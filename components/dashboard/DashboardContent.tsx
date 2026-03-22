"use client"

import * as React from "react"
import { KanbanBoard } from "@/components/kanban/KanbanBoard"
import type { Plan } from "@/lib/types"

interface DashboardContentProps {
  plan: Plan
}

export function DashboardContent({ plan }: DashboardContentProps) {
  return (
    <div className="overflow-hidden">
      <KanbanBoard plan={plan} />
    </div>
  )
}
