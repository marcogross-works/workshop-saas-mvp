export const dynamic = "force-dynamic";

// app/api/stripe/checkout/route.ts
// Creates a Stripe Checkout Session for the PRO subscription

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(_req: NextRequest): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const priceId = process.env.STRIPE_PRICE_ID_PRO;

  if (!priceId) {
    console.error("[stripe/checkout] STRIPE_PRICE_ID_PRO is not set");
    return NextResponse.json(
      { error: "Stripe price is not configured" },
      { status: 500 }
    );
  }

  try {
    const url = await createCheckoutSession(
      session.user.id,
      session.user.email,
      priceId
    );

    return NextResponse.json({ url }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[stripe/checkout] Error creating checkout session:", message);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
