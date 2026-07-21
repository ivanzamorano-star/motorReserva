import { reservationRepository } from "@/data/repository";
import { RevenueAutomations } from "@/components/admin/RevenueAutomations";
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
      <div className="border-b border-border pb-5">
        <span className="eyebrow text-[0.62rem]">Ventas y fidelización</span>
        <h1 className="mt-2.5 font-serif text-3xl font-light tracking-[-0.01em]">
          Automatizaciones de Ingresos
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Automatizaciones de alta conversión que recuperan y aumentan tus reservas directas — cada una con sus ingresos atribuidos.
        </p>
      </div>

      <div id="automations" className="scroll-mt-24">
        <RevenueAutomations />
      </div>

      <Separator />

      <div id="campanias" className="scroll-mt-24">
        <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground mb-4">
          Correos de fidelización
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
