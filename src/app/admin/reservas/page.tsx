import { reservationRepository } from "@/data/repository";
import { ReservasTable } from "@/components/admin/reservas-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default async function ReservasPage() {
  const reservas = await reservationRepository.listarReservas();
  const ordenadas = [...reservas].sort((a, b) => (a.creadaEn < b.creadaEn ? 1 : -1));

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Operación" title="Reservas">
        {reservas.length} reservas registradas en el motor de reservas.
      </AdminPageHeader>
      <ReservasTable reservas={ordenadas} />
    </div>
  );
}
