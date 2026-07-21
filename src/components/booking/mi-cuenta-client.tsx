"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Search,
  Loader2,
  Mail,
  Phone,
  X,
  ArrowRight,
  CalendarDays,
  Users,
  SearchX,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, formatDate } from "@/lib/utils";
import { useMoneda } from "@/lib/moneda";
import { useIdioma } from "@/lib/idioma";
import { WhatsAppIcon, linkWhatsApp } from "@/components/whatsapp-button";
import { buscarPerfil } from "@/app/mi-cuenta/actions";
import type { PerfilHuesped, ReservaPortal } from "@/data/repository";
import type { EstadoReserva, NivelCliente } from "@/domain/types";

function tonoEstado(estado: EstadoReserva): string {
  if (estado === "confirmada") return "border-success/40 bg-success/10 text-success";
  if (estado === "pendiente_pago") return "border-gold/40 bg-gold/10 text-gold";
  return "border-border bg-secondary/70 text-muted-foreground";
}

export function MiCuentaClient() {
  const { t, idioma } = useIdioma();
  const { formatear } = useMoneda();
  const [email, setEmail] = React.useState("");
  const [cargando, setCargando] = React.useState(false);
  const [perfil, setPerfil] = React.useState<PerfilHuesped | null>(null);
  const [sel, setSel] = React.useState<ReservaPortal | null>(null);

  const nombreHab = (r: ReservaPortal) =>
    idioma === "en" && r.habitacionNombreEn ? r.habitacionNombreEn : r.habitacionNombre ?? "";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setCargando(true);
    try {
      const p = await buscarPerfil(email);
      setPerfil(p);
    } finally {
      setCargando(false);
    }
  }

  function reiniciar() {
    setPerfil(null);
    setSel(null);
    setEmail("");
  }

  const reconocido = perfil?.encontrado === true;
  const nivel = (perfil?.nivel ?? "nuevo") as NivelCliente;
  const pct = Math.round((perfil?.descuentoPct ?? 0) * 100);
  // B2 — progreso de fidelización (estadías → siguiente nivel). Umbrales demo.
  const estadias = perfil?.reservas.length ?? 0;
  const SIGUIENTE: Record<NivelCliente, { nivel: NivelCliente; umbral: number } | null> = {
    nuevo: { nivel: "frecuente", umbral: 2 },
    frecuente: { nivel: "vip", umbral: 5 },
    vip: null,
  };
  const siguiente = SIGUIENTE[nivel];
  const faltan = siguiente ? Math.max(0, siguiente.umbral - estadias) : 0;
  const progreso = siguiente ? Math.min(100, Math.round((estadias / siguiente.umbral) * 100)) : 100;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <span className="eyebrow">{t("mc.eyebrow")}</span>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-light tracking-[-0.01em]">
          {t("mc.title")}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("mc.subtitle")}</p>
      </div>

      {/* Formulario de acceso por correo (sin login real — demo) */}
      {!reconocido && (
        <form onSubmit={onSubmit} className="card-accent p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="mc-email">{t("mc.emailLabel")}</Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                id="mc-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("mc.emailPh")}
                className="flex-1"
              />
              <Button type="submit" variant="gold" className="gap-2" disabled={cargando}>
                {cargando ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> {t("mc.searching")}
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" /> {t("mc.enter")}
                  </>
                )}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/80">{t("mc.demoHint")}</p>

          {perfil && !perfil.encontrado && (
            <div className="flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/[0.06] px-4 py-3">
              <SearchX className="h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="font-serif text-base font-medium">{t("mc.notFound.title")}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{t("mc.notFound.body")}</p>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Perfil reconocido */}
      {reconocido && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-light">
              {t("mc.greeting", { nombre: perfil?.nombre?.split(" ")[0] ?? "" })}
            </h2>
            <button
              type="button"
              onClick={reiniciar}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-gold transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" /> {t("mc.logout")}
            </button>
          </div>

          {/* Tarjeta de nivel de fidelización */}
          <div className="card-accent p-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-gold/15 text-gold">
              <Crown className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
                {t("mc.tier.title")}
              </p>
              <div className="mt-1 flex items-center gap-2.5">
                <span className="font-serif text-2xl font-medium">{t(`mc.level.${nivel}`)}</span>
                {pct > 0 && (
                  <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.1em] text-gold">
                    −{pct}%
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {pct > 0 ? t("mc.tier.benefit", { pct }) : t("mc.tier.newBenefit")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/80">
                {pct > 0 ? t("mc.tier.appliedNote") : t("mc.tier.newNote")}
              </p>

              <div className="mt-4 border-t border-border pt-4">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-muted-foreground">{t("mc.tier.stays", { n: estadias })}</span>
                  <span className="font-medium text-gold text-right">
                    {siguiente
                      ? t("mc.tier.toNext", { n: faltan, nivel: t(`mc.level.${siguiente.nivel}`) })
                      : t("mc.tier.top")}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-500"
                    style={{ width: `${progreso}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Historial de reservas */}
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground mb-3">
              {t("mc.history.title")}
            </p>
            {perfil && perfil.reservas.length === 0 ? (
              <p className="text-sm text-muted-foreground rounded-xl border border-border bg-secondary/40 px-5 py-6 text-center">
                {t("mc.history.empty")}
              </p>
            ) : (
              <div className="space-y-3">
                {perfil?.reservas.map((r) => (
                  <div
                    key={r.codigo}
                    className="card-accent p-5 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-serif text-lg font-medium truncate">{nombreHab(r)}</h3>
                        <span
                          className={cn(
                            "shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.62rem] font-medium uppercase tracking-[0.08em]",
                            tonoEstado(r.estado)
                          )}
                        >
                          {t(`mc.estado.${r.estado}`)}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-gold" />
                          {formatDate(r.checkIn)} → {formatDate(r.checkOut)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-gold" /> {r.huespedes}
                        </span>
                        <span className="font-mono text-xs text-foreground/70">{r.codigo}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-serif text-lg font-medium text-primary tabular-nums">
                        {formatear(r.montoTotal)}
                      </span>
                      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setSel(r)}>
                        {t("mc.manage")} <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-over de detalle + gestión */}
      <AnimatePresence>
        {sel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSel(null)}
              className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-border bg-background p-6 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="eyebrow text-[0.62rem] after:hidden">{t("mc.detail.title")}</span>
                <button
                  type="button"
                  onClick={() => setSel(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <h3 className="mt-4 font-serif text-2xl font-medium">{nombreHab(sel)}</h3>
              <span
                className={cn(
                  "mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.62rem] font-medium uppercase tracking-[0.08em]",
                  tonoEstado(sel.estado)
                )}
              >
                {t(`mc.estado.${sel.estado}`)}
              </span>

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">{t("mc.detail.code")}</dt>
                  <dd className="font-mono font-medium text-gold">{sel.codigo}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">{t("mc.detail.dates")}</dt>
                  <dd>{formatDate(sel.checkIn)} → {formatDate(sel.checkOut)}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">{t("mc.detail.guests")}</dt>
                  <dd>{sel.huespedes}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t("mc.detail.total")}</dt>
                  <dd className="font-serif text-lg font-medium text-primary tabular-nums">
                    {formatear(sel.montoTotal)}
                  </dd>
                </div>
              </dl>

              {/* Gestión: cambiar o cancelar por contacto directo con el código */}
              <div className="mt-7 rounded-xl border border-border bg-secondary/40 p-5">
                <p className="font-serif text-base font-medium">{t("mc.detail.help")}</p>
                <p className="text-sm text-muted-foreground mt-1">{t("mc.detail.helpBody")}</p>
                <div className="mt-4 flex flex-col gap-2.5">
                  <a
                    href={linkWhatsApp(`Hola, quiero gestionar mi reserva ${sel.codigo} en Hotel Plaza.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </a>
                  <div className="flex gap-2.5">
                    <a
                      href="tel:+56612241300"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-gold hover:text-gold"
                    >
                      <Phone className="h-4 w-4" /> {t("mc.detail.call")}
                    </a>
                    <a
                      href={`mailto:reservas@hotelplaza.cl?subject=${encodeURIComponent(
                        `Reserva ${sel.codigo}`
                      )}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-gold hover:text-gold"
                    >
                      <Mail className="h-4 w-4" /> {t("mc.detail.email")}
                    </a>
                  </div>
                </div>
                <p className="mt-3.5 text-xs text-muted-foreground">{t("ca.freeCancel")}</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
