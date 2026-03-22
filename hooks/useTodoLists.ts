"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { TodoList } from "@/lib/types"

const TODO_LISTS_KEY = ["todo-lists"] as const

async function fetchTodoLists(): Promise<TodoList[]> {
  const res = await fetch("/api/todo-lists")
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao buscar listas")
  }
  const json = await res.json()
  // API returns { data: lists } — each list includes items via separate fetch
  const lists: TodoList[] = (json.data ?? json) as TodoList[]

  // Fetch items for each list
  const listsWithItems = await Promise.all(
    lists.map(async (list) => {
      try {
        const itemsRes = await fetch(`/api/todo-lists/${list.id}`)
        if (itemsRes.ok) {
          const itemsJson = await itemsRes.json()
          const fullList = (itemsJson.data ?? itemsJson) as TodoList
          return fullList
        }
      } catch {
        // fall through
      }
      return { ...list, items: [] }
    })
  )

  return listsWithItems
}

async function createTodoList(data: { title: string }): Promise<TodoList> {
  const res = await fetch("/api/todo-lists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao criar lista")
  }
  const json = await res.json()
  const list = (json.data ?? json) as TodoList
  return { ...list, items: list.items ?? [] }
}

async function updateTodoList(data: {
  id: string
  title: string
}): Promise<TodoList> {
  const res = await fetch(`/api/todo-lists/${data.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: data.title }),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao atualizar lista")
  }
  const json = await res.json()
  const list = (json.data ?? json) as TodoList
  return { ...list, items: list.items ?? [] }
}

async function deleteTodoList(id: string): Promise<void> {
  const res = await fetch(`/api/todo-lists/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? error.error ?? "Erro ao deletar lista")
  }
}

export function useTodoLists() {
  return useQuery({
    queryKey: TODO_LISTS_KEY,
    queryFn: fetchTodoLists,
    staleTime: 1000 * 60,
  })
}

export function useCreateTodoList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTodoList,
    onMutate: async (newList) => {
      await queryClient.cancelQueries({ queryKey: TODO_LISTS_KEY })
      const previous = queryClient.getQueryData<TodoList[]>(TODO_LISTS_KEY)

      const optimistic: TodoList = {
        id: `optimistic-${Date.now()}`,
        title: newList.title,
        userId: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
      }

      queryClient.setQueryData<TodoList[]>(TODO_LISTS_KEY, (old = []) => [
        ...old,
        optimistic,
      ])

      return { previous }
    },
    onError: (_err, _newList, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TODO_LISTS_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TODO_LISTS_KEY })
    },
  })
}

export function useUpdateTodoList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTodoList,
    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: TODO_LISTS_KEY })
      const previous = queryClient.getQueryData<TodoList[]>(TODO_LISTS_KEY)

      queryClient.setQueryData<TodoList[]>(TODO_LISTS_KEY, (old = []) =>
        old.map((list) =>
          list.id === updated.id ? { ...list, title: updated.title } : list
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

export function useDeleteTodoList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTodoList,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TODO_LISTS_KEY })
      const previous = queryClient.getQueryData<TodoList[]>(TODO_LISTS_KEY)

      queryClient.setQueryData<TodoList[]>(TODO_LISTS_KEY, (old = []) =>
        old.filter((list) => list.id !== id)
      )

      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TODO_LISTS_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TODO_LISTS_KEY })
    },
  })
}
