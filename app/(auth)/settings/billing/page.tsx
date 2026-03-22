import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import {
  CreditCard,
  Zap,
  Check,
  ArrowRight,
  Crown,
  ExternalLink,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BillingActions } from "@/components/billing/BillingActions"
import type { Plan } from "@/lib/types"

export const metadata: Metadata = {
  title: "Faturamento",
}

function getPlanLabel(plan: Plan) {
  switch (plan) {
    case "FREE": return "Grátis"
    case "TRIAL": return "Trial"
    case "PRO": return "Pro"
  }
}

function getPlanBadgeVariant(plan: Plan) {
  switch (plan) {
    case "FREE": return "free" as const
    case "TRIAL": return "trial" as const
    case "PRO": return "pro" as const
  }
}

export default async function BillingPage() {
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
  const daysRemaining = trialEndsAt
    ? Math.max(0, differenceInDays(trialEndsAt, new Date()))
    : null
  const isPro = plan === "PRO"

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Faturamento
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Gerencie seu plano e informações de pagamento.
        </p>
      </div>

      <Separator />

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4 text-violet-500" />
            Plano atual
          </CardTitle>
          <CardDescription>
            Detalhes do seu plano de assinatura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  Plano {getPlanLabel(plan)}
                </p>
                <Badge variant={getPlanBadgeVariant(plan)}>
                  {getPlanLabel(plan)}
                </Badge>
              </div>
              <p className="text-sm text-slate-500">
                {plan === "FREE" && "Gratuito para sempre"}
                {plan === "TRIAL" &&
                  trialEndsAt &&
                  `Trial expira em ${format(trialEndsAt, "dd/MM/yyyy")}`}
                {plan === "PRO" && "R$19/mês · Acesso completo"}
              </p>
            </div>

            {isPro && (
              <Crown className="h-6 w-6 text-violet-500 shrink-0" />
            )}
          </div>

          {isOnTrial && trialEndsAt && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                    Trial ativo
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                    {daysRemaining === 0
                      ? "Expira hoje! Faça upgrade para não perder acesso."
                      : daysRemaining === 1
                      ? "Último dia! Faça upgrade para continuar."
                      : `${daysRemaining} dias restantes`}
                  </p>
                </div>
                <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  {daysRemaining}d
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade or Manage */}
      {!isPro ? (
        <Card className="border-violet-200 dark:border-violet-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40">
                <Zap className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <CardTitle className="text-base">
                  Faça upgrade para PRO
                </CardTitle>
                <CardDescription>
                  Desbloqueie todos os recursos por apenas R$19/mês
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-4">
              {[
                "Boards ilimitados",
                "Tarefas ilimitadas",
                "Suporte prioritário",
                "Acesso antecipado a novidades",
                "Sem limitações de uso",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400"
                >
                  <Check className="h-4 w-4 shrink-0 text-violet-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex items-baseline gap-1.5 rounded-xl bg-violet-50 p-4 dark:bg-violet-950/30">
              <span className="text-3xl font-extrabold text-violet-700 dark:text-violet-300">
                R$19
              </span>
              <span className="text-sm text-violet-500">/mês</span>
              <span className="ml-auto text-xs text-violet-500">
                Cancele quando quiser
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <BillingActions plan={plan} />
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Crown className="h-4 w-4 text-violet-500" />
              Assinatura PRO ativa
            </CardTitle>
            <CardDescription>
              Você tem acesso completo a todos os recursos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                "Boards ilimitados",
                "Tarefas ilimitadas",
                "Suporte prioritário",
                "Acesso antecipado a novidades",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400"
                >
                  <Check className="h-4 w-4 shrink-0 text-green-500" />
                  {feature}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <BillingActions plan={plan} />
          </CardFooter>
        </Card>
      )}

      <p className="text-xs text-slate-400 text-center">
        Pagamentos processados de forma segura via Stripe. Seus dados de
        pagamento nunca são armazenados em nossos servidores.
      </p>
    </div>
  )
}
