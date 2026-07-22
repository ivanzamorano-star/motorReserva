import { reservationRepository } from "@/data/repository";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KpiCard } from "@/components/admin/kpi-card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatCLP, formatDate } from "@/lib/utils";
import { Sunrise, Users, PiggyBank } from "lucide-react";
import { IncentivosRegistro, type SolicitudPanel } from "@/components/admin/incentivos-registro";

// "hoy" de la demo — mismo valor operativo usado en /admin/reservas.
const HOY = "2026-07-17";

export default async function IncentivosPage() {
  const [reservas, hotel] = await Promise.all([
    reservationRepository.listarReservas(),
    reservationRepository.getHotel(),
  ]);

  const [anioHoy, mesHoy] = HOY.split("-");
  const bonoPorUnidad = Math.round(hotel.precioIngresoPrioritario * hotel.incentivoIngresoPrioritarioPct);
  const esDelMes = (fecha: string) => fecha.slice(0, 4) === anioHoy && fecha.slice(5, 7) === mesHoy;

  const conteoMes: Record<string, number> = {};
  for (const m of hotel.mucamas) conteoMes[m.nombre] = 0;

  for (const r of reservas) {
    const asignada = r.solicitudEarlyCheckin?.mucamaAsignada;
    if (!asignada) continue;
    const fecha = r.solicitudEarlyCheckin?.solicitadaEn ?? "";
    if (esDelMes(fecha)) {
      conteoMes[asignada] = (conteoMes[asignada] ?? 0) + 1;
    }
  }

  // Resumen por mucama — solo informativo (para tener a la vista cuántos lleva
  // cada una este mes). No implica ningún orden de prioridad ni sugerencia del
  // sistema: la asignación siempre la decide una persona, manualmente, abajo.
  const filas = hotel.mucamas
    .map((m) => ({
      mucama: m.nombre,
      piso: m.pisoACargo,
      cantidad: conteoMes[m.nombre] ?? 0,
      bono: (conteoMes[m.nombre] ?? 0) * bonoPorUnidad,
    }))
    .sort((a, b) => a.cantidad - b.cantidad);

  const totalIngresosPrioritarios = filas.reduce((acc, f) => acc + f.cantidad, 0);
  const totalBonos = filas.reduce((acc, f) => acc + f.bono, 0);

  // Panel único: TODAS las solicitudes activas de Ingreso Prioritario —
  // recién solicitadas (pendientes de aprobación) y aprobadas sin mucama —
  // en una sola cola, con su acción correspondiente en la misma fila.
  const solicitudes: SolicitudPanel[] = reservas
    .filter(
      (r) =>
        r.solicitudEarlyCheckin?.estado === "pendiente_confirmacion" ||
        (r.solicitudEarlyCheckin?.estado === "aprobada" && !r.solicitudEarlyCheckin?.mucamaAsignada)
    )
    .map((r) => ({
      id: r.id,
      codigo: r.codigo,
      huesped: r.huesped?.nombre ?? r.huespedNombre ?? "Huésped directo",
      habitacion: r.habitacion?.nombre ?? "—",
      piso: r.habitacion?.piso,
      estado: r.solicitudEarlyCheckin?.estado === "aprobada" ? ("aprobada" as const) : ("pendiente" as const),
    }));

  // Bitácora histórica del mes: un registro por cada Ingreso Prioritario ya
  // asignado, con fecha, reserva, habitación, mucama y bono — es el respaldo
  // detallado para cuadrar cuentas con cada mucama a fin de mes (no solo el
  // total agregado de la tabla de resumen).
  const bitacora = reservas
    .filter((r) => r.solicitudEarlyCheckin?.mucamaAsignada && esDelMes(r.solicitudEarlyCheckin.solicitadaEn))
    .map((r) => ({
      id: r.id,
      fecha: r.solicitudEarlyCheckin!.solicitadaEn,
      codigo: r.codigo,
      habitacion: r.habitacion?.nombre ?? "—",
      mucama: r.solicitudEarlyCheckin!.mucamaAsignada!,
      bono: bonoPorUnidad,
    }))
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Administrador · Centro de control" title="Incentivos">
        Aprueba solicitudes y registra manualmente qué mucama preparó cada Ingreso Prioritario.
      </AdminPageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard label="Ingresos Prioritarios del mes" value={String(totalIngresosPrioritarios)} icon={Sunrise} accent="gold" />
        <KpiCard label="Mucamas participantes" value={String(hotel.mucamas.length)} icon={Users} accent="default" />
        <KpiCard label="Total bonos a pagar" value={formatCLP(totalBonos)} icon={PiggyBank} accent="success" />
      </div>

      <IncentivosRegistro solicitudes={solicitudes} mucamas={hotel.mucamas} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen Mensual por Mucama</CardTitle>
          <CardDescription>
            Bono por unidad: {formatCLP(bonoPorUnidad)} ({Math.round(hotel.incentivoIngresoPrioritarioPct * 100)}% de {formatCLP(hotel.precioIngresoPrioritario)}) · mes en curso. Vista de referencia — no es una asignación automática.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mucama</TableHead>
                <TableHead>Piso a cargo</TableHead>
                <TableHead className="text-center">Ingresos Prioritarios</TableHead>
                <TableHead className="text-right">Bono a pagar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filas.map((f) => (
                <TableRow key={f.mucama}>
                  <TableCell className="text-sm font-medium">{f.mucama}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {f.piso != null ? `Piso ${f.piso}` : "Flotante"}
                  </TableCell>
                  <TableCell className="text-sm text-center tabular-nums">{f.cantidad}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{formatCLP(f.bono)}</TableCell>
                </TableRow>
              ))}
              {filas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-10">
                    No hay mucamas registradas. Agrégalas en Configuración.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bitácora del Mes</CardTitle>
          <CardDescription>
            Registro detallado de cada Ingreso Prioritario asignado — el respaldo caso a caso para
            cuadrar cuentas con cada mucama a fin de mes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Reserva</TableHead>
                <TableHead>Habitación</TableHead>
                <TableHead>Mucama</TableHead>
                <TableHead className="text-right">Bono</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bitacora.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(b.fecha, { day: "2-digit", month: "short" })}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{b.codigo}</TableCell>
                  <TableCell className="text-sm">{b.habitacion}</TableCell>
                  <TableCell className="text-sm font-medium">{b.mucama}</TableCell>
                  <TableCell className="text-right text-sm tabular-nums">{formatCLP(b.bono)}</TableCell>
                </TableRow>
              ))}
              {bitacora.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-10">
                    Aún no hay Ingresos Prioritarios registrados este mes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
