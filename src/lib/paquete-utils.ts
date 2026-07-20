import type { PublicoPaquete, PaquetePromocional, ServicioAdicional, TipoHabitacion } from "@/domain/types";
import type { BadgeProps } from "@/components/ui/badge";
import { formatCLP, formatDate } from "@/lib/utils";

export const PUBLICO_LABEL: Record<PublicoPaquete, string> = {
  todos: "Todos los huéspedes",
  frecuente: "Clientes frecuentes",
  empresa: "Empresas",
};

export const PUBLICO_BADGE_VARIANT: Record<PublicoPaquete, NonNullable<BadgeProps["variant"]>> = {
  todos: "outline",
  frecuente: "gold",
  empresa: "secondary",
};

type PaqueteConHabitacion = PaquetePromocional & { tipoHabitacion?: TipoHabitacion };

export function buildPromoEmailTemplate(
  paquete: PaqueteConHabitacion,
  servicios: ServicioAdicional[],
  huespedNombre: string
) {
  const ahorro = paquete.precioReferencia - paquete.precioPaquete;
  const serviciosIncluidos = servicios.filter((s) => paquete.serviciosIds.includes(s.id));
  const detalleServicios =
    serviciosIncluidos.length > 0 ? `\n- ${serviciosIncluidos.map((s) => s.nombre).join("\n- ")}` : "";

  const asunto = `${paquete.nombre} — una oferta especial para usted`;

  const cuerpo = `Estimado/a {{nombre}},

Como huésped de Hotel Plaza, quisimos ofrecerle en exclusiva nuestro paquete "${paquete.nombre}":

- ${paquete.tipoHabitacion?.nombre ?? "Habitación"}${detalleServicios}

Precio de lista: ${formatCLP(paquete.precioReferencia)}
Precio especial: ${formatCLP(paquete.precioPaquete)}${ahorro > 0 ? ` (ahorra ${formatCLP(ahorro)})` : ""}

Válido hasta el ${formatDate(paquete.vigenciaFin)}, sujeto a disponibilidad.

Para reservar, responda este correo o escríbanos al +56 61 224 1300.

Un cordial saludo,
Equipo Hotel Plaza`;

  return { asunto, cuerpo: cuerpo.replace("{{nombre}}", huespedNombre || "{{nombre}}") };
}
