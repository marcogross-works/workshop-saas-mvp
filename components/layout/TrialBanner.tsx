"use client"

import * as React from "react"
import Link from "next/link"
import { X, Zap } from "lucide-react"
import { differenceInDays, formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface TrialBannerProps {
  trialEndsAt: Date
  className?: string
}

export function TrialBanner({ trialEndsAt, className }: TrialBannerProps) {
  const [dismissed, setDismissed] = React.useState(false)

  if (dismissed) return null

  const now = new Date()
  const daysRemaining = Math.max(0, differenceInDays(trialEndsAt, now))
  const totalTrialDays = 14
  const daysUsed = totalTrialDays - daysRemaining
  const progressValue = Math.min(100, (daysUsed / totalTrialDays) * 100)

  const isExpiringSoon = daysRemaining <= 3

  return (
    <div
      className={cn(
        "relative w-full rounded-lg border px-4 py-3",
        isExpiringSoon
          ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
          : "border-[#F59E0B]/30 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30",
        className
      )}
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-2 rounded-sm p-1 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Fechar banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            isExpiringSoon ? "bg-red-100 dark:bg-red-900" : "bg-amber-100 dark:bg-amber-900"
          )}
        >
          <Zap
            className={cn(
              "h-4 w-4",
              isExpiringSoon ? "text-red-600 dark:text-red-400" : "text-[#F59E0B] dark:text-amber-400"
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p
                className={cn(
                  "text-sm font-semibold",
                  isExpiringSoon
                    ? "text-red-800 dark:text-red-200"
                    : "text-amber-800 dark:text-amber-200"
                )}
              >
                {daysRemaining === 0
                  ? "Seu trial expira hoje!"
                  : daysRemaining === 1
                  ? "Ultimo dia do seu trial"
                  : `Aproveite seu trial — mudancas ilimitadas por mais ${daysRemaining} dias`}
              </p>
              <p
                className={cn(
                  "text-xs mt-0.5",
                  isExpiringSoon
                    ? "text-red-600 dark:text-red-400"
                    : "text-amber-600 dark:text-amber-400"
                )}
              >
                Expira {formatDistanceToNow(trialEndsAt, { addSuffix: true, locale: ptBR })}
              </p>
            </div>

            <Link href="/settings/billing">
              <Button
                size="sm"
                className={cn(
                  "shrink-0 text-xs h-8",
                  isExpiringSoon
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-[#F59E0B] hover:bg-amber-600 text-white"
                )}
              >
                <Zap className="mr-1 h-3 w-3" />
                Fazer upgrade para PRO
              </Button>
            </Link>
          </div>

          <div className="mt-2">
            <Progress
              value={progressValue}
              className={cn(
                "h-1.5",
                isExpiringSoon
                  ? "[&>div]:bg-red-500"
                  : "[&>div]:bg-[#F59E0B]"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
