import { reservationRepository } from "@/data/repository";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { NuevaReservaForm } from "@/components/admin/administrador/nueva-reserva-form";

export default async function NuevaReservaPage() {
  const [tipos, tarifas, paquetes] = await Promise.all([
    reservationRepository.listarTiposHabitacion(),
    reservationRepository.listarTarifas(),
    reservationRepository.listarPaquetes(),
  ]);

  // Tarifa de referencia por tipo de habitación (temporada más baja disponible),
  // usada para sugerir el monto en el formulario.
  const tarifaPorTipo: Record<string, number> = {};
  for (const t of tipos) {
    const dela = tarifas
      .filter((x) => x.tipoHabitacionId === t.id)
      .sort((a, b) => a.precioNoche - b.precioNoche)[0];
    tarifaPorTipo[t.id] = dela?.precioNoche ?? 0;
  }

  const paquetesActivos = paquetes
    .filter((p) => p.activo)
    .map((p) => ({
      id: p.id,
      nombre: p.nombre,
      tipoHabitacionId: p.tipoHabitacionId,
      precioPaquete: p.precioPaquete,
    }));

  const tiposMin = tipos.map((t) => ({ id: t.id, nombre: t.nombre, capacidad: t.capacidad }));

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Administrador · Centro de control" title="Nueva reserva">
        Crea una reserva manual desde recepción — por habitación o por paquete turístico — con cálculo
        de monto sugerido y ajuste de tarifa.
      </AdminPageHeader>

      <NuevaReservaForm tipos={tiposMin} tarifaPorTipo={tarifaPorTipo} paquetes={paquetesActivos} />
    </div>
  );
}
