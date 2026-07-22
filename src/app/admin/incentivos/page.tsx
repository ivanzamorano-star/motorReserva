import { redirect } from "next/navigation";

// Incentivos se movió dentro de Administrador. Se deja este redirect (no se
// pudo eliminar el archivo por permisos del sandbox).
export default function IncentivosRedirect() {
  redirect("/admin/administrador/incentivos");
}
