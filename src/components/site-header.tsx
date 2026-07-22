import Link from "next/link";
import Image from "next/image";
import { User, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { T } from "@/lib/idioma";
import { PreferenciasSwitch } from "@/components/preferencias-switch";
import { MobileMenu } from "@/components/mobile-menu";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur relative">
      <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="container flex h-16 sm:h-20 items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Hotel Cabo Froward · Punta Arenas">
          <Image
            src="/logo-cabo-froward-mark.png"
            alt="Hotel Cabo Froward"
            width={40}
            height={50}
            priority
            className="h-9 sm:h-12 w-auto"
          />
          <span className="font-serif text-base sm:text-xl font-semibold text-gold tracking-wide whitespace-nowrap">
            Cabo Froward
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-6 xl:gap-10 text-[0.8rem] font-medium tracking-[0.02em] text-foreground/80">
          <Link href="/#hotel" className="hover:text-gold transition-colors"><T k="nav.hotel" /></Link>
          <Link href="/#habitaciones" className="hover:text-gold transition-colors"><T k="nav.rooms" /></Link>
          <Link href="/#restaurant" className="hover:text-gold transition-colors"><T k="nav.restaurant" /></Link>
          <Link href="/#bar" className="hover:text-gold transition-colors"><T k="nav.bar" /></Link>
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1 hover:text-gold transition-colors"
            >
              <T k="nav.reservations" />
              <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 translate-y-1 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0">
              <div className="w-60 overflow-hidden rounded-xl border border-border/70 bg-background shadow-lg">
                <Link
                  href="/habitaciones"
                  className="block px-4 py-3 text-sm normal-case tracking-normal hover:bg-secondary/60 hover:text-gold transition-colors"
                >
                  <T k="nav.reservations.room" />
                </Link>
                <Link
                  href="https://hotel-nogueira-reservas.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border-t border-border/50 px-4 py-3 text-sm normal-case tracking-normal hover:bg-secondary/60 hover:text-gold transition-colors"
                >
                  <T k="nav.reservations.restaurant" />
                </Link>
              </div>
            </div>
          </div>
          <Link href="/#contacto" className="hover:text-gold transition-colors"><T k="nav.contact" /></Link>
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="hidden lg:flex items-center gap-3">
            <PreferenciasSwitch />
            <ThemeToggle />
            <Button asChild variant="ghost" size="icon" className="relative group">
              <Link href="/mi-cuenta" aria-label="Mi cuenta">
                <User className="h-4 w-4" />
                <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-2.5 py-1 text-[0.65rem] font-medium normal-case tracking-normal text-primary-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
                  <T k="nav.account" />
                </span>
              </Link>
            </Button>
            <Link
              href="/admin"
              className="btn-gold inline-flex h-10 px-5 text-[0.62rem]"
            >
              <T k="nav.panel" />
            </Link>
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
