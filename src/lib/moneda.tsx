"use client";

import * as React from "react";

// Multi-moneda para el flujo de reserva. El hotel opera en CLP; el huésped
// internacional puede ver los precios en USD. La tasa es referencial (demo);
// el día de mañana se conecta a un tipo de cambio real.
export type Moneda = "CLP" | "USD";
const TASA_USD = 950; // 1 USD ≈ 950 CLP (referencial)

interface MonedaCtx {
  moneda: Moneda;
  setMoneda: (m: Moneda) => void;
  formatear: (clp: number) => string;
}

const Ctx = React.createContext<MonedaCtx | null>(null);

export function MonedaProvider({ children }: { children: React.ReactNode }) {
  const [moneda, setMonedaState] = React.useState<Moneda>("CLP");

  React.useEffect(() => {
    const guardada = localStorage.getItem("moneda");
    if (guardada === "USD" || guardada === "CLP") setMonedaState(guardada);
  }, []);

  const setMoneda = React.useCallback((m: Moneda) => {
    setMonedaState(m);
    try {
      localStorage.setItem("moneda", m);
    } catch {
      /* sin storage */
    }
  }, []);

  const formatear = React.useCallback(
    (clp: number) => {
      if (moneda === "USD") {
        const usd = Math.round(clp / TASA_USD);
        return "US$" + usd.toLocaleString("en-US");
      }
      return "$" + Math.round(clp).toLocaleString("es-CL");
    },
    [moneda]
  );

  return <Ctx.Provider value={{ moneda, setMoneda, formatear }}>{children}</Ctx.Provider>;
}

export function useMoneda(): MonedaCtx {
  const ctx = React.useContext(Ctx);
  // Fallback seguro si se usa fuera del provider (ej. panel admin): siempre CLP.
  if (!ctx) {
    return {
      moneda: "CLP",
      setMoneda: () => {},
      formatear: (clp: number) => "$" + Math.round(clp).toLocaleString("es-CL"),
    };
  }
  return ctx;
}

// Componente de precio para usar dentro de Server Components.
export function Precio({ value, className }: { value: number; className?: string }) {
  const { formatear } = useMoneda();
  return <span className={className}>{formatear(value)}</span>;
}

// Selector de moneda para el header.
export function MonedaSwitch() {
  const { moneda, setMoneda } = useMoneda();
  return (
    <div className="inline-flex items-center rounded-full border border-border p-0.5 text-[0.68rem] font-medium">
      {(["CLP", "USD"] as Moneda[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => setMoneda(m)}
          className={
            "rounded-full px-2.5 py-1 transition-colors " +
            (moneda === m
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground")
          }
        >
          {m}
        </button>
      ))}
    </div>
  );
}
