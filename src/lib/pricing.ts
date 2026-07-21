// Motor de precios con contexto — fuente única de las "Tarifas Secretas".
// El beneficio por nivel se resuelve aquí (server-side, vía el repositorio),
// nunca en el cliente, para que la tarifa exclusiva no sea visible sin reconocer al huésped.

import type { NivelCliente } from "@/domain/types";

// Descuento automático por nivel de fidelización (0–1).
export const NIVEL_DESCUENTO: Record<NivelCliente, number> = {
  nuevo: 0,
  frecuente: 0.08, // 8% cliente frecuente
  vip: 0.15, // 15% VIP
};

export const NIVEL_LABEL: Record<NivelCliente, string> = {
  nuevo: "Nuevo",
  frecuente: "Frecuente",
  vip: "VIP",
};

export interface TarifaEfectiva {
  tarifaBase: number;
  tarifaNoche: number; // ya con beneficio aplicado
  descuentoPct: number; // 0–1
  ahorro: number; // ahorro absoluto por noche
  nivelAplicado?: NivelCliente;
}

/**
 * Calcula la tarifa efectiva para un precio base dado el nivel del huésped.
 * Si no hay nivel o el nivel no tiene beneficio, devuelve la tarifa pública sin cambios.
 */
export function tarifaEfectiva(
  tarifaBase: number,
  nivel?: NivelCliente | null
): TarifaEfectiva {
  const descuentoPct = nivel ? NIVEL_DESCUENTO[nivel] : 0;
  const tarifaNoche = Math.round(tarifaBase * (1 - descuentoPct));
  return {
    tarifaBase,
    tarifaNoche,
    descuentoPct,
    ahorro: tarifaBase - tarifaNoche,
    nivelAplicado: descuentoPct > 0 ? nivel ?? undefined : undefined,
  };
}
