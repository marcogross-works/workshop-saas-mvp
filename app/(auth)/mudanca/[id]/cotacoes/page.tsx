import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

import { CotacoesClient } from "./CotacoesClient"

export const metadata: Metadata = {
  title: "Cotacoes",
}

interface CotacoesPageProps {
  params: Promise<{ id: string }>
}

export default async function CotacoesPage({ params }: CotacoesPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const { id } = await params

  const user = session.user as {
    id: string
    plan: string
  }

  return <CotacoesClient mudancaId={id} plan={user.plan as "FREE" | "TRIAL" | "PRO"} />
}
