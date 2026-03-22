import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import type { Plan } from "@/lib/types"

import { TrialBanner } from "@/components/layout/TrialBanner"
import { DashboardContent } from "@/components/dashboard/DashboardContent"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = session.user as {
    id: string
    name: string | null
    email: string
    plan: Plan
    trialEndsAt: string | null
  }

  const plan = (user.plan ?? "FREE") as Plan
  const trialEndsAt = user.trialEndsAt ? new Date(user.trialEndsAt) : null
  const isOnTrial = plan === "TRIAL" && trialEndsAt !== null

  return (
    <div className="space-y-6">
      {isOnTrial && trialEndsAt && (
        <TrialBanner trialEndsAt={trialEndsAt} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {user.name ? `Olá, ${user.name.split(" ")[0]}! 👋` : "Bem-vindo de volta! 👋"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Gerencie suas tarefas no Kanban board abaixo.
          </p>
        </div>
      </div>

      <DashboardContent plan={plan} />
    </div>
  )
}
