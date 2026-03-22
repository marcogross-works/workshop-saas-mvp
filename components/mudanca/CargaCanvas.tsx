"use client"

import * as React from "react"
import {
  DndContext,
  useDraggable,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import type { MudancaItem, Caminhao } from "@/lib/types"

interface CargaCanvasProps {
  itens: MudancaItem[]
  caminhao: Caminhao | null
  onItemMove: (itemId: string, posX: number, posY: number) => void
  className?: string
}

// Scale: 1m = 60px
const SCALE = 60

interface DraggableItemProps {
  item: MudancaItem
  scale: number
  allItems: MudancaItem[]
}

function DraggableItem({ item, scale, allItems }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      data: { item },
    })

  const width = item.largura * scale
  const height = item.comprimento * scale
  const posX = (item.posX ?? 0) * scale
  const posY = (item.posY ?? 0) * scale

  const currentX = posX + (transform?.x ?? 0)
  const currentY = posY + (transform?.y ?? 0)

  // Check overlap with other items
  const isOverlapping = React.useMemo(() => {
    if (!isDragging) return false
    const myLeft = currentX / scale
    const myTop = currentY / scale
    const myRight = myLeft + item.largura
    const myBottom = myTop + item.comprimento

    return allItems.some((other) => {
      if (other.id === item.id) return false
      const otherLeft = other.posX ?? 0
      const otherTop = other.posY ?? 0
      const otherRight = otherLeft + other.largura
      const otherBottom = otherTop + other.comprimento

      return (
        myLeft < otherRight &&
        myRight > otherLeft &&
        myTop < otherBottom &&
        myBottom > otherTop
      )
    })
  }, [isDragging, currentX, currentY, item, allItems, scale])

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "absolute flex flex-col items-center justify-center rounded-md border-2 cursor-grab active:cursor-grabbing transition-shadow select-none",
        isDragging && "z-50 shadow-lg",
        isOverlapping
          ? "border-red-400 bg-red-100/80 text-red-700"
          : "border-[#2563EB]/40 bg-blue-50/80 text-slate-700 hover:border-[#2563EB]/70"
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${posX}px`,
        top: `${posY}px`,
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      <span className="text-lg leading-none">{item.icone}</span>
      <span className="text-[9px] font-medium leading-tight mt-0.5 text-center px-0.5 truncate w-full">
        {item.nome}
      </span>
    </div>
  )
}

export function CargaCanvas({
  itens,
  caminhao,
  onItemMove,
  className,
}: CargaCanvasProps) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 4 },
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 5 },
  })
  const sensors = useSensors(mouseSensor, touchSensor)

  const containerWidth = caminhao ? caminhao.largura * SCALE : 400
  const containerHeight = caminhao ? caminhao.comprimento * SCALE : 600

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    const item = itens.find((i) => i.id === active.id)
    if (!item) return

    const newPosX = Math.max(
      0,
      Math.min(
        (caminhao?.largura ?? 10) - item.largura,
        (item.posX ?? 0) + delta.x / SCALE
      )
    )
    const newPosY = Math.max(
      0,
      Math.min(
        (caminhao?.comprimento ?? 10) - item.comprimento,
        (item.posY ?? 0) + delta.y / SCALE
      )
    )

    onItemMove(item.id, Math.round(newPosX * 100) / 100, Math.round(newPosY * 100) / 100)
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Truck label */}
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
        <span>
          {caminhao
            ? `${caminhao.nome} — ${caminhao.largura}m x ${caminhao.comprimento}m`
            : "Selecione um caminhao"}
        </span>
      </div>

      {/* Canvas container */}
      <div className="overflow-auto rounded-xl border-2 border-slate-300 bg-white shadow-inner">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div
            className="relative cargo-grid"
            style={{
              width: `${containerWidth}px`,
              height: `${containerHeight}px`,
            }}
          >
            {/* Truck outline decorations */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Cab indicator at top */}
              <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-[#F59E0B] rounded-b" />
              {/* Side walls */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-400/30 rounded" />
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-slate-400/30 rounded" />
              {/* Back */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-400/30 rounded" />
            </div>

            {/* Dimension labels */}
            {caminhao && (
              <>
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-slate-400 whitespace-nowrap">
                  {caminhao.comprimento}m
                </div>
                <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-[10px] text-slate-400">
                  {caminhao.largura}m
                </div>
              </>
            )}

            {/* Draggable items */}
            {itens.map((item) => (
              <DraggableItem
                key={item.id}
                item={item}
                scale={SCALE}
                allItems={itens}
              />
            ))}

            {/* Empty state */}
            {itens.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <span className="text-4xl block mb-2">📦</span>
                  <p className="text-sm">Arraste itens do catalogo para ca</p>
                </div>
              </div>
            )}
          </div>
        </DndContext>
      </div>
    </div>
  )
}
