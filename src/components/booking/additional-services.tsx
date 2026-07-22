"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Car,
  Shirt,
  Wine,
  Plug,
  Baby,
  Coffee,
  Sunrise,
  Moon,
  Check,
  Clock,
  ArrowRight,
  Info,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMoneda } from "@/lib/moneda";
import { useIdioma } from "@/lib/idioma";
import type { FranjaLateCheckout } from "@/domain/types";

export type ServicioExtra = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number; // 0 = Cortesía
  icon: LucideIcon;
};

const SERVICIOS: ServicioExtra[] = [
  {
    id: "traslado-vip",
    nombre: "Traslado VIP al Aeropuerto",
    descripcion:
      "Traslado privado desde y hacia el aeropuerto de Punta Arenas.",
    precio: 25000,
    icon: Car,
  },
  {
    id: "lavanderia",
    nombre: "Lavandería y Tintorería Express",
    descripcion: "Lavado y planchado con entrega el mismo día.",
    precio: 18000,
    icon: Shirt,
  },
  {
    id: "minibar-premium",
    nombre: "Minibar Premium",
    descripcion:
      "Minibar pre-abastecido con una selección de licores y destilados.",
    precio: 35000,
    icon: Wine,
  },
  {
    id: "conectividad",
    nombre: "Kit de Conectividad",
    descripcion:
      "Adaptadores internacionales y cargadores para todos sus dispositivos.",
    precio: 0,
    icon: Plug,
  },
  {
    id: "cuna-bebe",
    nombre: "Cuna para bebé",
    descripcion: "Cuna equipada instalada en su habitación, sin costo.",
    precio: 0,
    icon: Baby,
  },
  {
    id: "in-room-dining",
    nombre: "Experiencia In-Room Dining",
    descripcion: "Desayuno servido en la cama para comenzar el día con calma.",
    precio: 22000,
    icon: Coffee,
  },
];

const FRANJAS: { id: FranjaLateCheckout; pct: number; labelKey: string }[] = [
  { id: "franja1", pct: 0.3, labelKey: "as.special.lateCheckout.slot1" },
  { id: "franja2", pct: 0.55, labelKey: "as.special.lateCheckout.slot2" },
  { id: "franja3", pct: 1, labelKey: "as.special.lateCheckout.slot3" },
];

export type SolicitudesEspeciales = {
  earlyCheckinSolicitado: boolean;
  earlyCheckinMonto: number;
  lateCheckoutFranja: FranjaLateCheckout | null;
  lateCheckoutMonto: number;
};

