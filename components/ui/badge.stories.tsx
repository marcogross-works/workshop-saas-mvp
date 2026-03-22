import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Badge } from "./badge"

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "free", "trial", "pro"],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Badge",
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
}

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Erro",
  },
}

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
}

export const FreePlan: Story = {
  args: {
    variant: "free",
    children: "Gratis",
  },
}

export const TrialPlan: Story = {
  args: {
    variant: "trial",
    children: "Trial",
  },
}

export const ProPlan: Story = {
  args: {
    variant: "pro",
    children: "PRO",
  },
}
