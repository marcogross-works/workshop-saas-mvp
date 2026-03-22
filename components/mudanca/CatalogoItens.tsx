"use client"

import * as React from "react"
import { Search, Plus, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CatalogoItem, MudancaItem } from "@/lib/types"

const CATEGORIAS = [
  { id: "todos", label: "Todos" },
  { id: "quarto", label: "Quarto" },
  { id: "cozinha", label: "Cozinha" },
  { id: "sala", label: "Sala" },
  { id: "escritorio", label: "Escritorio" },
  { id: "caixas", label: "Caixas" },
] as const

// Default catalog when API not available
const DEFAULT_CATALOGO: CatalogoItem[] = [
  { id: "1", nome: "Cama casal", icone: "🛏️", largura: 1.4, comprimento: 2.0, altura: 0.5, peso: 40, categoria: "quarto" },
  { id: "2", nome: "Guarda-roupa", icone: "🗄️", largura: 1.6, comprimento: 0.6, altura: 2.0, peso: 70, categoria: "quarto" },
  { id: "3", nome: "Criado-mudo", icone: "🪑", largura: 0.5, comprimento: 0.4, altura: 0.6, peso: 8, categoria: "quarto" },
  { id: "4", nome: "Comoda", icone: "🗃️", largura: 1.2, comprimento: 0.5, altura: 0.8, peso: 30, categoria: "quarto" },
  { id: "5", nome: "Colchao casal", icone: "🛏️", largura: 1.4, comprimento: 2.0, altura: 0.25, peso: 20, categoria: "quarto" },
  { id: "6", nome: "Cama solteiro", icone: "🛏️", largura: 0.9, comprimento: 2.0, altura: 0.5, peso: 25, categoria: "quarto" },
  { id: "7", nome: "Geladeira", icone: "🧊", largura: 0.7, comprimento: 0.7, altura: 1.7, peso: 60, categoria: "cozinha" },
  { id: "8", nome: "Fogao", icone: "🍳", largura: 0.6, comprimento: 0.6, altura: 0.9, peso: 35, categoria: "cozinha" },
  { id: "9", nome: "Microondas", icone: "📡", largura: 0.5, comprimento: 0.4, altura: 0.3, peso: 12, categoria: "cozinha" },
  { id: "10", nome: "Mesa jantar 4", icone: "🍽️", largura: 1.2, comprimento: 0.8, altura: 0.75, peso: 25, categoria: "cozinha" },
  { id: "11", nome: "Mesa jantar 6", icone: "🍽️", largura: 1.6, comprimento: 0.9, altura: 0.75, peso: 35, categoria: "cozinha" },
  { id: "12", nome: "Maquina lavar", icone: "🫧", largura: 0.6, comprimento: 0.6, altura: 0.9, peso: 45, categoria: "cozinha" },
  { id: "13", nome: "Sofa 2 lugares", icone: "🛋️", largura: 1.5, comprimento: 0.8, altura: 0.9, peso: 35, categoria: "sala" },
  { id: "14", nome: "Sofa 3 lugares", icone: "🛋️", largura: 2.0, comprimento: 0.9, altura: 0.9, peso: 50, categoria: "sala" },
  { id: "15", nome: "Rack TV", icone: "📺", largura: 1.6, comprimento: 0.4, altura: 0.5, peso: 20, categoria: "sala" },
  { id: "16", nome: "TV 55\"", icone: "📺", largura: 1.3, comprimento: 0.1, altura: 0.8, peso: 15, categoria: "sala" },
  { id: "17", nome: "Mesa centro", icone: "☕", largura: 1.0, comprimento: 0.5, altura: 0.4, peso: 12, categoria: "sala" },
  { id: "18", nome: "Estante livros", icone: "📚", largura: 0.8, comprimento: 0.3, altura: 1.8, peso: 25, categoria: "sala" },
  { id: "19", nome: "Poltrona", icone: "💺", largura: 0.8, comprimento: 0.8, altura: 0.9, peso: 18, categoria: "sala" },
  { id: "20", nome: "Escrivaninha", icone: "🖥️", largura: 1.2, comprimento: 0.6, altura: 0.75, peso: 20, categoria: "escritorio" },
  { id: "21", nome: "Cadeira escritorio", icone: "🪑", largura: 0.6, comprimento: 0.6, altura: 1.1, peso: 12, categoria: "escritorio" },
  { id: "22", nome: "Arquivo metal", icone: "🗄️", largura: 0.5, comprimento: 0.6, altura: 1.3, peso: 30, categoria: "escritorio" },
  { id: "23", nome: "Estante escritorio", icone: "📁", largura: 0.9, comprimento: 0.4, altura: 1.8, peso: 22, categoria: "escritorio" },
  { id: "24", nome: "Caixa pequena", icone: "📦", largura: 0.4, comprimento: 0.3, altura: 0.3, peso: 5, categoria: "caixas" },
  { id: "25", nome: "Caixa media", icone: "📦", largura: 0.5, comprimento: 0.4, altura: 0.4, peso: 10, categoria: "caixas" },
  { id: "26", nome: "Caixa grande", icone: "📦", largura: 0.6, comprimento: 0.5, altura: 0.5, peso: 15, categoria: "caixas" },
  { id: "27", nome: "Caixa extra grande", icone: "📦", largura: 0.8, comprimento: 0.6, altura: 0.6, peso: 20, categoria: "caixas" },
  { id: "28", nome: "Bicicleta", icone: "🚲", largura: 0.6, comprimento: 1.7, altura: 1.0, peso: 12, categoria: "sala" },
  { id: "29", nome: "Aparador", icone: "🪞", largura: 1.2, comprimento: 0.35, altura: 0.8, peso: 15, categoria: "sala" },
  { id: "30", nome: "Sapateira", icone: "👟", largura: 0.7, comprimento: 0.3, altura: 1.2, peso: 10, categoria: "quarto" },
]

