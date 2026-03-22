// app/api/stripe/webhook/route.ts
// Stripe webhook handler — processes subscription lifecycle events

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { constructWebhookEvent } from "@/lib/stripe";
import { db } from "@/lib/db";
import { Plan } from "@prisma/client";

// Disable body parsing — we need the raw body for signature verification
export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(body, signature);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[stripe/webhook] Signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  try {
    await handleEvent(event);
  } catch (err) {
    console.error("[stripe/webhook] Handler error:", err);
    // Return 200 so Stripe does not retry — log for investigation
    return NextResponse.json(
      { error: "Internal handler error — logged for review" },
      { status: 200 }
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

// ─── Event dispatcher ─────────────────────────────────────────────────────────

async function handleEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(
        event.data.object as Stripe.Checkout.Session
      );
      break;

    case "invoice.payment_succeeded":
      await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;

    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;

    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;

    default:
      // Unhandled event — not an error
      break;
  }
}

// ─── Individual handlers ──────────────────────────────────────────────────────

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  if (session.mode !== "subscription") return;

  const userId = session.metadata?.userId;
  if (!userId) {
    console.warn("[stripe/webhook] checkout.session.completed: no userId in metadata");
    return;
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!subscriptionId) {
    console.warn("[stripe/webhook] checkout.session.completed: no subscription id");
    return;
  }

  // Fetch full subscription to get priceId and period end
  const { stripe } = await import("@/lib/stripe");
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price?.id ?? null;
  const currentPeriodEnd = new Date(
    (subscription as any).current_period_end * 1000
  );

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null;

  await db.user.update({
    where: { id: userId },
    data: {
      plan: Plan.PRO,
      stripeCustomerId: customerId ?? undefined,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: currentPeriodEnd,
    },
  });
}

async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice
): Promise<void> {
  const inv = invoice as any;
  const subscriptionId =
    typeof inv.subscription === "string"
      ? inv.subscription
      : inv.subscription?.id;

  if (!subscriptionId) return;

  const { stripe } = await import("@/lib/stripe");
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const currentPeriodEnd = new Date(
    (subscription as any).current_period_end * 1000
  );

  await db.user.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: { stripeCurrentPeriodEnd: currentPeriodEnd },
  });
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  await db.user.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      plan: Plan.FREE,
      stripeSubscriptionId: null,
      stripePriceId: null,
      stripeCurrentPeriodEnd: null,
    },
  });
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const priceId = subscription.items.data[0]?.price?.id ?? null;
  const currentPeriodEnd = new Date(
    (subscription as any).current_period_end * 1000
  );

  // Determine plan from subscription status
  const isActive =
    subscription.status === "active" || subscription.status === "trialing";

  await db.user.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      plan: isActive ? Plan.PRO : Plan.FREE,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: currentPeriodEnd,
    },
  });
}
