"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { T } from "@/lib/idioma";
import { ThemeToggle } from "@/components/theme-toggle";
import { PreferenciasSwitch } from "@/components/preferencias-switch";

const LINKS = [
  { href: "/#hotel", k: "nav.hotel" },
  { href: "/#habitaciones", k: "nav.rooms" },
  { href: "/#restaurant", k: "nav.restaurant" },
  { href: "/#bar", k: "nav.bar" },
  { href: "/habitaciones", k: "nav.reservations.room" },
  { href: "https://hotel-nogueira-reservas.vercel.app", k: "nav.reservations.restaurant", external: true },
  { href: "/#contacto", k: "nav.contact" },
  { href: "/mi-cuenta", k: "nav.account" },
] as const;

// Menú de navegación mobile/tablet del sitio público (el <nav> completo solo
// entra cómodo desde ~1024px; por debajo — celulares y tablets — se usa esto).
export function MobileMenu() {
  const [abierto, setAbierto] = React.useState(false);

  React.useEffect(() => {
    if (!abierto) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [abierto]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={abierto}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-foreground/80 transition-colors hover:border-gold/50 hover:text-gold"
      >
        {abierto ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-x-0 top-full z-50 overflow-hidden border-b border-border/70 bg-background shadow-lg"
          >
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain">
              <div className="container flex items-center gap-3 py-3 border-b border-border/40">
                <PreferenciasSwitch />
                <ThemeToggle />
              </div>
              <nav className="container flex flex-col py-2 text-sm font-medium tracking-[0.02em] text-foreground/80">
                {LINKS.map((l) =>
                  "external" in l && l.external ? (
                    <a
                      key={l.k}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setAbierto(false)}
                      className="border-b border-border/40 py-3.5 last:border-b-0 hover:text-gold transition-colors"
                    >
                      <T k={l.k} />
                    </a>
                  ) : (
                    <Link
                      key={l.k}
                      href={l.href}
                      onClick={() => setAbierto(false)}
                      className="border-b border-border/40 py-3.5 last:border-b-0 hover:text-gold transition-colors"
                    >
                      <T k={l.k} />
                    </Link>
                  )
                )}
                <Link
                  href="/admin"
                  onClick={() => setAbierto(false)}
                  className="btn-gold my-4 h-11 justify-center text-[0.62rem]"
                >
                  <T k="nav.panel" />
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
