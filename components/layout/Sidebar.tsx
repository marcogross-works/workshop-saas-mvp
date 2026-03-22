"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  Kanban,
  ChevronRight,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Plan, TodoList } from "@/lib/types"

interface SidebarProps {
  plan: Plan
  boards?: TodoList[]
}

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  exact?: boolean
}

const mainNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    exact: true,
  },
]

const settingsNavItems: NavItem[] = [
  {
    label: "Configurações",
    href: "/settings",
    icon: <Settings className="h-4 w-4" />,
    exact: true,
  },
  {
    label: "Faturamento",
    href: "/settings/billing",
    icon: <CreditCard className="h-4 w-4" />,
  },
]

function getPlanBadgeVariant(plan: Plan) {
  switch (plan) {
    case "FREE":
      return "free" as const
    case "TRIAL":
      return "trial" as const
    case "PRO":
      return "pro" as const
  }
}

function getPlanLabel(plan: Plan) {
  switch (plan) {
    case "FREE":
      return "Grátis"
    case "TRIAL":
      return "Trial"
    case "PRO":
      return "Pro"
  }
}

function NavLink({
  item,
  pathname,
}: {
  item: NavItem
  pathname: string
}) {
  const isActive = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href)

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
      )}
    >
      {item.icon}
      {item.label}
    </Link>
  )
}

export function Sidebar({ plan, boards = [] }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:flex">
      <div className="flex h-14 items-center border-b border-slate-200 px-4 dark:border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
            <span className="text-sm font-bold text-white">W</span>
          </div>
          <span className="font-semibold text-slate-900 dark:text-slate-50">
            Workshop SaaS
          </span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <div className="mb-1">
          {mainNavItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>

        {boards.length > 0 && (
          <div className="mb-1">
            <div className="mb-1 px-3 py-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Boards
              </p>
            </div>
            {boards.map((board) => (
              <Link
                key={board.id}
                href={`/dashboard`}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname === `/dashboard`
                    ? "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                )}
              >
                <Kanban className="h-4 w-4 shrink-0" />
                <span className="truncate">{board.title}</span>
                <ChevronRight className="ml-auto h-3 w-3 shrink-0 opacity-40" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <div className="mb-1">
          {settingsNavItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>

        <Separator className="my-2" />

        <div className="flex items-center justify-between px-3 py-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Plano atual
          </span>
          <Badge variant={getPlanBadgeVariant(plan)}>
            {getPlanLabel(plan)}
          </Badge>
        </div>
      </div>
    </aside>
  )
}
