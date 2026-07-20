// Lógica de negocio para verificar disponibilidad real de habitaciones.
// Se mantiene separada del repositorio para que sea una función utilitaria pura,
// fácil de testear y de reutilizar el día que esto se conecte a una base de datos real.

import type { EstadoReserva } from "@/domain/types";

// Estados de reserva que NO bloquean disponibilidad (la habitación vuelve a quedar libre).
const ESTADOS_QUE_NO_BLOQUEAN: EstadoReserva[] = ["cancelada_huesped", "cancelada_hotel", "expirada"];

export interface RangoReserva {
  checkIn: string; // "YYYY-MM-DD"
  checkOut: string; // "YYYY-MM-DD"
}

/**
 * Determina si el rango solicitado (check-in/check-out) se cruza con una reserva existente.
 *
 * Una habitación está DISPONIBLE (sin cruce) si:
 *   (Fecha_Solicitada_CheckOut <= Reserva_Existente_CheckIn)  →  el huésped se va antes de que llegue el otro
 *   O
 *   (Fecha_Solicitada_CheckIn  >= Reserva_Existente_CheckOut) →  el huésped llega después de que el otro se va
 *
 * Si ninguna de las dos condiciones se cumple, las fechas se superponen y NO está disponible.
 */
export function hayCruceDeFechas(checkInSolicitado: string, checkOutSolicitado: string, reservaExistente: RangoReserva): boolean {
  const sinCruce = checkOutSolicitado <= reservaExistente.checkIn || checkInSolicitado >= reservaExistente.checkOut;
  return !sinCruce;
}

/**
 * Cuenta cuántas reservas activas (no canceladas/expiradas) de un tipo de habitación
 * se cruzan con el rango de fechas solicitado.
 */
export function contarReservasSuperpuestas<T extends RangoReserva & { tipoHabitacionId: string; estado: EstadoReserva }>(
  checkInSolicitado: string,
  checkOutSolicitado: string,
  tipoHabitacionId: string,
  reservas: T[]
): number {
  return reservas.filter(
    (r) =>
      r.tipoHabitacionId === tipoHabitacionId &&
      !ESTADOS_QUE_NO_BLOQUEAN.includes(r.estado) &&
      hayCruceDeFechas(checkInSolicitado, checkOutSolicitado, r)
  ).length;
}

/**
 * Calcula cuántas unidades de un tipo de habitación quedan realmente libres para el
 * rango de fechas solicitado, dado el total de unidades y el listado de reservas existentes.
 */
export function calcularUnidadesDisponibles<T extends RangoReserva & { tipoHabitacionId: string; estado: EstadoReserva }>(
  checkInSolicitado: string,
  checkOutSolicitado: string,
  tipoHabitacionId: string,
  cantidadUnidades: number,
  reservas: T[]
): number {
  const ocupadas = contarReservasSuperpuestas(checkInSolicitado, checkOutSolicitado, tipoHabitacionId, reservas);
  return Math.max(0, cantidadUnidades - ocupadas);
}
