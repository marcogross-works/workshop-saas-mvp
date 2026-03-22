"use client"

import * as React from "react"
import Link from "next/link"
import { MapPin, Calendar, Truck, Package, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Mudanca, MudancaStatus } from "@/lib/types"

const statusConfig: Record<MudancaStatus, { label: string; className: string }> = {
  RASCUNHO: {
    label: "Rascunho",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  COTANDO: {
    label: "Cotando",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  CONFIRMADA: {
    label: "Confirmada",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  CONCLUIDA: {
    label: "Concluida",
    className: "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20",
  },
}

interface MudancaCardProps {
  mudanca: Mudanca
  itemCount?: number
  caminhaoNome?: string
  className?: string
}

export function MudancaCard({
  mudanca,
  itemCount = 0,
  caminhaoNome,
  className,
}: MudancaCardProps) {
  const config = statusConfig[mudanca.status]
  const dataFormatada = mudanca.dataDesejada
    ? new Date(mudanca.dataDesejada).toLocaleDateString("pt-BR")
    : "Sem data definida"

  return (
    <Link href={`/mudanca/${mudanca.id}`}>
      <div
        className={cn(
          "group relative rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-md hover:border-[#2563EB]/30 cursor-pointer",
          className
        )}
      >
        {/* Status badge */}
        <div className="flex items-center justify-between mb-3">
          <Badge className={cn("text-[10px] font-medium", config.className)}>
            {config.label}
          </Badge>
          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#2563EB] transition-colors" />
        </div>

        {/* Addresses */}
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {mudanca.enderecoOrigem}
            </p>
            <div className="flex items-center gap-1 my-0.5">
              <div className="h-3 w-px bg-slate-300 ml-[1px]" />
            </div>
            <p className="text-sm text-slate-600 truncate">
              {mudanca.enderecoDestino}
            </p>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {dataFormatada}
          </span>
          <span className="flex items-center gap-1">
            <Package className="h-3 w-3" />
            {itemCount} {itemCount === 1 ? "item" : "itens"}
          </span>
          {caminhaoNome && (
            <span className="flex items-center gap-1">
              <Truck className="h-3 w-3" />
              {caminhaoNome}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
