"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ListaCotacoes } from "@/components/mudanca/ListaCotacoes"
import { useCotacoes, useRequestCotacoes } from "@/hooks/useCotacoes"
import type { Plan, CotacaoFilters } from "@/lib/types"

interface CotacoesClientProps {
  mudancaId: string
  plan: Plan
}

export function CotacoesClient({ mudancaId, plan }: CotacoesClientProps) {
  const [filters, setFilters] = React.useState<CotacaoFilters>({})
  const { data: cotacoes, isLoading } = useCotacoes(mudancaId, filters)
  const requestCotacoes = useRequestCotacoes()

  const handleSolicitar = () => {
    requestCotacoes.mutate(mudancaId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/mudanca/${mudancaId}`}>
            <Button variant="ghost" size="sm" className="h-8">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Voltar para a mudanca
            </Button>
          </Link>
        </div>

        <Button
          onClick={handleSolicitar}
          className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
          disabled={requestCotacoes.isPending}
        >
          {requestCotacoes.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Solicitando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Solicitar cotacoes
            </>
          )}
        </Button>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Cotacoes
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Compare precos e escolha a melhor transportadora para sua mudanca.
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />
          <span className="ml-2 text-sm text-slate-500">
            Carregando cotacoes...
          </span>
        </div>
      ) : (
        <ListaCotacoes
          cotacoes={cotacoes ?? []}
          plan={plan}
          onFiltersChange={setFilters}
        />
      )}
    </div>
  )
}
