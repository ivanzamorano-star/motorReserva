"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sunrise, ThumbsUp, UserCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  aprobarSolicitudEarlyCheckinAction,
  asignarMucamaIngresoPrioritarioAction,
} from "@/app/admin/administrador/actions";
import type { MucamaStaff } from "@/domain/types";

export type SolicitudPanel = {
  id: string;
  codigo: string;
  huesped: string;
  habitacion: string;
  piso?: number;
  estado: "pendiente" | "aprobada";
};

// Panel único de Incentivos: reúne TODAS las solicitudes activas de Ingreso
// Prioritario (recién solicitadas y aprobadas sin mucama) en una sola cola, con
// su acción correspondiente en la misma fila.
//
// REGLA DE NEGOCIO: la asignación de mucama es 100% manual. El sistema NO
// sugiere, ordena por equidad ni pre-selecciona a nadie — solo entrega un
// dropdown con el listado de mucamas (orden alfabético, sin ningún criterio de
// prioridad) porque solo Recepción/Administración sabe, en el momento, quién
// está disponible y en qué piso está trabajando cada una. El piso de la
// habitación se muestra como dato informativo, nunca como sugerencia.
export function IncentivosRegistro({
  solicitudes,
  mucamas,
}: {
  solicitudes: SolicitudPanel[];
  mucamas: MucamaStaff[];
}) {
  const router = useRouter();
  const [pendiente, setPendiente] = React.useState<string | null>(null);
  const [seleccion, setSeleccion] = React.useState<Record<string, string>>({});

  const mucamasOrdenadas = React.useMemo(
    () => [...mucamas].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [mucamas]
  );

  async function aprobar(id: string) {
    setPendiente(id);
    try {
      await aprobarSolicitudEarlyCheckinAction(id);
      router.refresh();
    } finally {
      setPendiente(null);
    }
  }

  async function asignar(id: string) {
    const mucama = seleccion[id];
    if (!mucama) return;
    setPendiente(id);
    try {
      await asignarMucamaIngresoPrioritarioAction(id, mucama);
      router.refresh();
    } finally {
      setPendiente(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Solicitudes de Ingreso Prioritario</CardTitle>
        <CardDescription>
          Aprueba las solicitudes nuevas y registra manualmente qué mucama preparó cada
          habitación. La asignación es siempre manual: elige según quién esté disponible y en
          qué piso está trabajando en ese momento — el sistema no sugiere a nadie.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {solicitudes.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No hay solicitudes de Ingreso Prioritario activas.
          </p>
        ) : (
          <div className="space-y-2">
            {solicitudes.map((s) => {
              const busy = pendiente === s.id;
              return (
                <div
                  key={s.id}
                  className={cn(
                    "flex flex-col gap-3 rounded-lg border px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between",
                    s.estado === "aprobada" ? "border-gold/30 bg-gold/[0.04]" : "border-border bg-secondary/30"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                        s.estado === "aprobada" ? "border-gold/40 text-gold" : "border-border text-muted-foreground"
                      )}
                    >
                      <Sunrise className="h-4 w-4" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {s.huesped} <span className="font-mono text-xs text-muted-foreground">· {s.codigo}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {s.habitacion}
                        {s.piso != null && <> · Piso {s.piso}</>}
                        {" · "}
                        {s.estado === "aprobada" ? "Aprobado, falta registrar mucama" : "Pendiente de aprobación"}
                      </p>
                    </div>
                  </div>

                  {s.estado === "pendiente" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 shrink-0"
                      disabled={busy}
                      onClick={() => aprobar(s.id)}
                    >
                      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ThumbsUp className="h-3.5 w-3.5" />}
                      Aprobar
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={seleccion[s.id] ?? ""}
                        onChange={(e) => setSeleccion((prev) => ({ ...prev, [s.id]: e.target.value }))}
                        disabled={busy}
                        className="h-9 rounded-md border border-input bg-background px-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Elegir mucama…</option>
                        {mucamasOrdenadas.map((m) => (
                          <option key={m.nombre} value={m.nombre}>
                            {m.nombre}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="gold"
                        size="sm"
                        className="gap-1.5"
                        disabled={busy || !seleccion[s.id]}
                        onClick={() => asignar(s.id)}
                      >
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserCheck className="h-3.5 w-3.5" />}
                        Asignar mucama
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
