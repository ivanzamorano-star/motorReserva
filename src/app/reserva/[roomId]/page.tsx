import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CheckoutForm } from "@/components/booking/checkout-form";
import { reservationRepository } from "@/data/repository";
import { T } from "@/lib/idioma";

export default async function ReservaPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; huespedes?: string; email?: string }>;
}) {
  const { roomId } = await params;
  const sp = await searchParams;
  const checkIn = sp.checkIn ?? "2026-07-18";
  const checkOut = sp.checkOut ?? "2026-07-20";
  const huespedes = sp.huespedes ?? "2";
  const email = sp.email ?? "";

  // Mantiene la tarifa secreta reconocida en la búsqueda a lo largo del checkout.
  const nivel = email ? await reservationRepository.getNivelPorEmail(email) : null;
  const disponibilidad = await reservationRepository.getDisponibilidad(checkIn, checkOut, { nivel });
  const habitacion = disponibilidad.find((h) => h.id === roomId);
  if (!habitacion) notFound();

  return (
    <>
      <SiteHeader />
      <main className="container py-12 sm:py-16">
        <div className="mb-10 max-w-2xl">
          <span className="eyebrow"><T k="co.eyebrow" /></span>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-light tracking-[-0.01em]">
            <T k="co.title" />
          </h1>
          <p className="mt-3 text-muted-foreground">
            <T k="co.subtitle" />
          </p>
        </div>
        <CheckoutForm habitacion={habitacion} checkIn={checkIn} checkOut={checkOut} huespedes={huespedes} />
      </main>
      <SiteFooter />
    </>
  );
}
