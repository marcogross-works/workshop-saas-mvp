// lib/validations.ts
// Zod schemas for request body validation

import { z } from "zod";

// ─── Todo List schemas ────────────────────────────────────────────────────────

export const createTodoListSchema = z.object({
  title: z
    .string()
    .min(1, "O título é obrigatório")
    .max(150, "O título deve ter no máximo 150 caracteres")
    .trim(),
});

export const updateTodoListSchema = z.object({
  title: z
    .string()
    .min(1, "O título é obrigatório")
    .max(150, "O título deve ter no máximo 150 caracteres")
    .trim(),
});

export type CreateTodoListInput = z.infer<typeof createTodoListSchema>;
export type UpdateTodoListInput = z.infer<typeof updateTodoListSchema>;

// ─── Todo Item schemas ────────────────────────────────────────────────────────

export const createTodoItemSchema = z.object({
  content: z
    .string()
    .min(1, "O conteúdo é obrigatório")
    .max(500, "O conteúdo deve ter no máximo 500 caracteres")
    .trim(),
  todoListId: z.string().min(1, "O ID da lista é obrigatório"),
  order: z.number().int().nonnegative().optional(),
});

export const updateTodoItemSchema = z.object({
  content: z
    .string()
    .min(1, "O conteúdo é obrigatório")
    .max(500, "O conteúdo deve ter no máximo 500 caracteres")
    .trim()
    .optional(),
  completed: z.boolean().optional(),
  order: z.number().int().nonnegative().optional(),
});

export const reorderTodoItemsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        order: z.number().int().nonnegative(),
      })
    )
    .min(1, "Ao menos um item deve ser fornecido"),
});

export type CreateTodoItemInput = z.infer<typeof createTodoItemSchema>;
export type UpdateTodoItemInput = z.infer<typeof updateTodoItemSchema>;
export type ReorderTodoItemsInput = z.infer<typeof reorderTodoItemsSchema>;
