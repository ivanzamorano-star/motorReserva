import { reservationRepository } from "@/data/repository";
import { ReservasTable } from "@/components/admin/reservas-table";

export default async function ReservasPage() {
  const reservas = await reservationRepository.listarReservas();
  const ordenadas = [...reservas].sort((a, b) => (a.creadaEn < b.creadaEn ? 1 : -1));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Reservas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {reservas.length} reservas registradas en el motor de reservas.
        </p>
      </div>
      <ReservasTable reservas={ordenadas} />
    </div>
  );
}
