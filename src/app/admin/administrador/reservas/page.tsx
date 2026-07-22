import { reservationRepository } from "@/data/repository";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { GestionReservas } from "@/components/admin/administrador/gestion-reservas";

export default async function GestionReservasPage() {
  const reservas = await reservationRepository.listarReservas();

  const filas = reservas.map((r) => ({
    id: r.id,
    codigo: r.codigo,
    huesped: r.huesped?.nombre ?? r.huespedNombre ?? "Huésped directo",
    habitacion: r.habitacion?.nombre ?? "—",
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    huespedes: r.huespedes,
    estado: r.estado,
    canalOrigen: r.canalOrigen,
    montoTotal: r.montoTotal,
    solicitudEarlyCheckin: r.solicitudEarlyCheckin,
    checkInRealizado: r.checkInRealizado,
  }));

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Administrador · Centro de control" title="Gestión de reservas">
        Confirma pagos, ajusta tarifas, cancela o elimina reservas. Aprueba solicitudes de Ingreso
        Prioritario — el registro de qué mucama preparó cada habitación se hace en Incentivos.
      </AdminPageHeader>

      <GestionReservas reservasIniciales={filas} />
    </div>
  );
}
