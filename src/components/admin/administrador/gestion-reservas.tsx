"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, TrendingDown, XCircle, Trash2, Sunrise, ThumbsUp } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatCLP, formatDate, cn } from "@/lib/utils";
import type { EstadoReserva, SolicitudEarlyCheckin } from "@/domain/types";
import {
  cancelarReservaAction,
  eliminarReservaAction,
  confirmarPagoAction,
  ajustarTarifaReservaAction,
  aprobarSolicitudEarlyCheckinAction,
} from "@/app/admin/administrador/actions";

type Fila = {
  id: string;
  codigo: string;
  huesped: string;
  habitacion: string;
  checkIn: string;
  checkOut: string;
  huespedes: number;
  estado: EstadoReserva;
  canalOrigen: string;
  montoTotal: number;
  solicitudEarlyCheckin?: SolicitudEarlyCheckin;
  checkInRealizado?: boolean;
};

const ESTADO: Record<EstadoReserva, { label: string; variant: "gold" | "outline" | "destructive" }> = {
  pendiente_pago: { label: "Pendiente pago", variant: "outline" },
  confirmada: { label: "Confirmada", variant: "gold" },
  expirada: { label: "Expirada", variant: "outline" },
  cancelada_huesped: { label: "Cancelada (huésped)", variant: "destructive" },
  cancelada_hotel: { label: "Cancelada (hotel)", variant: "destructive" },
  no_show: { label: "No-show", variant: "outline" },
  reembolsada: { label: "Reembolsada", variant: "outline" },
};

