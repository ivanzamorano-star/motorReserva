// Comparación honesta frente a las OTAs (Booking, Expedia).
// Las OTAs muestran la misma tarifa de habitación (paridad), pero le suman al
// huésped un cargo de servicio/gestión típico (~12%). Reservar directo evita ese
// cargo y garantiza el mejor precio — este es el argumento central de venta directa.

export const OTA_RECARGO_SERVICIO = 0.12;

// Precio de referencia que pagaría el huésped en una OTA (tarifa pública + cargo),
// redondeado a la centena más cercana para mostrar un número limpio.
export function precioReferenciaOTA(precioPublico: number): number {
  return Math.round((precioPublico * (1 + OTA_RECARGO_SERVICIO)) / 100) * 100;
}
