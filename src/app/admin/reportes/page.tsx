import { reservationRepository } from "@/data/repository";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KpiCard } from "@/components/admin/kpi-card";
import { CanalChart } from "@/components/admin/canal-chart";
import { formatCLP } from "@/lib/utils";
import { CANAL_LABEL } from "@/lib/reserva-utils";
import { TrendingUp, PiggyBank, Percent } from "lucide-react";
import type { CanalOrigen } from "@/domain/types";

export default async function ReportesPage() {
  const reservas = await reservationRepository.listarReservas();
  const confirmadas = reservas.filter((r) => r.estado === "confirmada");

  const canales: CanalOrigen[] = ["directo", "booking", "expedia", "telefono"];
  const dataPorCanal = canales
    .map((canal) => ({
      canal: CANAL_LABEL[canal],
      ingresos: confirmadas.filter((r) => r.canalOrigen === canal).reduce((acc, r) => acc + r.montoTotal, 0),
    }))
    .filter((d) => d.ingresos > 0);

  const ingresosTotales = confirmadas.reduce((acc, r) => acc + r.montoTotal, 0);
  const ingresosDirectos = confirmadas
    .filter((r) => r.canalOrigen === "directo")
    .reduce((acc, r) => acc + r.montoTotal, 0);
  const comisionEvitada = Math.round(ingresosDirectos * 0.18);
  const ticketPromedio = confirmadas.length ? Math.round(ingresosTotales / confirmadas.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Reportes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Comparativa de ingresos por canal de venta y ahorro en comisiones OTA.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard label="Ingresos confirmados" value={formatCLP(ingresosTotales)} icon={PiggyBank} accent="success" />
        <KpiCard
          label="Comisión OTA evitada (est.)"
          value={formatCLP(comisionEvitada)}
          icon={TrendingUp}
          trend="18% sobre venta directa"
          accent="gold"
        />
        <KpiCard label="Ticket promedio" value={formatCLP(ticketPromedio)} icon={Percent} accent="default" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ingresos por canal</CardTitle>
          <CardDescription>Reservas confirmadas, mes en curso</CardDescription>
        </CardHeader>
        <CardContent>
          <CanalChart data={dataPorCanal} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Por qué importa la venta directa</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Cada reserva que llega por Booking o Expedia paga una comisión de referencia (típicamente 15-20%)
            que se descuenta del ingreso del hotel. Las reservas directas a través del motor de reservas propio
            no pagan esa comisión: el hotel retiene el margen completo.
          </p>
          <p>
            El motor de reservas no reemplaza estos canales — se sincroniza con ellos vía channel manager — pero
            captura la demanda de huéspedes que ya conocen o buscan directamente al hotel, mejorando el mix de
            ingresos sin perder visibilidad en los canales externos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
