import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import { User, Mail, Shield, Calendar } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Plan } from "@/lib/types"

export const metadata: Metadata = {
  title: "Configurações",
}

function getPlanBadgeVariant(plan: Plan) {
  switch (plan) {
    case "FREE": return "free" as const
    case "TRIAL": return "trial" as const
    case "PRO": return "pro" as const
  }
}

function getPlanLabel(plan: Plan) {
  switch (plan) {
    case "FREE": return "Grátis"
    case "TRIAL": return "Trial"
    case "PRO": return "Pro"
  }
}

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = session.user as {
    id: string
    name: string | null
    email: string
    image: string | null
    plan: Plan
    trialEndsAt: string | null
  }

  const plan = (user.plan ?? "FREE") as Plan
  const trialEndsAt = user.trialEndsAt ? new Date(user.trialEndsAt) : null
  const isOnTrial = plan === "TRIAL" && trialEndsAt !== null
  const daysRemaining = trialEndsAt
    ? Math.max(0, differenceInDays(trialEndsAt, new Date()))
    : null

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Configurações
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Gerencie suas informações de conta e preferências.
        </p>
      </div>

      <Separator />

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4 text-violet-500" />
            Perfil
          </CardTitle>
          <CardDescription>
            Suas informações pessoais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Nome
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-900 dark:text-slate-50">
                {user.name ?? (
                  <span className="text-slate-400 italic">Não informado</span>
                )}
              </p>
            </div>

            <div className="col-span-1">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Email
              </p>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <p className="text-sm text-slate-900 dark:text-slate-50">
                {user.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-violet-500" />
            Plano atual
          </CardTitle>
          <CardDescription>
            Detalhes do seu plano de assinatura
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-50">
                Plano {getPlanLabel(plan)}
              </p>
              <p className="text-sm text-slate-500">
                {plan === "FREE" && "Acesso gratuito com recursos limitados"}
                {plan === "TRIAL" && "Acesso completo por tempo limitado"}
                {plan === "PRO" && "Acesso completo a todos os recursos"}
              </p>
            </div>
            <Badge variant={getPlanBadgeVariant(plan)} className="text-sm px-3 py-1">
              {getPlanLabel(plan)}
            </Badge>
          </div>

          {isOnTrial && trialEndsAt && (
            <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
              <Calendar className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Trial ativo
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {daysRemaining === 0
                    ? "Expira hoje"
                    : daysRemaining === 1
                    ? "Expira amanhã"
                    : `${daysRemaining} dias restantes`}{" "}
                  · Expira em{" "}
                  {format(trialEndsAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Recursos incluídos
            </p>
            <ul className="space-y-1.5">
              {plan === "FREE" && (
                <>
                  <li className="text-sm text-slate-500">• 1 board</li>
                  <li className="text-sm text-slate-500">• Até 5 tarefas</li>
                  <li className="text-sm text-slate-500">• Autenticação por Magic Link</li>
                </>
              )}
              {(plan === "TRIAL" || plan === "PRO") && (
                <>
                  <li className="text-sm text-slate-500">• Boards ilimitados</li>
                  <li className="text-sm text-slate-500">• Tarefas ilimitadas</li>
                  <li className="text-sm text-slate-500">• Autenticação por Magic Link</li>
                  <li className="text-sm text-slate-500">• Suporte prioritário</li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
