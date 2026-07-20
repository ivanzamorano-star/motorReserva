import Image from "next/image";

export function SiteFooter() {
  return (
    <footer id="contacto" className="border-t border-border bg-primary text-primary-foreground">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="container py-14 grid gap-10 sm:grid-cols-3 text-sm">
        <div>
          <Image
            src="/logo-plaza-white.png"
            alt="Hotel Plaza Punta Arenas"
            width={72}
            height={91}
            className="h-20 w-auto mb-4"
          />
          <p className="text-primary-foreground/70">Plaza de Armas, Punta Arenas<br />Región de Magallanes, Chile</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold mb-3">Contacto</p>
          <p className="text-primary-foreground/70">+56 61 224 1300</p>
          <p className="text-primary-foreground/70">reservas@hotelplaza.cl</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold mb-3">Motor de reservas</p>
          <p className="text-primary-foreground/70">Demo comercial construida por ia works spa — desarrollo de software a medida en Magallanes.</p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/50">
        © 2026 Hotel Plaza · Prototipo de demostración, no procesa pagos reales
      </div>
    </footer>
  );
}
