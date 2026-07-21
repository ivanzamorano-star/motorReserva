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
  Moon,
  Sunrise,
  Check,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMoneda } from "@/lib/moneda";
import { useIdioma } from "@/lib/idioma";

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
  {
    id: "late-checkout",
    nombre: "Late check-out (hasta 14:00)",
    descripcion: "Disfruta la mañana sin apuros y sal más tarde.",
    precio: 15000,
    icon: Moon,
  },
  {
    id: "early-checkin",
    nombre: "Early check-in (desde 10:00)",
    descripcion: "Entra antes a tu habitación tras un viaje largo.",
    precio: 12000,
    icon: Sunrise,
  },
];

export function AdditionalServices({
  onChange,
  onContinue,
}: {
  onChange?: (total: number, servicios: ServicioExtra[]) => void;
  onContinue: () => void;
}) {
  const { formatear } = useMoneda();
  const { t } = useIdioma();
  const [seleccionados, setSeleccionados] = React.useState<Set<string>>(
    new Set()
  );

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

  return (
    <div className="space-y-6">
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
