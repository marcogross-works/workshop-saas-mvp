// app/api/todo-items/reorder/route.ts
// POST — bulk-update the order of todo items in a single transaction

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { reorderTodoItemsSchema } from "@/lib/validations";

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

  const parsed = reorderTodoItemsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const { items } = parsed.data;
  const itemIds = items.map((i) => i.id);

  // Verify all items belong to the current user
  const existingItems = await db.todoItem.findMany({
    where: { id: { in: itemIds } },
    include: {
      todoList: {
        select: { userId: true },
      },
    },
  });

  if (existingItems.length !== itemIds.length) {
    return NextResponse.json(
      { error: "One or more todo items not found" },
      { status: 404 }
    );
  }

  const unauthorised = existingItems.some(
    (item) => item.todoList.userId !== session.user!.id
  );

  if (unauthorised) {
    return NextResponse.json(
      { error: "Access denied to one or more todo items" },
      { status: 403 }
    );
  }

  try {
    // Execute all order updates in a single transaction
    await db.$transaction(
      items.map(({ id, order }) =>
        db.todoItem.update({
          where: { id },
          data: { order },
        })
      )
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[todo-items/reorder] POST error:", err);
    return NextResponse.json(
      { error: "Failed to reorder todo items" },
      { status: 500 }
    );
  }
}
