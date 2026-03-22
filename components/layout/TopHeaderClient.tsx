"use client"

import { useRouter } from "next/navigation"
import { TopHeader } from "@/components/layout/TopHeader"
import type { Plan } from "@/lib/types"

interface TopHeaderClientProps {
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
    plan: Plan
    trialEndsAt: Date | null
  }
}

export default function TopHeaderClient({ user }: TopHeaderClientProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" })
    } catch {
      // ignore
    }
    router.push("/login")
    router.refresh()
  }

  return <TopHeader user={user} onSignOut={handleSignOut} />
}