export function GestionReservas({ reservasIniciales }: { reservasIniciales: Fila[] }) {
  const [reservas, setReservas] = React.useState(reservasIniciales);
  const [pendiente, setPendiente] = React.useState<string | null>(null);
  const [reducir, setReducir] = React.useState<Fila | null>(null);
  const [eliminar, setEliminar] = React.useState<Fila | null>(null);
  const [nuevoMonto, setNuevoMonto] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const esCancelada = (e: EstadoReserva) => e === "cancelada_hotel" || e === "cancelada_huesped";

  async function aprobarIngresoPrioritario(f: Fila) {
    setPendiente(f.id);
    try {
      const r = await aprobarSolicitudEarlyCheckinAction(f.id);
      setReservas((prev) =>
        prev.map((x) => (x.id === f.id ? { ...x, solicitudEarlyCheckin: r.solicitudEarlyCheckin } : x))
      );
    } finally {
      setPendiente(null);
    }
  }

  async function confirmar(f: Fila) {
    setPendiente(f.id);
    try {
      const r = await confirmarPagoAction(f.id);
      setReservas((prev) => prev.map((x) => (x.id === f.id ? { ...x, estado: r.estado } : x)));
    } finally {
      setPendiente(null);
    }
  }

  async function cancelar(f: Fila) {
    setPendiente(f.id);
    try {
      const r = await cancelarReservaAction(f.id);
      setReservas((prev) => prev.map((x) => (x.id === f.id ? { ...x, estado: r.estado } : x)));
    } finally {
      setPendiente(null);
    }
  }

  async function aplicarReduccion() {
    if (!reducir) return;
    const monto = Number(nuevoMonto);
    if (!Number.isFinite(monto) || monto < 0 || monto >= reducir.montoTotal) {
      setError("Ingresa un monto válido, menor al actual.");
      return;
    }
    setPendiente(reducir.id);
    try {
      const r = await ajustarTarifaReservaAction(reducir.id, monto);
      setReservas((prev) => prev.map((x) => (x.id === reducir.id ? { ...x, montoTotal: r.montoTotal } : x)));
      setReducir(null);
      setNuevoMonto("");
      setError(null);
    } finally {
      setPendiente(null);
    }
  }

  async function borrar() {
    if (!eliminar) return;
    setPendiente(eliminar.id);
    try {
      await eliminarReservaAction(eliminar.id);
      setReservas((prev) => prev.filter((x) => x.id !== eliminar.id));
      setEliminar(null);
    } finally {
      setPendiente(null);
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Huésped</TableHead>
                <TableHead>Habitación</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence initial={false}>
                {reservas.map((f) => {
                  const busy = pendiente === f.id;
                  const ipAprobado = f.solicitudEarlyCheckin?.estado === "aprobada";
                  const ipPendiente = f.solicitudEarlyCheckin?.estado === "pendiente_confirmacion";
                  return (
                    <motion.tr
                      key={f.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className={cn(
                        "border-b border-border last:border-0",
                        ipAprobado && !f.checkInRealizado && "bg-gold/[0.06]"
                      )}
                    >
                      <TableCell className="font-mono text-xs">{f.codigo}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{f.huesped}</div>
                        <div className="text-xs text-muted-foreground capitalize">{f.canalOrigen}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {f.habitacion}
                        {(ipAprobado || ipPendiente) && (
                          <span
                            className={cn(
                              "mt-1 flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-[0.06em]",
                              ipAprobado
                                ? "border-gold/50 bg-gold/15 text-gold"
                                : "border-border bg-secondary/60 text-muted-foreground"
                            )}
                          >
                            <Sunrise className="h-3 w-3" />
                            {f.checkInRealizado
                              ? "Ingreso prioritario ✓"
                              : ipAprobado
                              ? "IP aprobado · falta registrar mucama en Incentivos"
                              : "IP pendiente de aprobación"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(f.checkIn, { day: "2-digit", month: "short" })} →{" "}
                        {formatDate(f.checkOut, { day: "2-digit", month: "short" })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={ESTADO[f.estado].variant}>{ESTADO[f.estado].label}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCLP(f.montoTotal)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {f.estado === "pendiente_pago" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={busy}
                              onClick={() => confirmar(f)}
                              title="Confirmar pago"
                            >
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            </Button>
                          )}
                          {ipPendiente && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={busy}
                              onClick={() => aprobarIngresoPrioritario(f)}
                              title="Aprobar Ingreso Prioritario"
                            >
                              <ThumbsUp className="h-4 w-4 text-gold" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={busy || esCancelada(f.estado)}
                            onClick={() => {
                              setReducir(f);
                              setNuevoMonto("");
                              setError(null);
                            }}
                            title="Reducir tarifa"
                          >
                            <TrendingDown className="h-4 w-4 text-gold" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={busy || esCancelada(f.estado)}
                            onClick={() => cancelar(f)}
                            title="Cancelar reserva"
                          >
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={busy}
                            onClick={() => setEliminar(f)}
                            title="Eliminar definitivamente"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
          {reservas.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">No hay reservas.</p>
          )}
        </div>
      </CardContent>

      {/* Dialog: reducir tarifa */}
      <Dialog open={!!reducir} onOpenChange={(o) => !o && setReducir(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reducir tarifa</DialogTitle>
            <DialogDescription>
              {reducir && (
                <>
                  Reserva <span className="font-mono">{reducir.codigo}</span> · monto actual{" "}
                  {formatCLP(reducir.montoTotal)}.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Nuevo monto total</Label>
            <Input
              type="number"
              min={0}
              step={1000}
              value={nuevoMonto}
              onChange={(e) => setNuevoMonto(e.target.value)}
              placeholder="Ej. 85000"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setReducir(null)}>
              Cancelar
            </Button>
            <Button variant="gold" size="sm" onClick={aplicarReduccion} disabled={!!pendiente}>
              Aplicar reducción
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: eliminar definitivo */}
      <Dialog open={!!eliminar} onOpenChange={(o) => !o && setEliminar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar definitivamente</DialogTitle>
            <DialogDescription>
              {eliminar && (
                <>
                  Esta acción elimina la reserva <span className="font-mono">{eliminar.codigo}</span> del
                  sistema y no se puede deshacer. Para conservar trazabilidad, usa &quot;Cancelar&quot; en su
                  lugar.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setEliminar(null)}>
              Conservar
            </Button>
            <Button variant="destructive" size="sm" onClick={borrar} disabled={!!pendiente}>
              Eliminar definitivamente
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
