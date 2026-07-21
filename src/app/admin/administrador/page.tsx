import { redirect } from "next/navigation";

// El panel Administrador es un grupo de sub-secciones; la raíz redirige a la
// primera acción del centro de control.
export default function AdministradorPage() {
  redirect("/admin/administrador/nueva-reserva");
}
