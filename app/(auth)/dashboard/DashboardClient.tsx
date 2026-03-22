"use client"

import * as React from "react"
import { Plus, Loader2, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MudancaCard } from "@/components/mudanca/MudancaCard"
import { NovaMudancaDialog } from "@/components/mudanca/NovaMudancaDialog"
import { PaywallGate } from "@/components/paywall/PaywallGate"
import { useMudancas } from "@/hooks/useMudancas"
import { PLAN_LIMITS } from "@/lib/types"
import type { Plan } from "@/lib/types"

interface DashboardClientProps {
  plan: Plan
}

export function DashboardClient({ plan }: DashboardClientProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const { data: mudancas, isLoading, error } = useMudancas()

  const mudancasList = mudancas ?? []
  const limit = PLAN_LIMITS[plan].mudancas
  const isAtLimit = mudancasList.length >= limit

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />
        <span className="ml-2 text-sm text-slate-500">
          Carregando suas mudancas...
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">
          Erro ao carregar mudancas. Tente novamente.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* New mudanca button with paywall */}
      {isAtLimit && plan === "FREE" ? (
        <PaywallGate
          feature="mudanca ativa"
          currentCount={mudancasList.length}
          limit={limit}
          plan={plan}
        >
          <div />
        </PaywallGate>
      ) : (
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova mudanca
        </Button>
      )}

      {/* Mudancas list */}
      {mudancasList.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mudancasList.map((mudanca) => (
            <MudancaCard key={mudanca.id} mudanca={mudanca} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2563EB]/10">
            <Truck className="h-7 w-7 text-[#2563EB]" />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-slate-900">
            Nenhuma mudanca ainda
          </h3>
          <p className="mb-4 text-sm text-slate-500">
            Crie sua primeira mudanca e comece a montar sua carga.
          </p>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar primeira mudanca
          </Button>
        </div>
      )}

      {/* Dialog */}
      <NovaMudancaDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
