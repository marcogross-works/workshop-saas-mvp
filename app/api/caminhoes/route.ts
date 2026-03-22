export const dynamic = "force-dynamic";

// app/api/caminhoes/route.ts
// GET — list all available trucks (public)

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── GET /api/caminhoes ──────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  try {
    const caminhoes = await db.caminhao.findMany({
      orderBy: { capacidadeM3: "asc" },
    });

    return NextResponse.json({ data: caminhoes }, { status: 200 });
  } catch (err) {
    console.error("[caminhoes] GET error:", err);
    return NextResponse.json(
      { error: "Falha ao buscar caminhões" },
      { status: 500 }
    );
  }
}
