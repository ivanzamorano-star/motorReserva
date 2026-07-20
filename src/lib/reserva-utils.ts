import type { EstadoReserva, CanalOrigen } from "@/domain/types";
import type { BadgeProps } from "@/components/ui/badge";

export const ESTADO_LABEL: Record<EstadoReserva, string> = {
  pendiente_pago: "Pendiente de pago",
  confirmada: "Confirmada",
  expirada: "Expirada",
  cancelada_huesped: "Cancelada (huésped)",
  cancelada_hotel: "Cancelada (hotel)",
  no_show: "No-show",
  reembolsada: "Reembolsada",
};

export const ESTADO_BADGE_VARIANT: Record<EstadoReserva, NonNullable<BadgeProps["variant"]>> = {
  pendiente_pago: "gold",
  confirmada: "success",
  expirada: "secondary",
  cancelada_huesped: "destructive",
  cancelada_hotel: "destructive",
  no_show: "destructive",
  reembolsada: "outline",
};

export const CANAL_LABEL: Record<CanalOrigen, string> = {
  directo: "Directo",
  booking: "Booking.com",
  expedia: "Expedia",
  telefono: "Teléfono",
};
