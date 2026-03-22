import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"

import { SeletorCaminhao, type Caminhao } from "./SeletorCaminhao"

const mockCaminhoes: Caminhao[] = [
  { id: "fiorino", nome: "Fiorino", volumeM3: 3, pesoKg: 600 },
  { id: "hr", nome: "HR", volumeM3: 8, pesoKg: 1500 },
  { id: "34", nome: "3/4", volumeM3: 15, pesoKg: 3000 },
  { id: "bau", nome: "Bau", volumeM3: 25, pesoKg: 5000 },
]

const meta = {
  title: "Mudanca/SeletorCaminhao",
  component: SeletorCaminhao,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SeletorCaminhao>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState("hr")
    return (
      <SeletorCaminhao
        caminhoes={mockCaminhoes}
        selectedId={selected}
        onSelect={setSelected}
        volumeUsadoM3={5}
        pesoUsadoKg={800}
      />
    )
  },
}

export const LowCapacity: Story = {
  args: {
    caminhoes: mockCaminhoes,
    selectedId: "fiorino",
    volumeUsadoM3: 1,
    pesoUsadoKg: 150,
  },
}

export const MediumCapacity: Story = {
  args: {
    caminhoes: mockCaminhoes,
    selectedId: "hr",
    volumeUsadoM3: 5,
    pesoUsadoKg: 1000,
  },
}

export const HighCapacity: Story = {
  args: {
    caminhoes: mockCaminhoes,
    selectedId: "34",
    volumeUsadoM3: 14,
    pesoUsadoKg: 2800,
  },
}

export const NearOverload: Story = {
  args: {
    caminhoes: mockCaminhoes,
    selectedId: "fiorino",
    volumeUsadoM3: 2.9,
    pesoUsadoKg: 580,
  },
}
