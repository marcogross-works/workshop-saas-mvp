import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { PaywallGate } from "./PaywallGate"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const meta = {
  title: "Paywall/PaywallGate",
  component: PaywallGate,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PaywallGate>

export default meta
type Story = StoryObj<typeof meta>

const SampleChildren = () => (
  <Card>
    <CardHeader>
      <CardTitle>Conteudo Liberado</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-slate-600">
        Este conteudo esta disponivel no seu plano atual.
      </p>
    </CardContent>
  </Card>
)

export const WithinLimit: Story = {
  args: {
    feature: "mudancas",
    currentCount: 0,
    limit: 1,
    plan: "FREE",
    children: <SampleChildren />,
  },
}

export const AtLimit: Story = {
  args: {
    feature: "mudancas",
    currentCount: 1,
    limit: 1,
    plan: "FREE",
    children: <SampleChildren />,
  },
}
