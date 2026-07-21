"use client";

import * as React from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIdioma } from "@/lib/idioma";

// C3 — Retomar búsqueda por correo (antídoto a la indecisión). Captura sutil:
// el huésped deja su correo y "le enviamos" la búsqueda para retomarla luego.
// Solo UI/demo: no envía correos reales.
export function SavedSearch() {
  const { t } = useIdioma();
  const [email, setEmail] = React.useState("");
  const [enviado, setEnviado] = React.useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setEnviado(true);
  }

  return (
    <div className="mt-8 card-accent p-6 sm:p-7">
      {enviado ? (
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
          <p className="text-sm">{t("ss.done", { email })}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
              <Mail className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-serif text-lg font-medium">{t("ss.title")}</p>
              <p className="mt-0.5 text-sm text-muted-foreground max-w-md">{t("ss.body")}</p>
            </div>
          </div>
          <form onSubmit={onSubmit} className="flex flex-col gap-2.5 sm:flex-row sm:shrink-0">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("ss.placeholder")}
              className="sm:w-56"
            />
            <Button type="submit" variant="gold" className="gap-2">
              <Send className="h-4 w-4" /> {t("ss.button")}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
