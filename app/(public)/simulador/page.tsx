import type { Metadata } from "next"
import { SimuladorPage } from "@/components/simulador/SimuladorPage"

export const metadata: Metadata = {
  title: "Simulador Gratuito",
  description:
    "Simule sua mudanca gratuitamente. Escolha o caminhao, adicione seus moveis e veja a ocupacao em tempo real — sem cadastro.",
}

export default function SimuladorRoute() {
  return <SimuladorPage />
}
