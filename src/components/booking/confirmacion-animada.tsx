"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Mail, Phone } from "lucide-react";
import { WhatsAppIcon, linkWhatsApp } from "@/components/whatsapp-button";
import { useIdioma } from "@/lib/idioma";

export function ConfirmacionAnimada({ codigo, habitacion }: { codigo: string; habitacion: string }) {
  const { t } = useIdioma();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
        className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-gold/10"
      >
        <CheckCircle2 className="h-10 w-10 text-gold" strokeWidth={1.5} />
      </motion.div>
      <span className="eyebrow-center">{t("ca.eyebrow")}</span>
      <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-light tracking-[-0.01em]">
        {t("ca.title")}
      </h1>
      <p className="text-muted-foreground mt-4">
        {t("ca.bodyPre")}<span className="text-foreground font-medium">{habitacion}</span>{t("ca.bodyPost")}
      </p>
      <div className="mt-8 card-accent p-6 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{t("ca.code")}</span>
          <span className="font-mono text-lg font-semibold text-gold">{codigo}</span>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5" /> {t("ca.emailSent")}
        </div>
      </div>

      {/* Contacto directo + política de cancelación */}
      <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-6 text-left">
        <p className="font-serif text-base font-medium">{t("ca.changeTitle")}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {t("ca.changePre")}
          <span className="font-mono font-medium text-foreground">{codigo}</span>{t("ca.changePost")}
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <a
            href={linkWhatsApp(`Hola, quiero gestionar mi reserva ${codigo} en Hotel Plaza.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href="tel:+56612241300"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-gold hover:text-gold"
          >
            <Phone className="h-4 w-4" /> {t("ca.call")}
          </a>
          <a
            href="mailto:reservas@hotelplaza.cl"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-gold hover:text-gold"
          >
            <Mail className="h-4 w-4" /> {t("ca.email")}
          </a>
        </div>
        <p className="mt-3.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-success" /> {t("ca.freeCancel")}
        </p>
      </div>
    </motion.div>
  );
}
