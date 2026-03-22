"use client"

import * as React from "react"
import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { Plus, Trash2, Pencil, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { KanbanCard } from "@/components/kanban/KanbanCard"
import {
  useDeleteTodoList,
  useUpdateTodoList,
} from "@/hooks/useTodoLists"
import { useCreateTodoItem } from "@/hooks/useTodoItems"
import type { TodoList } from "@/lib/types"

interface KanbanColumnProps {
  list: TodoList
  itemsLimitReached?: boolean
}

export function KanbanColumn({ list, itemsLimitReached = false }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
    data: { type: "column", listId: list.id },
  })

  const [isEditingTitle, setIsEditingTitle] = React.useState(false)
  const [titleValue, setTitleValue] = React.useState(list.title)
  const [isAddingCard, setIsAddingCard] = React.useState(false)
  const [newCardContent, setNewCardContent] = React.useState("")

  const titleInputRef = React.useRef<HTMLInputElement>(null)
  const cardInputRef = React.useRef<HTMLInputElement>(null)

  const deleteList = useDeleteTodoList()
  const updateList = useUpdateTodoList()
  const createItem = useCreateTodoItem()

  const sortedItems = React.useMemo(
    () => [...list.items].sort((a, b) => a.order - b.order),
    [list.items]
  )

  const itemIds = sortedItems.map((item) => item.id)

  React.useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus()
      titleInputRef.current?.select()
    }
  }, [isEditingTitle])

  React.useEffect(() => {
    if (isAddingCard) {
      cardInputRef.current?.focus()
    }
  }, [isAddingCard])

  const handleSaveTitle = () => {
    const trimmed = titleValue.trim()
    if (!trimmed) {
      setTitleValue(list.title)
      setIsEditingTitle(false)
      return
    }
    if (trimmed !== list.title) {
      updateList.mutate({ id: list.id, title: trimmed })
    }
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveTitle()
    if (e.key === "Escape") {
      setTitleValue(list.title)
      setIsEditingTitle(false)
    }
  }

  const handleAddCard = () => {
    const trimmed = newCardContent.trim()
    if (!trimmed) {
      setIsAddingCard(false)
      return
    }
    createItem.mutate({ content: trimmed, todoListId: list.id })
    setNewCardContent("")
    setIsAddingCard(false)
  }

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAddCard()
    if (e.key === "Escape") {
      setNewCardContent("")
      setIsAddingCard(false)
    }
  }

  const handleDelete = () => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir a lista "${list.title}" e todas as suas tarefas?`
      )
    ) {
      deleteList.mutate(list.id)
    }
  }

  const completedCount = list.items.filter((i) => i.completed).length

  return (
    <div
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-xl border bg-slate-50 dark:bg-slate-900/60",
        isOver
          ? "border-violet-400 shadow-md shadow-violet-100 dark:border-violet-600 dark:shadow-violet-900/20"
          : "border-slate-200 dark:border-slate-700/60"
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        {isEditingTitle ? (
          <div className="flex flex-1 items-center gap-1">
            <Input
              ref={titleInputRef}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={handleSaveTitle}
              className="h-7 flex-1 px-2 text-sm font-semibold"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveTitle}
              className="h-6 w-6 text-green-600 hover:bg-green-50 hover:text-green-700"
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setTitleValue(list.title)
                setIsEditingTitle(false)
              }}
              className="h-6 w-6 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setIsEditingTitle(true)}
              className="flex-1 text-left"
            >
              <span className="text-sm font-semibold text-slate-800 hover:text-slate-600 dark:text-slate-200 dark:hover:text-slate-300">
                {list.title}
              </span>
            </button>

            <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-slate-200 px-1.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
              {list.items.length}
            </span>

            {completedCount > 0 && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-green-100 px-1.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-400">
                {completedCount} ✓
              </span>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditingTitle(true)}
              className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Pencil className="h-3 w-3" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deleteList.isPending}
              className="h-6 w-6 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2",
          sortedItems.length === 0 && isOver && "min-h-[80px]"
        )}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {sortedItems.map((item) => (
            <KanbanCard
              key={item.id}
              item={item}
              todoListId={list.id}
            />
          ))}
        </SortableContext>

        {sortedItems.length === 0 && !isOver && (
          <div className="flex min-h-[60px] items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-400">Nenhuma tarefa</p>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 p-2 dark:border-slate-700/60">
        {isAddingCard ? (
          <div className="flex flex-col gap-1.5">
            <Input
              ref={cardInputRef}
              value={newCardContent}
              onChange={(e) => setNewCardContent(e.target.value)}
              onKeyDown={handleCardKeyDown}
              placeholder="Nome da tarefa..."
              className="h-8 text-sm"
            />
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={handleAddCard}
                disabled={createItem.isPending || !newCardContent.trim()}
                className="h-7 flex-1 bg-violet-600 hover:bg-violet-700 text-white text-xs"
              >
                Adicionar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNewCardContent("")
                  setIsAddingCard(false)
                }}
                className="h-7 px-2 text-xs"
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (!itemsLimitReached) setIsAddingCard(true)
            }}
            disabled={itemsLimitReached}
            className="h-7 w-full justify-start gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            <Plus className="h-3.5 w-3.5" />
            {itemsLimitReached ? "Limite de tarefas atingido" : "Adicionar tarefa"}
          </Button>
        )}
      </div>
    </div>
  )
}
