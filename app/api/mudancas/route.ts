export const dynamic = "force-dynamic";

// app/api/mudancas/route.ts
// GET  — list all mudancas for the authenticated user
// POST — create a new mudanca (paywall: FREE max 1 active)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccess } from "@/lib/subscription";
import { createMudancaSchema } from "@/lib/validations";

// ─── GET /api/mudancas ────────────────────────────────────────────────────────

export async function GET(_req: NextRequest): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const mudancas = await db.mudanca.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        caminhao: true,
        _count: {
          select: { itens: true, cotacoes: true },
        },
      },
    });

    return NextResponse.json({ data: mudancas }, { status: 200 });
  } catch (err) {
    console.error("[mudancas] GET error:", err);
    return NextResponse.json(
      { error: "Falha ao buscar mudanças" },
      { status: 500 }
    );
  }
}

// ─── POST /api/mudancas ───────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createMudancaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  // Paywall: count active mudancas (not CONCLUIDA)
  const activeCount = await db.mudanca.count({
    where: {
      userId: session.user.id,
      status: { not: "CONCLUIDA" },
    },
  });

  const access = await canAccess(session.user.id, "mudancas", activeCount);

  if (!access.allowed) {
    return NextResponse.json(
      {
        error: "Plan limit reached",
        message: `Seu plano ${access.plan} permite até ${access.limit} mudança(s) ativa(s). Faça upgrade para PRO para mudanças ilimitadas.`,
        limit: access.limit,
        plan: access.plan,
      },
      { status: 403 }
    );
  }

  try {
    const mudanca = await db.mudanca.create({
      data: {
        enderecoOrigem: parsed.data.enderecoOrigem,
        enderecoDestino: parsed.data.enderecoDestino,
        dataDesejada: parsed.data.dataDesejada
          ? new Date(parsed.data.dataDesejada)
          : null,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ data: mudanca }, { status: 201 });
  } catch (err) {
    console.error("[mudancas] POST error:", err);
    return NextResponse.json(
      { error: "Falha ao criar mudança" },
      { status: 500 }
    );
  }
}
