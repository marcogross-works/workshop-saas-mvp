// app/api/todo-lists/route.ts
// GET  — list all todo lists for the authenticated user
// POST — create a new todo list (paywall enforced)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccess } from "@/lib/subscription";
import { createTodoListSchema } from "@/lib/validations";

// ─── GET /api/todo-lists ───────────────────────────────────────────────────────

export async function GET(_req: NextRequest): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const lists = await db.todoList.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json({ data: lists }, { status: 200 });
  } catch (err) {
    console.error("[todo-lists] GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch todo lists" },
      { status: 500 }
    );
  }
}

// ─── POST /api/todo-lists ──────────────────────────────────────────────────────

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

  const parsed = createTodoListSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  // Paywall: count existing lists and check plan limit
  const existingCount = await db.todoList.count({
    where: { userId: session.user.id },
  });

  const access = await canAccess(session.user.id, "todoLists", existingCount);

  if (!access.allowed) {
    return NextResponse.json(
      {
        error: "Plan limit reached",
        message: `Your ${access.plan} plan allows up to ${access.limit} todo list(s). Upgrade to PRO for unlimited lists.`,
        limit: access.limit,
        plan: access.plan,
      },
      { status: 403 }
    );
  }

  try {
    const list = await db.todoList.create({
      data: {
        title: parsed.data.title,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ data: list }, { status: 201 });
  } catch (err) {
    console.error("[todo-lists] POST error:", err);
    return NextResponse.json(
      { error: "Failed to create todo list" },
      { status: 500 }
    );
  }
}
