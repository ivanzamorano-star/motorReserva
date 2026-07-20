import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CheckoutForm } from "@/components/booking/checkout-form";
import { reservationRepository } from "@/data/repository";

export default async function ReservaPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; huespedes?: string }>;
}) {
  const { roomId } = await params;
  const sp = await searchParams;
  const checkIn = sp.checkIn ?? "2026-07-18";
  const checkOut = sp.checkOut ?? "2026-07-20";
  const huespedes = sp.huespedes ?? "2";

  const disponibilidad = await reservationRepository.getDisponibilidad(checkIn, checkOut);
  const habitacion = disponibilidad.find((h) => h.id === roomId);
  if (!habitacion) notFound();

  return (
    <>
      <SiteHeader />
      <main className="container py-12 sm:py-16">
        <div className="mb-10 max-w-2xl">
          <span className="eyebrow">Reserva directa</span>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-light tracking-[-0.01em]">
            Complete su reserva
          </h1>
          <p className="mt-3 text-muted-foreground">
            A pasos de confirmar su estadía en el corazón histórico de Punta Arenas.
          </p>
        </div>
        <CheckoutForm habitacion={habitacion} checkIn={checkIn} checkOut={checkOut} huespedes={huespedes} />
      </main>
      <SiteFooter />
    </>
  );
}
