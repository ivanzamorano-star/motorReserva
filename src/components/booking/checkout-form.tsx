"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShieldCheck, CreditCard, Lock, CheckCircle2, Star, Building2, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { reservationRepository } from "@/data/repository";
import { nightsBetween } from "@/lib/utils";
import { useMoneda } from "@/lib/moneda";
import { useIdioma } from "@/lib/idioma";
import { useRoomNombre } from "@/lib/room-i18n";
import { track } from "@/lib/analytics";
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
import {
  PaymentMethodSelector,
  type MetodoPago,
} from "@/components/booking/payment-method-selector";

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
  const { formatear } = useMoneda();
  const { t } = useIdioma();
  const nombreHab = useRoomNombre(habitacion);
  const nochesLabel = (n: number) => t(n === 1 ? "res.night" : "res.nights");
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
  const [metodoPago, setMetodoPago] = React.useState<MetodoPago>("tarjeta");

  const noches = nightsBetween(checkIn, checkOut);
  const subtotal = habitacion.tarifaNoche * noches;
  const totalFinal = subtotal + extrasTotal;
  const sena = Math.round(totalFinal * 0.3); // seña 30% para el método "depósito"
  const resto = totalFinal - sena;

  // C2 — evento GA4 de inicio de checkout (una vez, al montar el flujo).
  React.useEffect(() => {
    track("begin_checkout", {
      currency: "CLP",
      value: subtotal,
      items: [{ item_id: habitacion.id, item_name: nombreHab, price: habitacion.tarifaNoche }],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    track("purchase", {
      transaction_id: confirmada.codigo,
      currency: "CLP",
      value: totalFinal,
      payment_type: metodoPago,
      items: [{ item_id: habitacion.id, item_name: nombreHab }],
    });
    router.push(`/confirmacion?codigo=${confirmada.codigo}&habitacion=${encodeURIComponent(nombreHab)}`);
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
              <h2 className="font-serif text-2xl font-light">{t("cf.guestData")}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="nombre">{t("cf.fullName")}</Label>
                  <Input id="nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder={t("cf.fullNamePh")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">{t("cf.email")}</Label>
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("cf.emailPh")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="telefono">{t("cf.phone")}</Label>
                  <Input id="telefono" required value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder={t("cf.phonePh")} />
                </div>
              </div>

              <Separator className="my-6" />

              <TaxDocumentSelector value={documento} onChange={setDocumento} />

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setPaso("servicios")}>
                  {t("cf.back")}
                </Button>
                <Button type="submit" size="lg" variant="gold" className="flex-1 sm:flex-none">
                  {t("cf.continuePay")}
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
              <h2 className="font-serif text-2xl font-light">{t("cf.payTitle")}</h2>

              <PaymentMethodSelector value={metodoPago} onChange={setMetodoPago} />

              {metodoPago === "tarjeta" && (
                <div className="rounded-xl border border-border bg-secondary/40 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CreditCard className="h-4 w-4" /> Webpay Plus — Transbank
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>{t("cf.cardNumber")}</Label>
                      <Input placeholder="4051 8856 0044 6623" defaultValue="4051 8856 0044 6623" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t("cf.expiry")}</Label>
                      <Input placeholder="12/29" defaultValue="12/29" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t("cf.cvv")}</Label>
                      <Input placeholder="123" defaultValue="123" />
                    </div>
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" /> {t("cf.demoNote")}
                  </p>
                </div>
              )}

              {metodoPago === "hotel" && (
                <div className="rounded-xl border border-border bg-secondary/40 p-5 flex items-start gap-3">
                  <Building2 className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
                  <p className="text-sm text-muted-foreground">{t("pm.hotelNote")}</p>
                </div>
              )}

              {metodoPago === "deposito" && (
                <div className="rounded-xl border border-border bg-secondary/40 p-5 flex items-start gap-3">
                  <PiggyBank className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
                  <p className="text-sm text-muted-foreground">
                    {t("pm.depositNote", { sena: formatear(sena), pct: 30, resto: formatear(resto) })}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setPaso("datos")}>{t("cf.back")}</Button>
                <Button variant="gold" className="flex-1" onClick={handlePagar}>
                  {metodoPago === "hotel"
                    ? t("pm.confirmHotel")
                    : metodoPago === "deposito"
                    ? t("pm.payDeposit", { monto: formatear(sena) })
                    : t("cf.pay", { monto: formatear(totalFinal) })}
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
              <p className="font-medium">{t("cf.processing")}</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                {t("cf.processingNote")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="card-accent p-6 h-fit sticky top-24">
        <span className="eyebrow text-[0.62rem] after:hidden">{t("cf.summary")}</span>
        <p className="font-serif text-xl font-medium mt-3">{nombreHab}</p>
        <p className="text-sm text-muted-foreground mt-1.5">{checkIn} → {checkOut}</p>
        <p className="text-sm text-muted-foreground">{huespedes} {t("res.guests")} · {noches} {nochesLabel(noches)}</p>
        <Separator className="my-5" />
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">{formatear(habitacion.tarifaNoche)} × {noches} {nochesLabel(noches)}</span>
          <span>{formatear(subtotal)}</span>
        </div>

        {extras.length > 0 && (
          <div className="mt-4">
            <p className="text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground mb-2">
              {t("cf.extraServices")}
            </p>
            <div className="space-y-1.5">
              {extras.map((s) => (
                <div key={s.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t(`as.svc.${s.id}.name`)}</span>
                  <span className={s.precio === 0 ? "text-gold" : undefined}>
                    {s.precio === 0 ? t("cf.courtesy") : formatear(s.precio)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-5" />
        <div className="flex items-baseline justify-between">
          <span className="text-sm uppercase tracking-[0.14em] text-muted-foreground">{t("cf.totalFinal")}</span>
          <span className="font-serif text-2xl font-medium text-primary">{formatear(totalFinal)}</span>
        </div>
        <p className="text-[0.68rem] text-muted-foreground mt-1.5">
          {t("cf.taxNote")}
        </p>
        <div className="flex items-center gap-2 mt-5 rounded-lg bg-secondary/60 px-3 py-2.5">
          <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
          <p className="text-xs text-muted-foreground">{t("cf.holdNote")}</p>
        </div>

        {/* Señales de confianza */}
        <div className="mt-4 space-y-2.5 border-t border-border pt-4">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            {t("cf.freeCancel")}
          </p>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-4 w-4 shrink-0 text-gold" />
            {t("cf.securePay")}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
              ))}
            </span>
            <span>
              <span className="font-medium text-foreground">{t("cf.rating")}</span> {t("cf.reviewsSuffix")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
