import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SearchBar } from "@/components/booking/search-bar";
import { RoomVisual } from "@/components/booking/room-visual";
import {
  MapPin,
  Mountain,
  Sparkles,
  ChevronDown,
  Users,
  Maximize2,
  ArrowRight,
  Coffee,
  UtensilsCrossed,
  Croissant,
} from "lucide-react";
import { reservationRepository } from "@/data/repository";
import { formatCLP } from "@/lib/utils";

const CHECK_IN = "2026-07-18";
const CHECK_OUT = "2026-07-20";

export default async function HomePage() {
  const disponibilidad = await reservationRepository.getDisponibilidad(
    CHECK_IN,
    CHECK_OUT
  );

  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO — fotografía histórica a sangre con overlay navy */}
        <section className="relative overflow-hidden" id="inicio">
          <div className="absolute inset-0">
            <Image
              src="https://www.hotelplaza.cl/images/hotel_fachada_color.webp"
              alt="Fachada histórica del Hotel Plaza, Punta Arenas"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 hero-overlay" />
            <div className="absolute inset-0 bg-noise opacity-[0.1]" />
          </div>

          <div className="container relative pt-28 pb-16 sm:pt-36 sm:pb-24">
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow-center text-gold">
                Punta Arenas · Patagonia Chilena
              </span>
              <h1 className="mt-7 font-serif text-5xl sm:text-7xl font-light tracking-[-0.02em] text-balance text-primary-foreground">
                Tradición y calidez en el
                <br className="hidden sm:block" /> corazón de Punta Arenas
              </h1>
              <p className="mx-auto mt-6 max-w-xl font-display-italic text-lg sm:text-xl text-primary-foreground/80 text-balance">
                Un edificio histórico frente a la Plaza de Armas, a pasos del
                Estrecho de Magallanes.
              </p>
              <p className="mx-auto mt-4 max-w-lg text-sm text-primary-foreground/65 text-balance">
                Reserve en línea con disponibilidad real y confirmación
                inmediata — directo con el hotel, sin intermediarios.
              </p>
            </div>

            <div className="mt-12 sm:mt-14 max-w-3xl mx-auto">
              <SearchBar />
            </div>
          </div>

          <div className="relative pb-8 flex flex-col items-center gap-2 text-primary-foreground/55">
            <span className="text-[0.62rem] uppercase tracking-[0.3em]">Descubre</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </div>
        </section>

        {/* NUESTRO HOTEL — narrativa de identidad histórica */}
        <section className="bg-secondary/60" id="hotel">
          <div className="container py-20 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow-center">Nuestro hotel</span>
              <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-light tracking-[-0.01em]">
                Un clásico de Punta Arenas
              </h2>
              <p className="mt-5 text-muted-foreground text-balance leading-relaxed">
                El Hotel Plaza forma parte de la identidad histórica de la
                ciudad. Una estadía cálida y cercana, en una ubicación
                privilegiada para descubrir la Patagonia chilena.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: MapPin,
                  titulo: "Ubicación privilegiada",
                  texto:
                    "Frente a la Plaza de Armas y a pasos de restaurantes, cafeterías, museos y los principales atractivos de Punta Arenas.",
                },
                {
                  icon: Mountain,
                  titulo: "Puerta de entrada a la Patagonia",
                  texto:
                    "El punto de partida ideal para descubrir Torres del Paine, el Estrecho de Magallanes y las grandes aventuras del sur de Chile.",
                },
                {
                  icon: Sparkles,
                  titulo: "Tradición y calidez austral",
                  texto:
                    "Un hotel con identidad histórica, espacios acogedores y la hospitalidad característica del extremo sur del mundo.",
                },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <article key={c.titulo} className="card-accent p-7">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <h3 className="mt-5 font-serif text-xl font-medium">
                      {c.titulo}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {c.texto}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* HABITACIONES — showcase editorial con fotos reales */}
        <section className="container py-20 sm:py-28" id="habitaciones">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="eyebrow-center">Alojamiento</span>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl font-light tracking-[-0.01em]">
              Nuestras habitaciones
            </h2>
            <p className="text-muted-foreground mt-5 leading-relaxed text-balance">
              Espacios cálidos y cuidados en un edificio de época, con
              detalles clásicos, ropa de cama impecable y el silencio del
              extremo sur. Elija la suya y reserve con tarifa directa.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {disponibilidad.map((h, i) => (
              <article key={h.id} className="group card-accent flex flex-col">
                <div className="relative overflow-hidden">
                  <RoomVisual
                    gradient="from-primary/40 via-primary/0 to-transparent"
                    imageUrl={h.imagenUrl}
                    alt={h.nombre}
                    priority={i === 0}
                    className="h-64 transition-transform duration-700 group-hover:scale-105"
                  />
                  {h.id === "hab-suite" && (
                    <span className="absolute top-4 left-4 rounded-full bg-gold px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-gold-foreground">
                      Más exclusiva
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-serif text-2xl font-medium">{h.nombre}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {h.descripcion}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-gold" /> Hasta{" "}
                      {h.capacidad} huéspedes
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Maximize2 className="h-3.5 w-3.5 text-gold" /> {h.metros2} m²
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {h.amenities.slice(0, 4).map((a) => (
                      <span
                        key={a}
                        className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[0.68rem] text-muted-foreground"
                      >
                        {a}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-end justify-between border-t border-border pt-5 mt-6">
                    <div>
                      <p className="text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
                        Desde
                      </p>
                      <p className="font-serif text-2xl font-medium text-primary">
                        {formatCLP(h.tarifaNoche)}
                        <span className="text-sm font-sans text-muted-foreground">
                          {" "}
                          / noche
                        </span>
                      </p>
                    </div>
                    <Link
                      href={`/reserva/${h.id}?checkIn=${CHECK_IN}&checkOut=${CHECK_OUT}&huespedes=2`}
                      className="btn-gold h-11 px-5 text-[0.62rem] gap-1.5"
                    >
                      Reservar <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={`/habitaciones?checkIn=${CHECK_IN}&checkOut=${CHECK_OUT}&huespedes=2`}
              className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-deep transition-colors"
            >
              Ver todas las habitaciones y disponibilidad{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* GASTRONOMÍA — comedor de época y desayuno casero */}
        <section className="bg-secondary/60" id="restaurant">
          <div className="container py-20 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src="https://www.hotelplaza.cl/images/3.webp"
                    alt="Comedor histórico del Hotel Plaza"
                    width={900}
                    height={640}
                    className="w-full h-[420px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-4 hidden sm:block w-44 overflow-hidden rounded-xl border-4 border-background shadow-lg">
                  <Image
                    src="https://www.hotelplaza.cl/images/20.webp"
                    alt="Desayuno casero"
                    width={320}
                    height={240}
                    className="w-full h-32 object-cover"
                  />
                </div>
              </div>

              <div className="lg:pl-6">
                <span className="eyebrow">Gastronomía</span>
                <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-light tracking-[-0.01em]">
                  Desayuno casero en un comedor de época
                </h2>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                  Cada mañana servimos un desayuno preparado en casa —
                  queques recién horneados, pan caliente, mermeladas
                  artesanales y café— en un comedor clásico que conserva la
                  calidez y el carácter del edificio histórico.
                </p>

                <div className="mt-8 grid gap-5 sm:grid-cols-3">
                  {[
                    {
                      icon: Croissant,
                      titulo: "Hecho en casa",
                      texto: "Queques y panes recién horneados cada mañana.",
                    },
                    {
                      icon: UtensilsCrossed,
                      titulo: "Comedor histórico",
                      texto: "Mesas vestidas en un salón de época.",
                    },
                    {
                      icon: Coffee,
                      titulo: "Café de la casa",
                      texto: "Para comenzar el día antes de salir a explorar.",
                    },
                  ].map((c) => {
                    const Icon = c.icon;
                    return (
                      <div key={c.titulo}>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
                          <Icon className="h-5 w-5" strokeWidth={1.5} />
                        </div>
                        <p className="mt-4 font-serif text-base font-medium">
                          {c.titulo}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                          {c.texto}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FRANJA ASPIRACIONAL — Patagonia a sus pies */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://www.hotelplaza.cl/images/torres_fondo.webp"
              alt="Torres del Paine al atardecer"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-primary/70" />
          </div>
          <div className="container relative py-24 sm:py-32 text-center text-primary-foreground">
            <span className="eyebrow-center text-gold">Su base en el fin del mundo</span>
            <h2 className="mx-auto mt-5 max-w-3xl font-serif text-3xl sm:text-5xl font-light tracking-[-0.01em] text-balance">
              Duerma en el corazón de Punta Arenas, despierte en la Patagonia
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-primary-foreground/75 leading-relaxed text-balance">
              Torres del Paine, el Estrecho de Magallanes y los pingüinos de
              Magdalena, a un paso de su habitación.
            </p>
            <Link
              href={`/habitaciones?checkIn=${CHECK_IN}&checkOut=${CHECK_OUT}&huespedes=2`}
              className="btn-gold mt-9 h-12 px-8 text-[0.68rem]"
            >
              Reserve su estadía
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
