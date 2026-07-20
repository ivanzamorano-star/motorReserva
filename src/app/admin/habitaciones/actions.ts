"use server";

import { reservationRepository } from "@/data/repository";
import { revalidatePath } from "next/cache";

// Server Action: se ejecuta siempre en el servidor, a diferencia de una llamada directa
// al repositorio desde un componente cliente (que solo mutaría una copia en el navegador).
// Así, el cambio de tarifas queda disponible de inmediato para cualquier página renderizada
// en el servidor, incluido el sitio de reservas fuera del panel del hotel.
export async function actualizarTarifarioAction(updates: { id: string; precioNoche: number }[]) {
  const tarifas = await reservationRepository.actualizarTarifario(updates);

  revalidatePath("/admin/habitaciones");
  revalidatePath("/habitaciones");
  revalidatePath("/reserva/[roomId]", "page");
  revalidatePath("/");

  return tarifas;
}
