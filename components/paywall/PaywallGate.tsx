"use client"

import * as React from "react"
import Link from "next/link"
import { Lock, Zap, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Plan } from "@/lib/types"

interface PaywallGateProps {
  feature: string
  currentCount: number
  limit: number
  plan: Plan
  children: React.ReactNode
  className?: string
}

function PlanLimitReached({
  feature,
  currentCount,
  limit,
  plan,
}: {
  feature: string
  currentCount: number
  limit: number
  plan: Plan
}) {
  return (
    <div className="relative rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-950/20">
      <div className="absolute inset-0 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
        <div className="mx-auto max-w-sm p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900">
            <Lock className="h-6 w-6 text-violet-600 dark:text-violet-400" />
          </div>

          <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
            Limite atingido
          </h3>

          <p className="mb-1 text-sm text-slate-600 dark:text-slate-400">
            Você atingiu o limite de{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-50">
              {limit} {feature}
            </span>{" "}
            do plano{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-50">
              {plan === "FREE" ? "Grátis" : "Trial"}
            </span>
            .
          </p>

          <p className="mb-5 text-xs text-slate-500 dark:text-slate-400">
            Faça upgrade para o plano PRO e tenha acesso ilimitado a todos os recursos.
          </p>

          <div className="flex flex-col gap-2">
            <Link href="/settings/billing">
              <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                <Zap className="mr-2 h-4 w-4" />
                Fazer upgrade para PRO
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              A partir de R$19/mês · Cancele quando quiser
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none select-none opacity-30 p-4">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-2.5 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-2.5 w-1/3 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function PaywallGate({
  feature,
  currentCount,
  limit,
  plan,
  children,
  className,
}: PaywallGateProps) {
  const isLimitReached = currentCount >= limit

  if (isLimitReached) {
    return (
      <div className={cn("w-full", className)}>
        <PlanLimitReached
          feature={feature}
          currentCount={currentCount}
          limit={limit}
          plan={plan}
        />
      </div>
    )
  }

  return <>{children}</>
}
