// lib/types.ts
// Frontend types — uses string literal union for Plan to avoid Prisma client imports in client components

export type Plan = "FREE" | "TRIAL" | "PRO"

// ─── MudaFacil domain types ─────────────────────────────────────────────────

export type MudancaStatus = "RASCUNHO" | "COTANDO" | "CONFIRMADA" | "CONCLUIDA"

export interface Mudanca {
  id: string
  userId: string
  enderecoOrigem: string
  enderecoDestino: string
  dataDesejada: string | null
  status: MudancaStatus
  caminhaoId: string | null
  createdAt: string
  updatedAt: string
}

export interface MudancaItem {
  id: string
  mudancaId: string
  catalogoItemId: string
  quantidade: number
  posX: number | null
  posY: number | null
  nome: string
  icone: string
  largura: number
  comprimento: number
  altura: number
  peso: number
  categoria: string
}

export interface CatalogoItem {
  id: string
  nome: string
  icone: string
  largura: number
  comprimento: number
  altura: number
  peso: number
  categoria: string
}

export interface Caminhao {
  id: string
  nome: string
  largura: number
  comprimento: number
  altura: number
  capacidadeM3: number
  capacidadeKg: number
}

export interface CargaLayoutItem {
  itemId: string
  posX: number
  posY: number
  rotacao: number
}

export interface CargaLayout {
  mudancaId: string
  caminhaoId: string
  itens: CargaLayoutItem[]
}

export interface Cotacao {
  id: string
  mudancaId: string
  transportadora: string
  logoUrl: string | null
  preco: number
  dataDisponivel: string
  avaliacao: number
  seguro: boolean
  tipoCaminhao: string
}

export interface CotacaoFilters {
  precoMin?: number
  precoMax?: number
  avaliacaoMin?: number
  seguro?: boolean
  tipoCaminhao?: string
  ordenarPor?: "preco" | "avaliacao" | "data"
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
    mudancas: 1,
    itens: 15,
    cotacoes: 3,
    label: "Gratis",
  },
  TRIAL: {
    mudancas: Infinity,
    itens: Infinity,
    cotacoes: Infinity,
    label: "Trial",
  },
  PRO: {
    mudancas: Infinity,
    itens: Infinity,
    cotacoes: Infinity,
    label: "Pro",
  },
} as const
