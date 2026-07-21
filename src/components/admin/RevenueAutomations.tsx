"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  BedDouble,
  RotateCcw,
  X,
  TrendingUp,
  Clock,
  Percent,
  Phone,
  Check,
  Info,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCLP, cn } from "@/lib/utils";

type EstadoItem = "pendiente" | "enviado" | "logrado";

interface ItemAccion {
  id: string;
  titulo: string; // huésped
  contacto?: string; // teléfono para contacto directo
  detalle: string; // habitación · fechas / upgrade
  meta: string; // "hace 2 h" / "llega en 3 días" / "última visita"
  monto?: number; // monto en juego
  estado: EstadoItem;
}

interface Automatizacion {
  id: string;
  nombre: string;
  resumen: string; // descripción corta, lenguaje simple
  explicacion: string; // qué es, en lenguaje de recepción
  queHacer: string; // qué puede hacer el recepcionista
  disparador: string;
  icon: LucideIcon;
  activa: boolean;
  tiempoValor: number;
  tiempoUnidad: "horas" | "días";
  incentivoPct: number;
  // etiquetas operativas
  listaTitulo: string;
  accionLabel: string;
  montoLabel?: string; // qué significa el monto de cada fila
  estadoLabels: Record<EstadoItem, string>;
  // métricas
  enviados: number;
  conversionPct: number;
  ingresos: number;
  items: ItemAccion[];
}

