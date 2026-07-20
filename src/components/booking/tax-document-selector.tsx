"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Receipt, Building2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type {
  TipoDocumentoTributario,
  DatosFactura,
} from "@/domain/types";

export type DocumentoTributarioValue = {
  tipo: TipoDocumentoTributario;
  factura: DatosFactura;
};

export const FACTURA_VACIA: DatosFactura = {
  razonSocial: "",
  rut: "",
  giro: "",
  direccion: "",
  emailDTE: "",
};

const OPCIONES: {
  tipo: TipoDocumentoTributario;
  titulo: string;
  subtitulo: string;
  icon: typeof Receipt;
}[] = [
  {
    tipo: "boleta",
    titulo: "Boleta Electrónica",
    subtitulo: "Para personas naturales",
    icon: Receipt,
  },
  {
    tipo: "factura",
    titulo: "Factura de Empresa",
    subtitulo: "Con datos tributarios",
    icon: Building2,
  },
];

export function TaxDocumentSelector({
  value,
  onChange,
}: {
  value: DocumentoTributarioValue;
  onChange: (next: DocumentoTributarioValue) => void;
}) {
  function setTipo(tipo: TipoDocumentoTributario) {
    onChange({ ...value, tipo });
  }

  function setFacturaCampo(campo: keyof DatosFactura, valor: string) {
    onChange({ ...value, factura: { ...value.factura, [campo]: valor } });
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-serif text-lg font-medium">Documento tributario</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          ¿Cómo desea recibir su documento de pago?
        </p>
      </div>

      {/* Control segmentado: dos tarjetas finas lado a lado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OPCIONES.map((op) => {
          const activo = value.tipo === op.tipo;
          const Icon = op.icon;
          return (
            <button
              key={op.tipo}
              type="button"
              onClick={() => setTipo(op.tipo)}
              aria-pressed={activo}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl border bg-card p-4 text-left transition-all duration-200",
                activo
                  ? "border-gold ring-1 ring-gold bg-gold/[0.05]"
                  : "border-border hover:border-gold/50"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors",
                  activo
                    ? "border-gold bg-gold text-gold-foreground"
                    : "border-gold/40 text-gold"
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="font-serif text-base font-medium leading-tight">
                  {op.titulo}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {op.subtitulo}
                </p>
              </div>
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                  activo
                    ? "border-gold bg-gold text-gold-foreground"
                    : "border-border bg-background"
                )}
              >
                {activo && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>

      {/* Boleta: micro-texto informativo */}
      {value.tipo === "boleta" && (
        <p className="text-xs text-muted-foreground/80 leading-relaxed">
          Su boleta electrónica será enviada automáticamente al correo principal
          de la reserva.
        </p>
      )}

      {/* Factura: sub-formulario con despliegue animado */}
      <AnimatePresence initial={false}>
        {value.tipo === "factura" && (
          <motion.div
            key="factura-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-border bg-secondary/40 p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="razonSocial">Razón Social</Label>
                  <Input
                    id="razonSocial"
                    required
                    value={value.factura.razonSocial}
                    onChange={(e) => setFacturaCampo("razonSocial", e.target.value)}
                    placeholder="Comercial Austral Ltda."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rut">RUT Empresa</Label>
                  <Input
                    id="rut"
                    required
                    value={value.factura.rut}
                    onChange={(e) => setFacturaCampo("rut", e.target.value)}
                    placeholder="76.123.456-7"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="giro">Giro Comercial</Label>
                  <Input
                    id="giro"
                    required
                    value={value.factura.giro}
                    onChange={(e) => setFacturaCampo("giro", e.target.value)}
                    placeholder="Servicios de turismo"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="direccion">Dirección Comercial</Label>
                  <Input
                    id="direccion"
                    required
                    value={value.factura.direccion}
                    onChange={(e) => setFacturaCampo("direccion", e.target.value)}
                    placeholder="Av. Bulnes 01234, Punta Arenas"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="emailDTE">Correo de Facturación (DTE)</Label>
                  <Input
                    id="emailDTE"
                    type="email"
                    required
                    value={value.factura.emailDTE}
                    onChange={(e) => setFacturaCampo("emailDTE", e.target.value)}
                    placeholder="dte@suempresa.cl — donde recibe sus documentos tributarios"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
