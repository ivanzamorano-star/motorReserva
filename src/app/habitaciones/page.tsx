import { SearchX, Crown, ShieldCheck, CalendarCheck2, Wallet, HeartHandshake } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SearchBar } from "@/components/booking/search-bar";
import { RoomCard } from "@/components/booking/room-card";
import { SavedSearch } from "@/components/booking/saved-search";
import { reservationRepository } from "@/data/repository";
import { formatDate, nightsBetween } from "@/lib/utils";
import { NIVEL_LABEL } from "@/lib/pricing";
import { T } from "@/lib/idioma";

export default async function HabitacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ checkIn?: string; checkOut?: string; huespedes?: string; email?: string }>;
}) {
  const sp = await searchParams;
  const checkIn = sp.checkIn ?? "2026-07-18";
  const checkOut = sp.checkOut ?? "2026-07-20";
  const huespedes = sp.huespedes ?? "2";
  const email = sp.email ?? "";

  // Reconocimiento del huésped → tarifa secreta según su nivel.
  const nivel = email ? await reservationRepository.getNivelPorEmail(email) : null;
  const disponibilidad = await reservationRepository.getDisponibilidad(checkIn, checkOut, { nivel });
  const beneficio = disponibilidad.find((h) => h.descuentoPct)?.descuentoPct ?? 0;
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
          <SearchBar compact defaultEmail={email} />
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h1 className="font-serif text-2xl font-semibold"><T k="res.title" /></h1>
          <p className="text-sm text-muted-foreground">
            {formatDate(checkIn)} — {formatDate(checkOut)} · {noches}{" "}
            <T k={noches === 1 ? "res.night" : "res.nights"} /> · {huespedes}{" "}
            <T k="res.guests" />
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-border bg-secondary/40 p-4">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-gold mb-3">
            <T k="res.vs.eyebrow" />
          </p>
          <div className="grid gap-y-3 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, k: "res.vs.bestPrice" },
              { icon: CalendarCheck2, k: "res.vs.flexCancel" },
              { icon: Wallet, k: "res.vs.noFees" },
              { icon: HeartHandshake, k: "res.vs.directCare" },
            ].map(({ icon: Icon, k }) => (
              <div key={k} className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.75} />
                <span className="text-sm"><T k={k} /></span>
              </div>
            ))}
          </div>
        </div>

        {nivel && beneficio > 0 && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-gold/40 bg-gold/[0.08] px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-gold/15 text-gold">
              <Crown className="h-5 w-5" strokeWidth={1.6} />
            </div>
            <div>
              <p className="font-serif text-base font-medium">
                <T k="res.vip.title" vars={{ nivel: NIVEL_LABEL[nivel], pct: Math.round(beneficio * 100) }} />
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                <T k="res.vip.subtitle" />
              </p>
            </div>
          </div>
        )}

        {!hayAlgunaDisponible && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/[0.06] px-5 py-4">
            <SearchX className="h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="font-serif text-base font-medium">
                <T k="res.soldOut.title" />
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                <T k="res.soldOut.subtitle" />
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-5">
          {habitaciones.map((h, i) => (
            <RoomCard key={h.id} habitacion={h} checkIn={checkIn} checkOut={checkOut} huespedes={huespedes} email={email} index={i} />
          ))}
        </div>

        <SavedSearch />
      </main>
      <SiteFooter />
    </>
  );
}
