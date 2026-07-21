"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Users, Search, Crown, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useIdioma } from "@/lib/idioma";

function todayISO(offsetDays = 0) {
  const d = new Date("2026-07-17");
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

type Reconocimiento =
  | { reconocido: true; nombre: string; nivel: string; nivelLabel: string; descuentoPct: number }
  | { reconocido: false };

const esEmailValido = (v: string) => /\S+@\S+\.\S+/.test(v.trim());

export function SearchBar({
  compact = false,
  defaultEmail = "",
}: {
  compact?: boolean;
  defaultEmail?: string;
}) {
  const router = useRouter();
  const { t } = useIdioma();
  const [checkIn, setCheckIn] = React.useState(todayISO(1));
  const [checkOut, setCheckOut] = React.useState(todayISO(3));
  const [huespedes, setHuespedes] = React.useState(2);
  const [email, setEmail] = React.useState(defaultEmail);
  const [mostrarEmail, setMostrarEmail] = React.useState(!!defaultEmail);
  const [reconocimiento, setReconocimiento] = React.useState<Reconocimiento | null>(null);
  const [verificando, setVerificando] = React.useState(false);
  const [enviando, setEnviando] = React.useState(false);

  // Reconocimiento en vivo del correo (debounced), para dar feedback inmediato.
  React.useEffect(() => {
    const valor = email.trim();
    if (!esEmailValido(valor)) {
      setReconocimiento(null);
      setVerificando(false);
      return;
    }
    setVerificando(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/reconocer-huesped?email=${encodeURIComponent(valor)}`, {
          signal: ctrl.signal,
        });
        const data = (await res.json()) as Reconocimiento;
        setReconocimiento(data);
      } catch {
        /* cancelado */
      } finally {
        setVerificando(false);
      }
    }, 450);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [email]);

  const beneficioVip = reconocimiento?.reconocido && reconocimiento.descuentoPct > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    const params = new URLSearchParams({ checkIn, checkOut, huespedes: String(huespedes) });
    if (email.trim()) params.set("email", email.trim());
    track("search", { check_in: checkIn, check_out: checkOut, guests: huespedes, recognized: !!email.trim() });
    router.push(`/habitaciones?${params.toString()}`);
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      className={
        compact
          ? "flex flex-col gap-3 bg-card border border-border rounded-lg p-4 shadow-sm"
          : "flex flex-col gap-3 bg-card/98 backdrop-blur border border-border/80 rounded-lg p-6 shadow-2xl"
      }
    >
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-end">
      <div className="flex-1 min-w-0">
        <Label htmlFor="checkin" className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground mb-1.5 sm:mb-2">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" /> Check-in
        </Label>
        <input
          id="checkin"
          type="date"
          required
          value={checkIn}
          min={todayISO(0)}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full h-10 sm:h-11 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="flex-1 min-w-0">
        <Label htmlFor="checkout" className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground mb-1.5 sm:mb-2">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" /> Check-out
        </Label>
        <input
          id="checkout"
          type="date"
          required
          value={checkOut}
          min={checkIn}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full h-10 sm:h-11 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="w-full sm:w-28">
        <Label htmlFor="huespedes" className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground mb-1.5 sm:mb-2">
          <Users className="h-3.5 w-3.5 shrink-0" /> {t("sb.guests")}
        </Label>
        <input
          id="huespedes"
          type="number"
          min={1}
          max={6}
          value={huespedes}
          onChange={(e) => setHuespedes(Number(e.target.value))}
          className="w-full h-10 sm:h-11 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <Button type="submit" size="lg" variant="gold" className="gap-2 shrink-0 h-10 sm:h-11" disabled={enviando}>
        {enviando ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> {t("sb.searching")}
          </>
        ) : (
          <>
            <Search className="h-4 w-4" /> {beneficioVip ? t("sb.viewRooms") : t("sb.search")}
          </>
        )}
      </Button>
      </div>

      {/* Reconocimiento de huésped: tarifa exclusiva por correo */}
      <div className="border-t border-border/60 pt-3">
        {!mostrarEmail ? (
          <button
            type="button"
            onClick={() => setMostrarEmail(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gold hover:text-gold-deep transition-colors"
          >
            <Crown className="h-3.5 w-3.5" />
            {t("sb.emailToggle")}
          </button>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="email-cliente" className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-gold">
              <Crown className="h-3.5 w-3.5" /> {t("sb.emailLabel")}
            </Label>
            <div className="relative">
              <input
                id="email-cliente"
                type="email"
                value={email}
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("sb.emailPlaceholder")}
                className={
                  "w-full h-11 rounded-md border bg-background pl-3 pr-10 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                  (beneficioVip ? "border-gold ring-1 ring-gold/50" : "border-input")
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {verificando ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : beneficioVip ? (
                  <Check className="h-4 w-4 text-gold" strokeWidth={2.5} />
                ) : null}
              </span>
            </div>

            {/* Feedback de reconocimiento en vivo */}
            <AnimatePresence mode="wait">
              {reconocimiento && !verificando && (
                <motion.div
                  key={reconocimiento.reconocido ? "ok" : "no"}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {reconocimiento.reconocido && reconocimiento.descuentoPct > 0 ? (
                    <p className="flex items-center gap-1.5 text-xs text-gold">
                      <Crown className="h-3.5 w-3.5 shrink-0" />
                      ¡Hola {reconocimiento.nombre}! Tu descuento{" "}
                      <span className="font-semibold">{reconocimiento.nivelLabel}</span> de{" "}
                      <span className="font-semibold">−{Math.round(reconocimiento.descuentoPct * 100)}%</span> ya está
                      activo — continúa para ver las habitaciones.
                    </p>
                  ) : reconocimiento.reconocido ? (
                    <p className="text-xs text-muted-foreground">
                      {t("sb.recognizedNew", { nombre: reconocimiento.nombre })}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground/80">
                      {t("sb.notFound")}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.form>
  );
}