const DATOS: Automatizacion[] = [
  {
    id: "carrito",
    nombre: "Reservas sin terminar",
    resumen: "Recupera a quienes empezaron a reservar en tu web y no pagaron.",
    explicacion:
      "Cada fila es un huésped que en tu web eligió fechas y habitación pero no completó el pago. Son reservas casi cerradas que hoy se están perdiendo.",
    queHacer:
      "El sistema les envía un recordatorio automático con un enlace para retomar su reserva. Tú también puedes llamarlos o escribirles por WhatsApp para cerrar la venta al instante.",
    disparador: "1 h después de un intento de reserva sin completar",
    icon: ShoppingCart,
    activa: true,
    tiempoValor: 1,
    tiempoUnidad: "horas",
    incentivoPct: 5,
    listaTitulo: "Reservas por recuperar",
    accionLabel: "Reenviar recordatorio",
    montoLabel: "reserva en juego",
    estadoLabels: { pendiente: "Por recuperar", enviado: "Recordatorio enviado", logrado: "Recuperada" },
    enviados: 47,
    conversionPct: 22,
    ingresos: 1284000,
    items: [
      { id: "c1", titulo: "Camila Rojas", contacto: "+56 9 5544 3322", detalle: "Suite Estrecho de Magallanes · 12–15 ago", meta: "hace 2 h", monto: 294000, estado: "pendiente" },
      { id: "c2", titulo: "Thomas Berger", contacto: "+49 170 555 1234", detalle: "Habitación Superior · 20–22 ago", meta: "hace 6 h", monto: 136000, estado: "enviado" },
      { id: "c3", titulo: "Josefa Vidal", contacto: "+56 9 6677 8899", detalle: "Habitación Estándar · 5–7 sep", meta: "hace 1 día", monto: 104000, estado: "pendiente" },
    ],
  },
  {
    id: "upsell",
    nombre: "Mejoras a precio especial",
    resumen: "Ofrece subir de categoría a precio de oferta usando habitaciones que igual quedarían vacías. Gana el huésped y ganas tú.",
    explicacion:
      "No se trata de venderles algo más caro porque sí. Tienes habitaciones de mayor categoría que esa noche quedarían vacías. Ofrecerle a un huésped subir a esa habitación por una diferencia pequeña —mucho menor que su precio de lista— es un ganar-ganar: el huésped disfruta una mejor habitación a precio de oferta, y tú generas ingreso por un espacio que igual iba a quedar vacío, a costo casi cero.",
    queHacer:
      "Envíale la oferta a precio especial antes de llegar (la acepta con 1 clic), o tenla a mano para ofrecerla en el check-in. Es totalmente opcional para el huésped. También puedes sumar experiencias que sí desea: desayuno en la cama, traslado, late check-out.",
    disparador: "3 días antes del check-in",
    icon: BedDouble,
    activa: true,
    tiempoValor: 3,
    tiempoUnidad: "días",
    incentivoPct: 0,
    listaTitulo: "Llegadas próximas con oportunidad de mejora",
    accionLabel: "Enviar oferta",
    montoLabel: "ingreso extra para ti",
    estadoLabels: { pendiente: "Sin ofertar", enviado: "Oferta enviada", logrado: "Aceptó la mejora" },
    enviados: 63,
    conversionPct: 31,
    ingresos: 890000,
    items: [
      { id: "u1", titulo: "Marcela Ortúzar", contacto: "+56 9 8123 4455", detalle: "Subir a Suite por solo +$20.000/noche (tarifa normal: +$30.000)", meta: "llega el 13 ago · tienes 2 suites vacías esas noches", monto: 40000, estado: "enviado" },
      { id: "u2", titulo: "Hans Müller", contacto: "+49 151 2345 6789", detalle: "Subir a Superior por solo +$10.000/noche (tarifa normal: +$16.000)", meta: "llega el 15 ago · tienes 4 superiores vacías", monto: 30000, estado: "pendiente" },
      { id: "u3", titulo: "Camila Rojas", contacto: "+56 9 5544 3322", detalle: "Sumar desayuno en la cama + traslado al aeropuerto", meta: "llega el 18 ago · experiencias que suele pedir", monto: 47000, estado: "pendiente" },
    ],
  },
  {
    id: "winback",
    nombre: "Reconquista de huéspedes",
    resumen: "Trae de vuelta a clientes que ya te conocen, directo a tu web y sin comisión de OTA.",
    explicacion:
      "Son huéspedes que ya se hospedaron y hace meses no vuelven. Recuperar a alguien que ya te conoce y quedó contento cuesta mucho menos que conseguir un cliente nuevo. Con un incentivo pequeño reservan de nuevo directo en tu web (no por Booking ni Expedia), así te ahorras la comisión del 15-20% y mantienes la relación con el cliente.",
    queHacer:
      "El sistema les envía por correo un código de descuento personalizado. Puedes ajustar el incentivo o enviarlo tú mismo. Cuando reservan con el código, la venta entra directa y sin comisión de intermediarios.",
    disparador: "60 días después del check-out sin volver a reservar",
    icon: RotateCcw,
    activa: false,
    tiempoValor: 60,
    tiempoUnidad: "días",
    incentivoPct: 12,
    listaTitulo: "Huéspedes que puedes reconquistar",
    accionLabel: "Enviar código",
    montoLabel: "suele gastar por estadía",
    estadoLabels: { pendiente: "Sin contactar", enviado: "Código enviado", logrado: "Volvió a reservar" },
    enviados: 0,
    conversionPct: 0,
    ingresos: 0,
    items: [
      { id: "w1", titulo: "Laura Fernández", contacto: "+54 9 11 4455 8899", detalle: "Cliente frecuente · 2 estadías previas · última visita feb 2026", meta: "5 meses sin volver · código VUELVE12 listo para enviar", monto: 204000, estado: "pendiente" },
      { id: "w2", titulo: "Renata Silva", contacto: "+55 21 99887 6655", detalle: "Se hospedó en ene 2026 · quedó muy conforme", meta: "6 meses sin volver · código VUELVE12 listo para enviar", monto: 136000, estado: "pendiente" },
    ],
  },
];

