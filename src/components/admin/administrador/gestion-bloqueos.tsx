"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Trash2, CalendarOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { crearBloqueoAction, eliminarBloqueoAction } from "@/app/admin/administrador/actions";

type TipoMin = { id: string; nombre: string };
type Fila = {
  id: string;
  tipoHabitacionId: string;
  habitacion: string;
  desde: string;
  hasta: string;
  motivo: string;
};

export function GestionBloqueos({
  bloqueosIniciales,
  tipos,
}: {
  bloqueosIniciales: Fila[];
  tipos: TipoMin[];
}) {
  const [bloqueos, setBloqueos] = React.useState(bloqueosIniciales);
  const [tipoHabitacionId, setTipoHabitacionId] = React.useState(tipos[0]?.id ?? "");
  const [desde, setDesde] = React.useState("");
  const [hasta, setHasta] = React.useState("");
  const [motivo, setMotivo] = React.useState("");
  const [enviando, setEnviando] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!desde || !hasta) {
      setError("Indica el rango de fechas.");
      return;
    }
    setEnviando(true);
    try {
      const nuevo = await crearBloqueoAction({ tipoHabitacionId, desde, hasta, motivo });
      const habitacion = tipos.find((t) => t.id === tipoHabitacionId)?.nombre ?? "—";
      setBloqueos((prev) => [{ ...nuevo, habitacion }, ...prev]);
      setDesde("");
      setHasta("");
      setMotivo("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el bloqueo.");
    } finally {
      setEnviando(false);
    }
  }

  async function eliminar(f: Fila) {
    setBloqueos((prev) => prev.filter((x) => x.id !== f.id));
    await eliminarBloqueoAction(f.id);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-base">Nuevo bloqueo</CardTitle>
          <CardDescription>La habitación quedará no disponible en ese rango.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={crear} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Habitación</Label>
              <select
                value={tipoHabitacionId}
                onChange={(e) => setTipoHabitacionId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {tipos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Desde</Label>
                <Input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Hasta</Label>
                <Input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Motivo</Label>
              <Input
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej. Mantenimiento de baño"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" variant="gold" disabled={enviando} className="w-full">
              <Lock className="h-4 w-4" />
              {enviando ? "Bloqueando…" : "Bloquear habitación"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bloqueos activos ({bloqueos.length})</CardTitle>
          <CardDescription>Habitaciones fuera de servicio por período.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {bloqueos.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
              <CalendarOff className="h-6 w-6" />
              <p className="text-sm">No hay bloqueos activos.</p>
            </div>
          )}
          <AnimatePresence initial={false}>
            {bloqueos.map((b, i) => (
              <motion.div
                key={b.id}
                layout
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gold/10 text-gold">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{b.habitacion}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(b.desde, { day: "2-digit", month: "short" })} →{" "}
                        {formatDate(b.hasta, { day: "2-digit", month: "short" })} · {b.motivo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Fuera de servicio</Badge>
                    <Button variant="ghost" size="sm" onClick={() => eliminar(b)} title="Levantar bloqueo">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                {i < bloqueos.length - 1 && <Separator />}
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
