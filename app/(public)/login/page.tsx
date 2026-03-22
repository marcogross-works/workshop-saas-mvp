"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Loader2, ArrowLeft, CheckCircle2, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError("Por favor, informe seu email.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Por favor, informe um email valido.")
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("redirectTo", "/dashboard")
      formData.append("csrfToken", await getCsrfToken())

      const res = await fetch("/api/auth/signin/resend", {
        method: "POST",
        body: formData,
        redirect: "follow",
      })

      if (res.ok || res.redirected) {
        setIsSuccess(true)
        router.push("/login/verify")
      } else {
        setError("Ocorreu um erro ao enviar o link. Tente novamente.")
      }
    } catch {
      setError("Ocorreu um erro ao enviar o link. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 dark:bg-slate-950">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
            Link enviado!
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Verifique seu email{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {email}
            </span>{" "}
            e clique no link para entrar.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB]">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-50">
              MudaFacil
            </span>
          </Link>

          <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Entrar na sua conta
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Informe seu email e enviaremos um link magico para voce entrar sem
            senha.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError(null)
                  }}
                  className={cn(
                    "pl-10",
                    error && "border-red-400 focus-visible:ring-red-400"
                  )}
                  disabled={isLoading}
                  autoComplete="email"
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar link magico
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Ao continuar, voce concorda com nossos{" "}
              <span className="underline cursor-pointer hover:text-slate-600">
                Termos de Servico
              </span>{" "}
              e{" "}
              <span className="underline cursor-pointer hover:text-slate-600">
                Politica de Privacidade
              </span>
              .
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

async function getCsrfToken(): Promise<string> {
  try {
    const res = await fetch("/api/auth/csrf")
    const data = await res.json()
    return data.csrfToken ?? ""
  } catch {
    return ""
  }
}
