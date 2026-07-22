"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { actualizarConfigIncentivosAction } from "@/app/admin/configuracion/actions";
import type { Hotel, MucamaStaff } from "@/domain/types";

const FLOTANTE = "flotante";

// Sistema ligero de incentivos: "Staff Tags" (nombres de mucamas, sin cuentas de
// usuario reales) + piso fijo a cargo (para la asignación de Ingreso Prioritario)
// + % de incentivo sobre la tarifa plana.
export function IncentivosConfigCard({ hotel, pisos }: { hotel: Hotel; pisos: number[] }) {
  const router = useRouter();
  const [mucamas, setMucamas] = React.useState<MucamaStaff[]>(hotel.mucamas);
  const [nuevaMucama, setNuevaMucama] = React.useState("");
  const [nuevoPiso, setNuevoPiso] = React.useState<string>(FLOTANTE);
  const [pct, setPct] = React.useState(String(Math.round(hotel.incentivoIngresoPrioritarioPct * 100)));
  const [precio, setPrecio] = React.useState(String(hotel.precioIngresoPrioritario));
  const [guardando, setGuardando] = React.useState(false);

  function agregarMucama() {
    const nombre = nuevaMucama.trim();
    if (!nombre || mucamas.some((m) => m.nombre === nombre)) return;
    const pisoACargo = nuevoPiso === FLOTANTE ? undefined : Number(nuevoPiso);
    setMucamas((prev) => [...prev, { nombre, pisoACargo }]);
    setNuevaMucama("");
    setNuevoPiso(FLOTANTE);
  }

  function quitarMucama(nombre: string) {
    setMucamas((prev) => prev.filter((m) => m.nombre !== nombre));
  }

  function cambiarPiso(nombre: string, valor: string) {
    const pisoACargo = valor === FLOTANTE ? undefined : Number(valor);
    setMucamas((prev) => prev.map((m) => (m.nombre === nombre ? { ...m, pisoACargo } : m)));
  }

  async function guardar() {
    setGuardando(true);
    await actualizarConfigIncentivosAction({
      mucamas,
      incentivoIngresoPrioritarioPct: Math.max(0, Math.min(100, Number(pct) || 0)) / 100,
      precioIngresoPrioritario: Math.max(0, Number(precio) || 0),
    });
    setGuardando(false);
    router.refresh();
  }

  const bonoPorUnidad = Math.round((Number(precio) || 0) * ((Number(pct) || 0) / 100));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Incentivos — Ingreso Prioritario</CardTitle>
        <CardDescription>
          Mucamas participantes y bono por cada Ingreso Prioritario que preparen. Sin cuentas de usuario reales.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Tarifa plana del Ingreso Prioritario</Label>
            <Input type="number" min={0} value={precio} onChange={(e) => setPrecio(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>% de incentivo para mucamas</Label>
            <Input type="number" min={0} max={100} value={pct} onChange={(e) => setPct(e.target.value)} />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Bono por cada Ingreso Prioritario asignado: <span className="font-medium text-foreground">{bonoPorUnidad.toLocaleString("es-CL")}</span> ({pct || 0}% de la tarifa plana).
        </p>

        <div className="space-y-2">
          <Label>Mucamas (Staff Tags) y piso a cargo</Label>
          <p className="text-xs text-muted-foreground">
            El piso a cargo se usa para asignar automáticamente al hacer el check-in del Ingreso
            Prioritario: si la mucama con menos ingresos del mes no está a cargo de ese piso, se
            asigna a la encargada del piso. "Flotante" cubre cualquier piso.
          </p>
          <div className="space-y-1.5">
            {mucamas.map((m) => (
              <div
                key={m.nombre}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2"
              >
                <span className="text-sm font-medium">{m.nombre}</span>
                <div className="flex items-center gap-2">
                  <select
                    value={m.pisoACargo != null ? String(m.pisoACargo) : FLOTANTE}
                    onChange={(e) => cambiarPiso(m.nombre, e.target.value)}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value={FLOTANTE}>Flotante</option>
                    {pisos.map((p) => (
                      <option key={p} value={p}>
                        Piso {p}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => quitarMucama(m.nombre)}
                    aria-label={`Quitar a ${m.nombre}`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {mucamas.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin mucamas registradas todavía.</p>
            )}
          </div>
          <div className="flex gap-2 pt-1">
            <Input
              placeholder="Nombre de la mucama"
              value={nuevaMucama}
              onChange={(e) => setNuevaMucama(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  agregarMucama();
                }
              }}
              className="max-w-xs"
            />
            <select
              value={nuevoPiso}
              onChange={(e) => setNuevoPiso(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value={FLOTANTE}>Flotante</option>
              {pisos.map((p) => (
                <option key={p} value={p}>
                  Piso {p}
                </option>
              ))}
            </select>
            <Button type="button" variant="outline" size="sm" onClick={agregarMucama} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Agregar
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="button" variant="gold" onClick={guardar} disabled={guardando} className="gap-1.5">
            {guardando && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Guardar cambios
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
