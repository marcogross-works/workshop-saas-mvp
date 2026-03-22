// lib/types.ts
// Frontend types — uses string literal union for Plan to avoid Prisma client imports in client components

export type Plan = "FREE" | "TRIAL" | "PRO"

// ─── Prisma model shapes (matching the DB schema) ─────────────────────────────

export interface TodoItem {
  id: string
  content: string
  order: number
  completed: boolean
  todoListId: string
  createdAt: Date
  updatedAt: Date
}

export interface TodoList {
  id: string
  title: string
  userId: string
  createdAt: Date
  updatedAt: Date
  items: TodoItem[]
}

export interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  plan: Plan
  trialEndsAt: Date | null
}

// Plan limits for the frontend paywall
export const PLAN_LIMITS = {
  FREE: {
    boards: 1,
    items: 5,
    label: "Grátis",
  },
  TRIAL: {
    boards: Infinity,
    items: Infinity,
    label: "Trial",
  },
  PRO: {
    boards: Infinity,
    items: Infinity,
    label: "Pro",
  },
} as const
