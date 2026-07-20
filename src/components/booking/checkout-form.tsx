"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShieldCheck, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { reservationRepository } from "@/data/repository";
import { formatCLP, nightsBetween } from "@/lib/utils";
import type { HabitacionConDisponibilidad } from "@/domain/types";
import {
  AdditionalServices,
  type ServicioExtra,
} from "@/components/booking/additional-services";
import {
  TaxDocumentSelector,
  FACTURA_VACIA,
  type DocumentoTributarioValue,
} from "@/components/booking/tax-document-selector";

type Paso = "servicios" | "datos" | "pago" | "procesando";

export function CheckoutForm({
  habitacion,
  checkIn,
  checkOut,
  huespedes,
}: {
  habitacion: HabitacionConDisponibilidad;
  checkIn: string;
  checkOut: string;
  huespedes: string;
}) {
  const router = useRouter();
  const [paso, setPaso] = React.useState<Paso>("servicios");
  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [extras, setExtras] = React.useState<ServicioExtra[]>([]);
  const [extrasTotal, setExtrasTotal] = React.useState(0);
  const [documento, setDocumento] = React.useState<DocumentoTributarioValue>({
    tipo: "boleta",
    factura: FACTURA_VACIA,
  });

  const noches = nightsBetween(checkIn, checkOut);
  const subtotal = habitacion.tarifaNoche * noches;
  const totalFinal = subtotal + extrasTotal;

  async function handleDatosSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPaso("pago");
  }

  async function handlePagar() {
    setPaso("procesando");
    const documentoTributario =
      documento.tipo === "factura"
        ? { tipo: "factura" as const, factura: documento.factura }
        : { tipo: "boleta" as const };
    const reserva = await reservationRepository.crearReserva({
      tipoHabitacionId: habitacion.id,
      checkIn,
      checkOut,
      huespedes: Number(huespedes),
      nombre,
      email,
      telefono,
      montoTotal: totalFinal,
      documentoTributario,
    });
    const { reserva: confirmada } = await reservationRepository.confirmarPago(reserva.id);
    router.push(`/confirmacion?codigo=${confirmada.codigo}&habitacion=${habitacion.nombre}`);
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8">
      <div>
        <AnimatePresence mode="wait">
          {paso === "servicios" && (
            <motion.div
              key="servicios"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25 }}
            >
              <AdditionalServices
                onChange={(total, servicios) => {
                  setExtrasTotal(total);
                  setExtras(servicios);
                }}
                onContinue={() => setPaso("datos")}
              />
            </motion.div>
          )}

          {paso === "datos" && (
            <motion.form
              key="datos"
              onSubmit={handleDatosSubmit}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <h2 className="font-serif text-2xl font-light">Datos del huésped</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input id="nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre y apellido" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@correo.com" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" required value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+56 9 1234 5678" />
                </div>
              </div>

              <Separator className="my-6" />

              <TaxDocumentSelector value={documento} onChange={setDocumento} />

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setPaso("servicios")}>
                  Volver
                </Button>
                <Button type="submit" size="lg" variant="gold" className="flex-1 sm:flex-none">
                  Continuar al pago
                </Button>
              </div>
            </motion.form>
          )}

          {paso === "pago" && (
            <motion.div
              key="pago"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <h2 className="font-serif text-2xl font-light">Pago</h2>
              <div className="rounded-xl border border-border bg-secondary/40 p-5 space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CreditCard className="h-4 w-4" /> Webpay Plus — Transbank
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Número de tarjeta</Label>
                    <Input placeholder="4051 8856 0044 6623" defaultValue="4051 8856 0044 6623" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Vencimiento</Label>
                    <Input placeholder="12/29" defaultValue="12/29" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>CVV</Label>
                    <Input placeholder="123" defaultValue="123" />
                  </div>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" /> Ambiente de demostración — no se procesa ningún cobro real.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setPaso("datos")}>Volver</Button>
                <Button variant="gold" className="flex-1" onClick={handlePagar}>
                  Pagar {formatCLP(totalFinal)}
                </Button>
              </div>
            </motion.div>
          )}

          {paso === "procesando" && (
            <motion.div
              key="procesando"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center gap-4"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="font-medium">Confirmando disponibilidad y procesando el pago…</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Estamos bloqueando la habitación y validando el pago con Transbank en tiempo real.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="card-accent p-6 h-fit sticky top-24">
        <span className="eyebrow text-[0.62rem] after:hidden">Resumen de reserva</span>
        <p className="font-serif text-xl font-medium mt-3">{habitacion.nombre}</p>
        <p className="text-sm text-muted-foreground mt-1.5">{checkIn} → {checkOut}</p>
        <p className="text-sm text-muted-foreground">{huespedes} huésped(es) · {noches} {noches === 1 ? "noche" : "noches"}</p>
        <Separator className="my-5" />
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">{formatCLP(habitacion.tarifaNoche)} × {noches} {noches === 1 ? "noche" : "noches"}</span>
          <span>{formatCLP(subtotal)}</span>
        </div>

        {extras.length > 0 && (
          <div className="mt-4">
            <p className="text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground mb-2">
              Servicios adicionales
            </p>
            <div className="space-y-1.5">
              {extras.map((s) => (
                <div key={s.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{s.nombre}</span>
                  <span className={s.precio === 0 ? "text-gold" : undefined}>
                    {s.precio === 0 ? "Cortesía" : formatCLP(s.precio)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-5" />
        <div className="flex items-baseline justify-between">
          <span className="text-sm uppercase tracking-[0.14em] text-muted-foreground">Total</span>
          <span className="font-serif text-2xl font-medium text-primary">{formatCLP(totalFinal)}</span>
        </div>
        <div className="flex items-center gap-2 mt-5 rounded-lg bg-secondary/60 px-3 py-2.5">
          <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
          <p className="text-xs text-muted-foreground">Bloqueo de disponibilidad activo por 15 min</p>
        </div>
      </div>
    </div>
  );
}
