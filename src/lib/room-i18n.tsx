"use client";

// Helpers de i18n para los datos de habitaciones (nombre/descripcion/amenities).
// Los campos EN son opcionales en TipoHabitacion; si faltan, se cae al español.
// Como los datos vienen de mock-data (server), estos componentes/hook resuelven
// el idioma en el cliente vía el contexto de IdiomaProvider.
import { useIdioma } from "@/lib/idioma";
import type { TipoHabitacion } from "@/domain/types";

type HabTextos = Pick<
  TipoHabitacion,
  "nombre" | "nombreEn" | "descripcion" | "descripcionEn" | "amenities" | "amenitiesEn"
>;

export function useRoomNombre(h: Pick<HabTextos, "nombre" | "nombreEn">): string {
  const { idioma } = useIdioma();
  return idioma === "en" && h.nombreEn ? h.nombreEn : h.nombre;
}

export function useRoomDescripcion(
  h: Pick<HabTextos, "descripcion" | "descripcionEn">
): string {
  const { idioma } = useIdioma();
  return idioma === "en" && h.descripcionEn ? h.descripcionEn : h.descripcion;
}

export function useRoomAmenities(
  h: Pick<HabTextos, "amenities" | "amenitiesEn">
): string[] {
  const { idioma } = useIdioma();
  return idioma === "en" && h.amenitiesEn ? h.amenitiesEn : h.amenities;
}

// Componentes de conveniencia para usar dentro de Server Components (ej. la home),
// que no pueden llamar hooks directamente.
export function RoomNombre({ h }: { h: Pick<HabTextos, "nombre" | "nombreEn"> }) {
  return <>{useRoomNombre(h)}</>;
}

export function RoomDescripcion({
  h,
}: {
  h: Pick<HabTextos, "descripcion" | "descripcionEn">;
}) {
  return <>{useRoomDescripcion(h)}</>;
}

// Chips de amenities con el estilo del showcase de la home.
export function RoomAmenitiesChips({
  h,
  limit = 4,
}: {
  h: Pick<HabTextos, "amenities" | "amenitiesEn">;
  limit?: number;
}) {
  const amenities = useRoomAmenities(h);
  return (
    <>
      {amenities.slice(0, limit).map((a) => (
        <span
          key={a}
          className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[0.68rem] text-muted-foreground"
        >
          {a}
        </span>
      ))}
    </>
  );
}
