"use client";

import * as React from "react";
import { PaquetesList } from "@/components/admin/paquetes-list";
import { CrearPaqueteForm } from "@/components/admin/crear-paquete-form";
import { EnviarPromocionForm } from "@/components/admin/enviar-promocion-form";
import { Separator } from "@/components/ui/separator";
import type { TipoHabitacion, ServicioAdicional, PaquetePromocional, Huesped } from "@/domain/types";

type PaqueteConHabitacion = PaquetePromocional & { tipoHabitacion?: TipoHabitacion };

export function PaquetesSection({
  paquetesIniciales,
  tipos,
  servicios,
  huespedes,
}: {
  paquetesIniciales: PaqueteConHabitacion[];
  tipos: TipoHabitacion[];
  servicios: ServicioAdicional[];
  huespedes: Huesped[];
}) {
  const [paquetes, setPaquetes] = React.useState(paquetesIniciales);

  function handleCreado(nuevo: PaquetePromocional) {
    const tipoHabitacion = tipos.find((t) => t.id === nuevo.tipoHabitacionId);
    setPaquetes((prev) => [{ ...nuevo, tipoHabitacion }, ...prev]);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground mb-4">
          Paquetes activos
        </h2>
        <PaquetesList paquetes={paquetes} servicios={servicios} onChange={setPaquetes} />
      </div>

      <Separator />

      <div>
        <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground mb-4">
          Nuevo paquete
        </h2>
        <CrearPaqueteForm tipos={tipos} servicios={servicios} onCreado={handleCreado} />
      </div>

      <Separator />

      <div>
        <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground mb-4">
          Enviar promoción por correo
        </h2>
        <EnviarPromocionForm paquetes={paquetes} servicios={servicios} huespedes={huespedes} />
      </div>
    </div>
  );
}
