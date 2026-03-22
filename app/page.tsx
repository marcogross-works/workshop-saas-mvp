import Link from "next/link"
import {
  Kanban,
  CreditCard,
  Clock,
  Zap,
  ArrowRight,
  Check,
  Star,
  Github,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    icon: <Kanban className="h-6 w-6" />,
    title: "Kanban Board",
    description:
      "Organize suas tarefas em colunas arrastáveis. Visualize o progresso do seu trabalho de forma intuitiva com drag-and-drop.",
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Pagamentos Stripe",
    description:
      "Integração nativa com Stripe para cobranças, assinaturas recorrentes e gerenciamento de planos de forma segura.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Trial de 14 dias",
    description:
      "Deixe seus usuários experimentarem o produto completo por 14 dias sem precisar de cartão de crédito.",
  },
]

const pricingPlans = [
  {
    name: "Grátis",
    price: "R$0",
    period: "para sempre",
    badge: null,
    description: "Perfeito para começar e experimentar o produto.",
    features: [
      "1 board",
      "Até 5 tarefas",
      "Magic Link auth",
      "Suporte por email",
    ],
    cta: "Começar grátis",
    ctaHref: "/login",
    highlighted: false,
    plan: "FREE",
  },
  {
    name: "Trial",
    price: "Grátis",
    period: "por 14 dias",
    badge: "Popular",
    description: "Experimente todos os recursos sem limitações.",
    features: [
      "Boards ilimitados",
      "Tarefas ilimitadas",
      "Magic Link auth",
      "Suporte prioritário",
      "Todos os recursos PRO",
    ],
    cta: "Iniciar trial",
    ctaHref: "/login",
    highlighted: true,
    plan: "TRIAL",
  },
  {
    name: "PRO",
    price: "R$19",
    period: "por mês",
    badge: null,
    description: "Para times e profissionais que precisam de mais.",
    features: [
      "Boards ilimitados",
      "Tarefas ilimitadas",
      "Magic Link auth",
      "Suporte prioritário",
      "Acesso antecipado a novidades",
    ],
    cta: "Assinar PRO",
    ctaHref: "/login",
    highlighted: false,
    plan: "PRO",
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <span className="text-sm font-bold text-white">W</span>
            </div>
            <span className="font-bold text-white">Workshop SaaS</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-white/10"
              >
                Entrar
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                Começar grátis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-slate-950 to-slate-950" />
          <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
              <Zap className="h-3.5 w-3.5" />
              Construa seu SaaS mais rápido
            </div>

            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Construa seu{" "}
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                SaaS
              </span>{" "}
              em minutos
            </h1>

            <p className="mb-10 text-xl text-slate-400 sm:text-2xl">
              Um template completo com autenticação, Kanban board, pagamentos
              Stripe e sistema de planos prontos para usar. Foque no que
              importa: seu produto.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="h-12 bg-violet-600 px-8 text-base hover:bg-violet-700 text-white"
                >
                  Começar grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/20 px-8 text-base text-slate-300 hover:bg-white/10 hover:text-white bg-transparent"
                >
                  Ver planos
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" />
                Sem cartão de crédito
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" />
                14 dias de trial grátis
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" />
                Cancele quando quiser
              </span>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-violet-900/20">
            <div className="flex items-center gap-1.5 border-b border-white/10 bg-slate-800/50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <div className="ml-4 flex-1 rounded-md bg-slate-700/50 px-3 py-1 text-xs text-slate-400">
                app.workshopsaas.com/dashboard
              </div>
            </div>
            <div className="p-6">
              <div className="flex gap-4 overflow-x-hidden">
                {["A Fazer", "Em Progresso", "Concluído"].map((col, i) => (
                  <div
                    key={col}
                    className="w-64 shrink-0 rounded-xl border border-white/10 bg-slate-800/50 p-3"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-200">
                        {col}
                      </span>
                      <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-400">
                        {i + 2}
                      </span>
                    </div>
                    {Array.from({ length: i + 2 }).map((_, j) => (
                      <div
                        key={j}
                        className="mb-2 rounded-lg border border-white/10 bg-slate-700/50 p-3"
                      >
                        <div className="mb-1.5 h-2.5 w-3/4 rounded bg-slate-600" />
                        <div className="h-2 w-1/2 rounded bg-slate-600/60" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Tudo que você precisa para lançar
            </h2>
            <p className="text-lg text-slate-400">
              Recursos essenciais para construir um SaaS de sucesso, sem
              precisar reinventar a roda.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/10 bg-slate-900 p-6 transition-colors hover:border-violet-500/50 hover:bg-slate-800/50"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 group-hover:bg-violet-600/30">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-24 sm:py-32 bg-gradient-to-b from-slate-950 to-slate-900"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Preços simples e transparentes
            </h2>
            <p className="text-lg text-slate-400">
              Comece grátis e faça upgrade quando precisar. Sem surpresas.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={
                  plan.highlighted
                    ? "relative border-violet-500 bg-violet-950/40 shadow-xl shadow-violet-900/30"
                    : "border-white/10 bg-slate-900"
                }
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-violet-600 text-white border-0 px-3 py-1">
                      <Star className="mr-1 h-3 w-3" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <CardTitle className="text-xl text-white">
                      {plan.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">
                      {plan.price}
                    </span>
                    <span className="text-slate-400 text-sm">
                      /{plan.period}
                    </span>
                  </div>
                  <CardDescription className="text-slate-400">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-sm text-slate-300"
                      >
                        <Check className="h-4 w-4 shrink-0 text-violet-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Link href={plan.ctaHref} className="w-full">
                    <Button
                      className={
                        plan.highlighted
                          ? "w-full bg-violet-600 hover:bg-violet-700 text-white"
                          : "w-full border-white/20 text-slate-300 hover:bg-white/10 hover:text-white bg-transparent"
                      }
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
                <span className="text-xs font-bold text-white">W</span>
              </div>
              <span className="font-semibold text-white">Workshop SaaS</span>
            </div>

            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Workshop SaaS. Todos os direitos reservados.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="#pricing"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Planos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
