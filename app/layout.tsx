import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { QueryProvider } from "@/providers/QueryProvider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Workshop SaaS",
    template: "%s | Workshop SaaS",
  },
  description:
    "Gerencie suas tarefas com um Kanban board intuitivo. Construa seu SaaS em minutos.",
  keywords: ["kanban", "tarefas", "produtividade", "saas"],
  openGraph: {
    title: "Workshop SaaS",
    description: "Gerencie suas tarefas com um Kanban board intuitivo.",
    type: "website",
    locale: "pt_BR",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans antialiased dark:bg-slate-950">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}
