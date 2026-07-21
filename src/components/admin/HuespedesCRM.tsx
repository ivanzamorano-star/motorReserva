"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Crown,
  Repeat,
  Sparkles,
  X,
  Plus,
  Cake,
  Globe,
  CalendarPlus,
  BedDouble,
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
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCLP, formatDate, cn } from "@/lib/utils";
import { NIVEL_DESCUENTO } from "@/lib/pricing";

type NivelCliente = "nuevo" | "frecuente" | "vip";

interface EstadiaHistorial {
  codigo: string;
  habitacion: string;
  checkIn: string;
  checkOut: string;
  noches: number;
  monto: number;
}

interface HuespedCRM {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  nacionalidad: string;
  cumpleanos: string;
  nivel: NivelCliente;
  estadiasTotales: number;
  nochesTotales: number;
  ultimaVisita: string;
  preferencias: string[];
  historial: EstadiaHistorial[];
}

const NIVEL: Record<
  NivelCliente,
  { label: string; icon: LucideIcon; variant: NonNullable<BadgeProps["variant"]>; className?: string }
> = {
  nuevo: { label: "Nuevo", icon: Sparkles, variant: "secondary" },
  frecuente: { label: "Frecuente", icon: Repeat, variant: "gold" },
  vip: {
    label: "VIP",
    icon: Crown,
    variant: "gold",
    className: "border border-gold/50 bg-gold/20",
  },
};

const INICIALES = (n: string) =>
  n.split(" ").map((p) => p[0]).slice(0, 2).join("");

