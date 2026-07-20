import { HuespedesCRM } from "@/components/admin/HuespedesCRM";

export default function HuespedesPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-5">
        <span className="eyebrow text-[0.62rem]">Fidelización</span>
        <h1 className="mt-2.5 font-serif text-3xl font-light tracking-[-0.01em]">
          CRM de Huéspedes
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Directorio de perfiles, historial y preferencias para una atención
          personalizada.
        </p>
      </div>

      <HuespedesCRM />
    </div>
  );
}
