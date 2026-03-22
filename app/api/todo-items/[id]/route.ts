export const dynamic = "force-dynamic";

// app/api/todo-items/[id]/route.ts
// PATCH  — update content, completed flag, or order
// DELETE — delete the todo item

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateTodoItemSchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

// ─── Helper: verify ownership ─────────────────────────────────────────────────

async function getItemForUser(
  itemId: string,
  userId: string
): Promise<{ id: string } | null> {
  const item = await db.todoItem.findUnique({
    where: { id: itemId },
    include: {
      todoList: {
        select: { userId: true },
      },
    },
  });

  if (!item) return null;
  if (item.todoList.userId !== userId) return null;

  return item;
}

// ─── PATCH /api/todo-items/[id] ───────────────────────────────────────────────

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

  const parsed = updateTodoItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json(
      { error: "No fields provided to update" },
      { status: 400 }
    );
  }

  try {
    const item = await getItemForUser(id, session.user.id);

    if (!item) {
      // Could be not found or forbidden — return 404 to avoid enumeration
      return NextResponse.json(
        { error: "Todo item not found or access denied" },
        { status: 404 }
      );
    }

    const updated = await db.todoItem.update({
      where: { id },
      data: {
        ...(parsed.data.content !== undefined && { content: parsed.data.content }),
        ...(parsed.data.completed !== undefined && { completed: parsed.data.completed }),
        ...(parsed.data.order !== undefined && { order: parsed.data.order }),
      },
    });

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (err) {
    console.error("[todo-items/[id]] PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update todo item" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/todo-items/[id] ──────────────────────────────────────────────

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
    const item = await getItemForUser(id, session.user.id);

    if (!item) {
      return NextResponse.json(
        { error: "Todo item not found or access denied" },
        { status: 404 }
      );
    }

    await db.todoItem.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[todo-items/[id]] DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete todo item" },
      { status: 500 }
    );
  }
}
