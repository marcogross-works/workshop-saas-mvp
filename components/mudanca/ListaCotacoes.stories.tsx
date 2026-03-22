import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ListaCotacoes, type Cotacao } from "./ListaCotacoes"

const mockCotacoes: Cotacao[] = [
  {
    id: "1",
    transportadora: "MudaRapido Express",
    preco: 1890,
    prazo: "2-3 dias uteis",
    avaliacao: 4.8,
    avaliacoes: 234,
    selecionada: false,
  },
  {
    id: "2",
    transportadora: "TransBrasil Mudancas",
    preco: 1450,
    prazo: "3-5 dias uteis",
    avaliacao: 4.5,
    avaliacoes: 189,
    selecionada: false,
  },
  {
    id: "3",
    transportadora: "Frete Facil SP",
    preco: 2200,
    prazo: "1-2 dias uteis",
    avaliacao: 4.9,
    avaliacoes: 412,
    selecionada: true,
  },
  {
    id: "4",
    transportadora: "Carrega Bem",
    preco: 1650,
    prazo: "4-6 dias uteis",
    avaliacao: 4.2,
    avaliacoes: 97,
    selecionada: false,
  },
  {
    id: "5",
    transportadora: "Mudancas Economicas",
    preco: 980,
    prazo: "5-7 dias uteis",
    avaliacao: 3.8,
    avaliacoes: 56,
    selecionada: false,
  },
]

const meta = {
  title: "Mudanca/ListaCotacoes",
  component: ListaCotacoes,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListaCotacoes>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    cotacoes: mockCotacoes,
  },
}