export function AdditionalServices({
  tarifaNoche,
  precioIngresoPrioritario,
  onChange,
  onSpecialChange,
  onContinue,
}: {
  tarifaNoche: number;
  precioIngresoPrioritario: number;
  onChange?: (total: number, servicios: ServicioExtra[]) => void;
  onSpecialChange?: (solicitudes: SolicitudesEspeciales) => void;
  onContinue: () => void;
}) {
  const { formatear } = useMoneda();
  const { t } = useIdioma();
  const [seleccionados, setSeleccionados] = React.useState<Set<string>>(
    new Set()
  );
  const [earlyCheckin, setEarlyCheckin] = React.useState(false);
  const [franja, setFranja] = React.useState<FranjaLateCheckout | null>(null);

  const items = SERVICIOS.filter((s) => seleccionados.has(s.id));
  const totalExtra = items.reduce((acc, s) => acc + s.precio, 0);

  function toggle(id: string) {
    const next = new Set(seleccionados);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSeleccionados(next);
    const nuevos = SERVICIOS.filter((s) => next.has(s.id));
    onChange?.(
      nuevos.reduce((acc, s) => acc + s.precio, 0),
      nuevos
    );
  }

  function toggleEarlyCheckin() {
    const next = !earlyCheckin;
    setEarlyCheckin(next);
    onSpecialChange?.({
      earlyCheckinSolicitado: next,
      earlyCheckinMonto: next ? precioIngresoPrioritario : 0,
      lateCheckoutFranja: franja,
      lateCheckoutMonto: franja
        ? Math.round(tarifaNoche * (FRANJAS.find((f) => f.id === franja)?.pct ?? 0))
        : 0,
    });
  }

  function elegirFranja(id: FranjaLateCheckout) {
    const next = franja === id ? null : id;
    setFranja(next);
    onSpecialChange?.({
      earlyCheckinSolicitado: earlyCheckin,
      earlyCheckinMonto: earlyCheckin ? precioIngresoPrioritario : 0,
      lateCheckoutFranja: next,
      lateCheckoutMonto: next
        ? Math.round(tarifaNoche * (FRANJAS.find((f) => f.id === next)?.pct ?? 0))
        : 0,
    });
  }

  const montoFranjaActiva = franja
    ? Math.round(tarifaNoche * (FRANJAS.find((f) => f.id === franja)?.pct ?? 0))
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow text-[0.62rem] after:hidden">{t("as.step")}</span>
        <h2 className="font-serif text-2xl font-light mt-2">
          {t("as.title")}
        </h2>
        <p className="text-muted-foreground mt-1.5">
          {t("as.subtitle")}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {SERVICIOS.map((s) => {
          const active = seleccionados.has(s.id);
          const Icon = s.icon;
          const cortesia = s.precio === 0;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggle(s.id)}
              aria-pressed={active}
              className={cn(
                "group relative card-accent p-5 text-left",
                active && "border-gold ring-1 ring-gold bg-gold/[0.05]"
              )}
            >
              <span
                className={cn(
                  "absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
                  active
                    ? "border-gold bg-gold text-gold-foreground"
                    : "border-border bg-background"
                )}
              >
                {active && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
              </span>

              <div className="flex items-start gap-4 pr-8">
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors",
                    active
                      ? "border-gold bg-gold text-gold-foreground"
                      : "border-gold/40 text-gold"
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-medium leading-snug">
                    {t(`as.svc.${s.id}.name`)}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {t(`as.svc.${s.id}.desc`)}
                  </p>
                  <div className="mt-3">
                    {cortesia ? (
                      <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-gold">
                        {t("as.courtesy")}
                      </span>
                    ) : (
                      <span className="font-serif text-lg font-medium text-primary">
                        {formatear(s.precio)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Solicitudes especiales — Early check-in / Late check-out: sin compra
          garantizada, quedan sujetas a aprobación y cobro de recepción. */}
      <div className="space-y-4">
        <div>
          <h3 className="font-serif text-xl font-medium">{t("as.special.title")}</h3>
          <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gold" />
            {t("as.special.legend")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Early check-in */}
          <div className="card-accent p-5">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors",
                  earlyCheckin ? "border-gold bg-gold text-gold-foreground" : "border-gold/40 text-gold"
                )}
              >
                <Sunrise className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h4 className="font-serif text-lg font-medium leading-snug">
                  {t("as.special.earlyCheckin.name")}
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t("as.special.earlyCheckin.desc")}
                </p>
                <p className="mt-2.5 font-serif text-lg font-medium text-primary">
                  {formatear(precioIngresoPrioritario)}
                </p>
                <div className="mt-3">
                  {earlyCheckin ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.1em] text-gold">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                      {t("as.special.earlyCheckin.requested")}
                    </span>
                  ) : (
                    <Button type="button" size="sm" variant="outline" onClick={toggleEarlyCheckin}>
                      {t("as.special.earlyCheckin.request")}
                    </Button>
                  )}
                  {earlyCheckin && (
                    <button
                      type="button"
                      onClick={toggleEarlyCheckin}
                      className="ml-3 text-[0.7rem] text-muted-foreground underline underline-offset-2 hover:text-foreground"
                    >
                      {t("cf.back")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Late check-out */}
          <div className="card-accent p-5">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors",
                  franja ? "border-gold bg-gold text-gold-foreground" : "border-gold/40 text-gold"
                )}
              >
                <Moon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h4 className="font-serif text-lg font-medium leading-snug">
                  {t("as.special.lateCheckout.name")}
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t("as.special.lateCheckout.desc")}
                </p>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {FRANJAS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => elegirFranja(f.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.7rem] font-medium transition-colors",
                        franja === f.id
                          ? "border-gold bg-gold text-gold-foreground"
                          : "border-border hover:border-gold/50"
                      )}
                    >
                      <Clock className="h-3 w-3" /> {t(f.labelKey)}
                    </button>
                  ))}
                </div>
                {franja && (
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2">
                    <span className="text-[0.68rem] uppercase tracking-[0.1em] text-muted-foreground">
                      {t("as.special.lateCheckout.estimated")}
                    </span>
                    <span className="font-serif text-base font-medium text-primary">
                      {formatear(montoFranjaActiva)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-border pt-6">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
            {t("as.totalExtra")}
          </p>
          <motion.p
            key={totalExtra}
            initial={{ opacity: 0.4, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="font-serif text-2xl font-medium text-primary"
          >
            {formatear(totalExtra)}
          </motion.p>
        </div>
        <Button
          size="lg"
          variant="gold"
          onClick={onContinue}
          className="gap-2 w-full sm:w-auto"
        >
          {t("as.continue")} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
