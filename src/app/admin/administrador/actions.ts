"use server";

// Server actions del panel Administrador (menú master). Cada acción muta el store
// a través del repositorio y revalida las rutas afectadas para que el resto del
// panel (Reservas, Calendario, Dashboard) y el sitio público reflejen el cambio.
import { revalidatePath } from "next/cache";
import { reservationRepository } from "@/data/repository";
import type { EstadoReserva, UsuarioStaff } from "@/domain/types";

function revalidarReservas() {
  revalidatePath("/admin/administrador/reservas");
  revalidatePath("/admin/administrador/nueva-reserva");
  revalidatePath("/admin/reservas");
  revalidatePath("/admin/calendario");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function crearReservaManualAction(input: {
  tipoHabitacionId: string;
  paqueteId?: string;
  checkIn: string;
  checkOut: string;
  huespedes: number;
  nombre: string;
  email: string;
  telefono: string;
  montoTotal: number;
  estado: Extract<EstadoReserva, "confirmada" | "pendiente_pago">;
}) {
  const reserva = await reservationRepository.crearReservaManual(input);
  revalidarReservas();
  return reserva;
}

export async function cancelarReservaAction(id: string) {
  const reserva = await reservationRepository.cancelarReserva(id);
  revalidarReservas();
  return reserva;
}

export async function eliminarReservaAction(id: string) {
  await reservationRepository.eliminarReserva(id);
  revalidarReservas();
}

export async function confirmarPagoAction(id: string) {
  const res = await reservationRepository.confirmarPago(id);
  revalidarReservas();
  return res.reserva;
}

export async function ajustarTarifaReservaAction(id: string, nuevoMonto: number) {
  const reserva = await reservationRepository.ajustarTarifaReserva(id, nuevoMonto);
  revalidarReservas();
  return reserva;
}

export async function crearUsuarioAction(input: {
  nombre: string;
  email: string;
  rol: UsuarioStaff["rol"];
}) {
  const usuario = await reservationRepository.crearUsuario(input);
  revalidatePath("/admin/administrador/usuarios");
  revalidatePath("/admin/configuracion");
  return usuario;
}

export async function eliminarUsuarioAction(id: string) {
  await reservationRepository.eliminarUsuario(id);
  revalidatePath("/admin/administrador/usuarios");
  revalidatePath("/admin/configuracion");
}

export async function crearBloqueoAction(input: {
  tipoHabitacionId: string;
  desde: string;
  hasta: string;
  motivo: string;
}) {
  const bloqueo = await reservationRepository.crearBloqueo(input);
  revalidatePath("/admin/administrador/bloqueos");
  revalidatePath("/admin/calendario");
  return bloqueo;
}

export async function eliminarBloqueoAction(id: string) {
  await reservationRepository.eliminarBloqueo(id);
  revalidatePath("/admin/administrador/bloqueos");
  revalidatePath("/admin/calendario");
}
