import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MiCuentaClient } from "@/components/booking/mi-cuenta-client";

// Portal público del huésped — acceso por correo (sin login real, demo).
export default function MiCuentaPage() {
  return (
    <>
      <SiteHeader />
      <main className="container py-12 sm:py-16">
        <MiCuentaClient />
      </main>
      <SiteFooter />
    </>
  );
}
