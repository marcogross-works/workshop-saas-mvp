"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { MudancaItem } from "@/lib/types"

function mudancaItensKey(mudancaId: string) {
  return ["mudanca-itens", mudancaId] as const
}

async function fetchMudancaItens(mudancaId: string): Promise<MudancaItem[]> {
  const res = await fetch(`/api/mudancas/${mudancaId}/itens`)
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao buscar itens")
  }
  const json = await res.json()
  return (json.data ?? json) as MudancaItem[]
}

async function addItem(data: {
  mudancaId: string
  catalogoItemId: string
  quantidade?: number
}): Promise<MudancaItem> {
  const res = await fetch(`/api/mudancas/${data.mudancaId}/itens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      catalogoItemId: data.catalogoItemId,
      quantidade: data.quantidade ?? 1,
    }),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao adicionar item")
  }
  const json = await res.json()
  return (json.data ?? json) as MudancaItem
}

async function removeItem(data: {
  mudancaId: string
  itemId: string
}): Promise<void> {
  const res = await fetch(
    `/api/mudancas/${data.mudancaId}/itens/${data.itemId}`,
    { method: "DELETE" }
  )
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao remover item")
  }
}

async function updateItemQuantidade(data: {
  mudancaId: string
  itemId: string
  quantidade: number
}): Promise<MudancaItem> {
  const res = await fetch(
    `/api/mudancas/${data.mudancaId}/itens/${data.itemId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantidade: data.quantidade }),
    }
  )
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao atualizar quantidade")
  }
  const json = await res.json()
  return (json.data ?? json) as MudancaItem
}

export function useMudancaItens(mudancaId: string) {
  return useQuery({
    queryKey: mudancaItensKey(mudancaId),
    queryFn: () => fetchMudancaItens(mudancaId),
    enabled: !!mudancaId,
    staleTime: 1000 * 30,
  })
}

export function useAddItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addItem,
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: mudancaItensKey(variables.mudancaId),
      })
    },
  })
}

export function useRemoveItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeItem,
    onMutate: async (variables) => {
      const key = mudancaItensKey(variables.mudancaId)
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<MudancaItem[]>(key)

      queryClient.setQueryData<MudancaItem[]>(key, (old = []) =>
        old.filter((item) => item.id !== variables.itemId)
      )

      return { previous, key }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous && context.key) {
        queryClient.setQueryData(context.key, context.previous)
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: mudancaItensKey(variables.mudancaId),
      })
    },
  })
}

export function useUpdateItemQuantidade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateItemQuantidade,
    onMutate: async (variables) => {
      const key = mudancaItensKey(variables.mudancaId)
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<MudancaItem[]>(key)

      queryClient.setQueryData<MudancaItem[]>(key, (old = []) =>
        old.map((item) =>
          item.id === variables.itemId
            ? { ...item, quantidade: variables.quantidade }
            : item
        )
      )

      return { previous, key }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous && context.key) {
        queryClient.setQueryData(context.key, context.previous)
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: mudancaItensKey(variables.mudancaId),
      })
    },
  })
}
