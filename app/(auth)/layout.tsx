import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/Sidebar"
import TopHeaderClient from "@/components/layout/TopHeaderClient"
import type { Plan } from "@/lib/types"

// Server component — auth check happens server-side
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  const userProfile = {
    id: user.id,
    name: user.name ?? null,
    email: user.email ?? "",
    image: user.image ?? null,
    plan: (user.plan ?? "FREE") as Plan,
    trialEndsAt: user.trialEndsAt ? new Date(user.trialEndsAt) : null,
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar plan={userProfile.plan} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopHeaderClient user={userProfile} />

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
