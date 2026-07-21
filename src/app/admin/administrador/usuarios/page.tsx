import { reservationRepository } from "@/data/repository";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { GestionUsuarios } from "@/components/admin/administrador/gestion-usuarios";

export default async function UsuariosPage() {
  const staff = await reservationRepository.listarStaff();

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Administrador · Centro de control" title="Usuarios del panel">
        Crea y administra las cuentas con acceso al panel. Define su rol: administrador (acceso total)
        o recepción (operación diaria).
      </AdminPageHeader>

      <GestionUsuarios usuariosIniciales={staff} />
    </div>
  );
}
