"use client"

import * as React from "react"
import { BarChart3, AlertTriangle, Truck, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { MudancaItem, Caminhao } from "@/lib/types"

interface ResumoCargaProps {
  itens: MudancaItem[]
  caminhao: Caminhao | null
  mudancaId: string
  className?: string
}

function calcularVolumeTotal(itens: MudancaItem[]): number {
  return itens.reduce(
    (sum, item) =>
      sum + item.largura * item.comprimento * item.altura * item.quantidade,
    0
  )
}

function calcularPesoTotal(itens: MudancaItem[]): number {
  return itens.reduce((sum, item) => sum + item.peso * item.quantidade, 0)
}

export function ResumoCarga({
  itens,
  caminhao,
  mudancaId,
  className,
}: ResumoCargaProps) {
  const volumeTotal = calcularVolumeTotal(itens)
  const pesoTotal = calcularPesoTotal(itens)
  const totalItens = itens.reduce((sum, i) => sum + i.quantidade, 0)

  const percentVolume = caminhao
    ? Math.round((volumeTotal / caminhao.capacidadeM3) * 100)
    : 0
  const percentPeso = caminhao
    ? Math.round((pesoTotal / caminhao.capacidadeKg) * 100)
    : 0
  const percentMax = Math.max(percentVolume, percentPeso)
  const isOverCapacity = percentMax > 100

  return (
    <div
      className={cn(
        "flex flex-col bg-white border-l border-slate-200 h-full",
        className
      )}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#2563EB]" />
          <h3 className="font-semibold text-slate-900 text-sm">
            Resumo da Carga
          </h3>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Total items */}
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500 mb-1">Total de itens</p>
          <p className="text-2xl font-bold text-slate-900">{totalItens}</p>
        </div>

        {/* Volume */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">Volume total</p>
            <p className="text-sm font-semibold text-slate-900">
              {volumeTotal.toFixed(2)} m³
            </p>
          </div>
          {caminhao && (
            <>
              <Progress
                value={Math.min(percentVolume, 100)}
                className={cn(
                  "h-2",
                  percentVolume > 100
                    ? "[&>div]:bg-red-500"
                    : percentVolume > 80
                    ? "[&>div]:bg-[#F59E0B]"
                    : "[&>div]:bg-[#2563EB]"
                )}
              />
              <p className="text-[10px] text-slate-400 text-right">
                {percentVolume}% de {caminhao.capacidadeM3} m³
              </p>
            </>
          )}
        </div>

        {/* Weight */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">Peso total</p>
            <p className="text-sm font-semibold text-slate-900">
              {pesoTotal.toFixed(0)} kg
            </p>
          </div>
          {caminhao && (
            <>
              <Progress
                value={Math.min(percentPeso, 100)}
                className={cn(
                  "h-2",
                  percentPeso > 100
                    ? "[&>div]:bg-red-500"
                    : percentPeso > 80
                    ? "[&>div]:bg-[#F59E0B]"
                    : "[&>div]:bg-[#2563EB]"
                )}
              />
              <p className="text-[10px] text-slate-400 text-right">
                {percentPeso}% de {caminhao.capacidadeKg} kg
              </p>
            </>
          )}
        </div>

        {/* Truck info */}
        {caminhao && (
          <div className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Truck className="h-3.5 w-3.5 text-[#F59E0B]" />
              <p className="text-xs font-medium text-slate-700">
                {caminhao.nome}
              </p>
            </div>
            <p className="text-[10px] text-slate-400">
              {caminhao.largura}m x {caminhao.comprimento}m x{" "}
              {caminhao.altura}m
            </p>
          </div>
        )}

        {/* Occupancy */}
        {caminhao && (
          <div
            className={cn(
              "rounded-xl p-3 text-center",
              isOverCapacity
                ? "bg-red-50 border border-red-200"
                : percentMax > 80
                ? "bg-amber-50 border border-amber-200"
                : "bg-green-50 border border-green-200"
            )}
          >
            <p className="text-xs text-slate-500 mb-0.5">Ocupacao</p>
            <p
              className={cn(
                "text-3xl font-bold",
                isOverCapacity
                  ? "text-red-600"
                  : percentMax > 80
                  ? "text-amber-600"
                  : "text-green-600"
              )}
            >
              {percentMax}%
            </p>
            {isOverCapacity && (
              <Badge variant="destructive" className="mt-1 text-[10px]">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Acima da capacidade
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="p-4 border-t border-slate-100">
        <Link href={`/mudanca/${mudancaId}/cotacoes`}>
          <Button
            className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-10"
            disabled={totalItens === 0}
          >
            Solicitar cotacoes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
