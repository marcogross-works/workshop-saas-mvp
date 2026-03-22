import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Loader2, Mail } from "lucide-react"

import { Button } from "./button"

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Button",
  },
}

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Excluir",
  },
}

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
}

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
}

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link",
  },
}

export const Small: Story = {
  args: {
    size: "sm",
    children: "Pequeno",
  },
}

export const Large: Story = {
  args: {
    size: "lg",
    children: "Grande",
  },
}

export const Icon: Story = {
  args: {
    size: "icon",
    "aria-label": "Enviar email",
  },
  render: (args) => (
    <Button {...args}>
      <Mail className="h-4 w-4" />
    </Button>
  ),
}

export const Loading: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <Button {...args}>
      <Loader2 className="h-4 w-4 animate-spin" />
      Aguarde...
    </Button>
  ),
}
