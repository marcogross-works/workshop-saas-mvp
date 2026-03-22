// lib/subscription.ts
// Plan management, trial logic, and paywall helpers

import { Plan } from "@prisma/client";
import { db } from "@/lib/db";

// ─── Plan limits ──────────────────────────────────────────────────────────────

export const PLAN_LIMITS = {
  [Plan.FREE]: {
    mudancas: 1,
    itensPorCanvas: 15,
    cotacoesPorMudanca: 3,
    filtrosAvancados: false,
  },
  [Plan.TRIAL]: {
    mudancas: 999,
    itensPorCanvas: 999,
    cotacoesPorMudanca: 999,
    filtrosAvancados: true,
  },
  [Plan.PRO]: {
    mudancas: 999,
    itensPorCanvas: 999,
    cotacoesPorMudanca: 999,
    filtrosAvancados: true,
  },
} as const;

export type Feature = "mudancas" | "itensPorCanvas" | "cotacoesPorMudanca";

// ─── User shape expected by helper functions ──────────────────────────────────

interface UserPlanSnapshot {
  plan: Plan;
  trialEndsAt: Date | null;
}

// ─── Trial helpers ─────────────────────────────────────────────────────────────

/**
 * Returns true if the user's trial is currently active (not expired).
 */
export function isTrialActive(user: UserPlanSnapshot): boolean {
  if (user.plan !== Plan.TRIAL) return false;
  if (!user.trialEndsAt) return false;
  return user.trialEndsAt > new Date();
}

/**
 * Returns the number of full days remaining in the trial.
 * Returns 0 if the trial has expired or the user is not on a trial.
 */
export function getTrialDaysLeft(user: UserPlanSnapshot): number {
  if (!isTrialActive(user)) return 0;
  const now = new Date();
  const msLeft = (user.trialEndsAt as Date).getTime() - now.getTime();
  return Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
}

// ─── Effective plan ───────────────────────────────────────────────────────────

/**
 * Returns the effective Plan for a user, accounting for trial expiry.
 * If a user is on TRIAL but the trial has ended, they are treated as FREE.
 */
export function getEffectivePlan(user: UserPlanSnapshot): Plan {
  if (user.plan === Plan.TRIAL && !isTrialActive(user)) {
    return Plan.FREE;
  }
  return user.plan;
}

// ─── DB-backed helpers ────────────────────────────────────────────────────────

/**
 * Fetches the user from the DB and returns their effective plan.
 * Throws if the user is not found.
 */
export async function getUserPlan(userId: string): Promise<Plan> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true, trialEndsAt: true },
  });

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  return getEffectivePlan(user);
}

/**
 * Checks whether the user has access to a given numeric feature.
 * Pass `currentCount` to check against the feature limit.
 *
 * Returns an object `{ allowed: boolean, limit: number, plan: Plan }`.
 */
export async function canAccess(
  userId: string,
  feature: Feature,
  currentCount: number
): Promise<{ allowed: boolean; limit: number; plan: Plan }> {
  const plan = await getUserPlan(userId);
  const limit = PLAN_LIMITS[plan][feature];
  return {
    allowed: currentCount < limit,
    limit,
    plan,
  };
}

/**
 * Checks whether the user has access to advanced filters.
 */
export async function canUseAdvancedFilters(
  userId: string
): Promise<{ allowed: boolean; plan: Plan }> {
  const plan = await getUserPlan(userId);
  const allowed = PLAN_LIMITS[plan].filtrosAvancados;
  return { allowed, plan };
}