// ------- Datos de prueba CRM (realistas) -------
const HUESPEDES_CRM: HuespedCRM[] = [
  {
    id: "hu-1",
    nombre: "Marcela Ortúzar",
    email: "marcela.ortuzar@example.com",
    telefono: "+56 9 8123 4455",
    nacionalidad: "Chile",
    cumpleanos: "14 de marzo",
    nivel: "vip",
    estadiasTotales: 4,
    nochesTotales: 11,
    ultimaVisita: "2026-06-28",
    preferencias: [
      "No molestar por las mañanas",
      "Prefiere piso alto",
      "Champán de bienvenida",
    ],
    historial: [
      { codigo: "HP-2606-118", habitacion: "Suite Estrecho de Magallanes", checkIn: "2026-06-25", checkOut: "2026-06-28", noches: 3, monto: 294000 },
      { codigo: "HP-2603-077", habitacion: "Habitación Superior", checkIn: "2026-03-12", checkOut: "2026-03-15", noches: 3, monto: 204000 },
      { codigo: "HP-2512-041", habitacion: "Suite Estrecho de Magallanes", checkIn: "2025-12-20", checkOut: "2025-12-23", noches: 3, monto: 396000 },
      { codigo: "HP-2509-012", habitacion: "Habitación Superior", checkIn: "2025-09-05", checkOut: "2025-09-07", noches: 2, monto: 136000 },
    ],
  },
  {
    id: "hu-2",
    nombre: "James Whitfield",
    email: "j.whitfield@example.com",
    telefono: "+1 415 555 0142",
    nacionalidad: "Estados Unidos",
    cumpleanos: "2 de septiembre",
    nivel: "frecuente",
    estadiasTotales: 3,
    nochesTotales: 8,
    ultimaVisita: "2026-05-19",
    preferencias: ["Alérgico al gluten", "Late check-out"],
    historial: [
      { codigo: "HP-2605-093", habitacion: "Suite Estrecho de Magallanes", checkIn: "2026-05-16", checkOut: "2026-05-19", noches: 3, monto: 294000 },
      { codigo: "HP-2601-054", habitacion: "Habitación Superior", checkIn: "2026-01-10", checkOut: "2026-01-13", noches: 3, monto: 204000 },
      { codigo: "HP-2510-028", habitacion: "Habitación Estándar", checkIn: "2025-10-02", checkOut: "2025-10-04", noches: 2, monto: 104000 },
    ],
  },
  {
    id: "hu-4",
    nombre: "Hans Müller",
    email: "hans.muller@example.com",
    telefono: "+49 151 2345 6789",
    nacionalidad: "Alemania",
    cumpleanos: "27 de junio",
    nivel: "frecuente",
    estadiasTotales: 3,
    nochesTotales: 7,
    ultimaVisita: "2026-04-11",
    preferencias: ["Prefiere piso alto", "Vista a la Plaza de Armas"],
    historial: [
      { codigo: "HP-2604-081", habitacion: "Habitación Superior", checkIn: "2026-04-08", checkOut: "2026-04-11", noches: 3, monto: 204000 },
      { codigo: "HP-2511-036", habitacion: "Habitación Superior", checkIn: "2025-11-14", checkOut: "2025-11-16", noches: 2, monto: 136000 },
      { codigo: "HP-2508-019", habitacion: "Habitación Estándar", checkIn: "2025-08-20", checkOut: "2025-08-22", noches: 2, monto: 104000 },
    ],
  },
  {
    id: "hu-3",
    nombre: "Laura Fernández",
    email: "laura.fernandez@example.com",
    telefono: "+54 9 11 4455 8899",
    nacionalidad: "Argentina",
    cumpleanos: "9 de enero",
    nivel: "frecuente",
    estadiasTotales: 2,
    nochesTotales: 5,
    ultimaVisita: "2026-02-14",
    preferencias: ["Cama extra dura"],
    historial: [
      { codigo: "HP-2602-065", habitacion: "Habitación Superior", checkIn: "2026-02-11", checkOut: "2026-02-14", noches: 3, monto: 204000 },
      { codigo: "HP-2507-014", habitacion: "Habitación Estándar", checkIn: "2025-07-01", checkOut: "2025-07-03", noches: 2, monto: 104000 },
    ],
  },
  {
    id: "hu-5",
    nombre: "Renata Silva",
    email: "renata.silva@example.com",
    telefono: "+55 21 99887 6655",
    nacionalidad: "Brasil",
    cumpleanos: "21 de noviembre",
    nivel: "nuevo",
    estadiasTotales: 1,
    nochesTotales: 2,
    ultimaVisita: "2026-07-16",
    preferencias: [],
    historial: [
      { codigo: "HP-2607-030", habitacion: "Habitación Superior", checkIn: "2026-07-14", checkOut: "2026-07-16", noches: 2, monto: 136000 },
    ],
  },
  {
    id: "hu-6",
    nombre: "Ignacio Pérez",
    email: "ignacio.perez@example.com",
    telefono: "+56 9 7766 5544",
    nacionalidad: "Chile",
    cumpleanos: "3 de mayo",
    nivel: "nuevo",
    estadiasTotales: 1,
    nochesTotales: 2,
    ultimaVisita: "2026-07-17",
    preferencias: ["Check-in temprano"],
    historial: [
      { codigo: "HP-2607-009", habitacion: "Habitación Estándar", checkIn: "2026-07-17", checkOut: "2026-07-19", noches: 2, monto: 104000 },
    ],
  },
];

type FiltroNivel = "todos" | NivelCliente;

const FILTROS: { id: FiltroNivel; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "vip", label: "VIP" },
  { id: "frecuente", label: "Frecuentes" },
  { id: "nuevo", label: "Nuevos" },
];

function NivelBadge({ nivel }: { nivel: NivelCliente }) {
  const cfg = NIVEL[nivel];
  const Icon = cfg.icon;
  return (
    <Badge variant={cfg.variant} className={cn("gap-1", cfg.className)}>
      <Icon className="h-3 w-3" /> {cfg.label}
    </Badge>
  );
}

