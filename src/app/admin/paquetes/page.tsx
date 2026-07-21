import { reservationRepository } from "@/data/repository";
import { PaquetesSection } from "@/components/admin/paquetes-section";
import { CodigosPromocionales } from "@/components/admin/CodigosPromocionales";
import { Separator } from "@/components/ui/separator";

export default async function PaquetesPage() {
  const [paquetes, tipos, servicios, huespedes] = await Promise.all([
    reservationRepository.listarPaquetes(),
    reservationRepository.listarTiposHabitacion(),
    reservationRepository.listarServiciosAdicionales(),
    reservationRepository.listarHuespedes(),
  ]);

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-5">
        <span className="eyebrow text-[0.62rem]">Ofertas y promociones</span>
        <h1 className="mt-2.5 font-serif text-3xl font-light tracking-[-0.01em]">
          Motor de ofertas
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Lanza códigos de descuento y campañas flash con reglas claras, y mide cuánto dinero generó cada una.
        </p>
      </div>

      <div id="codigos" className="scroll-mt-24">
        <CodigosPromocionales />
      </div>

      <Separator />

      <div id="paquetes" className="scroll-mt-24">
        <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground mb-1">
          Paquetes (habitación + servicios)
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Combina habitaciones con tours, traslados o spa para armar paquetes de bienestar o tarifas corporativas.
        </p>
        <PaquetesSection paquetesIniciales={paquetes} tipos={tipos} servicios={servicios} huespedes={huespedes} />
      </div>
    </div>
  );
}
