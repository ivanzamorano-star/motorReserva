"use client";

import { CreditCard, Building2, PiggyBank, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIdioma } from "@/lib/idioma";

// Métodos de pago flexibles (demo, no procesa cobros reales).
export type MetodoPago = "tarjeta" | "hotel" | "deposito";

const OPCIONES: {
  metodo: MetodoPago;
  tituloKey: string;
  descKey: string;
  icon: typeof CreditCard;
}[] = [
  { metodo: "tarjeta", tituloKey: "pm.card", descKey: "pm.card.desc", icon: CreditCard },
  { metodo: "hotel", tituloKey: "pm.hotel", descKey: "pm.hotel.desc", icon: Building2 },
  { metodo: "deposito", tituloKey: "pm.deposit", descKey: "pm.deposit.desc", icon: PiggyBank },
];

export function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: MetodoPago;
  onChange: (m: MetodoPago) => void;
}) {
  const { t } = useIdioma();
  return (
    <div className="space-y-3">
      <h3 className="font-serif text-lg font-medium">{t("pm.title")}</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {OPCIONES.map((op) => {
          const activo = value === op.metodo;
          const Icon = op.icon;
          return (
            <button
              key={op.metodo}
              type="button"
              onClick={() => onChange(op.metodo)}
              aria-pressed={activo}
              className={cn(
                "group relative rounded-xl border bg-card p-4 text-left transition-all duration-200",
                activo ? "border-gold ring-1 ring-gold bg-gold/[0.05]" : "border-border hover:border-gold/50"
              )}
            >
              <span
                className={cn(
                  "absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                  activo ? "border-gold bg-gold text-gold-foreground" : "border-border bg-background"
                )}
              >
                {activo && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border transition-colors",
                  activo ? "border-gold bg-gold text-gold-foreground" : "border-gold/40 text-gold"
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <p className="mt-3 font-serif text-base font-medium leading-tight">{t(op.tituloKey)}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t(op.descKey)}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