function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-gold" : "bg-input"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-background shadow-sm transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export function RevenueAutomations() {
  const [items, setItems] = React.useState<Automatizacion[]>(DATOS);
  const [detalleId, setDetalleId] = React.useState<string | null>(null);

  const enDetalle = items.find((a) => a.id === detalleId) ?? null;

  const ingresosTotales = items.filter((a) => a.activa).reduce((acc, a) => acc + a.ingresos, 0);
  const activas = items.filter((a) => a.activa).length;

  function toggle(id: string) {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, activa: !a.activa } : a)));
  }

  function actualizar(id: string, cambios: Partial<Automatizacion>) {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, ...cambios } : a)));
  }

  function accionItem(autoId: string, itemId: string) {
    setItems((prev) =>
      prev.map((a) =>
        a.id === autoId
          ? {
              ...a,
              items: a.items.map((it) =>
                it.id === itemId && it.estado === "pendiente" ? { ...it, estado: "enviado" } : it
              ),
            }
          : a
      )
    );
  }

  const pendientesDe = (a: Automatizacion) => a.items.filter((i) => i.estado === "pendiente").length;

  return (
    <>
      {/* Resumen de ingresos */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="relative overflow-hidden sm:col-span-2">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-gold/0 via-gold/70 to-gold/0" />
          <CardContent className="p-5">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Ingresos recuperados y generados este mes
            </p>
            <p className="mt-2 font-serif text-3xl font-light tracking-tight text-primary tabular-nums">
              {formatCLP(ingresosTotales)}
            </p>
            <p className="mt-1 text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> Ventas directas que se habrían perdido sin estas automatizaciones
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Automatizaciones activas
            </p>
            <p className="mt-2 font-serif text-3xl font-light tracking-tight text-primary tabular-nums">
              {activas} <span className="text-lg text-muted-foreground">/ {items.length}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recetas */}
      <div className="grid gap-5 lg:grid-cols-3 mt-5">
        {items.map((a, i) => {
          const Icon = a.icon;
          const pendientes = pendientesDe(a);
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Card className={cn("h-full transition-opacity", !a.activa && "opacity-70")}>
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </div>
                    <Switch checked={a.activa} onChange={() => toggle(a.id)} />
                  </div>

                  <h3 className="mt-4 font-serif text-lg font-medium">{a.nombre}</h3>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[0.7rem] text-gold">
                    <Clock className="h-3 w-3" /> {a.disparador}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground flex-1">{a.resumen}</p>

                  {/* Señal operativa: cuántos casos hay por gestionar */}
                  {pendientes > 0 && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/[0.07] px-3 py-2">
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[0.68rem] font-semibold text-gold-foreground tabular-nums">
                        {pendientes}
                      </span>
                      <span className="text-xs text-foreground">
                        {a.id === "carrito"
                          ? "reservas por recuperar ahora"
                          : a.id === "upsell"
                          ? "llegadas con oportunidad de mejora"
                          : "huéspedes por reactivar"}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
                    <div>
                      <p className="text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground">Enviados</p>
                      <p className="font-medium tabular-nums">{a.enviados}</p>
                    </div>
                    <div>
                      <p className="text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground">Conversión</p>
                      <p className="font-medium tabular-nums">{a.conversionPct}%</p>
                    </div>
                    <div>
                      <p className="text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground">Ingresos</p>
                      <p className="font-serif text-base font-medium text-gold tabular-nums leading-tight">
                        {a.ingresos > 0 ? formatCLP(a.ingresos) : "—"}
                      </p>
                    </div>
                  </div>

                  <Button variant="gold" size="sm" className="mt-4 w-full" onClick={() => setDetalleId(a.id)}>
                    Gestionar
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Panel de gestión */}
      <AnimatePresence>
        {enDetalle && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDetalleId(null)}
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
              <div className="flex items-start justify-between border-b border-border p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                    <enDetalle.icon className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <div>
                    <span className="eyebrow text-[0.62rem] after:hidden">Automatización de ventas</span>
                    <h2 className="mt-1 font-serif text-xl font-medium leading-tight">{enDetalle.nombre}</h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDetalleId(null)}
                  aria-label="Cerrar"
                  className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Explicación en lenguaje simple */}
                <div className="rounded-lg border border-gold/30 bg-gold/[0.06] p-4">
                  <p className="flex items-center gap-1.5 text-sm font-medium">
                    <Info className="h-4 w-4 text-gold" /> ¿Qué es esto?
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{enDetalle.explicacion}</p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground">Qué puedes hacer: </span>
                    {enDetalle.queHacer}
                  </p>
                </div>

                {/* Lista accionable */}
                <section>
                  <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-gold mb-3">
                    {enDetalle.listaTitulo} ({enDetalle.items.length})
                  </p>
                  <div className="space-y-2.5">
                    {enDetalle.items.map((it) => (
                      <div
                        key={it.id}
                        className="flex items-start justify-between gap-3 rounded-lg border border-border p-3.5"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{it.titulo}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{it.detalle}</p>
                          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.68rem] text-muted-foreground/80">
                            {it.contacto && (
                              <span className="inline-flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {it.contacto}
                              </span>
                            )}
                            <span>· {it.meta}</span>
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          {it.monto ? (
                            <div className="text-right leading-none">
                              <p className="font-serif text-base font-medium text-primary tabular-nums">
                                {formatCLP(it.monto)}
                              </p>
                              {enDetalle.montoLabel && (
                                <p className="text-[0.6rem] text-muted-foreground mt-0.5">{enDetalle.montoLabel}</p>
                              )}
                            </div>
                          ) : null}
                          {it.estado === "pendiente" ? (
                            <Button
                              size="sm"
                              variant="gold"
                              className="h-8 whitespace-nowrap"
                              onClick={() => accionItem(enDetalle.id, it.id)}
                            >
                              {enDetalle.accionLabel}
                            </Button>
                          ) : it.estado === "enviado" ? (
                            <Badge variant="gold" className="whitespace-nowrap">
                              {enDetalle.estadoLabels.enviado}
                            </Badge>
                          ) : (
                            <Badge variant="success" className="gap-1 whitespace-nowrap">
                              <Check className="h-3 w-3" /> {enDetalle.estadoLabels.logrado}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Ajustes del envío automático */}
                <section className="rounded-lg border border-border p-4 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Envío automático</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {enDetalle.activa
                          ? "Encendido — el sistema contacta solo, sin que hagas nada."
                          : "Apagado — nadie recibe el mensaje automático."}
                      </p>
                    </div>
                    <Switch checked={enDetalle.activa} onChange={() => toggle(enDetalle.id)} />
                  </div>

                  <div>
                    <Label className="flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground mb-2">
                      <Clock className="h-3.5 w-3.5" /> Cuándo se envía
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        value={enDetalle.tiempoValor}
                        onChange={(e) => actualizar(enDetalle.id, { tiempoValor: Number(e.target.value) })}
                        className="h-10 w-24"
                      />
                      <select
                        value={enDetalle.tiempoUnidad}
                        onChange={(e) =>
                          actualizar(enDetalle.id, { tiempoUnidad: e.target.value as "horas" | "días" })
                        }
                        className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="horas">horas después</option>
                        <option value="días">días después</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground mb-2">
                      <Percent className="h-3.5 w-3.5" /> Descuento del incentivo (opcional)
                    </Label>
                    <div className="relative w-32">
                      <Input
                        type="number"
                        min={0}
                        max={50}
                        value={enDetalle.incentivoPct}
                        onChange={(e) => actualizar(enDetalle.id, { incentivoPct: Number(e.target.value) })}
                        className="h-10 pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {enDetalle.incentivoPct > 0
                        ? `Se ofrece un ${enDetalle.incentivoPct}% de descuento para cerrar la venta.`
                        : "Sin descuento — se apoya solo en el recordatorio."}
                    </p>
                  </div>
                </section>
              </div>

              <div className="border-t border-border p-6">
                <Button variant="gold" className="w-full" onClick={() => setDetalleId(null)}>
                  Listo
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
