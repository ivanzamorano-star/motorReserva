"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Sparkles, Mail, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reservationRepository } from "@/data/repository";
import { formatDate } from "@/lib/utils";
import type { Huesped, EnvioEmail } from "@/domain/types";

const PLANTILLA_DEFECTO = `Estimado/a {{nombre}},

Quisimos escribirle personalmente para agradecer su preferencia por Hotel Plaza durante su reciente estadía en Punta Arenas.

Esperamos que haya disfrutado de su paso por la Patagonia tanto como nosotros disfrutamos recibirle. Será un gusto volver a atenderle en su próxima visita.

Un cordial saludo,
Equipo Hotel Plaza`;

type EnvioConHuesped = EnvioEmail & { huesped?: Huesped };

export function EnviarEmailForm({
  huespedes,
  enviosIniciales,
}: {
  huespedes: Huesped[];
  enviosIniciales: EnvioConHuesped[];
}) {
  const [huespedId, setHuespedId] = React.useState(huespedes[0]?.id ?? "");
  const [asunto, setAsunto] = React.useState("Un gesto especial de Hotel Plaza");
  const [cuerpo, setCuerpo] = React.useState(PLANTILLA_DEFECTO);
  const [enviando, setEnviando] = React.useState(false);
  const [enviado, setEnviado] = React.useState(false);
  const [envios, setEnvios] = React.useState(enviosIniciales);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    const nuevo = await reservationRepository.enviarEmailPersonalizado({ huespedId, asunto, cuerpo });
    const huesped = huespedes.find((h) => h.id === huespedId);
    setEnvios((prev) => [{ ...nuevo, huesped }, ...prev]);
    setEnviando(false);
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3500);
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-5 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" /> Correo personalizado post-hospedaje
          </CardTitle>
          <CardDescription>
            Envíe un mensaje individual a un huésped — por ejemplo, para agradecer una estadía especial o resolver una situación puntual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="huesped">Huésped</Label>
                <select
                  id="huesped"
                  value={huespedId}
                  onChange={(e) => setHuespedId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {huespedes.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.nombre} — {h.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="asunto">Asunto</Label>
                <Input id="asunto" value={asunto} onChange={(e) => setAsunto(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cuerpo">Mensaje</Label>
              <Textarea
                id="cuerpo"
                value={cuerpo}
                onChange={(e) => setCuerpo(e.target.value)}
                rows={8}
                required
              />
              <p className="text-xs text-muted-foreground">
                Use <code className="font-mono">{"{{nombre}}"}</code> para personalizar automáticamente con el nombre del huésped.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <AnimatePresence mode="wait">
                {enviado ? (
                  <motion.p
                    key="enviado"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-sm text-success font-medium"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Correo enviado correctamente
                  </motion.p>
                ) : (
                  <span />
                )}
              </AnimatePresence>
              <Button type="submit" variant="gold" disabled={enviando}>
                <Send className="h-4 w-4" /> {enviando ? "Enviando..." : "Enviar correo"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4 text-gold" /> Envíos recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[420px] overflow-y-auto">
          {envios.length === 0 && (
            <p className="text-sm text-muted-foreground">Aún no se han enviado correos.</p>
          )}
          {envios.map((e) => (
            <div key={e.id} className="rounded-md border border-border p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <UserRound className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <p className="text-sm font-medium truncate">{e.huesped?.nombre ?? "Huésped"}</p>
                </div>
                <Badge variant={e.tipo === "personalizado" ? "gold" : "outline"} className="shrink-0 text-[10px]">
                  {e.tipo === "personalizado" ? "Personalizado" : "Automatizado"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 truncate">{e.asunto}</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {formatDate(e.fecha.slice(0, 10))} · {e.estado === "abierto" ? "Abierto" : "Enviado"}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
