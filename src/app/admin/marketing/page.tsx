import { reservationRepository } from "@/data/repository";
import { CampaniasList } from "@/components/admin/campanias-list";
import { EnviarEmailForm } from "@/components/admin/enviar-email-form";
import { Separator } from "@/components/ui/separator";

export default async function MarketingPage() {
  const [campanias, huespedes, envios] = await Promise.all([
    reservationRepository.listarCampaniasEmail(),
    reservationRepository.listarHuespedes(),
    reservationRepository.listarEnviosEmail(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Marketing y fidelización</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Correos automatizados para fidelizar huéspedes y mensajes personalizados post-hospedaje.
        </p>
      </div>

      <div>
        <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground mb-4">
          Campañas automatizadas
        </h2>
        <CampaniasList campanias={campanias} />
      </div>

      <Separator />

      <div>
        <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground mb-4">
          Envío individual
        </h2>
        <EnviarEmailForm huespedes={huespedes} enviosIniciales={envios} />
      </div>
    </div>
  );
}
