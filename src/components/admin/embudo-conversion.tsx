import { cn } from "@/lib/utils";

// C1 — Embudo de conversión: visitas → búsquedas → checkout → reserva.
// Barras proporcionales al total superior, con la conversión/abandono entre etapas.
// Server-compatible (sin estado): datos mock realistas se pasan desde la página.
export function EmbudoConversion({
  etapas,
}: {
  etapas: { etapa: string; valor: number }[];
}) {
  const top = etapas[0]?.valor ?? 1;
  const tonos = ["bg-primary", "bg-primary/75", "bg-gold", "bg-success"];

  return (
    <div className="space-y-4">
      {etapas.map((e, i) => {
        const pct = Math.round((e.valor / top) * 100);
        const conv = i === 0 ? null : Math.round((e.valor / etapas[i - 1].valor) * 100);
        return (
          <div key={e.etapa}>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className="font-medium">{e.etapa}</span>
              <span className="tabular-nums text-muted-foreground">
                {e.valor.toLocaleString("es-CL")}
                <span className="ml-1.5 text-xs">· {pct}%</span>
              </span>
            </div>
            <div className="h-8 w-full overflow-hidden rounded-lg bg-secondary/60">
              <div
                className={cn("h-full rounded-lg", tonos[i % tonos.length])}
                style={{ width: `${pct}%` }}
              />
            </div>
            {conv !== null && (
              <p className="mt-1 text-xs text-muted-foreground">
                {conv}% avanza desde «{etapas[i - 1].etapa}» · {100 - conv}% abandona
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
