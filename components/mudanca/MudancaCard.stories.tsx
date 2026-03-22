import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { MudancaCard } from "./MudancaCard"

const meta = {
  title: "Mudanca/MudancaCard",
  component: MudancaCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MudancaCard>

export default meta
type Story = StoryObj<typeof meta>

export const Rascunho: Story = {
  args: {
    titulo: "Mudanca Apartamento Centro",
    origem: "Rua Augusta, 100 - Sao Paulo, SP",
    destino: "Av. Atlantica, 500 - Rio de Janeiro, RJ",
    data: "15/04/2026",
    status: "RASCUNHO",
  },
}

export const Cotando: Story = {
  args: {
    titulo: "Mudanca Escritorio",
    origem: "Av. Paulista, 1000 - Sao Paulo, SP",
    destino: "Rua Funchal, 200 - Sao Paulo, SP",
    data: "20/04/2026",
    status: "COTANDO",
    caminhao: "HR (8m³)",
  },
}

export const Confirmada: Story = {
  args: {
    titulo: "Mudanca Casa Nova",
    origem: "Rua Oscar Freire, 300 - Sao Paulo, SP",
    destino: "Al. Santos, 800 - Sao Paulo, SP",
    data: "01/05/2026",
    status: "CONFIRMADA",
    caminhao: "3/4 (15m³)",
  },
}

export const Concluida: Story = {
  args: {
    titulo: "Mudanca Kitnet",
    origem: "Rua da Consolacao, 50 - Sao Paulo, SP",
    destino: "Rua Vergueiro, 1200 - Sao Paulo, SP",
    data: "10/03/2026",
    status: "CONCLUIDA",
    caminhao: "Fiorino (3m³)",
  },
}
