"use client";

import * as React from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useIdioma, type Idioma } from "@/lib/idioma";
import { useMoneda, type Moneda } from "@/lib/moneda";
import { cn } from "@/lib/utils";

const IDIOMAS: { id: Idioma; label: string }[] = [
  { id: "es", label: "Español" },
  { id: "en", label: "English" },
];

const MONEDAS: { id: Moneda; label: string }[] = [
  { id: "CLP", label: "Peso chileno (CLP)" },
  { id: "USD", label: "Dólar (USD)" },
];

// Control unificado de idioma + moneda: un solo botón sobrio con menú desplegable.
export function PreferenciasSwitch() {
  const { idioma, setIdioma } = useIdioma();
  const { moneda, setMoneda } = useMoneda();
  const [abierto, setAbierto] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!abierto) return;
    const cerrar = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener("mousedown", cerrar);
    return () => document.removeEventListener("mousedown", cerrar);
  }, [abierto]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setAbierto((o) => !o)}
        aria-label="Idioma y moneda"
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-border px-2 sm:px-3 h-8 sm:h-9 text-[11px] sm:text-xs font-medium text-foreground/80 transition-colors hover:border-gold/50 hover:text-foreground",
          abierto && "border-gold/50 text-foreground"
        )}
      >
        <Globe className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
        <span className="uppercase">{idioma}</span>
        <span className="text-muted-foreground hidden sm:inline">·</span>
        <span className="hidden sm:inline">{moneda}</span>
        <ChevronDown
          className={cn("h-3 w-3 text-muted-foreground transition-transform shrink-0", abierto && "rotate-180")}
        />
      </button>

      {abierto && (
        <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-xl border border-border bg-popover p-1.5 shadow-xl">
          <p className="px-2 pt-1.5 pb-1 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Idioma / Language
          </p>
          {IDIOMAS.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => setIdioma(i.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent",
                idioma === i.id ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {i.label}
              {idioma === i.id && <Check className="h-3.5 w-3.5 text-gold" />}
            </button>
          ))}

          <div className="my-1 h-px bg-border" />

          <p className="px-2 pt-1.5 pb-1 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Moneda / Currency
          </p>
          {MONEDAS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMoneda(m.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent",
                moneda === m.id ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {m.label}
              {moneda === m.id && <Check className="h-3.5 w-3.5 text-gold" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
