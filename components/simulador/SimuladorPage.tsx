"use client"

import * as React from "react"
import Link from "next/link"
import {
  Truck,
  Search,
  Plus,
  Minus,
  X,
  Package,
  BarChart3,
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// ─── Tipos locais ────────────────────────────────────────────────────────────

interface CaminhaoLocal {
  id: string
  nome: string
  tipo: string
  capacidadeM3: number
  capacidadeKg: number
  comprimentoCm: number
  larguraCm: number
  alturaCm: number
  emoji: string
}

interface ItemCatalogo {
  id: string
  nome: string
  categoria: string
  emoji: string
  larguraCm: number
  alturaCm: number
  profundidadeCm: number
  pesoKg: number
  volumeM3: number
}

interface ItemAdicionado {
  item: ItemCatalogo
  quantidade: number
}

// ─── Dados hardcoded ─────────────────────────────────────────────────────────

const CAMINHOES: CaminhaoLocal[] = [
  { id: "fiorino", nome: "Fiorino", tipo: "fiorino", capacidadeM3: 3, capacidadeKg: 600, comprimentoCm: 200, larguraCm: 130, alturaCm: 120, emoji: "\u{1F690}" },
  { id: "hr", nome: "HR", tipo: "hr", capacidadeM3: 8, capacidadeKg: 1500, comprimentoCm: 350, larguraCm: 180, alturaCm: 180, emoji: "\u{1F69A}" },
  { id: "tres-quartos", nome: "3/4", tipo: "tres_quartos", capacidadeM3: 15, capacidadeKg: 3000, comprimentoCm: 450, larguraCm: 220, alturaCm: 200, emoji: "\u{1F69B}" },
  { id: "bau", nome: "Bau", tipo: "bau", capacidadeM3: 25, capacidadeKg: 5000, comprimentoCm: 600, larguraCm: 250, alturaCm: 250, emoji: "\u{1F4E6}" },
]

const CATALOGO_ITENS: ItemCatalogo[] = [
  // Quarto
  { id: "cama-solteiro", nome: "Cama Solteiro", categoria: "quarto", emoji: "\u{1F6CF}\uFE0F", larguraCm: 90, alturaCm: 45, profundidadeCm: 200, pesoKg: 30, volumeM3: 0.81 },
  { id: "cama-casal", nome: "Cama Casal", categoria: "quarto", emoji: "\u{1F6CF}\uFE0F", larguraCm: 140, alturaCm: 45, profundidadeCm: 200, pesoKg: 45, volumeM3: 1.26 },
  { id: "guarda-roupa", nome: "Guarda-Roupa", categoria: "quarto", emoji: "\u{1F6AA}", larguraCm: 160, alturaCm: 200, profundidadeCm: 60, pesoKg: 70, volumeM3: 1.92 },
  { id: "comoda", nome: "Comoda", categoria: "quarto", emoji: "\u{1F5C4}\uFE0F", larguraCm: 80, alturaCm: 90, profundidadeCm: 45, pesoKg: 25, volumeM3: 0.32 },
  { id: "criado-mudo", nome: "Criado-Mudo", categoria: "quarto", emoji: "\u{1F5C4}\uFE0F", larguraCm: 45, alturaCm: 55, profundidadeCm: 40, pesoKg: 10, volumeM3: 0.10 },
  { id: "colchao-solteiro", nome: "Colchao Solteiro", categoria: "quarto", emoji: "\u{1F6CF}\uFE0F", larguraCm: 88, alturaCm: 20, profundidadeCm: 188, pesoKg: 15, volumeM3: 0.33 },
  { id: "colchao-casal", nome: "Colchao Casal", categoria: "quarto", emoji: "\u{1F6CF}\uFE0F", larguraCm: 138, alturaCm: 25, profundidadeCm: 188, pesoKg: 25, volumeM3: 0.65 },
  // Sala
  { id: "sofa-2lug", nome: "Sofa 2 Lugares", categoria: "sala", emoji: "\u{1F6CB}\uFE0F", larguraCm: 160, alturaCm: 85, profundidadeCm: 90, pesoKg: 40, volumeM3: 1.22 },
  { id: "sofa-3lug", nome: "Sofa 3 Lugares", categoria: "sala", emoji: "\u{1F6CB}\uFE0F", larguraCm: 220, alturaCm: 85, profundidadeCm: 90, pesoKg: 55, volumeM3: 1.68 },
  { id: "mesa-centro", nome: "Mesa de Centro", categoria: "sala", emoji: "\u{1FA91}", larguraCm: 100, alturaCm: 45, profundidadeCm: 60, pesoKg: 15, volumeM3: 0.27 },
  { id: "rack-tv", nome: "Rack de TV", categoria: "sala", emoji: "\u{1F4FA}", larguraCm: 180, alturaCm: 50, profundidadeCm: 45, pesoKg: 30, volumeM3: 0.41 },
  { id: "estante", nome: "Estante", categoria: "sala", emoji: "\u{1F4DA}", larguraCm: 120, alturaCm: 180, profundidadeCm: 35, pesoKg: 35, volumeM3: 0.76 },
  { id: "poltrona", nome: "Poltrona", categoria: "sala", emoji: "\u{1F4BA}", larguraCm: 80, alturaCm: 90, profundidadeCm: 75, pesoKg: 20, volumeM3: 0.54 },
  // Cozinha
  { id: "geladeira", nome: "Geladeira", categoria: "cozinha", emoji: "\u{1F9CA}", larguraCm: 70, alturaCm: 170, profundidadeCm: 70, pesoKg: 60, volumeM3: 0.83 },
  { id: "fogao", nome: "Fogao", categoria: "cozinha", emoji: "\u{1F373}", larguraCm: 60, alturaCm: 85, profundidadeCm: 60, pesoKg: 40, volumeM3: 0.31 },
  { id: "microondas", nome: "Micro-ondas", categoria: "cozinha", emoji: "\u{1F4E1}", larguraCm: 45, alturaCm: 28, profundidadeCm: 35, pesoKg: 12, volumeM3: 0.04 },
  { id: "mesa-jantar", nome: "Mesa de Jantar", categoria: "cozinha", emoji: "\u{1FA91}", larguraCm: 140, alturaCm: 78, profundidadeCm: 80, pesoKg: 30, volumeM3: 0.87 },
  { id: "cadeira", nome: "Cadeira", categoria: "cozinha", emoji: "\u{1FA91}", larguraCm: 45, alturaCm: 90, profundidadeCm: 45, pesoKg: 5, volumeM3: 0.18 },
  { id: "maq-lavar", nome: "Maquina de Lavar", categoria: "cozinha", emoji: "\u{1F300}", larguraCm: 60, alturaCm: 85, profundidadeCm: 65, pesoKg: 65, volumeM3: 0.33 },
  // Escritorio
  { id: "escrivaninha", nome: "Escrivaninha", categoria: "escritorio", emoji: "\u{1F5A5}\uFE0F", larguraCm: 120, alturaCm: 75, profundidadeCm: 60, pesoKg: 25, volumeM3: 0.54 },
  { id: "cadeira-escritorio", nome: "Cadeira de Escritorio", categoria: "escritorio", emoji: "\u{1FA91}", larguraCm: 60, alturaCm: 110, profundidadeCm: 60, pesoKg: 12, volumeM3: 0.40 },
  { id: "armario-arquivo", nome: "Armario Arquivo", categoria: "escritorio", emoji: "\u{1F5C4}\uFE0F", larguraCm: 50, alturaCm: 130, profundidadeCm: 40, pesoKg: 20, volumeM3: 0.26 },
  // Caixas
  { id: "caixa-p", nome: "Caixa P", categoria: "caixas", emoji: "\u{1F4E6}", larguraCm: 35, alturaCm: 30, profundidadeCm: 30, pesoKg: 5, volumeM3: 0.03 },
  { id: "caixa-m", nome: "Caixa M", categoria: "caixas", emoji: "\u{1F4E6}", larguraCm: 50, alturaCm: 40, profundidadeCm: 40, pesoKg: 10, volumeM3: 0.08 },
  { id: "caixa-g", nome: "Caixa G", categoria: "caixas", emoji: "\u{1F4E6}", larguraCm: 60, alturaCm: 50, profundidadeCm: 50, pesoKg: 15, volumeM3: 0.15 },
]

const CATEGORIAS = [
  { id: "todos", label: "Todos" },
  { id: "quarto", label: "Quarto" },
  { id: "sala", label: "Sala" },
  { id: "cozinha", label: "Cozinha" },
  { id: "escritorio", label: "Escritorio" },
  { id: "caixas", label: "Caixas" },
] as const

// ─── Cores para itens no canvas ──────────────────────────────────────────────

const CORES_CATEGORIA: Record<string, { bg: string; border: string; text: string }> = {
  quarto: { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700" },
  sala: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700" },
  cozinha: { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-700" },
  escritorio: { bg: "bg-green-50", border: "border-green-300", text: "text-green-700" },
  caixas: { bg: "bg-slate-50", border: "border-slate-300", text: "text-slate-700" },
}

// ─── Componente principal ────────────────────────────────────────────────────

export function SimuladorPage() {
  const [selectedTruck, setSelectedTruck] = React.useState<CaminhaoLocal>(CAMINHOES[0])
  const [addedItems, setAddedItems] = React.useState<ItemAdicionado[]>([])
  const [busca, setBusca] = React.useState("")
  const [categoriaAtiva, setCategoriaAtiva] = React.useState("todos")
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  // ── Computed values ──────────────────────────────────────────────────────

  const totalVolume = React.useMemo(
    () => addedItems.reduce((sum, ai) => sum + ai.item.volumeM3 * ai.quantidade, 0),
    [addedItems]
  )

  const totalWeight = React.useMemo(
    () => addedItems.reduce((sum, ai) => sum + ai.item.pesoKg * ai.quantidade, 0),
    [addedItems]
  )

  const totalItemCount = React.useMemo(
    () => addedItems.reduce((sum, ai) => sum + ai.quantidade, 0),
    [addedItems]
  )

  const percentVolume = Math.round((totalVolume / selectedTruck.capacidadeM3) * 100)
  const percentWeight = Math.round((totalWeight / selectedTruck.capacidadeKg) * 100)
  const percentMax = Math.max(percentVolume, percentWeight)
  const isOverCapacity = percentMax > 100

  // ── Filtro do catalogo ───────────────────────────────────────────────────

  const itensFiltrados = React.useMemo(() => {
    return CATALOGO_ITENS.filter((item) => {
      const matchBusca =
        busca === "" || item.nome.toLowerCase().includes(busca.toLowerCase())
      const matchCategoria =
        categoriaAtiva === "todos" || item.categoria === categoriaAtiva
      return matchBusca && matchCategoria
    })
  }, [busca, categoriaAtiva])

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleAddItem(item: ItemCatalogo) {
    setAddedItems((prev) => {
      const existing = prev.find((ai) => ai.item.id === item.id)
      if (existing) {
        return prev.map((ai) =>
          ai.item.id === item.id ? { ...ai, quantidade: ai.quantidade + 1 } : ai
        )
      }
      return [...prev, { item, quantidade: 1 }]
    })
  }

  function handleIncrement(itemId: string) {
    setAddedItems((prev) =>
      prev.map((ai) =>
        ai.item.id === itemId ? { ...ai, quantidade: ai.quantidade + 1 } : ai
      )
    )
  }

  function handleDecrement(itemId: string) {
    setAddedItems((prev) =>
      prev
        .map((ai) =>
          ai.item.id === itemId ? { ...ai, quantidade: ai.quantidade - 1 } : ai
        )
        .filter((ai) => ai.quantidade > 0)
    )
  }

  function handleRemoveItem(itemId: string) {
    setAddedItems((prev) => prev.filter((ai) => ai.item.id !== itemId))
  }

  function getItemCount(catalogoItemId: string): number {
    return addedItems.find((ai) => ai.item.id === catalogoItemId)?.quantidade ?? 0
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]">
                <Truck className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">MudaFacil</span>
            </Link>
            <div className="hidden sm:block h-5 w-px bg-slate-200" />
            <Badge
              variant="secondary"
              className="hidden sm:inline-flex bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20 font-semibold"
            >
              Simulador Gratuito
            </Badge>
          </div>

          <Link href="/login">
            <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm h-9">
              Criar conta para salvar
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* ─── Seletor de Caminhao ───────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-4 lg:px-6">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="h-4 w-4 text-[#F59E0B]" />
            <h2 className="font-semibold text-slate-900 text-sm">
              Selecione o caminhao
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {CAMINHOES.map((caminhao) => {
              const isSelected = selectedTruck.id === caminhao.id
              const pVol = Math.round((totalVolume / caminhao.capacidadeM3) * 100)
              const pWeight = Math.round((totalWeight / caminhao.capacidadeKg) * 100)
              const pMax = Math.max(pVol, pWeight)
              const over = pMax > 100

              return (
                <button
                  key={caminhao.id}
                  onClick={() => setSelectedTruck(caminhao)}
                  className={cn(
                    "relative flex flex-col rounded-xl border-2 p-3 text-left transition-all hover:shadow-md",
                    isSelected
                      ? "border-[#2563EB] bg-blue-50/50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300",
                    over && isSelected && "border-red-400 bg-red-50/50"
                  )}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB]">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{caminhao.emoji}</span>
                    <span className="font-semibold text-slate-900 text-sm">
                      {caminhao.nome}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mb-2 space-y-0.5">
                    <p>
                      {caminhao.larguraCm / 100}m x {caminhao.comprimentoCm / 100}m x{" "}
                      {caminhao.alturaCm / 100}m
                    </p>
                    <p>
                      {caminhao.capacidadeM3} m\u00B3 \u00B7 {caminhao.capacidadeKg} kg
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Ocupacao</span>
                      <span
                        className={cn(
                          "font-semibold",
                          over ? "text-red-600" : "text-[#2563EB]"
                        )}
                      >
                        {pMax}%
                      </span>
                    </div>
                    <Progress
                      value={Math.min(pMax, 100)}
                      className={cn(
                        "h-1.5",
                        over ? "[&>div]:bg-red-500" : "[&>div]:bg-[#2563EB]"
                      )}
                    />
                  </div>

                  {over && (
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
      </section>

      {/* ─── Main area: Catalogo | Canvas | Resumo ─────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left sidebar: Catalogo ──────────────────────────────────────── */}
        <aside
          className={cn(
            "flex flex-col border-r border-slate-200 bg-white transition-all duration-300 shrink-0",
            sidebarOpen ? "w-72 lg:w-80" : "w-0"
          )}
        >
          {sidebarOpen && (
            <>
              {/* Catalog header */}
              <div className="px-4 pt-4 pb-2 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#2563EB]" />
                    <h3 className="font-semibold text-slate-900 text-sm">
                      Catalogo de Itens
                    </h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {totalItemCount} adicionados
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

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleAddItem(item)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 group transition-colors w-full text-left"
                      >
                        <span className="text-xl shrink-0">{item.emoji}</span>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {item.nome}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {item.volumeM3} m\u00B3 \u00B7 {item.pesoKg} kg
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {count > 0 && (
                            <Badge className="bg-[#2563EB]/10 text-[#2563EB] border-0 text-[10px] px-1.5 py-0">
                              {count}x
                            </Badge>
                          )}
                          <div className="h-7 w-7 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-[#2563EB]/10 text-[#2563EB]">
                            <Plus className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </button>
                    )
                  })}

                  {itensFiltrados.length === 0 && (
                    <div className="py-8 text-center text-sm text-slate-400">
                      Nenhum item encontrado
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </aside>

        {/* ── Toggle sidebar button ───────────────────────────────────────── */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="relative z-10 flex items-center justify-center w-5 shrink-0 border-r border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
          aria-label={sidebarOpen ? "Fechar catalogo" : "Abrir catalogo"}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-3.5 w-3.5 text-slate-400" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          )}
        </button>

        {/* ── Center: Truck visualization ─────────────────────────────────── */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            <span className="text-lg">{selectedTruck.emoji}</span>
            <span className="font-medium text-slate-700">{selectedTruck.nome}</span>
            <span>\u2014</span>
            <span>
              {selectedTruck.larguraCm / 100}m x {selectedTruck.comprimentoCm / 100}m x{" "}
              {selectedTruck.alturaCm / 100}m
            </span>
          </div>

          {/* Truck outline container */}
          <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-4 min-h-[400px] relative">
            {/* Cab indicator */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-[#F59E0B] rounded-b-full" />

            {addedItems.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <span className="text-5xl block mb-3">{"\u{1F4E6}"}</span>
                  <p className="text-base font-medium mb-1">Nenhum item adicionado</p>
                  <p className="text-sm">
                    Clique nos itens do catalogo para adicionar
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {addedItems.map((ai) => {
                  const cores = CORES_CATEGORIA[ai.item.categoria] ?? CORES_CATEGORIA.caixas
                  const itemVolume = ai.item.volumeM3 * ai.quantidade
                  const itemWeight = ai.item.pesoKg * ai.quantidade

                  return (
                    <div
                      key={ai.item.id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border-2 p-3 transition-all",
                        cores.bg,
                        cores.border
                      )}
                    >
                      <span className="text-2xl shrink-0">{ai.item.emoji}</span>

                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-semibold truncate", cores.text)}>
                          {ai.item.nome}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {itemVolume.toFixed(2)} m\u00B3 \u00B7 {itemWeight} kg
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleDecrement(ai.item.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-white/80 border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-700 transition-colors"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="h-3 w-3" />
                        </button>

                        <span className="w-6 text-center text-sm font-bold text-slate-700">
                          {ai.quantidade}
                        </span>

                        <button
                          onClick={() => handleIncrement(ai.item.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-white/80 border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-700 transition-colors"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="h-3 w-3" />
                        </button>

                        <button
                          onClick={() => handleRemoveItem(ai.item.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 border border-red-200 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors ml-1"
                          aria-label="Remover item"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>

        {/* ── Right sidebar: Resumo ───────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 border-l border-slate-200 bg-white shrink-0">
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
              <p className="text-2xl font-bold text-slate-900">{totalItemCount}</p>
            </div>

            {/* Volume */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">Volume total</p>
                <p className="text-sm font-semibold text-slate-900">
                  {totalVolume.toFixed(2)} m\u00B3
                </p>
              </div>
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
                {percentVolume}% de {selectedTruck.capacidadeM3} m\u00B3
              </p>
            </div>

            {/* Weight */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">Peso total</p>
                <p className="text-sm font-semibold text-slate-900">
                  {totalWeight.toFixed(0)} kg
                </p>
              </div>
              <Progress
                value={Math.min(percentWeight, 100)}
                className={cn(
                  "h-2",
                  percentWeight > 100
                    ? "[&>div]:bg-red-500"
                    : percentWeight > 80
                    ? "[&>div]:bg-[#F59E0B]"
                    : "[&>div]:bg-[#2563EB]"
                )}
              />
              <p className="text-[10px] text-slate-400 text-right">
                {percentWeight}% de {selectedTruck.capacidadeKg} kg
              </p>
            </div>

            {/* Truck info */}
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{selectedTruck.emoji}</span>
                <p className="text-xs font-medium text-slate-700">
                  {selectedTruck.nome}
                </p>
              </div>
              <p className="text-[10px] text-slate-400">
                {selectedTruck.larguraCm / 100}m x {selectedTruck.comprimentoCm / 100}m x{" "}
                {selectedTruck.alturaCm / 100}m
              </p>
            </div>

            {/* Occupancy */}
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
                <div className="flex items-center justify-center gap-1 mt-1.5 text-xs text-red-600 font-medium">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Acima da capacidade!</span>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="p-4 border-t border-slate-100">
            <Link href="/login">
              <Button
                className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-10"
                disabled={totalItemCount === 0}
              >
                Salvar e receber cotacoes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </aside>
      </div>

      {/* ── Mobile summary (visible on lg-) ──────────────────────────────── */}
      <div className="lg:hidden border-t border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#2563EB]" />
            <h3 className="font-semibold text-slate-900 text-sm">Resumo</h3>
          </div>
          <div
            className={cn(
              "text-lg font-bold",
              isOverCapacity
                ? "text-red-600"
                : percentMax > 80
                ? "text-amber-600"
                : "text-green-600"
            )}
          >
            {percentMax}% ocupado
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="rounded-lg bg-slate-50 p-2 text-center">
            <p className="text-[10px] text-slate-500">Itens</p>
            <p className="text-sm font-bold text-slate-900">{totalItemCount}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-2 text-center">
            <p className="text-[10px] text-slate-500">Volume</p>
            <p className="text-sm font-bold text-slate-900">{totalVolume.toFixed(1)} m\u00B3</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-2 text-center">
            <p className="text-[10px] text-slate-500">Peso</p>
            <p className="text-sm font-bold text-slate-900">{totalWeight.toFixed(0)} kg</p>
          </div>
        </div>

        {isOverCapacity && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-2 mb-3 text-xs text-red-600 font-medium">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>A carga excede a capacidade do caminhao selecionado</span>
          </div>
        )}

        <Progress
          value={Math.min(percentMax, 100)}
          className={cn(
            "h-2 mb-3",
            isOverCapacity
              ? "[&>div]:bg-red-500"
              : percentMax > 80
              ? "[&>div]:bg-[#F59E0B]"
              : "[&>div]:bg-[#2563EB]"
          )}
        />

        <Link href="/login">
          <Button
            className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-10"
            disabled={totalItemCount === 0}
          >
            Salvar e receber cotacoes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* ─── Bottom CTA banner ─────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-gradient-to-r from-[#2563EB] to-blue-700 py-8">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Gostou? Crie sua conta para salvar e receber cotacoes reais
          </h2>
          <p className="text-blue-100 text-sm mb-6">
            Salve sua simulacao, compare transportadoras e contrate tudo em um so lugar.
            Sem compromisso.
          </p>
          <Link href="/login">
            <Button
              size="lg"
              className="bg-white text-[#2563EB] hover:bg-blue-50 h-12 px-8 text-base font-semibold"
            >
              Criar conta gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
