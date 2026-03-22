"use client"

import { useQuery } from "@tanstack/react-query"
import type { CatalogoItem, Caminhao } from "@/lib/types"

const ITEMS_KEY = ["catalogo-items"] as const
const CAMINHOES_KEY = ["caminhoes"] as const

async function fetchItems(): Promise<CatalogoItem[]> {
  const res = await fetch("/api/items")
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao buscar catalogo")
  }
  const json = await res.json()
  return (json.data ?? json) as CatalogoItem[]
}

async function fetchCaminhoes(): Promise<Caminhao[]> {
  const res = await fetch("/api/caminhoes")
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao buscar caminhoes")
  }
  const json = await res.json()
  return (json.data ?? json) as Caminhao[]
}

export function useItems() {
  return useQuery({
    queryKey: ITEMS_KEY,
    queryFn: fetchItems,
    staleTime: 1000 * 60 * 10,
  })
}

export function useCaminhoes() {
  return useQuery({
    queryKey: CAMINHOES_KEY,
    queryFn: fetchCaminhoes,
    staleTime: 1000 * 60 * 10,
  })
}
