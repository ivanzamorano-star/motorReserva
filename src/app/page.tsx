import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SearchBar } from "@/components/booking/search-bar";
import { RoomVisual } from "@/components/booking/room-visual";
import {
  MapPin,
  Mountain,
  Landmark,
  ChevronDown,
  Users,
  Maximize2,
  ArrowRight,
  Coffee,
  UtensilsCrossed,
  Croissant,
  Martini,
} from "lucide-react";
import { reservationRepository } from "@/data/repository";
import { Precio } from "@/lib/moneda";
import { T } from "@/lib/idioma";
import { RoomNombre, RoomDescripcion, RoomAmenitiesChips } from "@/lib/room-i18n";

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
              src="/hero-cabo-froward.png"
              alt="Fachada histórica del Hotel Cabo Froward, Punta Arenas"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 hero-overlay" />
            <div className="absolute inset-0 bg-noise opacity-[0.1]" />
          </div>

          <div className="absolute top-6 left-4 right-4 sm:right-auto sm:top-8 sm:left-8 z-10 inline-flex items-center gap-2 max-w-[calc(100%-2rem)] sm:max-w-none rounded-full border border-gold/40 bg-primary/50 backdrop-blur px-3.5 sm:px-4 py-1.5 text-primary-foreground shadow-sm">
            <MapPin className="h-3.5 w-3.5 text-gold shrink-0" />
            <span className="text-[0.65rem] sm:text-xs font-medium uppercase tracking-[0.1em] sm:tracking-[0.14em] truncate">
              Punta Arenas, Chile · Patagonia
            </span>
          </div>

          <div className="container relative pt-24 pb-12 sm:pt-36 sm:pb-24">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl font-light tracking-[-0.02em] text-balance text-primary-foreground leading-tight">
                <T k="hero.title" />
              </h1>
              <p className="mx-auto mt-4 sm:mt-6 max-w-xl font-display-italic text-base sm:text-lg md:text-xl text-primary-foreground/80 text-balance">
                <T k="hero.subtitle" />
              </p>
              <p className="mx-auto mt-3 sm:mt-4 max-w-lg text-xs sm:text-sm text-primary-foreground/65 text-balance">
                <T k="hero.support" />
              </p>
            </div>

            <div className="mt-12 sm:mt-14 max-w-3xl mx-auto">
              <SearchBar />
            </div>
          </div>

          <div className="relative pb-8 flex flex-col items-center gap-2 text-primary-foreground/55">
            <span className="text-[0.62rem] uppercase tracking-[0.3em]"><T k="hero.discover" /></span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </div>
        </section>

        {/* NUESTRO HOTEL — narrativa de identidad histórica */}
        <section className="bg-secondary/60" id="hotel">
          <div className="container py-20 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow-center"><T k="home.hotel.eyebrow" /></span>
              <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-light tracking-[-0.01em]">
                <T k="home.hotel.title" />
              </h2>
              <p className="mt-5 text-muted-foreground text-balance leading-relaxed">
                <T k="home.hotel.subtitle" />
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {[
                { icon: MapPin, k: "c1" },
                { icon: Mountain, k: "c2" },
                { icon: Landmark, k: "c3" },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <article key={c.k} className="card-accent p-7">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <h3 className="mt-5 font-serif text-xl font-medium">
                      <T k={`home.hotel.${c.k}.title`} />
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      <T k={`home.hotel.${c.k}.text`} />
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
            <span className="eyebrow-center"><T k="home.rooms.eyebrow" /></span>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl font-light tracking-[-0.01em]">
              <T k="home.rooms.title" />
            </h2>
            <p className="text-muted-foreground mt-5 leading-relaxed text-balance">
              <T k="home.rooms.subtitle" />
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
                      <T k="home.rooms.badge" />
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-serif text-2xl font-medium"><RoomNombre h={h} /></h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    <RoomDescripcion h={h} />
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-gold" />{" "}
                      <T k="home.rooms.upTo" vars={{ n: h.capacidad }} />
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Maximize2 className="h-3.5 w-3.5 text-gold" /> {h.metros2} m²
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <RoomAmenitiesChips h={h} limit={4} />
                  </div>

                  <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-border pt-5 mt-6">
                    <div>
                      <p className="text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
                        <T k="home.rooms.from" />
                      </p>
                      <p className="font-serif text-2xl font-medium text-primary">
                        <Precio value={h.tarifaNoche} />
                        <span className="text-sm font-sans text-muted-foreground">
                          {" "}
                          <T k="home.rooms.perNight" />
                        </span>
                      </p>
                    </div>
                    <Link
                      href={`/reserva/${h.id}?checkIn=${CHECK_IN}&checkOut=${CHECK_OUT}&huespedes=2`}
                      className="btn-gold h-11 px-5 text-[0.62rem] gap-1.5"
                    >
                      <T k="home.rooms.book" /> <ArrowRight className="h-3.5 w-3.5" />
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
              <T k="home.rooms.viewAll" />{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* GASTRONOMÍA — dos ambientes, editorial de lujo */}
        <section className="bg-secondary/60" id="restaurant">
          <div className="container py-20 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow-center"><T k="home.food.eyebrow" /></span>
              <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-light tracking-[-0.01em]">
                <T k="home.food.title" />
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed text-balance">
                <T k="home.food.subtitle" />
              </p>
            </div>

            <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-8">
              <figure className="lg:col-span-7 group">
                <div className="relative overflow-hidden rounded-2xl border border-gold/20 shadow-xl aspect-[4/5]">
                  <Image
                    src="/images/comedor.png"
                    alt="Comedor Nao Victoria, Hotel Cabo Froward"
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/0 to-transparent" />
                  <div className="absolute inset-x-5 bottom-5 flex items-center gap-3 text-primary-foreground">
                    <UtensilsCrossed className="h-5 w-5 text-gold shrink-0" strokeWidth={1.5} />
                    <span className="text-[0.7rem] font-medium uppercase tracking-[0.28em]">
                      <T k="home.food.room1.eyebrow" />
                    </span>
                  </div>
                </div>
                <figcaption className="mt-6 max-w-md">
                  <div className="h-px w-10 bg-gold/50" />
                  <h3 className="mt-4 font-serif text-2xl sm:text-3xl font-light">
                    <T k="home.food.room1.title" />
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    <T k="home.food.room1.text" />
                  </p>
                </figcaption>
              </figure>

              <figure className="lg:col-span-5 lg:mt-24 group">
                <div className="relative overflow-hidden rounded-2xl border border-gold/20 shadow-xl aspect-[4/5]">
                  <Image
                    src="/images/comedor-vidriado.png"
                    alt="Comedor Charles Darwin, Hotel Cabo Froward"
                    fill
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/0 to-transparent" />
                  <div className="absolute inset-x-5 bottom-5 flex items-center gap-3 text-primary-foreground">
                    <Croissant className="h-5 w-5 text-gold shrink-0" strokeWidth={1.5} />
                    <span className="text-[0.7rem] font-medium uppercase tracking-[0.28em]">
                      <T k="home.food.room2.eyebrow" />
                    </span>
                  </div>
                </div>
                <figcaption className="mt-6 max-w-md">
                  <div className="h-px w-10 bg-gold/50" />
                  <h3 className="mt-4 font-serif text-2xl sm:text-3xl font-light">
                    <T k="home.food.room2.title" />
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    <T k="home.food.room2.text" />
                  </p>
                </figcaption>
              </figure>
            </div>

            <div className="mt-16 pt-10 border-t border-border grid gap-5 sm:grid-cols-3">
              {[
                { icon: Croissant, k: "c1" },
                { icon: UtensilsCrossed, k: "c2" },
                { icon: Coffee, k: "c3" },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.k} className="text-center sm:text-left">
                    <div className="mx-auto sm:mx-0 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <p className="mt-4 font-serif text-base font-medium">
                      <T k={`home.food.${c.k}.title`} />
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      <T k={`home.food.${c.k}.text`} />
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BAR — salón de cócteles con historia patagónica */}
        <section id="bar">
          <div className="container py-20 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="lg:pr-6">
                <span className="eyebrow"><T k="home.bar.eyebrow" /></span>
                <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-light tracking-[-0.01em]">
                  <T k="home.bar.title" />
                </h2>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                  <T k="home.bar.subtitle" />
                </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-gold/20 shadow-xl group">
                <Image
                  src="/images/bar.png"
                  alt="Bar Luis Pardo, Hotel Cabo Froward"
                  width={1000}
                  height={667}
                  className="w-full h-[420px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/0 to-transparent" />
                <div className="absolute inset-x-6 bottom-6 flex items-center gap-3 text-primary-foreground">
                  <Martini className="h-5 w-5 text-gold shrink-0" strokeWidth={1.5} />
                  <span className="text-[0.7rem] font-medium uppercase tracking-[0.28em]">
                    <T k="home.bar.tag" />
                  </span>
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
            <span className="eyebrow-center text-gold"><T k="home.cta.eyebrow" /></span>
            <h2 className="mx-auto mt-5 max-w-3xl font-serif text-3xl sm:text-5xl font-light tracking-[-0.01em] text-balance">
              <T k="home.cta.title" />
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-primary-foreground/75 leading-relaxed text-balance">
              <T k="home.cta.subtitle" />
            </p>
            <Link
              href={`/habitaciones?checkIn=${CHECK_IN}&checkOut=${CHECK_OUT}&huespedes=2`}
              className="btn-gold mt-9 h-12 px-8 text-[0.68rem]"
            >
              <T k="home.cta.button" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
