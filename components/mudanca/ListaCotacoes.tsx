"use client"

import * as React from "react"
import {
  Star,
  Truck,
  Shield,
  SlidersHorizontal,
  ArrowUpDown,
  Lock,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Cotacao, CotacaoFilters, Plan } from "@/lib/types"

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3 w-3",
            i < Math.round(rating)
              ? "fill-[#F59E0B] text-[#F59E0B]"
              : "text-slate-300"
          )}
        />
      ))}
      <span className="ml-1 text-xs text-slate-500">
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

interface ListaCotacoesProps {
  cotacoes: Cotacao[]
  plan: Plan
  onFiltersChange?: (filters: CotacaoFilters) => void
  className?: string
}

type SortKey = "preco" | "avaliacao" | "data"

export function ListaCotacoes({
  cotacoes,
  plan,
  onFiltersChange,
  className,
}: ListaCotacoesProps) {
  const [showFilters, setShowFilters] = React.useState(false)
  const [precoMin, setPrecoMin] = React.useState("")
  const [precoMax, setPrecoMax] = React.useState("")
  const [avaliacaoMin, setAvaliacaoMin] = React.useState("")
  const [seguro, setSeguro] = React.useState<boolean | undefined>(undefined)
  const [sortBy, setSortBy] = React.useState<SortKey>("preco")
  const isFree = plan === "FREE"

  const handleSort = (key: SortKey) => {
    setSortBy(key)
    onFiltersChange?.({
      precoMin: precoMin ? Number(precoMin) : undefined,
      precoMax: precoMax ? Number(precoMax) : undefined,
      avaliacaoMin: avaliacaoMin ? Number(avaliacaoMin) : undefined,
      seguro,
      ordenarPor: key,
    })
  }

  const handleApplyFilters = () => {
    onFiltersChange?.({
      precoMin: precoMin ? Number(precoMin) : undefined,
      precoMax: precoMax ? Number(precoMax) : undefined,
      avaliacaoMin: avaliacaoMin ? Number(avaliacaoMin) : undefined,
      seguro,
      ordenarPor: sortBy,
    })
  }

  // Sort locally for display
  const sortedCotacoes = React.useMemo(() => {
    const sorted = [...cotacoes]
    switch (sortBy) {
      case "preco":
        sorted.sort((a, b) => a.preco - b.preco)
        break
      case "avaliacao":
        sorted.sort((a, b) => b.avaliacao - a.avaliacao)
        break
      case "data":
        sorted.sort(
          (a, b) =>
            new Date(a.dataDisponivel).getTime() -
            new Date(b.dataDisponivel).getTime()
        )
        break
    }
    return sorted
  }, [cotacoes, sortBy])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter bar */}
      <div className="relative">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="h-8 text-xs"
          >
            <SlidersHorizontal className="mr-1.5 h-3 w-3" />
            Filtros
          </Button>

          {/* Sort buttons */}
          <div className="flex items-center gap-1">
            <ArrowUpDown className="h-3 w-3 text-slate-400" />
            {(["preco", "avaliacao", "data"] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => handleSort(key)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors",
                  sortBy === key
                    ? "bg-[#2563EB] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {key === "preco"
                  ? "Preco"
                  : key === "avaliacao"
                  ? "Avaliacao"
                  : "Data"}
              </button>
            ))}
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="relative mt-3 rounded-xl border border-slate-200 bg-white p-4">
            {/* Free plan overlay */}
            {isFree && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm">
                <div className="text-center px-6">
                  <Lock className="mx-auto h-6 w-6 text-slate-400 mb-2" />
                  <p className="text-sm font-semibold text-slate-700 mb-1">
                    Filtros disponiveis no plano PRO
                  </p>
                  <p className="text-xs text-slate-400">
                    Seu plano FREE permite apenas 1 mudanca ativa. Faca upgrade
                    para usar filtros avancados.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">
                  Preco minimo (R$)
                </label>
                <Input
                  type="number"
                  value={precoMin}
                  onChange={(e) => setPrecoMin(e.target.value)}
                  placeholder="0"
                  className="h-8 text-sm"
                  disabled={isFree}
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">
                  Preco maximo (R$)
                </label>
                <Input
                  type="number"
                  value={precoMax}
                  onChange={(e) => setPrecoMax(e.target.value)}
                  placeholder="5000"
                  className="h-8 text-sm"
                  disabled={isFree}
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">
                  Avaliacao minima
                </label>
                <Input
                  type="number"
                  value={avaliacaoMin}
                  onChange={(e) => setAvaliacaoMin(e.target.value)}
                  placeholder="3.0"
                  min={0}
                  max={5}
                  step={0.5}
                  className="h-8 text-sm"
                  disabled={isFree}
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">
                  Seguro
                </label>
                <div className="flex gap-2">
                  {[
                    { label: "Todos", value: undefined },
                    { label: "Com seguro", value: true },
                    { label: "Sem seguro", value: false },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      onClick={() => setSeguro(opt.value)}
                      disabled={isFree}
                      className={cn(
                        "px-2 py-1 rounded text-[10px] font-medium transition-colors",
                        seguro === opt.value
                          ? "bg-[#2563EB] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              className="mt-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs"
              onClick={handleApplyFilters}
              disabled={isFree}
            >
              Aplicar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Cotacoes list */}
      <div className="space-y-3">
        {sortedCotacoes.map((cotacao) => (
          <div
            key={cotacao.id}
            className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left: transportadora info */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                  {cotacao.logoUrl ? (
                    <img
                      src={cotacao.logoUrl}
                      alt={cotacao.transportadora}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <Truck className="h-5 w-5 text-slate-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-slate-900">
                      {cotacao.transportadora}
                    </p>
                    {cotacao.seguro && (
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-[9px] px-1.5 py-0">
                        <Shield className="mr-0.5 h-2.5 w-2.5" />
                        Seguro
                      </Badge>
                    )}
                  </div>
                  <StarRating rating={cotacao.avaliacao} />
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Disponivel em{" "}
                    {new Date(cotacao.dataDisponivel).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {cotacao.tipoCaminhao}
                  </p>
                </div>
              </div>

              {/* Right: price */}
              <div className="text-right shrink-0">
                <p className="text-xl font-bold text-slate-900">
                  {formatBRL(cotacao.preco)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {sortedCotacoes.length === 0 && (
          <div className="py-12 text-center">
            <span className="text-4xl block mb-3">💰</span>
            <p className="text-sm text-slate-500">
              Nenhuma cotacao disponivel ainda. Solicite cotacoes para receber
              ofertas de transportadoras.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
