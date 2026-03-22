export const dynamic = "force-dynamic";

// app/api/mudancas/[id]/route.ts
// GET    — fetch a single mudanca with all relations
// PATCH  — update mudanca fields
// DELETE — delete the mudanca (cascade)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateMudancaSchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

// ─── Helper: verify ownership ─────────────────────────────────────────────────

async function getMudancaForUser(mudancaId: string, userId: string) {
  const mudanca = await db.mudanca.findUnique({
    where: { id: mudancaId },
    select: { userId: true },
  });

  if (!mudanca) return null;
  if (mudanca.userId !== userId) return null;
  return mudanca;
}

// ─── GET /api/mudancas/[id] ──────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const mudanca = await db.mudanca.findUnique({
      where: { id },
      include: {
        caminhao: true,
        itens: {
          include: { item: true },
        },
        cotacoes: {
          include: { transportadora: true },
          orderBy: { precoCentavos: "asc" },
        },
        cargaLayout: {
          include: { caminhao: true },
        },
      },
    });

    if (!mudanca) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (mudanca.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ data: mudanca }, { status: 200 });
  } catch (err) {
    console.error("[mudancas/[id]] GET error:", err);
    return NextResponse.json(
      { error: "Falha ao buscar mudança" },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/mudancas/[id] ────────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateMudancaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json(
      { error: "Nenhum campo fornecido para atualizar" },
      { status: 400 }
    );
  }

  try {
    const existing = await getMudancaForUser(id, session.user.id);

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Validate caminhaoId exists if provided
    if (parsed.data.caminhaoId) {
      const caminhao = await db.caminhao.findUnique({
        where: { id: parsed.data.caminhaoId },
      });
      if (!caminhao) {
        return NextResponse.json(
          { error: "Caminhão não encontrado" },
          { status: 404 }
        );
      }
    }

    const updated = await db.mudanca.update({
      where: { id },
      data: {
        ...(parsed.data.enderecoOrigem !== undefined && {
          enderecoOrigem: parsed.data.enderecoOrigem,
        }),
        ...(parsed.data.enderecoDestino !== undefined && {
          enderecoDestino: parsed.data.enderecoDestino,
        }),
        ...(parsed.data.dataDesejada !== undefined && {
          dataDesejada: parsed.data.dataDesejada
            ? new Date(parsed.data.dataDesejada)
            : null,
        }),
        ...(parsed.data.caminhaoId !== undefined && {
          caminhaoId: parsed.data.caminhaoId,
        }),
        ...(parsed.data.status !== undefined && {
          status: parsed.data.status,
        }),
      },
      include: {
        caminhao: true,
      },
    });

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (err) {
    console.error("[mudancas/[id]] PATCH error:", err);
    return NextResponse.json(
      { error: "Falha ao atualizar mudança" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/mudancas/[id] ───────────────────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await getMudancaForUser(id, session.user.id);

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.mudanca.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[mudancas/[id]] DELETE error:", err);
    return NextResponse.json(
      { error: "Falha ao excluir mudança" },
      { status: 500 }
    );
  }
}
