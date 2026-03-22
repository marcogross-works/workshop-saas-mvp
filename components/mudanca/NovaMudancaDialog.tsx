"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MapPin, Calendar, Loader2, Truck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useCreateMudanca } from "@/hooks/useMudancas"

interface NovaMudancaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NovaMudancaDialog({
  open,
  onOpenChange,
}: NovaMudancaDialogProps) {
  const router = useRouter()
  const createMudanca = useCreateMudanca()

  const [enderecoOrigem, setEnderecoOrigem] = React.useState("")
  const [enderecoDestino, setEnderecoDestino] = React.useState("")
  const [dataDesejada, setDataDesejada] = React.useState("")
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const resetForm = () => {
    setEnderecoOrigem("")
    setEnderecoDestino("")
    setDataDesejada("")
    setErrors({})
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!enderecoOrigem.trim()) {
      newErrors.enderecoOrigem = "Informe o endereco de origem"
    }
    if (!enderecoDestino.trim()) {
      newErrors.enderecoDestino = "Informe o endereco de destino"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validate()) return

    try {
      const mudanca = await createMudanca.mutateAsync({
        enderecoOrigem: enderecoOrigem.trim(),
        enderecoDestino: enderecoDestino.trim(),
        dataDesejada: dataDesejada || null,
      })

      resetForm()
      onOpenChange(false)
      router.push(`/mudanca/${mudanca.id}`)
    } catch {
      setErrors({ submit: "Erro ao criar mudanca. Tente novamente." })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm()
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]/10">
              <Truck className="h-4 w-4 text-[#2563EB]" />
            </div>
            <DialogTitle className="text-lg">Nova Mudanca</DialogTitle>
          </div>
          <DialogDescription>
            Informe os enderecos e comece a montar sua carga.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Endereco Origem */}
          <div className="space-y-1.5">
            <Label htmlFor="enderecoOrigem" className="text-sm">
              Endereco de origem
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="enderecoOrigem"
                value={enderecoOrigem}
                onChange={(e) => {
                  setEnderecoOrigem(e.target.value)
                  setErrors((prev) => {
                    const next = { ...prev }
                    delete next.enderecoOrigem
                    return next
                  })
                }}
                placeholder="Rua, numero, bairro, cidade"
                className={cn(
                  "pl-10",
                  errors.enderecoOrigem &&
                    "border-red-400 focus-visible:ring-red-400"
                )}
              />
            </div>
            {errors.enderecoOrigem && (
              <p className="text-xs text-red-500">{errors.enderecoOrigem}</p>
            )}
          </div>

          {/* Endereco Destino */}
          <div className="space-y-1.5">
            <Label htmlFor="enderecoDestino" className="text-sm">
              Endereco de destino
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2563EB]" />
              <Input
                id="enderecoDestino"
                value={enderecoDestino}
                onChange={(e) => {
                  setEnderecoDestino(e.target.value)
                  setErrors((prev) => {
                    const next = { ...prev }
                    delete next.enderecoDestino
                    return next
                  })
                }}
                placeholder="Rua, numero, bairro, cidade"
                className={cn(
                  "pl-10",
                  errors.enderecoDestino &&
                    "border-red-400 focus-visible:ring-red-400"
                )}
              />
            </div>
            {errors.enderecoDestino && (
              <p className="text-xs text-red-500">{errors.enderecoDestino}</p>
            )}
          </div>

          {/* Data Desejada */}
          <div className="space-y-1.5">
            <Label htmlFor="dataDesejada" className="text-sm">
              Data desejada{" "}
              <span className="text-slate-400 font-normal">(opcional)</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="dataDesejada"
                type="date"
                value={dataDesejada}
                onChange={(e) => setDataDesejada(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Submit error */}
          {errors.submit && (
            <p className="text-sm text-red-500 text-center">{errors.submit}</p>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMudanca.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
              disabled={createMudanca.isPending}
            >
              {createMudanca.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar mudanca"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
