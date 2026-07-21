import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { T } from "@/lib/idioma";
import { PreferenciasSwitch } from "@/components/preferencias-switch";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Hotel Plaza · Punta Arenas">
          <Image
            src="/logo-plaza-dark.png"
            alt="Hotel Plaza Punta Arenas"
            width={56}
            height={70}
            priority
            className="h-14 w-auto dark:hidden"
          />
          <Image
            src="/logo-plaza-white.png"
            alt="Hotel Plaza Punta Arenas"
            width={56}
            height={70}
            priority
            className="hidden h-14 w-auto dark:block"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-[0.8rem] font-medium tracking-[0.02em] text-foreground/80">
          <Link href="/#hotel" className="hover:text-gold transition-colors"><T k="nav.hotel" /></Link>
          <Link href="/#habitaciones" className="hover:text-gold transition-colors"><T k="nav.rooms" /></Link>
          <Link href="/#restaurant" className="hover:text-gold transition-colors"><T k="nav.restaurant" /></Link>
          <Link href="/#contacto" className="hover:text-gold transition-colors"><T k="nav.contact" /></Link>
          <Link href="/mi-cuenta" className="hover:text-gold transition-colors"><T k="nav.account" /></Link>
        </nav>
        <div className="flex items-center gap-3">
          <PreferenciasSwitch />
          <ThemeToggle />
          <Link
            href="/admin"
            className="btn-gold hidden sm:inline-flex h-10 px-5 text-[0.62rem]"
          >
            <T k="nav.panel" />
          </Link>
        </div>
      </div>
    </header>
  );
}
