export const dynamic = "force-dynamic";

// app/api/mudancas/[id]/itens/[itemId]/route.ts
// PATCH  — update quantity of a mudanca item
// DELETE — remove item from mudanca

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateMudancaItemSchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string; itemId: string }> };

// ─── Helper: verify mudanca item ownership ────────────────────────────────────

async function getMudancaItemForUser(
  mudancaId: string,
  mudancaItemId: string,
  userId: string
) {
  const mudancaItem = await db.mudancaItem.findFirst({
    where: { id: mudancaItemId, mudancaId },
    include: {
      mudanca: { select: { userId: true } },
    },
  });

  if (!mudancaItem) return null;
  if (mudancaItem.mudanca.userId !== userId) return null;
  return mudancaItem;
}

// ─── PATCH /api/mudancas/[id]/itens/[itemId] ─────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: mudancaId, itemId: mudancaItemId } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateMudancaItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  try {
    const existing = await getMudancaItemForUser(
      mudancaId,
      mudancaItemId,
      session.user.id
    );

    if (!existing) {
      return NextResponse.json(
        { error: "Item não encontrado ou acesso negado" },
        { status: 404 }
      );
    }

    const updated = await db.mudancaItem.update({
      where: { id: mudancaItemId },
      data: { quantidade: parsed.data.quantidade },
      include: { item: true },
    });

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (err) {
    console.error("[mudancas/[id]/itens/[itemId]] PATCH error:", err);
    return NextResponse.json(
      { error: "Falha ao atualizar item" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/mudancas/[id]/itens/[itemId] ────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: mudancaId, itemId: mudancaItemId } = await params;

  try {
    const existing = await getMudancaItemForUser(
      mudancaId,
      mudancaItemId,
      session.user.id
    );

    if (!existing) {
      return NextResponse.json(
        { error: "Item não encontrado ou acesso negado" },
        { status: 404 }
      );
    }

    await db.mudancaItem.delete({ where: { id: mudancaItemId } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[mudancas/[id]/itens/[itemId]] DELETE error:", err);
    return NextResponse.json(
      { error: "Falha ao remover item" },
      { status: 500 }
    );
  }
}
