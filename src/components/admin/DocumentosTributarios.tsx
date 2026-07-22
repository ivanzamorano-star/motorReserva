"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Building2,
  Copy,
  Check,
  X,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCLP, formatDate } from "@/lib/utils";

type EstadoDocumento = "pendiente" | "emitido";
type TipoDocumento = "boleta" | "factura";

interface DatosEmpresa {
  razonSocial: string;
  rut: string;
  giro: string;
  direccion: string;
  emailDTE: string;
}

interface DocumentoTributarioFila {
  id: string;
  codigoReserva: string;
  huesped: string;
  fecha: string; // YYYY-MM-DD
  monto: number;
  tipo: TipoDocumento;
  estado: EstadoDocumento;
  empresa?: DatosEmpresa;
}

// Datos simulados realistas para el mercado chileno.
const DOCUMENTOS_MOCK: DocumentoTributarioFila[] = [
  {
    id: "doc-1",
    codigoReserva: "HP-2607-041",
    huesped: "María José Fuentes",
    fecha: "2026-07-16",
    monto: 104000,
    tipo: "boleta",
    estado: "emitido",
  },
  {
    id: "doc-2",
    codigoReserva: "HP-2607-052",
    huesped: "Rodrigo Mella Cárcamo",
    fecha: "2026-07-17",
    monto: 268000,
    tipo: "factura",
    estado: "pendiente",
    empresa: {
      razonSocial: "Comercial Austral Ltda.",
      rut: "76.123.456-7",
      giro: "Servicios de turismo y transporte",
      direccion: "Av. Bulnes 01234, Punta Arenas",
      emailDTE: "facturacion@comercialaustral.cl",
    },
  },
  {
    id: "doc-3",
    codigoReserva: "HP-2607-058",
    huesped: "Valentina Soto Riquelme",
    fecha: "2026-07-18",
    monto: 396000,
    tipo: "factura",
    estado: "pendiente",
    empresa: {
      razonSocial: "Turismo Fin del Mundo SpA",
      rut: "77.890.123-4",
      giro: "Operador turístico",
      direccion: "Calle Lautaro Navarro 567, Punta Arenas",
      emailDTE: "dte@finmundo.cl",
    },
  },
  {
    id: "doc-4",
    codigoReserva: "HP-2607-060",
    huesped: "Ignacio Pérez Vera",
    fecha: "2026-07-18",
    monto: 136000,
    tipo: "boleta",
    estado: "pendiente",
  },
];

// Arma un bloque de texto listo para pegar en WhatsApp / correo al contador o recepcionista.
function construirTextoFacturacion(d: DocumentoTributarioFila): string {
  if (!d.empresa) return "";
  return [
    "🧾 Datos de facturación — Hotel Cabo Froward",
    "",
    `Reserva: ${d.codigoReserva} (${d.huesped})`,
    `Razón Social: ${d.empresa.razonSocial}`,
    `RUT: ${d.empresa.rut}`,
    `Giro: ${d.empresa.giro}`,
    `Dirección: ${d.empresa.direccion}`,
    `Correo DTE: ${d.empresa.emailDTE}`,
    `Monto a facturar: ${formatCLP(d.monto)}`,
  ].join("\n");
}

