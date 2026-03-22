"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Cotacao, CotacaoFilters } from "@/lib/types"

function cotacoesKey(mudancaId: string, filters?: CotacaoFilters) {
  return ["cotacoes", mudancaId, filters ?? {}] as const
}

async function fetchCotacoes(
  mudancaId: string,
  filters?: CotacaoFilters
): Promise<Cotacao[]> {
  const params = new URLSearchParams()
  if (filters?.precoMin !== undefined) params.set("precoMin", String(filters.precoMin))
  if (filters?.precoMax !== undefined) params.set("precoMax", String(filters.precoMax))
  if (filters?.avaliacaoMin !== undefined) params.set("avaliacaoMin", String(filters.avaliacaoMin))
  if (filters?.seguro !== undefined) params.set("seguro", String(filters.seguro))
  if (filters?.tipoCaminhao) params.set("tipoCaminhao", filters.tipoCaminhao)
  if (filters?.ordenarPor) params.set("ordenarPor", filters.ordenarPor)

  const qs = params.toString()
  const url = `/api/mudancas/${mudancaId}/cotacoes${qs ? `?${qs}` : ""}`

  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao buscar cotacoes")
  }
  const json = await res.json()
  return (json.data ?? json) as Cotacao[]
}

async function requestCotacoes(mudancaId: string): Promise<Cotacao[]> {
  const res = await fetch(`/api/mudancas/${mudancaId}/cotacoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao solicitar cotacoes")
  }
  const json = await res.json()
  return (json.data ?? json) as Cotacao[]
}

export function useCotacoes(mudancaId: string, filters?: CotacaoFilters) {
  return useQuery({
    queryKey: cotacoesKey(mudancaId, filters),
    queryFn: () => fetchCotacoes(mudancaId, filters),
    enabled: !!mudancaId,
    staleTime: 1000 * 60,
  })
}

export function useRequestCotacoes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: requestCotacoes,
    onSettled: (_data, _error, mudancaId) => {
      queryClient.invalidateQueries({
        queryKey: ["cotacoes", mudancaId],
      })
    },
  })
}
