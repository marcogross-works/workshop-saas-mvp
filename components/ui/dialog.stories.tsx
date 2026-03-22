import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Abrir Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Mudanca</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar uma nova mudanca.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="origem" className="text-right">
              Origem
            </Label>
            <Input id="origem" placeholder="Sao Paulo, SP" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="destino" className="text-right">
              Destino
            </Label>
            <Input id="destino" placeholder="Rio de Janeiro, RJ" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Criar Mudanca</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
