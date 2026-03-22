"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { CargaLayout } from "@/lib/types"

function cargaLayoutKey(mudancaId: string) {
  return ["carga-layout", mudancaId] as const
}

async function fetchCargaLayout(mudancaId: string): Promise<CargaLayout> {
  const res = await fetch(`/api/mudancas/${mudancaId}/layout`)
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao buscar layout")
  }
  const json = await res.json()
  return (json.data ?? json) as CargaLayout
}

async function saveCargaLayout(data: CargaLayout): Promise<CargaLayout> {
  const res = await fetch(`/api/mudancas/${data.mudancaId}/layout`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao salvar layout")
  }
  const json = await res.json()
  return (json.data ?? json) as CargaLayout
}

export function useCargaLayout(mudancaId: string) {
  return useQuery({
    queryKey: cargaLayoutKey(mudancaId),
    queryFn: () => fetchCargaLayout(mudancaId),
    enabled: !!mudancaId,
    staleTime: 1000 * 30,
  })
}

export function useSaveCargaLayout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveCargaLayout,
    onMutate: async (newLayout) => {
      const key = cargaLayoutKey(newLayout.mudancaId)
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<CargaLayout>(key)

      queryClient.setQueryData<CargaLayout>(key, newLayout)

      return { previous, key }
    },
    onError: (_err, _data, context) => {
      if (context?.previous && context.key) {
        queryClient.setQueryData(context.key, context.previous)
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: cargaLayoutKey(variables.mudancaId),
      })
    },
  })
}
