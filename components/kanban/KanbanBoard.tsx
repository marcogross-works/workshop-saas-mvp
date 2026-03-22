"use client"

import * as React from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  closestCorners,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import { createPortal } from "react-dom"
import { Plus, Loader2, AlertCircle } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { KanbanColumn } from "@/components/kanban/KanbanColumn"
import { KanbanCard } from "@/components/kanban/KanbanCard"
import { cn } from "@/lib/utils"
import {
  useTodoLists,
  useCreateTodoList,
} from "@/hooks/useTodoLists"
import { useReorderTodoItems } from "@/hooks/useTodoItems"
import { PLAN_LIMITS } from "@/lib/types"
import type { Plan, TodoList, TodoItem } from "@/lib/types"

interface KanbanBoardProps {
  plan: Plan
}

export function KanbanBoard({ plan }: KanbanBoardProps) {
  const { data: lists = [], isLoading, isError } = useTodoLists()
  const createList = useCreateTodoList()
  const reorderItems = useReorderTodoItems()
  const queryClient = useQueryClient()

  const [activeCard, setActiveCard] = React.useState<{
    item: TodoItem
    todoListId: string
  } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const listIds = lists.map((l) => l.id)

  const planLimits = PLAN_LIMITS[plan]
  const boardLimitReached = lists.length >= planLimits.boards
  const totalItemsCount = lists.reduce((acc, l) => acc + l.items.length, 0)
  const itemsLimitReached =
    planLimits.items !== Infinity && totalItemsCount >= planLimits.items

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (active.data.current?.type === "card") {
      setActiveCard({
        item: active.data.current.item as TodoItem,
        todoListId: active.data.current.todoListId as string,
      })
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const isActiveCard = active.data.current?.type === "card"
    if (!isActiveCard) return

    const activeListId = active.data.current?.todoListId as string
    const overListId =
      over.data.current?.type === "card"
        ? (over.data.current?.todoListId as string)
        : (overId as string)

    if (!activeListId || !overListId) return
    if (activeListId === overListId) return

    queryClient.setQueryData<TodoList[]>(["todo-lists"], (old = []) => {
      const activeList = old.find((l) => l.id === activeListId)
      const overList = old.find((l) => l.id === overListId)
      if (!activeList || !overList) return old

      const activeItem = activeList.items.find((i) => i.id === activeId)
      if (!activeItem) return old

      return old.map((list) => {
        if (list.id === activeListId) {
          return {
            ...list,
            items: list.items.filter((i) => i.id !== activeId),
          }
        }
        if (list.id === overListId) {
          const overIndex = list.items.findIndex((i) => i.id === overId)
          const newItems = [...list.items]
          const insertIndex = overIndex >= 0 ? overIndex : newItems.length
          newItems.splice(insertIndex, 0, { ...activeItem, todoListId: overListId })
          return { ...list, items: newItems }
        }
        return list
      })
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const isActiveCard = active.data.current?.type === "card"
    if (!isActiveCard) return

    const currentLists = queryClient.getQueryData<TodoList[]>(["todo-lists"]) ?? []

    const activeListId =
      currentLists
        .find((l) => l.items.some((i) => i.id === activeId))
        ?.id ?? ""

    const overListId =
      over.data.current?.type === "card"
        ? (over.data.current?.todoListId as string)
        : (overId as string)

    if (!activeListId || !overListId) return

    const targetList = currentLists.find((l) => l.id === overListId)
    if (!targetList) return

    const sortedItems = [...targetList.items].sort((a, b) => a.order - b.order)
    const activeIndex = sortedItems.findIndex((i) => i.id === activeId)
    const overIndex = sortedItems.findIndex((i) => i.id === overId)

    let newOrder: TodoItem[]
    if (activeListId === overListId && activeIndex !== -1 && overIndex !== -1) {
      newOrder = arrayMove(sortedItems, activeIndex, overIndex)
    } else {
      newOrder = sortedItems
    }

    reorderItems.mutate({
      todoListId: overListId,
      itemIds: newOrder.map((i) => i.id),
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-50">
            Erro ao carregar o board
          </p>
          <p className="text-sm text-slate-500">
            Tente recarregar a página
          </p>
        </div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-start gap-4 overflow-x-auto pb-4">
        <SortableContext
          items={listIds}
          strategy={horizontalListSortingStrategy}
        >
          {lists.map((list) => (
            <KanbanColumn
              key={list.id}
              list={list}
              itemsLimitReached={itemsLimitReached}
            />
          ))}
        </SortableContext>

        <div className="shrink-0">
          <Button
            variant="outline"
            onClick={() => {
              if (!boardLimitReached) {
                const title = window.prompt("Nome da nova lista:")
                if (title?.trim()) {
                  createList.mutate({ title: title.trim() })
                }
              }
            }}
            disabled={boardLimitReached || createList.isPending}
            className={cn(
              "h-10 w-64 justify-start gap-2 border-dashed text-sm",
              boardLimitReached &&
                "cursor-not-allowed opacity-50"
            )}
          >
            {createList.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {boardLimitReached
              ? "Limite de listas atingido"
              : "Nova lista"}
          </Button>

          {boardLimitReached && plan === "FREE" && (
            <p className="mt-1.5 text-center text-xs text-slate-400">
              Faça upgrade para criar mais listas
            </p>
          )}
        </div>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <DragOverlay>
            {activeCard ? (
              <div className="rotate-2 scale-105">
                <KanbanCard
                  item={activeCard.item}
                  todoListId={activeCard.todoListId}
                  disabled
                />
              </div>
            ) : null}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  )
}
