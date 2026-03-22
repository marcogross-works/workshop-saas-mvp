export const dynamic = "force-dynamic";

// app/api/mudancas/[id]/itens/route.ts
// GET  — list items for a mudanca
// POST — add item to a mudanca (paywall: FREE max 15 items)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccess } from "@/lib/subscription";
import { addMudancaItemSchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

// ─── Helper: verify mudanca ownership ─────────────────────────────────────────

async function verifyMudancaOwnership(
  mudancaId: string,
  userId: string
): Promise<{ owned: boolean; exists: boolean }> {
  const mudanca = await db.mudanca.findUnique({
    where: { id: mudancaId },
    select: { userId: true },
  });

  if (!mudanca) return { owned: false, exists: false };
  return { owned: mudanca.userId === userId, exists: true };
}

// ─── GET /api/mudancas/[id]/itens ────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: mudancaId } = await params;

  const { owned, exists } = await verifyMudancaOwnership(
    mudancaId,
    session.user.id
  );

  if (!exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!owned) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const itens = await db.mudancaItem.findMany({
      where: { mudancaId },
      include: { item: true },
    });

    return NextResponse.json({ data: itens }, { status: 200 });
  } catch (err) {
    console.error("[mudancas/[id]/itens] GET error:", err);
    return NextResponse.json(
      { error: "Falha ao buscar itens da mudança" },
      { status: 500 }
    );
  }
}

// ─── POST /api/mudancas/[id]/itens ───────────────────────────────────────────

export async function POST(
  req: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: mudancaId } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Inject mudancaId from the URL into the body for validation
  const parsed = addMudancaItemSchema.safeParse({
    ...(typeof body === "object" && body !== null ? body : {}),
    mudancaId,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const { owned, exists } = await verifyMudancaOwnership(
    mudancaId,
    session.user.id
  );

  if (!exists) {
    return NextResponse.json({ error: "Mudança não encontrada" }, { status: 404 });
  }

  if (!owned) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Verify the catalog item exists
  const catalogItem = await db.item.findUnique({
    where: { id: parsed.data.itemId },
  });

  if (!catalogItem) {
    return NextResponse.json(
      { error: "Item do catálogo não encontrado" },
      { status: 404 }
    );
  }

  // Paywall: count total item quantity in this mudanca
  const currentItems = await db.mudancaItem.aggregate({
    where: { mudancaId },
    _sum: { quantidade: true },
  });

  const totalQuantity = (currentItems._sum.quantidade ?? 0) + parsed.data.quantidade;

  const access = await canAccess(
    session.user.id,
    "itensPorCanvas",
    totalQuantity - 1 // canAccess checks currentCount < limit, so subtract 1 to account for the new item
  );

  if (!access.allowed) {
    return NextResponse.json(
      {
        error: "Plan limit reached",
        message: `Seu plano ${access.plan} permite até ${access.limit} item(ns) por mudança. Faça upgrade para PRO para itens ilimitados.`,
        limit: access.limit,
        plan: access.plan,
      },
      { status: 403 }
    );
  }

  try {
    // Check if this item already exists in the mudanca — if so, increment quantity
    const existing = await db.mudancaItem.findFirst({
      where: { mudancaId, itemId: parsed.data.itemId },
    });

    let mudancaItem;
    if (existing) {
      mudancaItem = await db.mudancaItem.update({
        where: { id: existing.id },
        data: { quantidade: existing.quantidade + parsed.data.quantidade },
        include: { item: true },
      });
    } else {
      mudancaItem = await db.mudancaItem.create({
        data: {
          mudancaId,
          itemId: parsed.data.itemId,
          quantidade: parsed.data.quantidade,
        },
        include: { item: true },
      });
    }

    return NextResponse.json({ data: mudancaItem }, { status: 201 });
  } catch (err) {
    console.error("[mudancas/[id]/itens] POST error:", err);
    return NextResponse.json(
      { error: "Falha ao adicionar item à mudança" },
      { status: 500 }
    );
  }
}
