"use server";

import { reservationRepository } from "@/data/repository";
import { revalidatePath } from "next/cache";

// Server Action: se ejecuta en el servidor (no en el navegador), para que la eliminación
// quede reflejada de inmediato para cualquier otra visita a esta página, en vez de mutar
// solo una copia local en el cliente.
export async function eliminarPaqueteAction(id: string) {
  await reservationRepository.eliminarPaquete(id);
  revalidatePath("/admin/paquetes");
}
