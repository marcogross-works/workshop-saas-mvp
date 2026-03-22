import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

import { MudancaWorkspace } from "./MudancaWorkspace"

export const metadata: Metadata = {
  title: "Mudanca",
}

interface MudancaPageProps {
  params: Promise<{ id: string }>
}

export default async function MudancaPage({ params }: MudancaPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const { id } = await params

  const user = session.user as {
    id: string
    plan: string
  }

  return <MudancaWorkspace mudancaId={id} plan={user.plan as "FREE" | "TRIAL" | "PRO"} />
}
