import { SearchX } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SearchBar } from "@/components/booking/search-bar";
import { RoomCard } from "@/components/booking/room-card";
import { reservationRepository } from "@/data/repository";
import { formatDate, nightsBetween } from "@/lib/utils";

export default async function HabitacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ checkIn?: string; checkOut?: string; huespedes?: string }>;
}) {
  const sp = await searchParams;
  const checkIn = sp.checkIn ?? "2026-07-18";
  const checkOut = sp.checkOut ?? "2026-07-20";
  const huespedes = sp.huespedes ?? "2";

  const disponibilidad = await reservationRepository.getDisponibilidad(checkIn, checkOut);
  // Se muestran todas las categorías, con las disponibles primero y las agotadas al final
  // (estas últimas quedan en la tarjeta como "Agotado para estas fechas", sin ocultarse).
  const habitaciones = [...disponibilidad].sort(
    (a, b) => Number(b.unidadesDisponibles > 0) - Number(a.unidadesDisponibles > 0)
  );
  const hayAlgunaDisponible = habitaciones.some((h) => h.unidadesDisponibles > 0);
  const noches = nightsBetween(checkIn, checkOut);

  return (
    <>
      <SiteHeader />
      <main className="container py-10">
        <div className="mb-8">
          <SearchBar compact />
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
          <h1 className="font-serif text-2xl font-semibold">Disponibilidad para su estadía</h1>
          <p className="text-sm text-muted-foreground">
            {formatDate(checkIn)} — {formatDate(checkOut)} · {noches} {noches === 1 ? "noche" : "noches"} · {huespedes} huésped(es)
          </p>
        </div>

        {!hayAlgunaDisponible && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/[0.06] px-5 py-4">
            <SearchX className="h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="font-serif text-base font-medium">
                No quedan habitaciones para estas fechas.
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Puede intentar con otras fechas u otro número de huéspedes.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-5">
          {habitaciones.map((h, i) => (
            <RoomCard key={h.id} habitacion={h} checkIn={checkIn} checkOut={checkOut} huespedes={huespedes} index={i} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
