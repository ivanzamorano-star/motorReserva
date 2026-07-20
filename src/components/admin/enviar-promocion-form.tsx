"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Gift, Mail, UserRound, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reservationRepository } from "@/data/repository";
import { formatCLP, formatDate } from "@/lib/utils";
import { buildPromoEmailTemplate, PUBLICO_LABEL } from "@/lib/paquete-utils";
import type { Huesped, PaquetePromocional, ServicioAdicional, TipoHabitacion, EnvioEmail } from "@/domain/types";

type PaqueteConHabitacion = PaquetePromocional & { tipoHabitacion?: TipoHabitacion };
type EnvioConHuesped = EnvioEmail & { huesped?: Huesped; paqueteNombre?: string; emailDestino?: string };

export function EnviarPromocionForm({
  paquetes,
  servicios,
  huespedes,
}: {
  paquetes: PaqueteConHabitacion[];
  servicios: ServicioAdicional[];
  huespedes: Huesped[];
}) {
  const [paqueteId, setPaqueteId] = React.useState(paquetes[0]?.id ?? "");
  const [huespedId, setHuespedId] = React.useState(huespedes[0]?.id ?? "");
  const [email, setEmail] = React.useState(huespedes[0]?.email ?? "");
  const [asunto, setAsunto] = React.useState("");
  const [cuerpo, setCuerpo] = React.useState("");
  const [enviando, setEnviando] = React.useState(false);
  const [enviado, setEnviado] = React.useState(false);
  const [envios, setEnvios] = React.useState<EnvioConHuesped[]>([]);

  const paqueteSeleccionado = paquetes.find((p) => p.id === paqueteId);
  const huespedSeleccionado = huespedes.find((h) => h.id === huespedId);

  React.useEffect(() => {
    if (!paqueteSeleccionado) return;
    const { asunto: a, cuerpo: c } = buildPromoEmailTemplate(
      paqueteSeleccionado,
      servicios,
      huespedSeleccionado?.nombre ?? ""
    );
    setAsunto(a);
    setCuerpo(c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paqueteId, huespedId]);

  React.useEffect(() => {
    setEmail(huespedSeleccionado?.email ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [huespedId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    const nuevo = await reservationRepository.enviarEmailPersonalizado({ huespedId, asunto, cuerpo });
    setEnvios((prev) => [
      { ...nuevo, huesped: huespedSeleccionado, paqueteNombre: paqueteSeleccionado?.nombre, emailDestino: email },
      ...prev,
    ]);
    setEnviando(false);
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3500);
  }

  if (paquetes.length === 0) {
    return null;
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-5 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Gift className="h-4 w-4 text-gold" /> Enviar promoción a un huésped
          </CardTitle>
          <CardDescription>
            Elija un paquete y un huésped: el asunto y el mensaje se completan automáticamente con los detalles de la
            oferta, y puede editarlos antes de enviar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="paquete">Paquete promocional</Label>
                <select
                  id="paquete"
                  value={paqueteId}
                  onChange={(e) => setPaqueteId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {paquetes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} {!p.activo ? "(inactivo)" : ""} — {formatCLP(p.precioPaquete)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="huesped-promo">Huésped</Label>
                <select
                  id="huesped-promo"
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
            </div>

            {paqueteSeleccionado && (
              <div className="flex flex-wrap items-center gap-2 rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs">
                <Badge variant="gold" className="text-[10px]">
                  {PUBLICO_LABEL[paqueteSeleccionado.publico]}
                </Badge>
                <span className="text-muted-foreground">
                  {paqueteSeleccionado.tipoHabitacion?.nombre} · Vigente hasta {formatDate(paqueteSeleccionado.vigenciaFin)}
                </span>
                <span className="ml-auto font-medium text-primary">{formatCLP(paqueteSeleccionado.precioPaquete)}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email-promo">Correo del huésped</Label>
              <Input
                id="email-promo"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@correo.com"
                required
              />
              <p className="text-xs text-muted-foreground">
                Se autocompleta con el correo registrado del huésped — puede editarlo si desea enviarlo a otra dirección.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="asunto-promo">Asunto</Label>
              <Input id="asunto-promo" value={asunto} onChange={(e) => setAsunto(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cuerpo-promo" className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-gold" /> Mensaje (generado automáticamente, editable)
              </Label>
              <Textarea
                id="cuerpo-promo"
                value={cuerpo}
                onChange={(e) => setCuerpo(e.target.value)}
                rows={10}
                required
              />
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
                    <CheckCircle2 className="h-4 w-4" /> Promoción enviada correctamente
                  </motion.p>
                ) : (
                  <span />
                )}
              </AnimatePresence>
              <Button type="submit" variant="gold" disabled={enviando}>
                <Send className="h-4 w-4" /> {enviando ? "Enviando..." : "Enviar promoción"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4 text-gold" /> Promociones enviadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[420px] overflow-y-auto">
          {envios.length === 0 && (
            <p className="text-sm text-muted-foreground">Aún no se han enviado promociones en esta sesión.</p>
          )}
          {envios.map((e) => (
            <div key={e.id} className="rounded-md border border-border p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <UserRound className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <p className="text-sm font-medium truncate">{e.huesped?.nombre ?? "Huésped"}</p>
                </div>
                <Badge variant="gold" className="shrink-0 text-[10px]">
                  Promoción
                </Badge>
              </div>
              {e.paqueteNombre && (
                <p className="text-xs text-gold mt-1.5 truncate">{e.paqueteNombre}</p>
              )}
              {e.emailDestino && (
                <p className="text-[11px] text-muted-foreground mt-1 truncate">{e.emailDestino}</p>
              )}
              <p className="text-[11px] text-muted-foreground mt-0.5">{formatDate(e.fecha.slice(0, 10))} · Enviado</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
