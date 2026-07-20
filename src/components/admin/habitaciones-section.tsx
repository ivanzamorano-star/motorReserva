"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EditarTarifarioDialog } from "@/components/admin/editar-tarifario-dialog";
import { formatCLP } from "@/lib/utils";
import { Users, Ruler } from "lucide-react";
import type { TipoHabitacion, Tarifa } from "@/domain/types";

export function HabitacionesSection({
  tipos,
  tarifasIniciales,
}: {
  tipos: TipoHabitacion[];
  tarifasIniciales: Tarifa[];
}) {
  const [tarifas, setTarifas] = React.useState(tarifasIniciales);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Habitaciones y tarifas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {tipos.length} tipos de habitación configurados en el motor de reservas.
          </p>
        </div>
        <EditarTarifarioDialog tipos={tipos} tarifas={tarifas} onActualizado={setTarifas} />
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {tipos.map((tipo) => {
          const tarifaBaja = tarifas.find((t) => t.tipoHabitacionId === tipo.id && t.temporada === "baja");
          const tarifaAlta = tarifas.find((t) => t.tipoHabitacionId === tipo.id && t.temporada === "alta");
          return (
            <Card key={tipo.id} className="overflow-hidden">
              <div className="relative h-28 bg-secondary">
                <Image src={tipo.imagenUrl} alt={tipo.nombre} fill sizes="400px" className="object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-t ${tipo.imagenGradient}`} />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{tipo.nombre}</CardTitle>
                  <Badge variant="secondary">{tipo.cantidadUnidades} unidades</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{tipo.descripcion}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {tipo.capacidad} huéspedes
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler className="h-3.5 w-3.5" /> {tipo.metros2} m²
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tipo.amenities.map((a) => (
                    <Badge key={a} variant="outline" className="text-[11px]">
                      {a}
                    </Badge>
                  ))}
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Temporada baja</p>
                    <p className="font-semibold">{tarifaBaja ? formatCLP(tarifaBaja.precioNoche) : "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Temporada alta</p>
                    <p className="font-semibold">{tarifaAlta ? formatCLP(tarifaAlta.precioNoche) : "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
