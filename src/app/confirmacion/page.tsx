import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ConfirmacionAnimada } from "@/components/booking/confirmacion-animada";
import { Button } from "@/components/ui/button";

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ codigo?: string; habitacion?: string }>;
}) {
  const sp = await searchParams;
  const codigo = sp.codigo ?? "HP-DEMO-0000";
  const habitacion = sp.habitacion ?? "Habitación";

  return (
    <>
      <SiteHeader />
      <main className="container py-16">
        <ConfirmacionAnimada codigo={codigo} habitacion={habitacion} />
        <div className="flex justify-center mt-8">
          <Button asChild variant="outline">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
