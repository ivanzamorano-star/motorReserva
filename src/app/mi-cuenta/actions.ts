"use server";

// Server action del portal del huésped: reconoce al cliente por correo (server-side,
// sin exponer la base de clientes) y devuelve su nivel, beneficio e historial.
import { reservationRepository, type PerfilHuesped } from "@/data/repository";

export async function buscarPerfil(email: string): Promise<PerfilHuesped> {
  return reservationRepository.getPerfilHuesped(email);
}
