"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Plus,
  X,
  Percent,
  DollarSign,
  Zap,
  CalendarClock,
  Moon,
  Pause,
  Play,
  TrendingUp,
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
import { Label } from "@/components/ui/label";
import { formatCLP, formatDate, cn } from "@/lib/utils";

type EstadoCodigo = "activa" | "programada" | "expirada" | "pausada";
type TipoDescuento = "porcentaje" | "fijo";

interface CodigoPromo {
  id: string;
  codigo: string;
  campana: string;
  tipo: TipoDescuento;
  valor: number;
  vigenciaInicio: string;
  vigenciaFin: string;
  minNoches: number;
  topeUsos: number | null;
  estado: EstadoCodigo;
  usos: number;
  ingresos: number; // reservas generadas con el código (neto recibido)
  descuento: number; // total regalado en descuentos
}

const ESTADO_META: Record<EstadoCodigo, { label: string; variant: NonNullable<BadgeProps["variant"]> }> = {
  activa: { label: "Activa", variant: "success" },
  programada: { label: "Programada", variant: "gold" },
  expirada: { label: "Expirada", variant: "secondary" },
  pausada: { label: "Pausada", variant: "outline" },
};

const CODIGOS_MOCK: CodigoPromo[] = [
  {
    id: "p1",
    codigo: "BLACKFRIDAY25",
    campana: "Black Friday 2026",
    tipo: "porcentaje",
    valor: 25,
    vigenciaInicio: "2026-11-27",
    vigenciaFin: "2026-11-30",
    minNoches: 2,
    topeUsos: 50,
    estado: "expirada",
    usos: 34,
    ingresos: 4180000,
    descuento: 1240000,
  },
  {
    id: "p2",
    codigo: "VERANO2026",
    campana: "Temporada alta verano",
    tipo: "porcentaje",
    valor: 15,
    vigenciaInicio: "2026-12-01",
    vigenciaFin: "2027-02-28",
    minNoches: 3,
    topeUsos: null,
    estado: "activa",
    usos: 18,
    ingresos: 2340000,
    descuento: 410000,
  },
  {
    id: "p3",
    codigo: "VUELVE12",
    campana: "Reconquista de huéspedes",
    tipo: "porcentaje",
    valor: 12,
    vigenciaInicio: "2026-07-01",
    vigenciaFin: "2026-12-31",
    minNoches: 1,
    topeUsos: null,
    estado: "activa",
    usos: 7,
    ingresos: 890000,
    descuento: 121000,
  },
  {
    id: "p4",
    codigo: "LARGAESTADIA",
    campana: "Descuento larga estadía",
    tipo: "fijo",
    valor: 20000,
    vigenciaInicio: "2026-06-01",
    vigenciaFin: "2026-09-30",
    minNoches: 5,
    topeUsos: null,
    estado: "pausada",
    usos: 5,
    ingresos: 640000,
    descuento: 100000,
  },
  {
    id: "p5",
    codigo: "CYBERDAY20",
    campana: "Cyber Day",
    tipo: "porcentaje",
    valor: 20,
    vigenciaInicio: "2026-10-05",
    vigenciaFin: "2026-10-07",
    minNoches: 1,
    topeUsos: 40,
    estado: "programada",
    usos: 0,
    ingresos: 0,
    descuento: 0,
  },
];

// Presets de campaña flash: prellenan el formulario con reglas sensatas.
const PRESETS: {
  id: string;
  label: string;
  icon: LucideIconType;
  data: Partial<FormState>;
}[] = [
  { id: "bf", label: "Black Friday", icon: Zap, data: { campana: "Black Friday", tipo: "porcentaje", valor: "25", minNoches: "2", topeUsos: "50" } },
  { id: "cyber", label: "Cyber Day", icon: Zap, data: { campana: "Cyber Day", tipo: "porcentaje", valor: "20", minNoches: "1", topeUsos: "40" } },
  { id: "lastminute", label: "Última hora", icon: CalendarClock, data: { campana: "Oferta de última hora", tipo: "porcentaje", valor: "15", minNoches: "1", topeUsos: "" } },
  { id: "larga", label: "Larga estadía", icon: Moon, data: { campana: "Descuento larga estadía", tipo: "fijo", valor: "20000", minNoches: "5", topeUsos: "" } },
];

