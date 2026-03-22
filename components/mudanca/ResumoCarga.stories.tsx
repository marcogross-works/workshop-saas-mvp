import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ResumoCarga } from "./ResumoCarga"

const meta = {
  title: "Mudanca/ResumoCarga",
  component: ResumoCarga,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResumoCarga>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    volumeUsadoM3: 0,
    volumeTotalM3: 8,
    pesoUsadoKg: 0,
    pesoTotalKg: 1500,
    totalItens: 0,
  },
}

export const HalfFull: Story = {
  args: {
    volumeUsadoM3: 4,
    volumeTotalM3: 8,
    pesoUsadoKg: 750,
    pesoTotalKg: 1500,
    totalItens: 12,
  },
}

export const AlmostFull: Story = {
  args: {
    volumeUsadoM3: 7.2,
    volumeTotalM3: 8,
    pesoUsadoKg: 1350,
    pesoTotalKg: 1500,
    totalItens: 28,
  },
}

export const OverCapacity: Story = {
  args: {
    volumeUsadoM3: 9.5,
    volumeTotalM3: 8,
    pesoUsadoKg: 1800,
    pesoTotalKg: 1500,
    totalItens: 35,
  },
}
