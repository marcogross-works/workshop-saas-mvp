export const dynamic = "force-dynamic";

// app/api/stripe/portal/route.ts
// Creates a Stripe Billing Portal session for managing subscriptions

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCustomerPortalSession } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(_req: NextRequest): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No Stripe customer found for this account" },
      { status: 400 }
    );
  }

  try {
    const url = await createCustomerPortalSession(user.stripeCustomerId);
    return NextResponse.json({ url }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[stripe/portal] Error creating portal session:", message);
    return NextResponse.json(
      { error: "Failed to create billing portal session" },
      { status: 500 }
    );
  }
}
