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
    default: "MudaFacil",
    template: "%s | MudaFacil",
  },
  description:
    "Arraste seus moveis, escolha o caminhao e mude sem estresse. Monte visualmente a carga da sua mudanca com drag & drop.",
  keywords: ["mudanca", "frete", "caminhao", "carga", "cotacao", "transportadora"],
  openGraph: {
    title: "MudaFacil",
    description: "Monte visualmente a carga da sua mudanca com drag & drop e receba cotacoes instantaneas.",
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
      <body className="min-h-screen bg-[#F8FAFC] font-sans antialiased dark:bg-slate-950">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}
