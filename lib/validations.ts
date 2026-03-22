// lib/validations.ts
// Zod schemas for request body validation — MudaFácil

import { z } from "zod";

// ─── Mudanca schemas ─────────────────────────────────────────────────────────

export const createMudancaSchema = z.object({
  enderecoOrigem: z
    .string()
    .min(1, "O endereço de origem é obrigatório")
    .max(500, "O endereço de origem deve ter no máximo 500 caracteres")
    .trim(),
  enderecoDestino: z
    .string()
    .min(1, "O endereço de destino é obrigatório")
    .max(500, "O endereço de destino deve ter no máximo 500 caracteres")
    .trim(),
  dataDesejada: z
    .string()
    .datetime({ message: "Data inválida" })
    .optional()
    .nullable(),
});

export const updateMudancaSchema = z.object({
  enderecoOrigem: z
    .string()
    .min(1, "O endereço de origem é obrigatório")
    .max(500, "O endereço de origem deve ter no máximo 500 caracteres")
    .trim()
    .optional(),
  enderecoDestino: z
    .string()
    .min(1, "O endereço de destino é obrigatório")
    .max(500, "O endereço de destino deve ter no máximo 500 caracteres")
    .trim()
    .optional(),
  dataDesejada: z
    .string()
    .datetime({ message: "Data inválida" })
    .optional()
    .nullable(),
  caminhaoId: z.string().cuid().optional().nullable(),
  status: z
    .enum(["RASCUNHO", "COTANDO", "CONFIRMADA", "CONCLUIDA"])
    .optional(),
});

export type CreateMudancaInput = z.infer<typeof createMudancaSchema>;
export type UpdateMudancaInput = z.infer<typeof updateMudancaSchema>;

// ─── MudancaItem schemas ─────────────────────────────────────────────────────

export const addMudancaItemSchema = z.object({
  mudancaId: z.string().cuid("ID da mudança inválido"),
  itemId: z.string().cuid("ID do item inválido"),
  quantidade: z.number().int().min(1, "Quantidade mínima é 1").default(1),
});

export const updateMudancaItemSchema = z.object({
  quantidade: z.number().int().min(1, "Quantidade mínima é 1"),
});

export type AddMudancaItemInput = z.infer<typeof addMudancaItemSchema>;
export type UpdateMudancaItemInput = z.infer<typeof updateMudancaItemSchema>;

// ─── CargaLayout schemas ─────────────────────────────────────────────────────

const itemPosicionadoSchema = z.object({
  itemId: z.string().cuid("ID do item inválido"),
  x: z.number(),
  y: z.number(),
  rotacao: z.number().min(0).max(360),
});

export const saveCargaLayoutSchema = z.object({
  mudancaId: z.string().cuid("ID da mudança inválido"),
  caminhaoId: z.string().cuid("ID do caminhão inválido"),
  itensPosicionados: z
    .array(itemPosicionadoSchema)
    .min(1, "Ao menos um item deve ser posicionado"),
  ocupacaoPercentual: z
    .number()
    .min(0, "Ocupação deve ser entre 0 e 100")
    .max(100, "Ocupação deve ser entre 0 e 100"),
});

export type SaveCargaLayoutInput = z.infer<typeof saveCargaLayoutSchema>;

// ─── Cotacao filter schemas ──────────────────────────────────────────────────

export const filterCotacoesSchema = z.object({
  precoMin: z.coerce.number().int().min(0).optional(),
  precoMax: z.coerce.number().int().min(0).optional(),
  notaMinima: z.coerce.number().min(0).max(5).optional(),
  seguroIncluso: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  tipo: z.string().optional(),
});

export type FilterCotacoesInput = z.infer<typeof filterCotacoesSchema>;
