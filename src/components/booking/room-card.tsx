"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Maximize2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoomVisual } from "@/components/booking/room-visual";
import { formatCLP, nightsBetween, cn } from "@/lib/utils";
import type { HabitacionConDisponibilidad } from "@/domain/types";

export function RoomCard({
  habitacion,
  checkIn,
  checkOut,
  huespedes,
  index,
}: {
  habitacion: HabitacionConDisponibilidad;
  checkIn: string;
  checkOut: string;
  huespedes: string;
  index: number;
}) {
  const noches = nightsBetween(checkIn, checkOut);
  const total = habitacion.tarifaNoche * noches;
  const params = new URLSearchParams({ checkIn, checkOut, huespedes });

  const agotada = habitacion.unidadesDisponibles <= 0;
  const escasa =
    habitacion.unidadesDisponibles > 0 && habitacion.unidadesDisponibles <= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "overflow-hidden group rounded-lg transition-all duration-300",
          agotada ? "opacity-70" : "hover:shadow-lg"
        )}
      >
        <div className="grid sm:grid-cols-[280px_1fr]">
          <div className="overflow-hidden">
            <RoomVisual
              gradient={habitacion.imagenGradient}
              imageUrl={habitacion.imagenUrl}
              alt={habitacion.nombre}
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
                  <h3 className="font-serif text-xl font-semibold">{habitacion.nombre}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 max-w-md">{habitacion.descripcion}</p>
                </div>
                {escasa && (
                  <span className="shrink-0 inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[0.68rem] font-medium tracking-[0.02em] text-gold">
                    {habitacion.unidadesDisponibles === 1
                      ? "Última habitación disponible"
                      : "Solo quedan 2 disponibles"}
                  </span>
                )}
                {agotada && (
                  <span className="shrink-0 inline-flex items-center rounded-full border border-border bg-secondary/70 px-3 py-1 text-[0.68rem] font-medium tracking-[0.02em] text-muted-foreground">
                    Sin cupo
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-3">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Hasta {habitacion.capacidad} huéspedes</span>
                <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" /> {habitacion.metros2} m²</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {habitacion.amenities.slice(0, 4).map((a) => (
                  <Badge key={a} variant="secondary" className="font-normal">{a}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-end justify-between border-t border-border pt-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{noches} {noches === 1 ? "noche" : "noches"} · total</p>
                <p className={cn(
                  "font-serif text-2xl font-semibold",
                  agotada ? "text-muted-foreground" : "text-primary"
                )}>{formatCLP(total)}</p>
                <p className="text-xs text-muted-foreground">{formatCLP(habitacion.tarifaNoche)} / noche</p>
              </div>
              {agotada ? (
                <span
                  aria-disabled="true"
                  className="inline-flex cursor-default items-center rounded-full border border-border bg-secondary/60 px-5 py-2.5 text-sm font-medium text-muted-foreground"
                >
                  Agotado para estas fechas
                </span>
              ) : (
                <Button asChild variant="gold" className="gap-1.5">
                  <Link href={`/reserva/${habitacion.id}?${params.toString()}`}>
                    Reservar <ArrowRight className="h-4 w-4" />
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
