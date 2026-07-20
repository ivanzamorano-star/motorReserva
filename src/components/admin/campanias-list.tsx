"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mail, CalendarClock, Cake, Star, RotateCcw, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { reservationRepository } from "@/data/repository";
import type { CampanaEmail, TriggerEmail } from "@/domain/types";

const TRIGGER_ICON: Record<TriggerEmail, React.ElementType> = {
  post_estadia: Mail,
  cumpleanos: Cake,
  recompra: RotateCcw,
  resena: Star,
  manual: Send,
};

const TRIGGER_LABEL: Record<TriggerEmail, string> = {
  post_estadia: "Post-estadía",
  cumpleanos: "Cumpleaños",
  recompra: "Recompra / fidelización",
  resena: "Solicitud de reseña",
  manual: "Manual",
};

export function CampaniasList({ campanias: initial }: { campanias: CampanaEmail[] }) {
  const [campanias, setCampanias] = React.useState(initial);
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  async function handleToggle(id: string) {
    setPendingId(id);
    const actualizada = await reservationRepository.toggleCampaniaEmail(id);
    setCampanias((prev) => prev.map((c) => (c.id === id ? actualizada : c)));
    setPendingId(null);
  }

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {campanias.map((c, i) => {
        const Icon = TRIGGER_ICON[c.trigger];
        return (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="font-serif text-base font-semibold">{c.nombre}</p>
                      <Badge variant="outline" className="mt-1 text-[10px]">
                        <CalendarClock className="h-3 w-3" />
                        {TRIGGER_LABEL[c.trigger]}
                        {c.diasDelay > 0 ? ` · ${c.diasDelay} días` : ""}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant={c.activa ? "success" : "secondary"} className="shrink-0">
                    {c.activa ? "Activa" : "Inactiva"}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">{c.descripcion}</p>

                <div className="rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs">
                  <span className="text-muted-foreground">Asunto: </span>
                  <span className="font-medium">{c.asunto}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>
                      <span className="font-semibold text-foreground">{c.enviosTotales}</span> enviados
                    </span>
                    <span>
                      <span className="font-semibold text-foreground">{c.tasaAperturaPorcentaje}%</span> apertura
                    </span>
                  </div>
                  <Button
                    variant={c.activa ? "outline" : "gold"}
                    size="sm"
                    disabled={pendingId === c.id}
                    onClick={() => handleToggle(c.id)}
                  >
                    {pendingId === c.id ? "Guardando..." : c.activa ? "Desactivar" : "Activar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
