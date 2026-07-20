"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  Eye,
  StickyNote,
  Mail,
  XCircle,
  Globe,
  Building2,
  Phone,
  X,
  User,
  MapPin,
  BedDouble,
  CalendarRange,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCLP, formatDate, nightsBetween, cn } from "@/lib/utils";
import { ESTADO_LABEL, ESTADO_BADGE_VARIANT, CANAL_LABEL } from "@/lib/reserva-utils";
import type {
  Reserva,
  Huesped,
  TipoHabitacion,
  CanalOrigen,
  EstadoReserva,
} from "@/domain/types";

type ReservaFila = Reserva & { huesped?: Huesped; habitacion?: TipoHabitacion };

// "Hoy" de la demo (coincide con la fecha operativa del panel).
const HOY = "2026-07-17";

type FiltroRapido = "todas" | "hoy" | "canceladas";

const FILTROS: { id: FiltroRapido; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "hoy", label: "Llegadas de hoy" },
  { id: "canceladas", label: "Canceladas" },
];

const CANAL_ICON: Record<CanalOrigen, LucideIcon> = {
  directo: Globe,
  booking: Building2,
  expedia: Building2,
  telefono: Phone,
};

const ESTADOS_CANCELADOS: EstadoReserva[] = ["cancelada_huesped", "cancelada_hotel"];

/* ------------------------------------------------------------------ */
/* Menú de opciones por fila — dropdown propio (sin dependencias).      */
/* Se renderiza en un portal con posición fija para que no lo recorte   */
/* el `overflow-auto` del contenedor de la tabla.                       */
/* ------------------------------------------------------------------ */

function MenuItem({
  icon: Icon,
  children,
  onClick,
  danger,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
        danger
          ? "text-destructive hover:bg-destructive/10"
          : "text-foreground hover:bg-accent"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      {children}
    </button>
  );
}

function RowActionsMenu({
  reserva,
  onCancelar,
  onVerDetalles,
}: {
  reserva: ReservaFila;
  onCancelar: (id: string) => void;
  onVerDetalles: (reserva: ReservaFila) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState<{ top: number; right: number } | null>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  function toggle() {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 6, right: window.innerWidth - r.right });
    }
    setOpen((o) => !o);
  }

  React.useEffect(() => {
    if (!open) return;
    const cerrar = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const cerrarPorMovimiento = () => setOpen(false);
    document.addEventListener("mousedown", cerrar);
    window.addEventListener("resize", cerrarPorMovimiento);
    window.addEventListener("scroll", cerrarPorMovimiento, true);
    return () => {
      document.removeEventListener("mousedown", cerrar);
      window.removeEventListener("resize", cerrarPorMovimiento);
      window.removeEventListener("scroll", cerrarPorMovimiento, true);
    };
  }, [open]);

  const cerrarLuego = (fn?: () => void) => () => {
    fn?.();
    setOpen(false);
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label="Opciones de la reserva"
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-foreground",
          open && "border-border bg-accent text-foreground"
        )}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open &&
        pos &&
        createPortal(
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.97, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 60 }}
            className="w-56 rounded-lg border border-border bg-popover p-1 shadow-xl"
          >
            <MenuItem icon={Eye} onClick={cerrarLuego(() => onVerDetalles(reserva))}>
              Ver detalles
            </MenuItem>
            <MenuItem icon={StickyNote} onClick={cerrarLuego()}>
              Añadir nota / requerimiento
            </MenuItem>
            <MenuItem icon={Mail} onClick={cerrarLuego()}>
              Reenviar correo
            </MenuItem>
            <div className="my-1 h-px bg-border" />
            <MenuItem
              icon={XCircle}
              danger
              onClick={cerrarLuego(() => onCancelar(reserva.id))}
            >
              Cancelar reserva
            </MenuItem>
          </motion.div>,
          document.body
        )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Panel de detalle de la reserva (slide-over) — misma estética que el  */
/* resto del panel: navy + dorado, tipografía Fraunces, bordes sutiles.  */
/* ------------------------------------------------------------------ */

function DatoDetalle({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
        <Icon className="h-4 w-4" strokeWidth={1.6} />
      </div>
      <div className="min-w-0">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
        <div className="mt-0.5 text-sm text-foreground break-words">{value}</div>
      </div>
    </div>
  );
}

