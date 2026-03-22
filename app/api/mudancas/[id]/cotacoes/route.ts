export const dynamic = "force-dynamic";

// app/api/mudancas/[id]/cotacoes/route.ts
// GET  — list cotacoes for a mudanca (with optional filters, paywall for advanced filters)
// POST — request cotacoes (paywall: FREE max 3 per mudanca)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccess, canUseAdvancedFilters } from "@/lib/subscription";
import { filterCotacoesSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";

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

// ─── GET /api/mudancas/[id]/cotacoes ─────────────────────────────────────────

export async function GET(
  req: NextRequest,
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

  // Parse filter query params
  const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
  const hasAdvancedFilters =
    searchParams.precoMin !== undefined ||
    searchParams.precoMax !== undefined ||
    searchParams.notaMinima !== undefined ||
    searchParams.seguroIncluso !== undefined ||
    searchParams.tipo !== undefined;

  // Check paywall for advanced filters
  if (hasAdvancedFilters) {
    const filterAccess = await canUseAdvancedFilters(session.user.id);
    if (!filterAccess.allowed) {
      return NextResponse.json(
        {
          error: "Plan limit reached",
          message: `Filtros avançados estão disponíveis apenas nos planos TRIAL e PRO. Faça upgrade para acessar.`,
          plan: filterAccess.plan,
        },
        { status: 403 }
      );
    }
  }

  const filterParsed = filterCotacoesSchema.safeParse(searchParams);

  try {
    const where: Prisma.CotacaoWhereInput = { mudancaId };

    if (filterParsed.success) {
      const filters = filterParsed.data;

      if (filters.precoMin !== undefined || filters.precoMax !== undefined) {
        where.precoCentavos = {};
        if (filters.precoMin !== undefined) {
          where.precoCentavos.gte = filters.precoMin;
        }
        if (filters.precoMax !== undefined) {
          where.precoCentavos.lte = filters.precoMax;
        }
      }

      if (filters.seguroIncluso !== undefined) {
        where.seguroIncluso = filters.seguroIncluso;
      }

      if (filters.notaMinima !== undefined || filters.tipo !== undefined) {
        const transportadoraWhere: Prisma.TransportadoraWhereInput = {};
        if (filters.notaMinima !== undefined) {
          transportadoraWhere.notaMedia = { gte: filters.notaMinima };
        }
        if (filters.tipo !== undefined) {
          transportadoraWhere.tiposCaminhao = { has: filters.tipo };
        }
        where.transportadora = transportadoraWhere;
      }
    }

    const cotacoes = await db.cotacao.findMany({
      where,
      include: { transportadora: true },
      orderBy: { precoCentavos: "asc" },
    });

    return NextResponse.json({ data: cotacoes }, { status: 200 });
  } catch (err) {
    console.error("[mudancas/[id]/cotacoes] GET error:", err);
    return NextResponse.json(
      { error: "Falha ao buscar cotações" },
      { status: 500 }
    );
  }
}

// ─── POST /api/mudancas/[id]/cotacoes ────────────────────────────────────────

export async function POST(
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
    return NextResponse.json({ error: "Mudança não encontrada" }, { status: 404 });
  }

  if (!owned) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Paywall: count existing cotacoes for this mudanca
  const existingCount = await db.cotacao.count({
    where: { mudancaId },
  });

  const access = await canAccess(
    session.user.id,
    "cotacoesPorMudanca",
    existingCount
  );

  if (!access.allowed) {
    return NextResponse.json(
      {
        error: "Plan limit reached",
        message: `Seu plano ${access.plan} permite até ${access.limit} cotação(ões) por mudança. Faça upgrade para PRO para cotações ilimitadas.`,
        limit: access.limit,
        plan: access.plan,
      },
      { status: 403 }
    );
  }

  try {
    // Get the mudanca with its caminhao to determine which transportadoras to query
    const mudanca = await db.mudanca.findUnique({
      where: { id: mudancaId },
      include: {
        caminhao: true,
        itens: { include: { item: true } },
      },
    });

    if (!mudanca) {
      return NextResponse.json({ error: "Mudança não encontrada" }, { status: 404 });
    }

    if (!mudanca.caminhao) {
      return NextResponse.json(
        { error: "Selecione um caminhão antes de solicitar cotações" },
        { status: 400 }
      );
    }

    if (mudanca.itens.length === 0) {
      return NextResponse.json(
        { error: "Adicione itens à mudança antes de solicitar cotações" },
        { status: 400 }
      );
    }

    // Find transportadoras that handle this truck type
    const transportadoras = await db.transportadora.findMany({
      where: {
        tiposCaminhao: { has: mudanca.caminhao.tipo },
      },
    });

    if (transportadoras.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma transportadora disponível para este tipo de caminhão" },
        { status: 404 }
      );
    }

    // Calculate total volume and weight for pricing
    const totalVolume = mudanca.itens.reduce(
      (sum, mi) => sum + mi.item.volumeM3 * mi.quantidade,
      0
    );
    const totalWeight = mudanca.itens.reduce(
      (sum, mi) => sum + mi.item.pesoKg * mi.quantidade,
      0
    );

    // Generate cotacoes from available transportadoras
    const dataDisponivel = mudanca.dataDesejada ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const validade = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Filter out transportadoras that already have cotacoes for this mudanca
    const existingCotacoes = await db.cotacao.findMany({
      where: { mudancaId },
      select: { transportadoraId: true },
    });
    const existingTransportadoraIds = new Set(
      existingCotacoes.map((c) => c.transportadoraId)
    );

    const newTransportadoras = transportadoras.filter(
      (t) => !existingTransportadoraIds.has(t.id)
    );

    if (newTransportadoras.length === 0) {
      return NextResponse.json(
        { error: "Todas as transportadoras disponíveis já enviaram cotações" },
        { status: 409 }
      );
    }

    // Determine how many cotacoes we can still create
    const remainingSlots = access.limit - existingCount;
    const toCreate = newTransportadoras.slice(0, remainingSlots);

    const cotacoesData = toCreate.map((transportadora) => {
      // Price based on volume, weight, and a random factor per transportadora
      const basePrice = Math.round(
        (totalVolume * 15000 + totalWeight * 500) *
          (0.8 + Math.random() * 0.4)
      );
      const includeInsurance = Math.random() > 0.5;

      return {
        mudancaId,
        transportadoraId: transportadora.id,
        precoCentavos: Math.max(basePrice, 15000), // minimum R$150,00
        dataDisponivel: new Date(dataDisponivel),
        seguroIncluso: includeInsurance,
        validade,
      };
    });

    const created = await db.cotacao.createMany({
      data: cotacoesData,
    });

    // Update mudanca status to COTANDO
    await db.mudanca.update({
      where: { id: mudancaId },
      data: { status: "COTANDO" },
    });

    // Fetch the newly created cotacoes with transportadora info
    const cotacoes = await db.cotacao.findMany({
      where: { mudancaId },
      include: { transportadora: true },
      orderBy: { precoCentavos: "asc" },
    });

    return NextResponse.json(
      { data: cotacoes, created: created.count },
      { status: 201 }
    );
  } catch (err) {
    console.error("[mudancas/[id]/cotacoes] POST error:", err);
    return NextResponse.json(
      { error: "Falha ao solicitar cotações" },
      { status: 500 }
    );
  }
}
