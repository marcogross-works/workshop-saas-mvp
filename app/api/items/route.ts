export const dynamic = "force-dynamic";

// app/api/items/route.ts
// GET — list all catalog items (public, grouped by category)

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── GET /api/items ──────────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  try {
    const items = await db.item.findMany({
      orderBy: [{ categoria: "asc" }, { nome: "asc" }],
    });

    // Group by category
    const grouped: Record<string, typeof items> = {};
    for (const item of items) {
      if (!grouped[item.categoria]) {
        grouped[item.categoria] = [];
      }
      grouped[item.categoria].push(item);
    }

    return NextResponse.json({ data: items, grouped }, { status: 200 });
  } catch (err) {
    console.error("[items] GET error:", err);
    return NextResponse.json(
      { error: "Falha ao buscar itens do catálogo" },
      { status: 500 }
    );
  }
}