type LucideIconType = typeof Zap;

interface FormState {
  codigo: string;
  campana: string;
  tipo: TipoDescuento;
  valor: string;
  vigenciaInicio: string;
  vigenciaFin: string;
  minNoches: string;
  topeUsos: string;
}

const FORM_VACIO: FormState = {
  codigo: "",
  campana: "",
  tipo: "porcentaje",
  valor: "",
  vigenciaInicio: "2026-07-19",
  vigenciaFin: "2026-12-31",
  minNoches: "1",
  topeUsos: "",
};

function reglasResumen(c: CodigoPromo) {
  const desc = c.tipo === "porcentaje" ? `−${c.valor}%` : `−${formatCLP(c.valor)}`;
  const noches = c.minNoches > 1 ? ` · mín ${c.minNoches} noches` : "";
  return `${desc}${noches}`;
}

export function CodigosPromocionales() {
  const [codigos, setCodigos] = React.useState<CodigoPromo[]>(CODIGOS_MOCK);
  const [crear, setCrear] = React.useState(false);
  const [form, setForm] = React.useState<FormState>(FORM_VACIO);

  const ingresosTotales = codigos.reduce((a, c) => a + c.ingresos, 0);
  const canjesTotales = codigos.reduce((a, c) => a + c.usos, 0);
  const activos = codigos.filter((c) => c.estado === "activa").length;

  function togglePausa(id: string) {
    setCodigos((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, estado: c.estado === "activa" ? "pausada" : c.estado === "pausada" ? "activa" : c.estado }
          : c
      )
    );
  }

  function aplicarPreset(data: Partial<FormState>) {
    setForm((f) => ({ ...f, ...data }));
  }

  function crearCodigo() {
    if (!form.codigo.trim() || !form.valor) return;
    const nuevo: CodigoPromo = {
      id: `p-${Date.now()}`,
      codigo: form.codigo.trim().toUpperCase(),
      campana: form.campana.trim() || "Campaña sin nombre",
      tipo: form.tipo,
      valor: Number(form.valor),
      vigenciaInicio: form.vigenciaInicio,
      vigenciaFin: form.vigenciaFin,
      minNoches: Number(form.minNoches) || 1,
      topeUsos: form.topeUsos ? Number(form.topeUsos) : null,
      estado: "activa",
      usos: 0,
      ingresos: 0,
      descuento: 0,
    };
    setCodigos((prev) => [nuevo, ...prev]);
    setForm(FORM_VACIO);
    setCrear(false);
  }

  return (
    <div className="space-y-5">
      {/* Resumen ROI */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-gold/0 via-gold/70 to-gold/0" />
          <CardContent className="p-5">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Ingresos generados por códigos
            </p>
            <p className="mt-2 font-serif text-3xl font-light tracking-tight text-primary tabular-nums">
              {formatCLP(ingresosTotales)}
            </p>
            <p className="mt-1 text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> Reservas cerradas gracias a tus promociones
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Canjes totales
            </p>
            <p className="mt-2 font-serif text-3xl font-light tracking-tight text-primary tabular-nums">
              {canjesTotales}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Códigos activos
            </p>
            <p className="mt-2 font-serif text-3xl font-light tracking-tight text-primary tabular-nums">
              {activos} <span className="text-lg text-muted-foreground">/ {codigos.length}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de códigos con ROI */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Códigos promocionales
            </p>
            <Button variant="gold" size="sm" className="gap-1.5" onClick={() => setCrear(true)}>
              <Plus className="h-3.5 w-3.5" /> Crear código
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Reglas</TableHead>
                <TableHead>Vigencia</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Usos</TableHead>
                <TableHead className="text-right">Descuento otorgado</TableHead>
                <TableHead className="text-right">Ingresos generados</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codigos.map((c) => {
                const est = ESTADO_META[c.estado];
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <p className="font-mono text-sm font-medium">{c.codigo}</p>
                      <p className="text-[0.68rem] text-muted-foreground">{c.campana}</p>
                    </TableCell>
                    <TableCell className="text-sm">
                      {reglasResumen(c)}
                      {c.topeUsos ? (
                        <span className="text-muted-foreground"> · tope {c.topeUsos}</span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(c.vigenciaInicio)} — {formatDate(c.vigenciaFin)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={est.variant}>{est.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">{c.usos}</TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                      {c.descuento > 0 ? formatCLP(c.descuento) : "—"}
                    </TableCell>
                    <TableCell className="text-right font-serif text-base font-medium text-gold tabular-nums">
                      {c.ingresos > 0 ? formatCLP(c.ingresos) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {(c.estado === "activa" || c.estado === "pausada") && (
                        <button
                          type="button"
                          onClick={() => togglePausa(c.id)}
                          aria-label={c.estado === "activa" ? "Pausar" : "Activar"}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                          {c.estado === "activa" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Slide-over: crear código */}
      <AnimatePresence>
        {crear && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setCrear(false)}
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
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                    <Ticket className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <div>
                    <span className="eyebrow text-[0.62rem] after:hidden">Nueva promoción</span>
                    <h2 className="mt-1 font-serif text-xl font-medium leading-tight">Crear código</h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCrear(false)}
                  aria-label="Cerrar"
                  className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Presets flash */}
                <div>
                  <Label className="flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.14em] text-gold mb-2">
                    <Zap className="h-3.5 w-3.5" /> Campaña flash (opcional)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((p) => {
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => aplicarPreset(p.data)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium transition-colors hover:border-gold/50 hover:text-gold"
                        >
                          <Icon className="h-3.5 w-3.5" /> {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="codigo">Código</Label>
                    <Input
                      id="codigo"
                      value={form.codigo}
                      onChange={(e) => setForm({ ...form, codigo: e.target.value.toUpperCase() })}
                      placeholder="BLACKFRIDAY25"
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="campana">Campaña</Label>
                    <Input
                      id="campana"
                      value={form.campana}
                      onChange={(e) => setForm({ ...form, campana: e.target.value })}
                      placeholder="Black Friday 2026"
                    />
                  </div>
                </div>

                {/* Tipo y valor de descuento */}
                <div>
                  <Label className="mb-2 block">Descuento</Label>
                  <div className="flex gap-2">
                    <div className="inline-flex rounded-lg border border-border bg-secondary/40 p-1">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, tipo: "porcentaje" })}
                        className={cn(
                          "flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                          form.tipo === "porcentaje" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                        )}
                      >
                        <Percent className="h-3.5 w-3.5" /> %
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, tipo: "fijo" })}
                        className={cn(
                          "flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                          form.tipo === "fijo" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                        )}
                      >
                        <DollarSign className="h-3.5 w-3.5" /> Monto fijo
                      </button>
                    </div>
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        min={0}
                        value={form.valor}
                        onChange={(e) => setForm({ ...form, valor: e.target.value })}
                        placeholder={form.tipo === "porcentaje" ? "25" : "20000"}
                        className="pr-9"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {form.tipo === "porcentaje" ? "%" : "$"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reglas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="ini">Válido desde</Label>
                    <Input id="ini" type="date" value={form.vigenciaInicio} onChange={(e) => setForm({ ...form, vigenciaInicio: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="fin">Válido hasta</Label>
                    <Input id="fin" type="date" value={form.vigenciaFin} onChange={(e) => setForm({ ...form, vigenciaFin: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="min">Mínimo de noches</Label>
                    <Input id="min" type="number" min={1} value={form.minNoches} onChange={(e) => setForm({ ...form, minNoches: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="tope">Tope de usos</Label>
                    <Input id="tope" type="number" min={0} value={form.topeUsos} onChange={(e) => setForm({ ...form, topeUsos: e.target.value })} placeholder="Sin límite" />
                  </div>
                </div>
              </div>

              <div className="border-t border-border p-6">
                <Button variant="gold" className="w-full gap-2" onClick={crearCodigo}>
                  <Ticket className="h-4 w-4" /> Crear y activar código
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
