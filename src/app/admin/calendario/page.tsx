import { reservationRepository } from "@/data/repository";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvailabilityGrid } from "@/components/admin/availability-grid";
import { cn } from "@/lib/utils";

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function CalendarioPage() {
  const [tipos, reservas] = await Promise.all([
    reservationRepository.listarTiposHabitacion(),
    reservationRepository.listarReservas(),
  ]);

  const activas = reservas.filter(
    (r) => !["cancelada_huesped", "cancelada_hotel", "expirada"].includes(r.estado)
  );

  const inicio = new Date("2026-07-15T00:00:00");
  const dias = Array.from({ length: 21 }, (_, i) => {
    const d = new Date(inicio);
    d.setDate(inicio.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Calendario de disponibilidad</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ocupación por habitación, día a día, para el mes en curso.
        </p>
      </div>

      <AvailabilityGrid />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen por tipo de habitación — vista de 21 días</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 overflow-x-auto">
          <div className="min-w-[900px] space-y-4">
            <div
              className="grid gap-1 text-[10px] text-muted-foreground"
              style={{ gridTemplateColumns: `160px repeat(${dias.length}, 1fr)` }}
            >
              <div />
              {dias.map((d) => (
                <div key={toISODate(d)} className="text-center">
                  <div className="uppercase">{d.toLocaleDateString("es-CL", { weekday: "short" })}</div>
                  <div className="font-medium text-foreground">{d.getDate()}</div>
                </div>
              ))}
            </div>

            {tipos.map((tipo) => (
              <div
                key={tipo.id}
                className="grid gap-1 items-center"
                style={{ gridTemplateColumns: `160px repeat(${dias.length}, 1fr)` }}
              >
                <div className="text-sm font-medium pr-3 truncate">{tipo.nombre}</div>
                {dias.map((d) => {
                  const iso = toISODate(d);
                  const ocupadas = activas.filter(
                    (r) =>
                      r.tipoHabitacionId === tipo.id &&
                      iso >= r.checkIn &&
                      iso < r.checkOut
                  ).length;
                  const ratio = ocupadas / tipo.cantidadUnidades;
                  return (
                    <div
                      key={iso}
                      title={`${ocupadas}/${tipo.cantidadUnidades} unidades ocupadas`}
                      className={cn(
                        "h-8 rounded-md flex items-center justify-center text-[10px] font-medium",
                        ratio === 0 && "bg-success/15 text-success",
                        ratio > 0 && ratio < 1 && "bg-gold/20 text-gold",
                        ratio >= 1 && "bg-destructive/15 text-destructive"
                      )}
                    >
                      {ocupadas}/{tipo.cantidadUnidades}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-success/40" /> Disponible
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-gold/40" /> Parcialmente ocupado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/40" /> Completo
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
