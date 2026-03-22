export const dynamic = "force-dynamic";

// app/api/mudancas/[id]/carga-layout/route.ts
// GET — get current cargo layout for a mudanca
// PUT — save (upsert) cargo layout

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { saveCargaLayoutSchema } from "@/lib/validations";

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

// ─── GET /api/mudancas/[id]/carga-layout ─────────────────────────────────────

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
    const layout = await db.cargaLayout.findUnique({
      where: { mudancaId },
      include: { caminhao: true },
    });

    if (!layout) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json({ data: layout }, { status: 200 });
  } catch (err) {
    console.error("[mudancas/[id]/carga-layout] GET error:", err);
    return NextResponse.json(
      { error: "Falha ao buscar layout de carga" },
      { status: 500 }
    );
  }
}

// ─── PUT /api/mudancas/[id]/carga-layout ─────────────────────────────────────

export async function PUT(
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

  // Inject mudancaId from the URL
  const parsed = saveCargaLayoutSchema.safeParse({
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

  // Validate caminhao exists
  const caminhao = await db.caminhao.findUnique({
    where: { id: parsed.data.caminhaoId },
  });

  if (!caminhao) {
    return NextResponse.json(
      { error: "Caminhão não encontrado" },
      { status: 404 }
    );
  }

  try {
    const layout = await db.cargaLayout.upsert({
      where: { mudancaId },
      create: {
        mudancaId,
        caminhaoId: parsed.data.caminhaoId,
        itensPosicionados: parsed.data.itensPosicionados,
        ocupacaoPercentual: parsed.data.ocupacaoPercentual,
      },
      update: {
        caminhaoId: parsed.data.caminhaoId,
        itensPosicionados: parsed.data.itensPosicionados,
        ocupacaoPercentual: parsed.data.ocupacaoPercentual,
      },
      include: { caminhao: true },
    });

    // Also update the caminhaoId on the mudanca itself
    await db.mudanca.update({
      where: { id: mudancaId },
      data: { caminhaoId: parsed.data.caminhaoId },
    });

    return NextResponse.json({ data: layout }, { status: 200 });
  } catch (err) {
    console.error("[mudancas/[id]/carga-layout] PUT error:", err);
    return NextResponse.json(
      { error: "Falha ao salvar layout de carga" },
      { status: 500 }
    );
  }
}
