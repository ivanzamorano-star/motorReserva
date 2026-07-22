import {
  CalendarCheck2,
  BedDouble,
  Wallet,
  Globe2,
  LogIn,
  LogOut,
  AlertTriangle,
  PackageX,
  MailX,
  CheckCircle2,
  Gift,
} from "lucide-react";
import { reservationRepository } from "@/data/repository";
import { formatCLP, formatDate } from "@/lib/utils";
import { KpiCard } from "@/components/admin/kpi-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ESTADO_LABEL, ESTADO_BADGE_VARIANT, CANAL_LABEL } from "@/lib/reserva-utils";
import { PUBLICO_LABEL, PUBLICO_BADGE_VARIANT } from "@/lib/paquete-utils";

const HOY = "2026-07-17";

function iniciales(nombre?: string) {
  if (!nombre) return "?";
  return nombre.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

export default async function AdminDashboardPage() {
  const [kpis, reservas, tipos, paquetes, campanias] = await Promise.all([
    reservationRepository.getKpis(),
    reservationRepository.listarReservas(),
    reservationRepository.listarTiposHabitacion(),
    reservationRepository.listarPaquetes(),
    reservationRepository.listarCampaniasEmail(),
  ]);

  const recientes = [...reservas].sort((a, b) => (a.creadaEn < b.creadaEn ? 1 : -1)).slice(0, 6);

  const llegadasHoy = reservas.filter(
    (r) => r.checkIn === HOY && (r.estado === "confirmada" || r.estado === "pendiente_pago")
  );
  const salidasHoy = reservas.filter((r) => r.checkOut === HOY && r.estado === "confirmada");

  const pagosPendientes = reservas.filter((r) => r.estado === "pendiente_pago");
  const noShows = reservas.filter((r) => r.estado === "no_show");
  const paquetesInactivos = paquetes.filter((p) => !p.activo);
  const campaniasInactivas = campanias.filter((c) => !c.activa);
  const totalAcciones = pagosPendientes.length + noShows.length + paquetesInactivos.length + campaniasInactivas.length;

  const ocupacionPorTipo = tipos.map((tipo) => {
    const ocupadas = reservas.filter(
      (r) => r.tipoHabitacionId === tipo.id && r.estado === "confirmada" && r.checkIn <= HOY && r.checkOut > HOY
    ).length;
    return {
      tipo,
      ocupadas,
      pct: tipo.cantidadUnidades ? Math.round((ocupadas / tipo.cantidadUnidades) * 100) : 0,
    };
  });

  const paquetesDestacados = [...paquetes].sort((a, b) => b.vecesVendido - a.vecesVendido).slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-5">
        <span className="eyebrow text-[0.62rem]">Panel del hotel</span>
        <h1 className="mt-2.5 font-serif text-3xl font-light tracking-[-0.01em]">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Resumen operativo de Hotel Cabo Froward — {formatDate(HOY)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Llegadas hoy" value={String(llegadasHoy.length)} icon={CalendarCheck2} accent="default" />
        <KpiCard label="Ocupación" value={`${kpis.ocupacionPorcentaje}%`} icon={BedDouble} accent="gold" />
        <KpiCard label="Ingresos del mes" value={formatCLP(kpis.ingresosMes)} icon={Wallet} accent="success" />
        <KpiCard
          label="Reservas directas"
          value={`${kpis.reservasDirectasPorcentaje}%`}
          icon={Globe2}
          trend="vs. canales OTA"
          accent="default"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Llegadas y salidas de hoy</CardTitle>
          <CardDescription>{formatDate(HOY)}</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-6 pt-0">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <LogIn className="h-3.5 w-3.5 text-success" />
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Llegadas ({llegadasHoy.length})
              </p>
            </div>
            {llegadasHoy.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin llegadas programadas para hoy.</p>
            ) : (
              <div className="space-y-3">
                {llegadasHoy.map((r) => (
                  <div key={r.id} className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="text-[10px]">{iniciales(r.huesped?.nombre)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{r.huesped?.nombre ?? "Huésped demo"}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {r.habitacion?.nombre} · {r.huespedes} huésped{r.huespedes > 1 ? "es" : ""}
                      </p>
                    </div>
                    <Badge variant={ESTADO_BADGE_VARIANT[r.estado]} className="shrink-0 text-[10px]">
                      {ESTADO_LABEL[r.estado]}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <LogOut className="h-3.5 w-3.5 text-gold" />
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Salidas ({salidasHoy.length})
              </p>
            </div>
            {salidasHoy.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin salidas programadas para hoy.</p>
            ) : (
              <div className="space-y-3">
                {salidasHoy.map((r) => (
                  <div key={r.id} className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="text-[10px]">{iniciales(r.huesped?.nombre)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{r.huesped?.nombre ?? "Huésped demo"}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.habitacion?.nombre}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-[10px]">
                      Check-out
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-gold" /> Acciones pendientes
          </CardTitle>
          <CardDescription>Cosas que valen la pena revisar hoy.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {totalAcciones === 0 ? (
            <p className="flex items-center gap-2 text-sm text-success font-medium">
              <CheckCircle2 className="h-4 w-4" /> Todo al día — sin acciones pendientes.
            </p>
          ) : (
            <div className="space-y-2.5">
              {pagosPendientes.map((r) => (
                <a
                  key={r.id}
                  href="/admin/reservas"
                  className="flex items-center gap-3 rounded-md border border-border p-2.5 hover:bg-secondary/50 transition-colors"
                >
                  <AlertTriangle className="h-4 w-4 text-gold shrink-0" />
                  <p className="text-sm flex-1 min-w-0 truncate">
                    Pago pendiente — <span className="font-mono text-xs">{r.codigo}</span> ·{" "}
                    {r.huesped?.nombre ?? "Huésped demo"}
                  </p>
                  <Badge variant="gold" className="shrink-0 text-[10px]">
                    {formatCLP(r.montoTotal)}
                  </Badge>
                </a>
              ))}
              {noShows.map((r) => (
                <a
                  key={r.id}
                  href="/admin/reservas"
                  className="flex items-center gap-3 rounded-md border border-border p-2.5 hover:bg-secondary/50 transition-colors"
                >
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                  <p className="text-sm flex-1 min-w-0 truncate">
                    No-show sin resolver — <span className="font-mono text-xs">{r.codigo}</span> ·{" "}
                    {r.huesped?.nombre ?? "Huésped demo"}
                  </p>
                  <Badge variant="destructive" className="shrink-0 text-[10px]">
                    Revisar
                  </Badge>
                </a>
              ))}
              {paquetesInactivos.map((p) => (
                <a
                  key={p.id}
                  href="/admin/paquetes"
                  className="flex items-center gap-3 rounded-md border border-border p-2.5 hover:bg-secondary/50 transition-colors"
                >
                  <PackageX className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-sm flex-1 min-w-0 truncate">Paquete promocional inactivo — {p.nombre}</p>
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    Activar
                  </Badge>
                </a>
              ))}
              {campaniasInactivas.map((c) => (
                <a
                  key={c.id}
                  href="/admin/marketing"
                  className="flex items-center gap-3 rounded-md border border-border p-2.5 hover:bg-secondary/50 transition-colors"
                >
                  <MailX className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-sm flex-1 min-w-0 truncate">Campaña de fidelización inactiva — {c.nombre}</p>
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    Activar
                  </Badge>
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ocupación por tipo de habitación</CardTitle>
            <CardDescription>Unidades ocupadas hoy sobre el total disponible.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {ocupacionPorTipo.map(({ tipo, ocupadas, pct }) => (
              <div key={tipo.id}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium truncate pr-2">{tipo.nombre}</span>
                  <span className="text-muted-foreground shrink-0">
                    {ocupadas}/{tipo.cantidadUnidades}
                  </span>
                </div>
                <Progress value={pct} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Gift className="h-4 w-4 text-gold" /> Paquetes promocionales
              </CardTitle>
              <CardDescription>Rendimiento por veces vendido.</CardDescription>
            </div>
            <a href="/admin/paquetes" className="text-xs font-medium text-primary hover:underline shrink-0">
              Ver todos
            </a>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {paquetesDestacados.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{p.nombre}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge variant={PUBLICO_BADGE_VARIANT[p.publico]} className="text-[10px]">
                      {PUBLICO_LABEL[p.publico]}
                    </Badge>
                    {!p.activo && (
                      <Badge variant="outline" className="text-[10px]">
                        Inactivo
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">{p.vecesVendido} vendidos</p>
                  <p className="text-xs text-muted-foreground">{formatCLP(p.vecesVendido * p.precioPaquete)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Reservas recientes</CardTitle>
          <a href="/admin/reservas" className="text-xs font-medium text-primary hover:underline">
            Ver todas
          </a>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Huésped</TableHead>
                <TableHead>Habitación</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recientes.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.codigo}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px]">{iniciales(r.huesped?.nombre)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{r.huesped?.nombre ?? "Huésped demo"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.habitacion?.nombre}</TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(r.checkIn)} → {formatDate(r.checkOut)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{CANAL_LABEL[r.canalOrigen]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ESTADO_BADGE_VARIANT[r.estado]}>{ESTADO_LABEL[r.estado]}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCLP(r.montoTotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
