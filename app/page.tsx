import Link from "next/link"
import {
  Truck,
  ArrowRight,
  Check,
  Star,
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
    icon: "📦",
    title: "Canvas de carga interativo",
    description:
      "Arraste e posicione seus moveis dentro do caminhao com drag & drop visual. Veja em tempo real como tudo se encaixa.",
  },
  {
    icon: "🚛",
    title: "Seletor de caminhao",
    description:
      "Compare Fiorino, HR, 3/4 e Bau lado a lado. Veja a ocupacao em tempo real e escolha o tamanho ideal.",
  },
  {
    icon: "💰",
    title: "Cotacoes instantaneas",
    description:
      "Receba cotacoes de transportadoras avaliadas. Compare precos, prazos e avaliacoes em um so lugar.",
  },
  {
    icon: "🏠",
    title: "Catalogo com 30+ itens",
    description:
      "Cama, geladeira, sofa, caixas — tudo com dimensoes e peso reais. Adicione com um clique.",
  },
  {
    icon: "📊",
    title: "Resumo inteligente",
    description:
      "Acompanhe volume, peso e ocupacao em tempo real. Alertas automaticos quando exceder a capacidade.",
  },
]

const pricingPlans = [
  {
    name: "Gratis",
    price: "R$0",
    period: "para sempre",
    badge: null,
    description: "Perfeito para uma mudanca simples.",
    features: [
      "1 mudanca ativa",
      "Ate 15 itens",
      "3 cotacoes",
      "Magic Link auth",
    ],
    cta: "Comecar gratis",
    ctaHref: "/login",
    highlighted: false,
  },
  {
    name: "Trial",
    price: "Gratis",
    period: "por 14 dias",
    badge: "Popular",
    description: "Experimente todos os recursos sem limitacoes.",
    features: [
      "Mudancas ilimitadas",
      "Itens ilimitados",
      "Cotacoes ilimitadas",
      "Filtros avancados",
      "Todos os recursos PRO",
    ],
    cta: "Iniciar trial",
    ctaHref: "/login",
    highlighted: true,
  },
  {
    name: "PRO",
    price: "R$29,90",
    period: "por mes",
    badge: null,
    description: "Para quem precisa de mudancas frequentes.",
    features: [
      "Mudancas ilimitadas",
      "Itens ilimitados",
      "Cotacoes ilimitadas",
      "Filtros avancados",
      "Suporte prioritario",
    ],
    cta: "Assinar PRO",
    ctaHref: "/login",
    highlighted: false,
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">MudaFacil</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-slate-900"
              >
                Entrar
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                Comecar gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-[#F8FAFC] to-amber-50/30" />
          <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2563EB]/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/5 px-4 py-1.5 text-sm text-[#2563EB]">
              <Truck className="h-3.5 w-3.5" />
              Mudanca inteligente e visual
            </div>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Arraste seus moveis, escolha o caminhao e{" "}
              <span className="text-[#2563EB]">
                mude sem estresse
              </span>
            </h1>

            <p className="mb-10 text-lg text-slate-500 sm:text-xl max-w-2xl mx-auto">
              Monte visualmente a carga da sua mudanca com drag & drop, compare
              tamanhos de caminhao em tempo real e receba cotacoes instantaneas de
              transportadoras avaliadas.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="h-12 bg-[#2563EB] px-8 text-base hover:bg-[#1d4ed8] text-white"
                >
                  Comecar gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/simulador">
                <Button
                  size="lg"
                  className="h-12 bg-[#F59E0B] px-8 text-base hover:bg-[#d97706] text-white font-semibold"
                >
                  Simular mudanca gratis
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" />
                Sem cartao de credito
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" />
                14 dias de trial gratis
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" />
                Cancele quando quiser
              </span>
            </div>
          </div>

          {/* App Preview */}
          <div className="mt-16 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <div className="ml-4 flex-1 rounded-md bg-slate-100 px-3 py-1 text-xs text-slate-400">
                app.mudafacil.com.br/mudanca
              </div>
            </div>
            <div className="p-6">
              <div className="flex gap-4">
                {/* Catalog sidebar mock */}
                <div className="w-48 shrink-0 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="mb-3 text-xs font-semibold text-slate-500">Catalogo</div>
                  {["🛏️ Cama casal", "🧊 Geladeira", "🛋️ Sofa", "📦 Caixa"].map((item) => (
                    <div
                      key={item}
                      className="mb-1.5 flex items-center gap-2 rounded-lg bg-white p-2 text-xs text-slate-600 border border-slate-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                {/* Canvas mock */}
                <div className="flex-1 rounded-xl border-2 border-dashed border-[#2563EB]/20 bg-blue-50/30 p-4 min-h-[200px] relative">
                  <div className="absolute top-2 left-2 text-[10px] text-slate-400">HR — 1.8m x 3.5m</div>
                  <div className="absolute top-8 left-4 w-16 h-20 rounded bg-[#2563EB]/10 border border-[#2563EB]/30 flex items-center justify-center text-xs">🛏️</div>
                  <div className="absolute top-8 left-24 w-10 h-10 rounded bg-[#2563EB]/10 border border-[#2563EB]/30 flex items-center justify-center text-xs">🧊</div>
                  <div className="absolute top-20 left-24 w-14 h-8 rounded bg-[#2563EB]/10 border border-[#2563EB]/30 flex items-center justify-center text-xs">🛋️</div>
                </div>
                {/* Summary mock */}
                <div className="w-40 shrink-0 rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
                  <div className="text-xs font-semibold text-slate-500">Resumo</div>
                  <div className="text-[10px] text-slate-400">Volume: 8.2 m³</div>
                  <div className="text-[10px] text-slate-400">Peso: 185 kg</div>
                  <div className="h-1.5 rounded-full bg-slate-200">
                    <div className="h-full w-3/5 rounded-full bg-[#2563EB]" />
                  </div>
                  <div className="text-[10px] text-[#2563EB] font-semibold">60% ocupado</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Tudo que voce precisa para uma mudanca tranquila
            </h2>
            <p className="text-lg text-slate-500">
              Recursos inteligentes para planejar, comparar e contratar sua
              mudanca com confianca.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-[#2563EB]/30 hover:shadow-lg hover:shadow-[#2563EB]/5"
              >
                <div className="mb-4 text-3xl">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experimente agora Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#2563EB] to-blue-700">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <span className="text-4xl mb-4 block">🚛</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Experimente agora
          </h2>
          <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Teste o simulador gratuitamente — sem cadastro, sem compromisso.
            Arraste seus moveis e descubra o caminhao ideal.
          </p>
          <Link href="/simulador">
            <Button
              size="lg"
              className="h-12 px-10 text-base font-semibold bg-[#F59E0B] hover:bg-[#d97706] text-white"
            >
              Abrir simulador gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-24 sm:py-32 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Precos simples e transparentes
            </h2>
            <p className="text-lg text-slate-500">
              Comece gratis e faca upgrade quando precisar. Sem surpresas.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={
                  plan.highlighted
                    ? "relative border-[#2563EB] bg-blue-50/30 shadow-xl shadow-[#2563EB]/10"
                    : "border-slate-200 bg-white"
                }
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#2563EB] text-white border-0 px-3 py-1">
                      <Star className="mr-1 h-3 w-3" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="mb-2">
                    <CardTitle className="text-xl text-slate-900">
                      {plan.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">
                      {plan.price}
                    </span>
                    <span className="text-slate-400 text-sm">
                      /{plan.period}
                    </span>
                  </div>
                  <CardDescription className="text-slate-500">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-sm text-slate-600"
                      >
                        <Check className="h-4 w-4 shrink-0 text-[#2563EB]" />
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
                          ? "w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                          : "w-full border-slate-300 text-slate-600 hover:bg-slate-100"
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
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB]">
                <Truck className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-semibold text-slate-900">MudaFacil</span>
            </div>

            <p className="text-sm text-slate-400">
              MudaFacil &copy; 2026. Todos os direitos reservados.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="#pricing"
                className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
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
