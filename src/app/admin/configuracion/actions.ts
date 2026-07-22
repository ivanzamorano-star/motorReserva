"use server";

import { revalidatePath } from "next/cache";
import { reservationRepository } from "@/data/repository";
import type { MucamaStaff } from "@/domain/types";

export async function actualizarConfigIncentivosAction(input: {
  mucamas: MucamaStaff[];
  incentivoIngresoPrioritarioPct: number;
  precioIngresoPrioritario: number;
}) {
  const hotel = await reservationRepository.actualizarConfigIncentivos(input);
  revalidatePath("/admin/configuracion");
  revalidatePath("/admin/administrador/incentivos");
  revalidatePath("/admin/administrador/reservas");
  revalidatePath("/admin/reservas");
  return hotel;
}
