import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Input } from "./input"
import { Label } from "./label"

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    type: "text",
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="seu@email.com" />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Campo desabilitado",
  },
}

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Digite o endereco de origem...",
  },
}
