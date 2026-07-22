"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Maximize2, ArrowRight, Star, Eye, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoomVisual } from "@/components/booking/room-visual";
import { nightsBetween, cn } from "@/lib/utils";
import { useMoneda } from "@/lib/moneda";
import { useIdioma } from "@/lib/idioma";
import { useRoomNombre, useRoomDescripcion, useRoomAmenities } from "@/lib/room-i18n";
import type { HabitacionConDisponibilidad } from "@/domain/types";

export function RoomCard({
  habitacion,
  checkIn,
  checkOut,
  huespedes,
  email = "",
  index,
}: {
  habitacion: HabitacionConDisponibilidad;
  checkIn: string;
  checkOut: string;
  huespedes: string;
  email?: string;
  index: number;
}) {
  const { formatear } = useMoneda();
  const { t } = useIdioma();
  const nombre = useRoomNombre(habitacion);
  const descripcion = useRoomDescripcion(habitacion);
  const amenities = useRoomAmenities(habitacion);
  const noches = nightsBetween(checkIn, checkOut);
  const nochesLabel = t(noches === 1 ? "res.night" : "res.nights");
  const total = habitacion.tarifaNoche * noches;
  const params = new URLSearchParams({ checkIn, checkOut, huespedes });
  if (email) params.set("email", email);

  // Micro-señales de urgencia deterministas (derivadas del id → estables entre
  // render de servidor y cliente, sin parpadeos ni valores aleatorios por hidratación).
  const hash = React.useMemo(() => {
    let h = 0;
    for (let i = 0; i < habitacion.id.length; i++) h = (h * 31 + habitacion.id.charCodeAt(i)) >>> 0;
    return h;
  }, [habitacion.id]);
  const viendo = 3 + (hash % 7); // 3–9 personas
  const reservadaHace = 2 + ((hash >>> 3) % 9); // hace 2–10 h (shift sin signo)

  const agotada = habitacion.unidadesDisponibles <= 0;
  const escasa =
    habitacion.unidadesDisponibles > 0 && habitacion.unidadesDisponibles <= 2;
  const conDescuento = !!habitacion.descuentoPct && habitacion.descuentoPct > 0;
  const totalBase = (habitacion.tarifaBase ?? habitacion.tarifaNoche) * noches;
  const ahorroVip = totalBase - total; // ahorro real solo cuando hay tarifa VIP reconocida

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "overflow-hidden group rounded-xl transition-all duration-300",
          agotada ? "opacity-70" : "hover:shadow-lg"
        )}
      >
        <div className="grid sm:grid-cols-[280px_1fr]">
          <div className="overflow-hidden">
            <RoomVisual
              gradient={habitacion.imagenGradient}
              imageUrl={habitacion.imagenUrl}
              alt={nombre}
              className={cn(
                "h-48 sm:h-full transition-transform duration-500",
                agotada ? "grayscale-[0.6]" : "group-hover:scale-105"
              )}
            />
          </div>
          <div className="p-6 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl font-semibold">{nombre}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 max-w-md">{descripcion}</p>
                </div>
                {escasa && (
                  <span className="shrink-0 inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[0.68rem] font-medium tracking-[0.02em] text-gold">
                    {habitacion.unidadesDisponibles === 1
                      ? t("rc.lastRoom")
                      : t("rc.only2")}
                  </span>
                )}
                {agotada && (
                  <span className="shrink-0 inline-flex items-center rounded-full border border-border bg-secondary/70 px-3 py-1 text-[0.68rem] font-medium tracking-[0.02em] text-muted-foreground">
                    {t("rc.noVacancy")}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-3">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {t("rc.upTo", { n: habitacion.capacidad })}</span>
                <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" /> {habitacion.metros2} m²</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {amenities.slice(0, 4).map((a) => (
                  <Badge key={a} variant="secondary" className="font-normal">{a}</Badge>
                ))}
              </div>

              {/* Prueba social + urgencia sutil (A3) */}
              <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[0.72rem] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                  <span className="font-medium text-foreground tabular-nums">{t("rc.rating")}</span>
                  <span>· {t("rc.reviewsCount", { n: 312 })}</span>
                </span>
                {!agotada && (
                  <>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-gold/80" /> {t("rc.viewing", { n: viendo })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-gold/80" /> {t("rc.bookedAgo", { n: reservadaHace })}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-end justify-between border-t border-border pt-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{t("rc.nightsTotal", { n: noches, label: nochesLabel })}</p>
                <div className="flex items-center gap-2">
                  {conDescuento && (
                    <span className="text-sm text-muted-foreground line-through tabular-nums">{formatear(totalBase)}</span>
                  )}
                  <p className={cn(
                    "font-serif text-2xl font-semibold tabular-nums",
                    agotada ? "text-muted-foreground" : "text-primary"
                  )}>{formatear(total)}</p>
                  {conDescuento && habitacion.nivelAplicado && (
                    <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-[0.1em] text-gold">
                      {habitacion.nivelAplicado} −{Math.round((habitacion.descuentoPct ?? 0) * 100)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{t("rc.perNightTaxes", { precio: formatear(habitacion.tarifaNoche) })}</p>
                {!agotada && conDescuento && ahorroVip > 0 && (
                  <p className="mt-1.5 text-[0.72rem] font-medium text-success">
                    {t("rc.savings", { monto: formatear(ahorroVip) })}
                  </p>
                )}
              </div>
              {agotada ? (
                <span
                  aria-disabled="true"
                  className="inline-flex cursor-default items-center rounded-full border border-border bg-secondary/60 px-5 py-2.5 text-sm font-medium text-muted-foreground"
                >
                  {t("rc.soldOutDates")}
                </span>
              ) : (
                <Button asChild variant="gold" className="gap-1.5">
                  <Link href={`/reserva/${habitacion.id}?${params.toString()}`}>
                    {t("rc.book")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
