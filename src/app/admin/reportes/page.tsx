import { reservationRepository } from "@/data/repository";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KpiCard } from "@/components/admin/kpi-card";
import { CanalChart } from "@/components/admin/canal-chart-lazy";
import { formatCLP } from "@/lib/utils";
import { CANAL_LABEL } from "@/lib/reserva-utils";
import { TrendingUp, PiggyBank, Percent, Filter, TrendingDown, Users } from "lucide-react";
import { EmbudoConversion } from "@/components/admin/embudo-conversion";
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

  // Embudo de conversión (datos mock realistas del canal directo, mes en curso).
  const EMBUDO = [
    { etapa: "Visitas al sitio", valor: 4200 },
    { etapa: "Búsquedas de disponibilidad", valor: 1850 },
    { etapa: "Checkout iniciado", valor: 520 },
    { etapa: "Reservas confirmadas", valor: 148 },
  ];
  const conversionGlobal = ((EMBUDO[3].valor / EMBUDO[0].valor) * 100).toFixed(1).replace(".", ",");
  const abandonoCheckout = Math.round(((EMBUDO[2].valor - EMBUDO[3].valor) / EMBUDO[2].valor) * 100);

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Análisis" title="Reportes">
        Comparativa de ingresos por canal de venta y ahorro en comisiones OTA.
      </AdminPageHeader>

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

      {/* Embudo de conversión */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard label="Conversión global" value={`${conversionGlobal}%`} icon={Filter} accent="gold" trend="visita → reserva" />
        <KpiCard label="Abandono en checkout" value={`${abandonoCheckout}%`} icon={TrendingDown} accent="default" />
        <KpiCard label="Reservas del período" value={String(EMBUDO[3].valor)} icon={Users} accent="success" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Embudo de conversión</CardTitle>
          <CardDescription>Del visitante a la reserva confirmada · canal directo, mes en curso</CardDescription>
        </CardHeader>
        <CardContent>
          <EmbudoConversion etapas={EMBUDO} />
          <p className="mt-5 text-sm text-muted-foreground">
            La mayor fuga ocurre en el checkout ({abandonoCheckout}% no completa el pago tras iniciarlo).
            Las automatizaciones de recuperación de reservas actúan justo sobre esa caída para reconvertir
            a los huéspedes que abandonaron con la reserva a medio terminar.
          </p>
        </CardContent>
      </Card>

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
