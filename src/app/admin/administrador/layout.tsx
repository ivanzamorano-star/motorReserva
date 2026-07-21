import { reservationRepository } from "@/data/repository";
import { AuthProvider } from "@/components/admin/administrador/auth-context";
import { AuthGuard } from "@/components/admin/administrador/auth-guard";
import { AdminSessionBar } from "@/components/admin/administrador/session-bar";

export default async function AdministradorLayout({ children }: { children: React.ReactNode }) {
  const staff = await reservationRepository.listarStaff();

  return (
    <AuthProvider>
      <AuthGuard staff={staff}>
        <AdminSessionBar />
        {children}
      </AuthGuard>
    </AuthProvider>
  );
}
