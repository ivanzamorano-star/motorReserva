import { reservationRepository } from "@/data/repository";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { GestionBloqueos } from "@/components/admin/administrador/gestion-bloqueos";

export default async function BloqueosPage() {
  const [bloqueos, tipos] = await Promise.all([
    reservationRepository.listarBloqueos(),
    reservationRepository.listarTiposHabitacion(),
  ]);

  const filas = bloqueos.map((b) => ({
    id: b.id,
    tipoHabitacionId: b.tipoHabitacionId,
    habitacion: b.habitacion?.nombre ?? "—",
    desde: b.desde,
    hasta: b.hasta,
    motivo: b.motivo,
  }));

  const tiposMin = tipos.map((t) => ({ id: t.id, nombre: t.nombre }));

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Administrador · Centro de control" title="Bloqueos de habitación">
        Deja una habitación fuera del inventario disponible por un rango de fechas (mantenimiento, fuera
        de servicio o uso interno). El motor de reservas no permitirá reservarla durante ese período.
      </AdminPageHeader>

      <GestionBloqueos bloqueosIniciales={filas} tipos={tiposMin} />
    </div>
  );
}
