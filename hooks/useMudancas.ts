"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Mudanca } from "@/lib/types"

const MUDANCAS_KEY = ["mudancas"] as const

async function fetchMudancas(): Promise<Mudanca[]> {
  const res = await fetch("/api/mudancas")
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao buscar mudancas")
  }
  const json = await res.json()
  return (json.data ?? json) as Mudanca[]
}

async function createMudanca(data: {
  enderecoOrigem: string
  enderecoDestino: string
  dataDesejada?: string | null
}): Promise<Mudanca> {
  const res = await fetch("/api/mudancas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao criar mudanca")
  }
  const json = await res.json()
  return (json.data ?? json) as Mudanca
}

async function updateMudanca(data: {
  id: string
  enderecoOrigem?: string
  enderecoDestino?: string
  dataDesejada?: string | null
  status?: string
  caminhaoId?: string | null
}): Promise<Mudanca> {
  const { id, ...body } = data
  const res = await fetch(`/api/mudancas/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao atualizar mudanca")
  }
  const json = await res.json()
  return (json.data ?? json) as Mudanca
}

async function deleteMudanca(id: string): Promise<void> {
  const res = await fetch(`/api/mudancas/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao deletar mudanca")
  }
}

export function useMudancas() {
  return useQuery({
    queryKey: MUDANCAS_KEY,
    queryFn: fetchMudancas,
    staleTime: 1000 * 60,
  })
}

export function useCreateMudanca() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMudanca,
    onMutate: async (newMudanca) => {
      await queryClient.cancelQueries({ queryKey: MUDANCAS_KEY })
      const previous = queryClient.getQueryData<Mudanca[]>(MUDANCAS_KEY)

      const optimistic: Mudanca = {
        id: `optimistic-${Date.now()}`,
        userId: "",
        enderecoOrigem: newMudanca.enderecoOrigem,
        enderecoDestino: newMudanca.enderecoDestino,
        dataDesejada: newMudanca.dataDesejada ?? null,
        status: "RASCUNHO",
        caminhaoId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      queryClient.setQueryData<Mudanca[]>(MUDANCAS_KEY, (old = []) => [
        ...old,
        optimistic,
      ])

      return { previous }
    },
    onError: (_err, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(MUDANCAS_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MUDANCAS_KEY })
    },
  })
}

export function useUpdateMudanca() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMudanca,
    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: MUDANCAS_KEY })
      const previous = queryClient.getQueryData<Mudanca[]>(MUDANCAS_KEY)

      queryClient.setQueryData<Mudanca[]>(MUDANCAS_KEY, (old = []) =>
        old.map((m) =>
          m.id === updated.id ? { ...m, ...updated } : m
        )
      )

      return { previous }
    },
    onError: (_err, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(MUDANCAS_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MUDANCAS_KEY })
    },
  })
}

export function useDeleteMudanca() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMudanca,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: MUDANCAS_KEY })
      const previous = queryClient.getQueryData<Mudanca[]>(MUDANCAS_KEY)

      queryClient.setQueryData<Mudanca[]>(MUDANCAS_KEY, (old = []) =>
        old.filter((m) => m.id !== id)
      )

      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(MUDANCAS_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MUDANCAS_KEY })
    },
  })
}
