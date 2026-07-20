import { reservationRepository } from "@/data/repository";
import { HabitacionesSection } from "@/components/admin/habitaciones-section";

export default async function HabitacionesPage() {
  const [tipos, tarifas] = await Promise.all([
    reservationRepository.listarTiposHabitacion(),
    reservationRepository.listarTarifas(),
  ]);

  return <HabitacionesSection tipos={tipos} tarifasIniciales={tarifas} />;
}
