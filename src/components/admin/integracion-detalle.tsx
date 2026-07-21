"use client";

import * as React from "react";
import {
  ArrowRightLeft,
  X,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Wifi,
  Clock,
  Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn, formatDate } from "@/lib/utils";
import type { IntegracionExterna } from "@/domain/types";

// D1 — Detalle de una conexión con Channel Manager / PMS (preparación para
// producción): estado de sincronización, último sync, mapeo de habitaciones y
// actividad reciente. Demo: la sincronización es simulada.
export function IntegracionDetalle({
  integracion,
  habitaciones,
}: {
  integracion: IntegracionExterna;
  habitaciones: { id: string; nombre: string }[];
}) {
  const [abierto, setAbierto] = React.useState(false);
  const [sincronizando, setSincronizando] = React.useState(false);
  const activo = integracion.activo;
  const prefijo = integracion.tipo === "channel_manager" ? "BDS" : "PMS";

  // Mapeo determinista local ↔ código externo. Se deja una categoría sin mapear
  // (solo en PMS) para mostrar el estado "Sin mapear" de forma realista.
  const mapeo = habitaciones.map((h, i) => ({
    ...h,
    codigoExterno: `${prefijo}-${101 + i}`,
    mapeada: !(integracion.tipo === "pms" && i === habitaciones.length - 1),
  }));

  const ultimoSync =
    integracion.ultimaSincronizacion === "—"
      ? "—"
      : formatDate(integracion.ultimaSincronizacion.slice(0, 10));

  const actividad = [
    { hora: "hace 6 min", texto: "Inventario sincronizado — sin conflictos" },
    { hora: "hace 21 min", texto: "Tarifas actualizadas en canales conectados" },
    { hora: "hace 1 h", texto: "Nueva reserva directa empujada al PMS" },
  ];

  function sincronizar() {
    setSincronizando(true);
    setTimeout(() => setSincronizando(false), 1200);
  }

  return (
    <>
      <Button variant="outline" size="sm" className="w-full" onClick={() => setAbierto(true)}>
        <ArrowRightLeft className="h-3.5 w-3.5" /> Ver detalle de sincronización
      </Button>

      {abierto && (
        <div className="fixed inset-0 z-50">
          <div
            onClick={() => setAbierto(false)}
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-border bg-background p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-gold">
                  {integracion.tipo === "channel_manager" ? "Channel manager" : "PMS externo"}
                </span>
                <button
                  type="button"
                  onClick={() => setAbierto(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <h2 className="font-serif text-2xl font-medium">{integracion.nombre}</h2>
                <Badge variant={activo ? "success" : "outline"}>
                  {activo ? "Activo" : "No conectado"}
                </Badge>
              </div>

              {!activo ? (
                <p className="mt-6 text-sm text-muted-foreground">
                  Esta integración aún no está conectada. Al conectarla, el motor sincroniza
                  inventario y tarifas en tiempo real y previene el overbooking entre canales.
                </p>
              ) : (
                <>
                  {/* Estado de sincronización */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Wifi className="h-4 w-4 text-success" /> Estado
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" /> En línea
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 text-gold" /> Última sincronización
                      </span>
                      <span className="font-medium">{ultimoSync}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Repeat className="h-4 w-4 text-gold" /> Frecuencia
                      </span>
                      <span className="font-medium">Automática · cada 15 min</span>
                    </div>
                  </div>

                  <Button
                    variant="gold"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={sincronizar}
                    disabled={sincronizando}
                  >
                    {sincronizando ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sincronizando…
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3.5 w-3.5" /> Sincronizar ahora
                      </>
                    )}
                  </Button>

                  {integracion.canalesConectados && integracion.canalesConectados.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {integracion.canalesConectados.map((c) => (
                        <Badge key={c} variant="outline">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Separator className="my-6" />

                  {/* Mapeo de habitaciones */}
                  <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Mapeo de habitaciones
                  </p>
                  <div className="mt-3 space-y-2">
                    {mapeo.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate">{m.nombre}</span>
                          <ArrowRightLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span className="font-mono text-xs text-muted-foreground">{m.codigoExterno}</span>
                        </div>
                        <span
                          className={cn(
                            "flex items-center gap-1 text-[0.68rem] font-medium shrink-0",
                            m.mapeada ? "text-success" : "text-muted-foreground"
                          )}
                        >
                          {m.mapeada ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" /> Mapeada
                            </>
                          ) : (
                            "Sin mapear"
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  {/* Actividad reciente */}
                  <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Actividad reciente
                  </p>
                  <div className="mt-3 space-y-3">
                    {actividad.map((a, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        <div>
                          <p>{a.texto}</p>
                          <p className="text-xs text-muted-foreground">{a.hora}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
          </aside>
        </div>
      )}
    </>
  );
}
