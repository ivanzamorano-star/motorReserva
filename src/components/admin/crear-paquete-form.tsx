"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PackagePlus, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reservationRepository } from "@/data/repository";
import { formatCLP } from "@/lib/utils";
import { PUBLICO_LABEL } from "@/lib/paquete-utils";
import type { TipoHabitacion, ServicioAdicional, PaquetePromocional, PublicoPaquete } from "@/domain/types";

const PUBLICOS: PublicoPaquete[] = ["todos", "frecuente", "empresa"];

export function CrearPaqueteForm({
  tipos,
  servicios,
  onCreado,
}: {
  tipos: TipoHabitacion[];
  servicios: ServicioAdicional[];
  onCreado: (paquete: PaquetePromocional) => void;
}) {
  const [nombre, setNombre] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  const [tipoHabitacionId, setTipoHabitacionId] = React.useState(tipos[0]?.id ?? "");
  const [serviciosIds, setServiciosIds] = React.useState<string[]>([]);
  const [precioPaquete, setPrecioPaquete] = React.useState<number>(0);
  const [publico, setPublico] = React.useState<PublicoPaquete>("frecuente");
  const [vigenciaInicio, setVigenciaInicio] = React.useState("2026-07-17");
  const [vigenciaFin, setVigenciaFin] = React.useState("2026-12-31");
  const [creando, setCreando] = React.useState(false);
  const [creado, setCreado] = React.useState(false);

  function toggleServicio(id: string) {
    setServiciosIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreando(true);
    const nuevo = await reservationRepository.crearPaquete({
      nombre,
      descripcion,
      tipoHabitacionId,
      serviciosIds,
      precioPaquete,
      publico,
      vigenciaInicio,
      vigenciaFin,
    });
    onCreado(nuevo);
    setCreando(false);
    setCreado(true);
    setNombre("");
    setDescripcion("");
    setServiciosIds([]);
    setPrecioPaquete(0);
    setTimeout(() => setCreado(false), 3500);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <PackagePlus className="h-4 w-4 text-gold" /> Crear paquete promocional
        </CardTitle>
        <CardDescription>
          Combine una habitación con servicios adicionales para armar una oferta de upselling, un paquete de bienestar
          o una tarifa corporativa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre del paquete</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Fin de semana romántico"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="habitacion">Habitación base</Label>
              <select
                id="habitacion"
                value={tipoHabitacionId}
                onChange={(e) => setTipoHabitacionId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {tipos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describa a quién va dirigido y qué incluye el paquete..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Servicios adicionales incluidos</Label>
            <div className="grid sm:grid-cols-2 gap-2">
              {servicios.map((s) => {
                const activo = serviciosIds.includes(s.id);
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => toggleServicio(s.id)}
                    className={`flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                      activo ? "border-gold bg-gold/10" : "border-input hover:bg-accent"
                    }`}
                  >
                    <span>{s.nombre}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{formatCLP(s.precio)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="precio">Precio del paquete (CLP)</Label>
              <Input
                id="precio"
                type="number"
                min={0}
                step={1000}
                value={precioPaquete || ""}
                onChange={(e) => setPrecioPaquete(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="publico">Público objetivo</Label>
              <select
                id="publico"
                value={publico}
                onChange={(e) => setPublico(e.target.value as PublicoPaquete)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {PUBLICOS.map((p) => (
                  <option key={p} value={p}>
                    {PUBLICO_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vigencia">Vigente hasta</Label>
              <Input
                id="vigencia"
                type="date"
                value={vigenciaFin}
                min={vigenciaInicio}
                onChange={(e) => setVigenciaFin(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <AnimatePresence mode="wait">
              {creado ? (
                <motion.p
                  key="creado"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-sm text-success font-medium"
                >
                  <CheckCircle2 className="h-4 w-4" /> Paquete creado y activado
                </motion.p>
              ) : (
                <span />
              )}
            </AnimatePresence>
            <Button type="submit" variant="gold" disabled={creando}>
              <PackagePlus className="h-4 w-4" /> {creando ? "Creando..." : "Crear paquete"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