interface CatalogoItensProps {
  catalogoItens?: CatalogoItem[]
  mudancaItens: MudancaItem[]
  onAddItem: (item: CatalogoItem) => void
  className?: string
}

export function CatalogoItens({
  catalogoItens,
  mudancaItens,
  onAddItem,
  className,
}: CatalogoItensProps) {
  const [busca, setBusca] = React.useState("")
  const [categoriaAtiva, setCategoriaAtiva] = React.useState("todos")

  const catalogo = catalogoItens ?? DEFAULT_CATALOGO

  const itensFiltrados = React.useMemo(() => {
    return catalogo.filter((item) => {
      const matchBusca =
        busca === "" ||
        item.nome.toLowerCase().includes(busca.toLowerCase())
      const matchCategoria =
        categoriaAtiva === "todos" || item.categoria === categoriaAtiva
      return matchBusca && matchCategoria
    })
  }, [catalogo, busca, categoriaAtiva])

  const getItemCount = (catalogoItemId: string): number => {
    return mudancaItens
      .filter((mi) => mi.catalogoItemId === catalogoItemId)
      .reduce((sum, mi) => sum + mi.quantidade, 0)
  }

  const totalItensAdicionados = mudancaItens.reduce(
    (sum, mi) => sum + mi.quantidade,
    0
  )

  return (
    <div
      className={cn(
        "flex flex-col bg-white border-r border-slate-200 h-full",
        className
      )}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-[#2563EB]" />
            <h3 className="font-semibold text-slate-900 text-sm">
              Catalogo de Itens
            </h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {totalItensAdicionados} adicionados
          </Badge>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar item..."
            className="pl-8 h-8 text-sm"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaAtiva(cat.id)}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                categoriaAtiva === cat.id
                  ? "bg-[#2563EB] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {itensFiltrados.map((item) => {
            const count = getItemCount(item.id)
            const volume = (
              item.largura *
              item.comprimento *
              item.altura
            ).toFixed(2)

            return (
              <div
                key={item.id}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 group transition-colors"
              >
                <span className="text-xl shrink-0">{item.icone}</span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {item.nome}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {item.largura}x{item.comprimento}x{item.altura}m
                    {" "}·{" "}{volume}m³ · {item.peso}kg
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {count > 0 && (
                    <Badge
                      className="bg-[#2563EB]/10 text-[#2563EB] border-0 text-[10px] px-1.5 py-0"
                    >
                      {count}x
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAddItem(item)}
                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#2563EB]/10 hover:text-[#2563EB]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}

          {itensFiltrados.length === 0 && (
            <div className="py-8 text-center text-sm text-slate-400">
              Nenhum item encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
