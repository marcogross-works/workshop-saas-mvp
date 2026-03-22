"use client"

import * as React from "react"
import Link from "next/link"
import { LogOut, Settings, CreditCard, User, Truck } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Plan, UserProfile } from "@/lib/types"

interface TopHeaderProps {
  user: UserProfile
  onSignOut: () => void
}

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
      return "Gratis"
    case "TRIAL":
      return "Trial"
    case "PRO":
      return "Pro"
  }
}

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  return email.slice(0, 2).toUpperCase()
}

export function TopHeader({ user, onSignOut }: TopHeaderProps) {
  const initials = getInitials(user.name, user.email)

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950 lg:px-6">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB]">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-50">
              MudaFacil
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex" />

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full"
              >
                <Avatar className="h-9 w-9">
                  {user.image && (
                    <AvatarImage src={user.image} alt={user.name ?? user.email} />
                  )}
                  <AvatarFallback className="bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#2563EB]/20 dark:text-blue-300 text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold leading-none truncate max-w-[140px]">
                      {user.name ?? "Usuario"}
                    </p>
                    <Badge variant={getPlanBadgeVariant(user.plan)}>
                      {getPlanLabel(user.plan)}
                    </Badge>
                  </div>
                  <p className="text-xs leading-none text-slate-500 truncate dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Minha conta
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/billing" className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Faturamento
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuracoes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 dark:text-red-400 cursor-pointer"
                onClick={onSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