export function HuespedesCRM() {
  const [huespedes, setHuespedes] = React.useState<HuespedCRM[]>(HUESPEDES_CRM);
  const [filtro, setFiltro] = React.useState<FiltroNivel>("todos");
  const [busqueda, setBusqueda] = React.useState("");
  const [seleccionadoId, setSeleccionadoId] = React.useState<string | null>(null);
  const [nuevaPref, setNuevaPref] = React.useState("");

  const seleccionado = huespedes.find((h) => h.id === seleccionadoId) ?? null;

  function agregarPreferencia() {
    const tag = nuevaPref.trim();
    if (!tag || !seleccionado) return;
    setHuespedes((prev) =>
      prev.map((h) =>
        h.id === seleccionado.id && !h.preferencias.includes(tag)
          ? { ...h, preferencias: [...h.preferencias, tag] }
          : h
      )
    );
    setNuevaPref("");
  }

  function quitarPreferencia(tag: string) {
    if (!seleccionado) return;
    setHuespedes((prev) =>
      prev.map((h) =>
        h.id === seleccionado.id
          ? { ...h, preferencias: h.preferencias.filter((p) => p !== tag) }
          : h
      )
    );
  }

  // useMemo: el filtrado del directorio solo se recalcula cuando cambian los
  // datos, el nivel o la búsqueda — evita recorrer toda la lista en cada render.
  const filtrados = React.useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return huespedes.filter((h) => {
      const matchNivel = filtro === "todos" || h.nivel === filtro;
      const matchBusqueda =
        !q ||
        h.nombre.toLowerCase().includes(q) ||
        h.email.toLowerCase().includes(q);
      return matchNivel && matchBusqueda;
    });
  }, [huespedes, filtro, busqueda]);

  return (
    <>
      <Card>
        <CardContent className="p-5 space-y-4">
          {/* Toolbar */}
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
                placeholder="Buscar por nombre o correo..."
                className="pl-9 h-9"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Huésped</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead className="text-center">Estadías</TableHead>
                <TableHead>Última visita</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Preferencias</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map((h) => (
                <TableRow
                  key={h.id}
                  onClick={() => setSeleccionadoId(h.id)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-[10px]">
                          {INICIALES(h.nombre)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="leading-tight">
                        <p className="text-sm font-medium">{h.nombre}</p>
                        <p className="text-[0.68rem] text-muted-foreground">
                          {h.nacionalidad}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground">{h.email}</p>
                    <p className="text-[0.68rem] text-muted-foreground/80">
                      {h.telefono}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <p className="text-sm font-medium">{h.estadiasTotales}</p>
                    <p className="text-[0.68rem] text-muted-foreground">
                      {h.nochesTotales} noches
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(h.ultimaVisita)}
                  </TableCell>
                  <TableCell>
                    <NivelBadge nivel={h.nivel} />
                  </TableCell>
                  <TableCell>
                    {h.preferencias.length === 0 ? (
                      <span className="text-xs text-muted-foreground/60">—</span>
                    ) : (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {h.preferencias.slice(0, 2).map((p) => (
                          <span
                            key={p}
                            className="rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-[0.68rem] text-muted-foreground"
                          >
                            {p}
                          </span>
                        ))}
                        {h.preferencias.length > 2 && (
                          <span className="text-[0.68rem] text-gold">
                            +{h.preferencias.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-10">
                    No se encontraron huéspedes con estos filtros.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Panel de perfil del huésped */}
      <AnimatePresence>
        {seleccionado && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSeleccionadoId(null)}
              className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-[2px]"
            />
            <motion.aside
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col border-l border-border bg-card shadow-2xl"
            >
              {/* Encabezado */}
              <div className="flex items-start justify-between border-b border-border p-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-sm">
                      {INICIALES(seleccionado.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="eyebrow text-[0.62rem] after:hidden">
                      Perfil del huésped
                    </span>
                    <h2 className="mt-1 font-serif text-xl font-medium leading-tight">
                      {seleccionado.nombre}
                    </h2>
                    <div className="mt-1.5">
                      <NivelBadge nivel={seleccionado.nivel} />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSeleccionadoId(null)}
                  aria-label="Cerrar"
                  className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-7">
                {/* Beneficio activo en el motor de reservas */}
                {NIVEL_DESCUENTO[seleccionado.nivel] > 0 && (
                  <div className="flex items-center gap-3 rounded-lg border border-gold/40 bg-gold/[0.08] px-4 py-3">
                    <Crown className="h-4 w-4 shrink-0 text-gold" />
                    <p className="text-sm">
                      <span className="font-medium">Tarifa exclusiva activa:</span>{" "}
                      −{Math.round(NIVEL_DESCUENTO[seleccionado.nivel] * 100)}% automático al reservar directo con su correo.
                    </p>
                  </div>
                )}

                {/* Datos personales */}
                <section>
                  <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-gold mb-3">
                    Datos personales
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[0.62rem] uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-1">
                        <Globe className="h-3 w-3" /> Nacionalidad
                      </p>
                      <p className="mt-1 text-sm">{seleccionado.nacionalidad}</p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[0.62rem] uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-1">
                        <Cake className="h-3 w-3" /> Cumpleaños
                      </p>
                      <p className="mt-1 text-sm">{seleccionado.cumpleanos}</p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-[0.62rem] uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-1">
                        <BedDouble className="h-3 w-3" /> Estadías
                      </p>
                      <p className="mt-1 text-sm">
                        {seleccionado.estadiasTotales} · {seleccionado.nochesTotales} n
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-0.5 text-sm text-muted-foreground">
                    <p>{seleccionado.email}</p>
                    <p>{seleccionado.telefono}</p>
                  </div>
                </section>

                {/* Preferencias (etiquetas editables) */}
                <section>
                  <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-gold mb-3">
                    Preferencias y notas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {seleccionado.preferencias.length === 0 && (
                      <span className="text-sm text-muted-foreground/70">
                        Sin preferencias registradas todavía.
                      </span>
                    )}
                    {seleccionado.preferencias.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-foreground"
                      >
                        {p}
                        <button
                          type="button"
                          onClick={() => quitarPreferencia(p)}
                          aria-label={`Quitar ${p}`}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Input
                      value={nuevaPref}
                      onChange={(e) => setNuevaPref(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          agregarPreferencia();
                        }
                      }}
                      placeholder="Agregar preferencia (ej. Prefiere piso alto)…"
                      className="h-9"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 gap-1.5 shrink-0"
                      onClick={agregarPreferencia}
                    >
                      <Plus className="h-3.5 w-3.5" /> Añadir
                    </Button>
                  </div>
                </section>

                {/* Historial de reservas */}
                <section>
                  <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-gold mb-3">
                    Historial de reservas
                  </p>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-secondary/40 text-[0.62rem] uppercase tracking-[0.1em] text-muted-foreground">
                          <th className="px-3 py-2 text-left font-medium">Habitación</th>
                          <th className="px-3 py-2 text-left font-medium">Fechas</th>
                          <th className="px-3 py-2 text-right font-medium">Monto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seleccionado.historial.map((e) => (
                          <tr key={e.codigo} className="border-b border-border last:border-0">
                            <td className="px-3 py-2.5">
                              <p className="font-medium leading-tight">{e.habitacion}</p>
                              <p className="font-mono text-[0.62rem] text-muted-foreground">
                                {e.codigo}
                              </p>
                            </td>
                            <td className="px-3 py-2.5 text-xs text-muted-foreground">
                              {formatDate(e.checkIn)} → {formatDate(e.checkOut)}
                              <span className="block text-[0.62rem]">
                                {e.noches} {e.noches === 1 ? "noche" : "noches"}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-right font-medium">
                              {formatCLP(e.monto)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>

              {/* Acción principal */}
              <div className="border-t border-border p-6">
                <Button variant="gold" className="w-full gap-2">
                  <CalendarPlus className="h-4 w-4" /> Crear nueva reserva
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
