// app/api/todo-lists/[id]/route.ts
// GET    — fetch a single todo list with its items
// PATCH  — update the title
// DELETE — delete the list and all its items (cascade)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateTodoListSchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

// ─── GET /api/todo-lists/[id] ─────────────────────────────────────────────────

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
    const list = await db.todoList.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!list) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (list.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ data: list }, { status: 200 });
  } catch (err) {
    console.error("[todo-lists/[id]] GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch todo list" },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/todo-lists/[id] ───────────────────────────────────────────────

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

  const parsed = updateTodoListSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  try {
    const existing = await db.todoList.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await db.todoList.update({
      where: { id },
      data: { title: parsed.data.title },
    });

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (err) {
    console.error("[todo-lists/[id]] PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update todo list" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/todo-lists/[id] ──────────────────────────────────────────────

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
    const existing = await db.todoList.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.todoList.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[todo-lists/[id]] DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete todo list" },
      { status: 500 }
    );
  }
}