function CampoEmpresa({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}

export function DocumentosTributarios() {
  const [documentos, setDocumentos] =
    React.useState<DocumentoTributarioFila[]>(DOCUMENTOS_MOCK);
  const [seleccionado, setSeleccionado] =
    React.useState<DocumentoTributarioFila | null>(null);
  const [copiado, setCopiado] = React.useState(false);

  function marcarEmitido(id: string) {
    setDocumentos((prev) =>
      prev.map((d) => (d.id === id ? { ...d, estado: "emitido" } : d))
    );
  }

  function copiarConFallback(texto: string) {
    const ta = document.createElement("textarea");
    ta.value = texto;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
    } catch {
      /* sin soporte de copiado */
    }
    document.body.removeChild(ta);
  }

  function copiarDatos(d: DocumentoTributarioFila) {
    const texto = construirTextoFacturacion(d);
    // Feedback inmediato (no depende de la promesa del portapapeles, que puede
    // quedar pendiente si la pestaña no tiene foco).
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard
          .writeText(texto)
          .catch(() => copiarConFallback(texto));
      } else {
        copiarConFallback(texto);
      }
    } catch {
      copiarConFallback(texto);
    }
  }

  function abrirPanel(d: DocumentoTributarioFila) {
    setCopiado(false);
    setSeleccionado(d);
  }

  const pendientes = documentos.filter((d) => d.estado === "pendiente").length;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-5">
        <span className="eyebrow text-[0.62rem]">Contabilidad</span>
        <h1 className="mt-2.5 font-serif text-3xl font-light tracking-[-0.01em]">
          Documentos Tributarios
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Emisión de boletas y facturas de las reservas ·{" "}
          {pendientes} {pendientes === 1 ? "pendiente" : "pendientes"}
        </p>
      </div>

      <Card>
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Huésped</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo de documento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Monto total</TableHead>
                <TableHead className="text-right w-[300px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentos.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <p className="text-sm font-medium">{d.huesped}</p>
                    <p className="font-mono text-[0.68rem] text-muted-foreground">
                      {d.codigoReserva}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(d.fecha)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="gap-1.5">
                      {d.tipo === "factura" ? (
                        <Building2 className="h-3 w-3" />
                      ) : (
                        <FileText className="h-3 w-3" />
                      )}
                      {d.tipo === "factura" ? "Factura" : "Boleta"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {d.estado === "pendiente" ? (
                      <Badge variant="gold">Pendiente</Badge>
                    ) : (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Emitido
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatCLP(d.monto)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {d.tipo === "factura" && d.empresa ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 whitespace-nowrap"
                          onClick={() => abrirPanel(d)}
                        >
                          <Eye className="h-3.5 w-3.5" /> Ver datos
                        </Button>
                      ) : null}
                      {d.estado === "pendiente" ? (
                        <Button
                          variant="gold"
                          size="sm"
                          className="h-8 whitespace-nowrap"
                          onClick={() => marcarEmitido(d.id)}
                        >
                          Marcar emitido
                        </Button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                          <Check className="h-3.5 w-3.5 text-success" /> Emitido
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Slide-over: datos comerciales de la empresa */}
      <AnimatePresence>
        {seleccionado?.empresa && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSeleccionado(null)}
              className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-[2px]"
            />
            <motion.aside
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-border p-6">
                <div>
                  <span className="eyebrow text-[0.62rem] after:hidden">
                    Datos comerciales
                  </span>
                  <h2 className="mt-2 font-serif text-xl font-medium">
                    Factura de empresa
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {seleccionado.codigoReserva} · {seleccionado.huesped}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSeleccionado(null)}
                  aria-label="Cerrar"
                  className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <CampoEmpresa
                  label="Razón Social"
                  value={seleccionado.empresa.razonSocial}
                />
                <CampoEmpresa label="RUT Empresa" value={seleccionado.empresa.rut} />
                <CampoEmpresa label="Giro Comercial" value={seleccionado.empresa.giro} />
                <CampoEmpresa
                  label="Dirección Comercial"
                  value={seleccionado.empresa.direccion}
                />
                <CampoEmpresa
                  label="Correo de Facturación (DTE)"
                  value={seleccionado.empresa.emailDTE}
                />

                <div className="rounded-lg bg-secondary/60 px-4 py-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      Monto a facturar
                    </span>
                    <span className="font-serif text-xl font-medium text-primary">
                      {formatCLP(seleccionado.monto)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border p-6 space-y-3">
                {/* Un solo botón: copia todo el bloque para enviarlo al contador/recepcionista */}
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => copiarDatos(seleccionado)}
                >
                  {copiado ? (
                    <>
                      <Check className="h-4 w-4 text-success" /> Datos copiados
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copiar datos para facturar
                    </>
                  )}
                </Button>

                {seleccionado.estado === "pendiente" ? (
                  <Button
                    variant="gold"
                    className="w-full"
                    onClick={() => {
                      marcarEmitido(seleccionado.id);
                      setSeleccionado(null);
                    }}
                  >
                    Marcar factura como emitida
                  </Button>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-2 text-sm text-success">
                    <CheckCircle2 className="h-4 w-4" /> Factura emitida
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
