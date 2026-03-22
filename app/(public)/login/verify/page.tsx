import Link from "next/link"
import { Mail, ArrowLeft, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600">
              <span className="text-sm font-bold text-white">W</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-50">
              Workshop SaaS
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
            <Mail className="h-10 w-10 text-violet-600 dark:text-violet-400" />
          </div>

          <h1 className="mb-3 text-2xl font-bold text-slate-900 dark:text-slate-50">
            Verifique seu email
          </h1>

          <p className="mb-2 text-slate-600 dark:text-slate-400">
            Enviamos um link mágico para o seu email.
          </p>

          <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
            Clique no link no email para entrar na sua conta. O link é válido
            por{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              24 horas
            </span>
            .
          </p>

          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50 mb-6">
            <div className="flex items-start gap-3 text-left">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40">
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                  1
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Abra seu cliente de email
                </p>
                <p className="text-xs text-slate-500">
                  Verifique sua caixa de entrada e pasta de spam
                </p>
              </div>
            </div>
            <div className="my-3 h-px bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-start gap-3 text-left">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40">
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                  2
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Clique no link "Entrar no Workshop SaaS"
                </p>
                <p className="text-xs text-slate-500">
                  Você será redirecionado automaticamente para o dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Tentar com outro email
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  )
}
