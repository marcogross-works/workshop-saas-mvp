"use client"

import * as React from "react"
import { Loader2, Zap, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import type { Plan } from "@/lib/types"

interface BillingActionsProps {
  plan: Plan
}

export function BillingActions({ plan }: BillingActionsProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? "Erro ao iniciar checkout")
      }

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      toast({
        title: "Erro ao redirecionar",
        description:
          err instanceof Error
            ? err.message
            : "Não foi possível abrir a página de pagamento. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? "Erro ao abrir portal")
      }

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      toast({
        title: "Erro ao redirecionar",
        description:
          err instanceof Error
            ? err.message
            : "Não foi possível abrir o portal. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (plan === "PRO") {
    return (
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={handleManageSubscription}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando...
          </>
        ) : (
          <>
            <ExternalLink className="h-4 w-4" />
            Gerenciar assinatura
          </>
        )}
      </Button>
    )
  }

  return (
    <Button
      className="w-full bg-violet-600 hover:bg-violet-700 text-white gap-2"
      onClick={handleUpgrade}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando...
        </>
      ) : (
        <>
          <Zap className="h-4 w-4" />
          Fazer upgrade para PRO — R$19/mês
        </>
      )}
    </Button>
  )
}
