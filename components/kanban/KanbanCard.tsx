"use client"

import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Trash2, GripVertical, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDeleteTodoItem } from "@/hooks/useTodoItems"
import { useUpdateTodoItem } from "@/hooks/useTodoItems"
import type { TodoItem } from "@/lib/types"

interface KanbanCardProps {
  item: TodoItem
  todoListId: string
  disabled?: boolean
}

export function KanbanCard({ item, todoListId, disabled }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled,
    data: {
      type: "card",
      item,
      todoListId,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const deleteItem = useDeleteTodoItem()
  const updateItem = useUpdateTodoItem()

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateItem.mutate({
      id: item.id,
      todoListId,
      completed: !item.completed,
    })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteItem.mutate({ id: item.id, todoListId })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-shadow dark:border-slate-700 dark:bg-slate-900",
        isDragging
          ? "opacity-50 shadow-lg ring-2 ring-violet-500 ring-offset-2"
          : "hover:shadow-md",
        item.completed && "opacity-60"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="mt-0.5 flex h-5 w-4 shrink-0 cursor-grab items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        aria-label="Arrastar card"
      >
        <GripVertical className="h-3.5 w-3.5 text-slate-400" />
      </div>

      <button
        onClick={handleToggleComplete}
        className={cn(
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          item.completed
            ? "border-violet-500 bg-violet-500 text-white"
            : "border-slate-300 hover:border-violet-400 dark:border-slate-600"
        )}
        aria-label={item.completed ? "Marcar como pendente" : "Marcar como concluído"}
      >
        {item.completed && <Check className="h-2.5 w-2.5" />}
      </button>

      <p
        className={cn(
          "flex-1 min-w-0 break-words text-sm text-slate-800 dark:text-slate-200",
          item.completed && "line-through text-slate-400 dark:text-slate-500"
        )}
      >
        {item.content}
      </p>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={deleteItem.isPending}
        className="ml-auto h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
        aria-label="Deletar tarefa"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

export function KanbanCardSkeleton() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
      <div className="mt-1 h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-2.5 w-1/2 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>
    </div>
  )
}
