import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card"
import { Button } from "./button"

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
    </Card>
  ),
}

export const WithContent: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Resumo da Mudanca</CardTitle>
        <CardDescription>Detalhes da sua mudanca</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">
          Origem: Sao Paulo, SP
        </p>
        <p className="text-sm text-slate-600">
          Destino: Rio de Janeiro, RJ
        </p>
        <p className="text-sm text-slate-600">
          Data: 15/04/2026
        </p>
      </CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Plano PRO</CardTitle>
        <CardDescription>Acesso completo ao MudaFacil</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">R$ 29,90/mes</p>
        <p className="text-sm text-slate-500">Mudancas ilimitadas</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Assinar agora</Button>
      </CardFooter>
    </Card>
  ),
}
