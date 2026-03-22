// lib/stripe.ts
// Stripe client singleton and helper functions

import Stripe from "stripe";
import { db } from "@/lib/db";

// ─── Singleton ────────────────────────────────────────────────────────────────

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

// ─── Customer helpers ─────────────────────────────────────────────────────────

/**
 * Returns the existing Stripe customer ID for a user, or creates a new
 * Stripe customer and persists the ID to the database.
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string
): Promise<string> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true, name: true },
  });

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email,
    name: user.name ?? undefined,
    metadata: { userId },
  });

  await db.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

/**
 * Creates a Stripe Checkout Session for a subscription upgrade to PRO.
 * Returns the checkout URL.
 */
export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string
): Promise<string> {
  const customerId = await getOrCreateStripeCustomer(userId, email);

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/dashboard?payment=success`,
    cancel_url: `${appUrl}/dashboard?payment=cancelled`,
    metadata: { userId },
    subscription_data: {
      metadata: { userId },
    },
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL");
  }

  return session.url;
}

// ─── Customer portal ──────────────────────────────────────────────────────────

/**
 * Creates a Stripe Billing Portal session for managing subscriptions.
 * Returns the portal URL.
 */
export async function createCustomerPortalSession(
  customerId: string
): Promise<string> {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/dashboard`,
  });

  return session.url;
}

// ─── Webhook verification ─────────────────────────────────────────────────────

/**
 * Constructs and verifies a Stripe webhook event from the raw request body
 * and the Stripe-Signature header.
 *
 * Throws a `Stripe.errors.StripeSignatureVerificationError` if the signature
 * is invalid.
 */
export function constructWebhookEvent(
  body: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }

  return stripe.webhooks.constructEvent(body, signature, webhookSecret);
}
