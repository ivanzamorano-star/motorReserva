"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Mail } from "lucide-react";

export function ConfirmacionAnimada({ codigo, habitacion }: { codigo: string; habitacion: string }) {
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
      <span className="eyebrow-center">Reserva confirmada</span>
      <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-light tracking-[-0.01em]">
        ¡Le esperamos en Punta Arenas!
      </h1>
      <p className="text-muted-foreground mt-4">
        Su reserva en <span className="text-foreground font-medium">{habitacion}</span> quedó
        confirmada. Recibirá el detalle en su correo.
      </p>
      <div className="mt-8 card-accent p-6 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Código de reserva</span>
          <span className="font-mono text-lg font-semibold text-gold">{codigo}</span>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5" /> Confirmación enviada automáticamente por correo
        </div>
      </div>
    </motion.div>
  );
}
