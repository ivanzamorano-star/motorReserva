"use server";

// Server action del checkout público. La reserva debe crearse en el store del
// servidor (no en el del navegador) para que el panel de administración —
// Reservas, Calendario, Incentivos— la vea de inmediato.
import { revalidatePath } from "next/cache";
import { reservationRepository } from "@/data/repository";
import type { DocumentoTributario, FranjaLateCheckout } from "@/domain/types";

export async function crearReservaYConfirmarAction(input: {
  tipoHabitacionId: string;
  checkIn: string;
  checkOut: string;
  huespedes: number;
  nombre: string;
  email: string;
  telefono: string;
  montoTotal: number;
  documentoTributario?: DocumentoTributario;
  solicitaEarlyCheckin?: boolean;
  lateCheckoutFranja?: FranjaLateCheckout;
  lateCheckoutMontoEstimado?: number;
}) {
  const reserva = await reservationRepository.crearReserva(input);
  const { reserva: confirmada } = await reservationRepository.confirmarPago(reserva.id);
  revalidatePath("/admin/reservas");
  revalidatePath("/admin/calendario");
  revalidatePath("/admin/administrador/reservas");
  revalidatePath("/admin/administrador/incentivos");
  revalidatePath("/admin");
  return confirmada;
}