function ReservaDetalle({
  reserva,
  onClose,
}: {
  reserva: ReservaFila | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {reserva && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-[2px]"
          />
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-border p-6">
              <div>
                <span className="eyebrow text-[0.62rem] after:hidden">
                  Detalle de reserva
                </span>
                <h2 className="mt-2 font-serif text-xl font-medium">
                  {reserva.habitacion?.nombre ?? "Reserva"}
                </h2>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  {reserva.codigo}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-gold mb-3">
                  Huésped
                </p>
                <div className="space-y-4">
                  <DatoDetalle
                    icon={User}
                    label="Nombre"
                    value={reserva.huesped?.nombre ?? "Huésped demo"}
                  />
                  <DatoDetalle
                    icon={Mail}
                    label="Correo"
                    value={reserva.huesped?.email ?? "—"}
                  />
                  <DatoDetalle
                    icon={Phone}
                    label="Teléfono"
                    value={reserva.huesped?.telefono ?? "—"}
                  />
                  <DatoDetalle
                    icon={MapPin}
                    label="País"
                    value={reserva.huesped?.pais ?? "—"}
                  />
                </div>
              </div>

              <div className="h-px bg-border" />

              <div>
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-gold mb-3">
                  Estadía
                </p>
                <div className="space-y-4">
                  <DatoDetalle
                    icon={BedDouble}
                    label="Habitación"
                    value={reserva.habitacion?.nombre ?? "—"}
                  />
                  <DatoDetalle
                    icon={CalendarRange}
                    label="Fechas"
                    value={
                      <>
                        {formatDate(reserva.checkIn)} → {formatDate(reserva.checkOut)}
                        <span className="text-muted-foreground">
                          {" "}
                          · {nightsBetween(reserva.checkIn, reserva.checkOut)}{" "}
                          {nightsBetween(reserva.checkIn, reserva.checkOut) === 1
                            ? "noche"
                            : "noches"}
                        </span>
                      </>
                    }
                  />
                  <DatoDetalle
                    icon={Users}
                    label="Huéspedes"
                    value={`${reserva.huespedes}`}
                  />
                  <DatoDetalle
                    icon={CANAL_ICON[reserva.canalOrigen]}
                    label="Canal de origen"
                    value={CANAL_LABEL[reserva.canalOrigen]}
                  />
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                      <Eye className="h-4 w-4" strokeWidth={1.6} />
                    </div>
                    <div>
                      <p className="text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                        Estado
                      </p>
                      <Badge
                        variant={ESTADO_BADGE_VARIANT[reserva.estado]}
                        className="mt-1"
                      >
                        {ESTADO_LABEL[reserva.estado]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border p-6">
              <div className="flex items-baseline justify-between rounded-lg bg-secondary/60 px-4 py-3">
                <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  Monto total
                </span>
                <span className="font-serif text-xl font-medium text-primary">
                  {formatCLP(reserva.montoTotal)}
                </span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */

export function ReservasTable({ reservas }: { reservas: ReservaFila[] }) {
  const [filas, setFilas] = React.useState<ReservaFila[]>(reservas);
  const [filtro, setFiltro] = React.useState<FiltroRapido>("todas");
  const [busqueda, setBusqueda] = React.useState("");
  const [detalle, setDetalle] = React.useState<ReservaFila | null>(null);

  function cancelarReserva(id: string) {
    setFilas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: "cancelada_hotel" } : r))
    );
    setDetalle((d) =>
      d && d.id === id ? { ...d, estado: "cancelada_hotel" } : d
    );
  }

  const filtradas = filas.filter((r) => {
    const matchFiltro =
      filtro === "todas" ||
      (filtro === "hoy" && r.checkIn === HOY) ||
      (filtro === "canceladas" && ESTADOS_CANCELADOS.includes(r.estado));

    const q = busqueda.trim().toLowerCase();
    const matchBusqueda =
      !q ||
      r.codigo.toLowerCase().includes(q) ||
      (r.huesped?.nombre.toLowerCase().includes(q) ?? false);

    return matchFiltro && matchBusqueda;
  });

  return (
    <>
    <Card>
      <CardContent className="p-5 space-y-4">
        {/* Cabecera de herramientas: filtros rápidos + búsqueda */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/40 p-1 w-fit">
            {FILTROS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFiltro(f.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                  filtro === f.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar por código o huésped..."
              className="pl-9 h-9"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Huésped</TableHead>
              <TableHead>Habitación</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead className="text-center">Huéspedes</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="w-12 text-right">Opciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtradas.map((r) => {
              const CanalIcon = CANAL_ICON[r.canalOrigen];
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.codigo}</TableCell>
                  <TableCell className="text-sm font-medium">
                    {r.huesped?.nombre ?? "Huésped demo"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {r.habitacion?.nombre}
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(r.checkIn)}</TableCell>
                  <TableCell className="text-sm">{formatDate(r.checkOut)}</TableCell>
                  <TableCell className="text-sm text-center">{r.huespedes}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <CanalIcon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />
                      {CANAL_LABEL[r.canalOrigen]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ESTADO_BADGE_VARIANT[r.estado]}>
                      {ESTADO_LABEL[r.estado]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCLP(r.montoTotal)}
                  </TableCell>
                  <TableCell className="text-right">
                    <RowActionsMenu
                      reserva={r}
                      onCancelar={cancelarReserva}
                      onVerDetalles={setDetalle}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {filtradas.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-sm text-muted-foreground py-10">
                  No se encontraron reservas con estos filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <ReservaDetalle reserva={detalle} onClose={() => setDetalle(null)} />
    </>
  );
}
