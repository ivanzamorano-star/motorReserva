"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, BedDouble, PackageCheck, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCLP } from "@/lib/utils";
import { crearReservaManualAction } from "@/app/admin/administrador/actions";

type TipoMin = { id: string; nombre: string; capacidad: number };
type PaqueteMin = { id: string; nombre: string; tipoHabitacionId: string; precioPaquete: number };

function noches(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return ms > 0 ? Math.round(ms / 86_400_000) : 0;
}

export function NuevaReservaForm({
  tipos,
  tarifaPorTipo,
  paquetes,
}: {
  tipos: TipoMin[];
  tarifaPorTipo: Record<string, number>;
  paquetes: PaqueteMin[];
}) {
  const [modo, setModo] = React.useState<"habitacion" | "paquete">("habitacion");
  const [tipoHabitacionId, setTipoHabitacionId] = React.useState(tipos[0]?.id ?? "");
  const [paqueteId, setPaqueteId] = React.useState(paquetes[0]?.id ?? "");
  const [checkIn, setCheckIn] = React.useState("");
  const [checkOut, setCheckOut] = React.useState("");
  const [huespedes, setHuespedes] = React.useState(2);
  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [estado, setEstado] = React.useState<"confirmada" | "pendiente_pago">("confirmada");
  const [montoManual, setMontoManual] = React.useState("");
  const [tocado, setTocado] = React.useState(false);
  const [enviando, setEnviando] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState<string | null>(null);

  const paquete = paquetes.find((p) => p.id === paqueteId);
  const habId = modo === "paquete" ? paquete?.tipoHabitacionId ?? "" : tipoHabitacionId;
  const n = noches(checkIn, checkOut);

  const montoSugerido =
    modo === "paquete"
      ? (paquete?.precioPaquete ?? 0) * Math.max(1, n)
      : (tarifaPorTipo[tipoHabitacionId] ?? 0) * n;

  const montoFinal = tocado && montoManual !== "" ? Number(montoManual) : montoSugerido;

  const puedeEnviar =
    habId && checkIn && checkOut && n > 0 && nombre.trim() && email.trim() && !enviando;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setEnviando(true);
    try {
      const reserva = await crearReservaManualAction({
        tipoHabitacionId: habId,
        paqueteId: modo === "paquete" ? paqueteId : undefined,
        checkIn,
        checkOut,
        huespedes,
        nombre,
        email,
        telefono,
        montoTotal: montoFinal,
        estado,
      });
      setOk(reserva.codigo);
      setNombre("");
      setEmail("");
      setTelefono("");
      setCheckIn("");
      setCheckOut("");
      setMontoManual("");
      setTocado(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la reserva.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Selector de modo */}
        <div className="grid grid-cols-2 gap-2 max-w-md">
          {(
            [
              { v: "habitacion", label: "Habitación", icon: BedDouble },
              { v: "paquete", label: "Paquete turístico", icon: PackageCheck },
            ] as const
          ).map(({ v, label, icon: Icon }) => (
            <button
              key={v}
              type="button"
              onClick={() => setModo(v)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm transition-all",
                modo === v
                  ? "border-gold bg-gold/10 text-foreground font-medium"
                  : "border-border text-muted-foreground hover:border-primary/40"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Selección de producto */}
          <div className="grid sm:grid-cols-2 gap-4">
            {modo === "habitacion" ? (
              <div className="space-y-1.5">
                <Label>Tipo de habitación</Label>
                <select
                  value={tipoHabitacionId}
                  onChange={(e) => setTipoHabitacionId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {tipos.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre} · hasta {t.capacidad} huésped(es)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label>Paquete turístico</Label>
                <select
                  value={paqueteId}
                  onChange={(e) => setPaqueteId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {paquetes.length === 0 && <option value="">No hay paquetes activos</option>}
                  {paquetes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} · {formatCLP(p.precioPaquete)}/noche
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Huéspedes</Label>
              <Input
                type="number"
                min={1}
                max={8}
                value={huespedes}
                onChange={(e) => setHuespedes(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Fechas */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Check-in</Label>
              <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Check-out</Label>
              <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
            </div>
          </div>

          {/* Huésped */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Nombre del huésped</Label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Marta Ríos" />
            </div>
            <div className="space-y-1.5">
              <Label>Correo</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.cl"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Teléfono</Label>
              <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+56 9 ..." />
            </div>
          </div>

          {/* Monto y estado */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Monto sugerido</p>
                <p className="font-serif text-2xl font-light mt-1">{formatCLP(montoSugerido)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {n > 0 ? `${n} noche(s)` : "Selecciona fechas"}
                  {modo === "habitacion" && habId
                    ? ` · ${formatCLP(tarifaPorTipo[tipoHabitacionId] ?? 0)}/noche`
                    : ""}
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-gold">
                  <Sparkles className="h-3.5 w-3.5" /> Ajustar / reducir tarifa
                </Label>
                <Input
                  type="number"
                  min={0}
                  step={1000}
                  value={tocado ? montoManual : ""}
                  placeholder={String(montoSugerido)}
                  onChange={(e) => {
                    setTocado(true);
                    setMontoManual(e.target.value);
                  }}
                  className="w-44"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 flex-wrap border-t border-border pt-4">
              <div className="space-y-1.5">
                <Label>Estado inicial</Label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as typeof estado)}
                  className="flex h-10 w-56 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="confirmada">Confirmada (pago recibido)</option>
                  <option value="pendiente_pago">Pendiente de pago</option>
                </select>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Total a cobrar</p>
                <p className="font-serif text-xl font-light mt-1">{formatCLP(Math.max(0, montoFinal))}</p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}
            {ok && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm text-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-success" />
                Reserva <Badge variant="gold">{ok}</Badge> creada correctamente.
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end">
            <Button type="submit" variant="gold" size="lg" disabled={!puedeEnviar}>
              {enviando ? "Creando…" : "Crear reserva"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
