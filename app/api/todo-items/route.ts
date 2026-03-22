export const dynamic = "force-dynamic";

// app/api/todo-items/route.ts
// POST — create a new todo item inside a list (paywall enforced)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccess } from "@/lib/subscription";
import { createTodoItemSchema } from "@/lib/validations";

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

  const parsed = createTodoItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const { todoListId, content, order } = parsed.data;

  // Verify the list belongs to the current user
  const list = await db.todoList.findUnique({
    where: { id: todoListId },
    select: { userId: true },
  });

  if (!list) {
    return NextResponse.json({ error: "Todo list not found" }, { status: 404 });
  }

  if (list.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Paywall: count existing items in this list
  const existingCount = await db.todoItem.count({
    where: { todoListId },
  });

  const access = await canAccess(
    session.user.id,
    "todoItemsPerList",
    existingCount
  );

  if (!access.allowed) {
    return NextResponse.json(
      {
        error: "Plan limit reached",
        message: `Your ${access.plan} plan allows up to ${access.limit} item(s) per list. Upgrade to PRO for unlimited items.`,
        limit: access.limit,
        plan: access.plan,
      },
      { status: 403 }
    );
  }

  // Determine order: if not provided, append at the end
  const itemOrder =
    order !== undefined
      ? order
      : await db.todoItem
          .count({ where: { todoListId } })
          .then((count) => count);

  try {
    const item = await db.todoItem.create({
      data: {
        content,
        todoListId,
        order: itemOrder,
        completed: false,
      },
    });

    return NextResponse.json({ data: item }, { status: 201 });
  } catch (err) {
    console.error("[todo-items] POST error:", err);
    return NextResponse.json(
      { error: "Failed to create todo item" },
      { status: 500 }
    );
  }
}
