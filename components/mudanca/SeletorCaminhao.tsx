"use client"

import * as React from "react"
import { Truck, AlertTriangle, Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { Caminhao, MudancaItem } from "@/lib/types"

const DEFAULT_CAMINHOES: Caminhao[] = [
  {
    id: "fiorino",
    nome: "Fiorino",
    largura: 1.4,
    comprimento: 2.2,
    altura: 1.1,
    capacidadeM3: 3.4,
    capacidadeKg: 600,
  },
  {
    id: "hr",
    nome: "HR",
    largura: 1.8,
    comprimento: 3.5,
    altura: 1.8,
    capacidadeM3: 11.3,
    capacidadeKg: 1500,
  },
  {
    id: "tres-quartos",
    nome: "3/4",
    largura: 2.2,
    comprimento: 4.5,
    altura: 2.0,
    capacidadeM3: 19.8,
    capacidadeKg: 3000,
  },
  {
    id: "bau",
    nome: "Bau",
    largura: 2.4,
    comprimento: 6.0,
    altura: 2.4,
    capacidadeM3: 34.6,
    capacidadeKg: 5000,
  },
]

interface SeletorCaminhaoProps {
  caminhoes?: Caminhao[]
  selectedId: string | null
  itens: MudancaItem[]
  onSelect: (caminhao: Caminhao) => void
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

export function SeletorCaminhao({
  caminhoes,
  selectedId,
  itens,
  onSelect,
  className,
}: SeletorCaminhaoProps) {
  const lista = caminhoes ?? DEFAULT_CAMINHOES
  const volumeTotal = calcularVolumeTotal(itens)
  const pesoTotal = calcularPesoTotal(itens)

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Truck className="h-4 w-4 text-[#F59E0B]" />
        <h3 className="font-semibold text-slate-900 text-sm">
          Selecione o caminhao
        </h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {lista.map((caminhao) => {
          const isSelected = selectedId === caminhao.id
          const percentVolume = Math.round(
            (volumeTotal / caminhao.capacidadeM3) * 100
          )
          const percentPeso = Math.round(
            (pesoTotal / caminhao.capacidadeKg) * 100
          )
          const percentMax = Math.max(percentVolume, percentPeso)
          const isOverCapacity = percentMax > 100

          return (
            <button
              key={caminhao.id}
              onClick={() => onSelect(caminhao)}
              className={cn(
                "relative flex flex-col rounded-xl border-2 p-3 text-left transition-all hover:shadow-md",
                isSelected
                  ? "border-[#2563EB] bg-blue-50/50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300",
                isOverCapacity && isSelected && "border-red-400 bg-red-50/50"
              )}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB]">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}

              {/* Truck name and icon */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🚛</span>
                <span className="font-semibold text-slate-900 text-sm">
                  {caminhao.nome}
                </span>
              </div>

              {/* Dimensions */}
              <div className="text-[11px] text-slate-500 mb-2 space-y-0.5">
                <p>
                  {caminhao.largura}m x {caminhao.comprimento}m x{" "}
                  {caminhao.altura}m
                </p>
                <p>
                  {caminhao.capacidadeM3} m³ · {caminhao.capacidadeKg} kg
                </p>
              </div>

              {/* Capacity bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Ocupacao</span>
                  <span
                    className={cn(
                      "font-semibold",
                      isOverCapacity ? "text-red-600" : "text-[#2563EB]"
                    )}
                  >
                    {percentMax}%
                  </span>
                </div>
                <Progress
                  value={Math.min(percentMax, 100)}
                  className={cn(
                    "h-1.5",
                    isOverCapacity
                      ? "[&>div]:bg-red-500"
                      : "[&>div]:bg-[#2563EB]"
                  )}
                />
              </div>

              {/* Over capacity warning */}
              {isOverCapacity && (
                <div className="flex items-center gap-1 mt-2 text-[10px] text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Excede capacidade</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
