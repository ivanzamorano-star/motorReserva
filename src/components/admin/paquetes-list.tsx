"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PackageCheck, CalendarRange, TrendingDown, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { reservationRepository } from "@/data/repository";
import { eliminarPaqueteAction } from "@/app/admin/paquetes/actions";
import { formatCLP, formatDate } from "@/lib/utils";
import { PUBLICO_LABEL, PUBLICO_BADGE_VARIANT } from "@/lib/paquete-utils";
import type { PaquetePromocional, ServicioAdicional, TipoHabitacion } from "@/domain/types";

type PaqueteConHabitacion = PaquetePromocional & { tipoHabitacion?: TipoHabitacion };

export function PaquetesList({
  paquetes,
  servicios,
  onChange,
}: {
  paquetes: PaqueteConHabitacion[];
  servicios: ServicioAdicional[];
  onChange: (paquetes: PaqueteConHabitacion[]) => void;
}) {
  const [pendingId, setPendingId] = React.useState<string | null>(null);
  const [confirmandoId, setConfirmandoId] = React.useState<string | null>(null);
  const [eliminandoId, setEliminandoId] = React.useState<string | null>(null);

  async function handleToggle(id: string) {
    setPendingId(id);
    const actualizado = await reservationRepository.togglePaquete(id);
    onChange(paquetes.map((p) => (p.id === id ? { ...p, activo: actualizado.activo } : p)));
    setPendingId(null);
  }

  async function handleEliminar(id: string) {
    setEliminandoId(id);
    await eliminarPaqueteAction(id);
    onChange(paquetes.filter((p) => p.id !== id));
    setEliminandoId(null);
    setConfirmandoId(null);
  }

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {paquetes.map((p, i) => {
        const ahorro = p.precioReferencia - p.precioPaquete;
        const ahorroPct = p.precioReferencia > 0 ? Math.round((ahorro / p.precioReferencia) * 100) : 0;
        const serviciosIncluidos = servicios.filter((s) => p.serviciosIds.includes(s.id));

        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                      <PackageCheck className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="font-serif text-base font-semibold">{p.nombre}</p>
                      <Badge variant={PUBLICO_BADGE_VARIANT[p.publico]} className="mt-1 text-[10px]">
                        {PUBLICO_LABEL[p.publico]}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant={p.activo ? "success" : "secondary"} className="shrink-0">
                    {p.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">{p.descripcion}</p>

                <div className="rounded-md border border-border bg-secondary/40 px-3 py-2.5 text-xs space-y-1.5">
                  <p>
                    <span className="text-muted-foreground">Incluye: </span>
                    <span className="font-medium">{p.tipoHabitacion?.nombre ?? "Habitación"}</span>
                    {serviciosIncluidos.length > 0 && (
                      <span className="text-muted-foreground"> + {serviciosIncluidos.map((s) => s.nombre).join(", ")}</span>
                    )}
                  </p>
                  <p className="flex items-center gap-1 text-muted-foreground">
                    <CalendarRange className="h-3 w-3" />
                    Vigente {formatDate(p.vigenciaInicio)} — {formatDate(p.vigenciaFin)}
                  </p>
                </div>

                <Separator />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[11px] text-muted-foreground line-through">{formatCLP(p.precioReferencia)}</p>
                    <p className="font-serif text-xl font-semibold text-primary">{formatCLP(p.precioPaquete)}</p>
                    {ahorro > 0 && (
                      <p className="flex items-center gap-1 text-[11px] text-success mt-0.5">
                        <TrendingDown className="h-3 w-3" /> Ahorra {formatCLP(ahorro)} ({ahorroPct}%)
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-2">
                      <span className="font-semibold text-foreground">{p.vecesVendido}</span> vendidos
                    </p>
                    <AnimatePresence mode="wait" initial={false}>
                      {confirmandoId === p.id ? (
                        <motion.div
                          key="confirmar"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-end gap-2"
                        >
                          <span className="text-xs text-muted-foreground">¿Eliminar?</span>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={eliminandoId === p.id}
                            onClick={() => handleEliminar(p.id)}
                          >
                            {eliminandoId === p.id ? "..." : "Sí, eliminar"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setConfirmandoId(null)}>
                            Cancelar
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="acciones"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-end gap-2"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:border-destructive/40"
                            onClick={() => setConfirmandoId(p.id)}
                            aria-label={`Eliminar paquete ${p.nombre}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant={p.activo ? "outline" : "gold"}
                            size="sm"
                            disabled={pendingId === p.id}
                            onClick={() => handleToggle(p.id)}
                          >
                            {pendingId === p.id ? "Guardando..." : p.activo ? "Desactivar" : "Activar"}
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
