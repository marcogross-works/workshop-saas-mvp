// types/index.ts
// Shared TypeScript types for the application — MudaFácil

import type {
  User,
  Mudanca,
  MudancaItem,
  Item,
  Caminhao,
  CargaLayout,
  Cotacao,
  Transportadora,
} from "@prisma/client";

// Re-export the Plan and MudancaStatus enums so consumers only need to import from @/types
export { Plan, MudancaStatus } from "@prisma/client";

// ─── User with computed plan fields ───────────────────────────────────────────

/**
 * User record augmented with computed plan state.
 * currentPlan already accounts for trial expiry (TRIAL → FREE if expired).
 */
export interface UserWithPlan extends User {
  /** Effective plan after accounting for trial expiry. */
  currentPlan: import("@prisma/client").Plan;
  /** Full days remaining in the trial. 0 if not on trial or expired. */
  trialDaysLeft: number;
  /** Whether the trial window is currently active and not expired. */
  isTrialActive: boolean;
}

// ─── Mudanca with relations ──────────────────────────────────────────────────

export interface MudancaWithRelations extends Mudanca {
  user: Pick<User, "id" | "name" | "email">;
  caminhao: Caminhao | null;
  itens: (MudancaItem & { item: Item })[];
  cotacoes: (Cotacao & { transportadora: Transportadora })[];
  cargaLayout: CargaLayout | null;
}

// ─── Catalog types ───────────────────────────────────────────────────────────

export interface ItemCatalog extends Item {
  // Item already includes all fields; this type is for clarity
}

export interface CaminhaoInfo extends Caminhao {
  // Caminhao already includes all fields; this type is for clarity
}

// ─── Cotacao with transportadora ─────────────────────────────────────────────

export interface CotacaoWithTransportadora extends Cotacao {
  transportadora: Transportadora;
}

// ─── Carga layout data ───────────────────────────────────────────────────────

export interface ItemPosicionado {
  itemId: string;
  x: number;
  y: number;
  rotacao: number;
}

export interface CargaLayoutData extends CargaLayout {
  caminhao: Caminhao;
  itensPosicionados: ItemPosicionado[];
}

// ─── Plan limits ──────────────────────────────────────────────────────────────

export interface PlanLimits {
  mudancas: number;
  itensPorCanvas: number;
  cotacoesPorMudanca: number;
  filtrosAvancados: boolean;
}

// ─── API response shapes ───────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  data: T;
}

export interface ApiError {
  error: string;
  message?: string;
  issues?: Array<{ message: string; path: (string | number)[] }>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Paywall error shape ──────────────────────────────────────────────────────

export interface PlanLimitError {
  error: "Plan limit reached";
  message: string;
  limit: number;
  plan: import("@prisma/client").Plan;
}

// ─── Session extensions ───────────────────────────────────────────────────────

/**
 * Extend the next-auth Session type to include user.id, plan, and trialEndsAt.
 * These are injected by the `session` callback in lib/auth.ts.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan: import("@prisma/client").Plan;
      trialEndsAt: Date | null;
    };
  }

  interface User {
    plan: import("@prisma/client").Plan;
    trialEndsAt: Date | null;
  }
}
