import { reservationRepository } from "@/data/repository";
import { PaquetesSection } from "@/components/admin/paquetes-section";

export default async function PaquetesPage() {
  const [paquetes, tipos, servicios, huespedes] = await Promise.all([
    reservationRepository.listarPaquetes(),
    reservationRepository.listarTiposHabitacion(),
    reservationRepository.listarServiciosAdicionales(),
    reservationRepository.listarHuespedes(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Paquetes promocionales</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Combine habitaciones con tours, traslados o spa para armar ofertas de upselling, paquetes de bienestar o
          tarifas corporativas para clientes frecuentes y empresas.
        </p>
      </div>

      <PaquetesSection paquetesIniciales={paquetes} tipos={tipos} servicios={servicios} huespedes={huespedes} />
    </div>
  );
}
