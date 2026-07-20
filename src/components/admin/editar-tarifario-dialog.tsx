"use client";

import * as React from "react";
import { Pencil, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { actualizarTarifarioAction } from "@/app/admin/habitaciones/actions";
import type { Tarifa, TipoHabitacion } from "@/domain/types";

export function EditarTarifarioDialog({
  tipos,
  tarifas,
  onActualizado,
}: {
  tipos: TipoHabitacion[];
  tarifas: Tarifa[];
  onActualizado: (tarifas: Tarifa[]) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [valores, setValores] = React.useState<Record<string, string>>({});
  const [guardando, setGuardando] = React.useState(false);
  const [guardado, setGuardado] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      const inicial: Record<string, string> = {};
      tarifas.forEach((t) => {
        inicial[t.id] = String(t.precioNoche);
      });
      setValores(inicial);
      setGuardado(false);
    }
  }, [open, tarifas]);

  function handleChange(id: string, value: string) {
    setValores((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    const updates = Object.entries(valores)
      .map(([id, value]) => ({ id, precioNoche: Number(value) }))
      .filter((u) => !Number.isNaN(u.precioNoche) && u.precioNoche >= 0);
    const nuevasTarifas = await actualizarTarifarioAction(updates);
    onActualizado(nuevasTarifas);
    setGuardando(false);
    setGuardado(true);
    setTimeout(() => {
      setGuardado(false);
      setOpen(false);
    }, 900);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-3.5 w-3.5" /> Editar tarifario
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar tarifario</DialogTitle>
          <DialogDescription>
            Los cambios se aplican de inmediato a la disponibilidad y precios del sitio de reservas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          {tipos.map((tipo, idx) => {
            const tarifaBaja = tarifas.find((t) => t.tipoHabitacionId === tipo.id && t.temporada === "baja");
            const tarifaAlta = tarifas.find((t) => t.tipoHabitacionId === tipo.id && t.temporada === "alta");
            return (
              <div key={tipo.id}>
                {idx > 0 && <Separator className="mb-5" />}
                <p className="text-sm font-medium mb-2.5">{tipo.nombre}</p>
                <div className="grid grid-cols-2 gap-3">
                  {tarifaBaja && (
                    <div className="space-y-1.5">
                      <Label htmlFor={`tarifa-${tarifaBaja.id}`} className="text-xs text-muted-foreground">
                        Temporada baja (CLP/noche)
                      </Label>
                      <Input
                        id={`tarifa-${tarifaBaja.id}`}
                        type="number"
                        min={0}
                        step={1000}
                        value={valores[tarifaBaja.id] ?? ""}
                        onChange={(e) => handleChange(tarifaBaja.id, e.target.value)}
                        required
                      />
                    </div>
                  )}
                  {tarifaAlta && (
                    <div className="space-y-1.5">
                      <Label htmlFor={`tarifa-${tarifaAlta.id}`} className="text-xs text-muted-foreground">
                        Temporada alta (CLP/noche)
                      </Label>
                      <Input
                        id={`tarifa-${tarifaAlta.id}`}
                        type="number"
                        min={0}
                        step={1000}
                        value={valores[tarifaAlta.id] ?? ""}
                        onChange={(e) => handleChange(tarifaAlta.id, e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between pt-1">
            {guardado ? (
              <p className="flex items-center gap-1.5 text-sm text-success font-medium">
                <CheckCircle2 className="h-4 w-4" /> Tarifario actualizado
              </p>
            ) : (
              <span />
            )}
            <Button type="submit" variant="gold" disabled={guardando} className="ml-auto">
              {guardando ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
