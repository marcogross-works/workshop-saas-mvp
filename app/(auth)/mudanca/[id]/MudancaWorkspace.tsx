"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CargaCanvas } from "@/components/mudanca/CargaCanvas"
import { CatalogoItens } from "@/components/mudanca/CatalogoItens"
import { SeletorCaminhao } from "@/components/mudanca/SeletorCaminhao"
import { ResumoCarga } from "@/components/mudanca/ResumoCarga"
import { useMudancaItens, useAddItem, useRemoveItem } from "@/hooks/useMudancaItens"
import { useSaveCargaLayout } from "@/hooks/useCargaLayout"
import { cn } from "@/lib/utils"
import type { Plan, Caminhao, CatalogoItem, MudancaItem, MudancaStatus } from "@/lib/types"

const statusLabels: Record<MudancaStatus, string> = {
  RASCUNHO: "Rascunho",
  COTANDO: "Cotando",
  CONFIRMADA: "Confirmada",
  CONCLUIDA: "Concluida",
}

// Default caminhoes for client-side state
const DEFAULT_CAMINHOES: Caminhao[] = [
  { id: "fiorino", nome: "Fiorino", largura: 1.4, comprimento: 2.2, altura: 1.1, capacidadeM3: 3.4, capacidadeKg: 600 },
  { id: "hr", nome: "HR", largura: 1.8, comprimento: 3.5, altura: 1.8, capacidadeM3: 11.3, capacidadeKg: 1500 },
  { id: "tres-quartos", nome: "3/4", largura: 2.2, comprimento: 4.5, altura: 2.0, capacidadeM3: 19.8, capacidadeKg: 3000 },
  { id: "bau", nome: "Bau", largura: 2.4, comprimento: 6.0, altura: 2.4, capacidadeM3: 34.6, capacidadeKg: 5000 },
]

interface MudancaWorkspaceProps {
  mudancaId: string
  plan: Plan
}

export function MudancaWorkspace({ mudancaId, plan }: MudancaWorkspaceProps) {
  const [catalogoOpen, setCatalogoOpen] = React.useState(true)
  const [selectedCaminhao, setSelectedCaminhao] = React.useState<Caminhao>(
    DEFAULT_CAMINHOES[1] // HR as default
  )

  // Local item state for optimistic canvas updates
  const [localItens, setLocalItens] = React.useState<MudancaItem[]>([])

  const { data: serverItens, isLoading } = useMudancaItens(mudancaId)
  const addItemMutation = useAddItem()
  const saveLayoutMutation = useSaveCargaLayout()

  // Sync server items to local state
  React.useEffect(() => {
    if (serverItens) {
      setLocalItens(serverItens)
    }
  }, [serverItens])

  const handleAddItem = (catalogoItem: CatalogoItem) => {
    // Optimistic local add
    const newItem: MudancaItem = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      mudancaId,
      catalogoItemId: catalogoItem.id,
      quantidade: 1,
      posX: Math.random() * Math.max(0, selectedCaminhao.largura - catalogoItem.largura),
      posY: Math.random() * Math.max(0, selectedCaminhao.comprimento - catalogoItem.comprimento),
      nome: catalogoItem.nome,
      icone: catalogoItem.icone,
      largura: catalogoItem.largura,
      comprimento: catalogoItem.comprimento,
      altura: catalogoItem.altura,
      peso: catalogoItem.peso,
      categoria: catalogoItem.categoria,
    }

    setLocalItens((prev) => [...prev, newItem])

    // API call
    addItemMutation.mutate({
      mudancaId,
      catalogoItemId: catalogoItem.id,
    })
  }

  const handleItemMove = (itemId: string, posX: number, posY: number) => {
    setLocalItens((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, posX, posY } : item
      )
    )

    // Save layout
    saveLayoutMutation.mutate({
      mudancaId,
      caminhaoId: selectedCaminhao.id,
      itens: localItens.map((item) => ({
        itemId: item.id,
        posX: item.id === itemId ? posX : (item.posX ?? 0),
        posY: item.id === itemId ? posY : (item.posY ?? 0),
        rotacao: 0,
      })),
    })
  }

  const handleSelectCaminhao = (caminhao: Caminhao) => {
    setSelectedCaminhao(caminhao)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />
        <span className="ml-2 text-sm text-slate-500">Carregando mudanca...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-4 lg:-m-6">
      {/* Top bar with addresses and status */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="h-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-3.5 w-3.5 text-[#2563EB]" />
            <span className="text-slate-600">Mudanca #{mudancaId.slice(0, 8)}</span>
            <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-[10px]">
              Rascunho
            </Badge>
          </div>
        </div>

        <Link href={`/mudanca/${mudancaId}/cotacoes`}>
          <Button
            size="sm"
            className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-8 text-xs"
          >
            Cotacoes
            <ArrowRight className="ml-1.5 h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Truck selector */}
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <SeletorCaminhao
          selectedId={selectedCaminhao.id}
          itens={localItens}
          onSelect={handleSelectCaminhao}
        />
      </div>

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Catalog sidebar */}
        <div
          className={cn(
            "relative transition-all duration-300 shrink-0",
            catalogoOpen ? "w-72" : "w-0"
          )}
        >
          {catalogoOpen && (
            <CatalogoItens
              mudancaItens={localItens}
              onAddItem={handleAddItem}
              className="w-72"
            />
          )}
          <button
            onClick={() => setCatalogoOpen(!catalogoOpen)}
            className="absolute -right-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
          >
            {catalogoOpen ? (
              <ChevronLeft className="h-3 w-3 text-slate-500" />
            ) : (
              <ChevronRight className="h-3 w-3 text-slate-500" />
            )}
          </button>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center p-6">
          <CargaCanvas
            itens={localItens}
            caminhao={selectedCaminhao}
            onItemMove={handleItemMove}
          />
        </div>

        {/* Right: Summary sidebar */}
        <div className="w-64 shrink-0">
          <ResumoCarga
            itens={localItens}
            caminhao={selectedCaminhao}
            mudancaId={mudancaId}
          />
        </div>
      </div>
    </div>
  )
}
