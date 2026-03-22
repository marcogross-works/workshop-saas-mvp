"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { TodoItem, TodoList } from "@/lib/types"

const TODO_LISTS_KEY = ["todo-lists"] as const

async function createTodoItem(data: {
  content: string
  todoListId: string
}): Promise<TodoItem> {
  const res = await fetch("/api/todo-items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: data.content,
      todoListId: data.todoListId,
    }),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao criar tarefa")
  }
  const json = await res.json()
  return (json.data ?? json) as TodoItem
}

async function updateTodoItem(data: {
  id: string
  todoListId: string
  content?: string
  completed?: boolean
  order?: number
}): Promise<TodoItem> {
  const res = await fetch(`/api/todo-items/${data.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...(data.content !== undefined && { content: data.content }),
      ...(data.completed !== undefined && { completed: data.completed }),
      ...(data.order !== undefined && { order: data.order }),
    }),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao atualizar tarefa")
  }
  const json = await res.json()
  return (json.data ?? json) as TodoItem
}

async function deleteTodoItem(data: {
  id: string
  todoListId: string
}): Promise<void> {
  const res = await fetch(`/api/todo-items/${data.id}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao deletar tarefa")
  }
}

async function reorderTodoItems(data: {
  todoListId: string
  itemIds: string[]
}): Promise<void> {
  // API expects: { items: [{ id, order }] }
  const items = data.itemIds.map((id, index) => ({ id, order: index }))

  const res = await fetch("/api/todo-items/reorder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao reordenar tarefas")
  }
}

export function useCreateTodoItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTodoItem,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: TODO_LISTS_KEY })
      const previous = queryClient.getQueryData<TodoList[]>(TODO_LISTS_KEY)

      const optimistic: TodoItem = {
        id: `optimistic-${Date.now()}`,
        content: newItem.content,
        order: 9999,
        completed: false,
        todoListId: newItem.todoListId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      queryClient.setQueryData<TodoList[]>(TODO_LISTS_KEY, (old = []) =>
        old.map((list) =>
          list.id === newItem.todoListId
            ? { ...list, items: [...list.items, optimistic] }
            : list
        )
      )

      return { previous }
    },
    onError: (_err, _newItem, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TODO_LISTS_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TODO_LISTS_KEY })
    },
  })
}

export function useUpdateTodoItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTodoItem,
    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: TODO_LISTS_KEY })
      const previous = queryClient.getQueryData<TodoList[]>(TODO_LISTS_KEY)

      queryClient.setQueryData<TodoList[]>(TODO_LISTS_KEY, (old = []) =>
        old.map((list) =>
          list.id === updated.todoListId
            ? {
                ...list,
                items: list.items.map((item) =>
                  item.id === updated.id
                    ? {
                        ...item,
                        ...(updated.content !== undefined && {
                          content: updated.content,
                        }),
                        ...(updated.completed !== undefined && {
                          completed: updated.completed,
                        }),
                      }
                    : item
                ),
              }
            : list
        )
      )

      return { previous }
    },
    onError: (_err, _updated, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TODO_LISTS_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TODO_LISTS_KEY })
    },
  })
}

export function useDeleteTodoItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTodoItem,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: TODO_LISTS_KEY })
      const previous = queryClient.getQueryData<TodoList[]>(TODO_LISTS_KEY)

      queryClient.setQueryData<TodoList[]>(TODO_LISTS_KEY, (old = []) =>
        old.map((list) =>
          list.id === data.todoListId
            ? {
                ...list,
                items: list.items.filter((item) => item.id !== data.id),
              }
            : list
        )
      )

      return { previous }
    },
    onError: (_err, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TODO_LISTS_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TODO_LISTS_KEY })
    },
  })
}

export function useReorderTodoItems() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reorderTodoItems,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: TODO_LISTS_KEY })
      const previous = queryClient.getQueryData<TodoList[]>(TODO_LISTS_KEY)

      queryClient.setQueryData<TodoList[]>(TODO_LISTS_KEY, (old = []) =>
        old.map((list) => {
          if (list.id !== data.todoListId) return list

          const reordered = data.itemIds
            .map((id) => list.items.find((item) => item.id === id))
            .filter((item): item is TodoItem => Boolean(item))
            .map((item, index) => ({ ...item, order: index }))

          return { ...list, items: reordered }
        })
      )

      return { previous }
    },
    onError: (_err, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TODO_LISTS_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TODO_LISTS_KEY })
    },
  })
}
