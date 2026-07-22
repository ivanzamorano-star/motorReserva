import Image from "next/image";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { T } from "@/lib/idioma";

export function SiteFooter() {
  return (
    <>
    <WhatsAppButton />
    <footer id="contacto" className="border-t border-border bg-primary text-primary-foreground">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="container py-14 grid gap-10 sm:grid-cols-3 text-sm">
        <div>
          <Image
            src="/logo-cabo-froward.png"
            alt="Hotel Cabo Froward"
            width={205}
            height={175}
            className="h-28 sm:h-36 w-auto mb-4"
          />
          <p className="text-primary-foreground/70"><T k="footer.address" /><br /><T k="footer.region" /></p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold mb-3"><T k="footer.contact" /></p>
          <p className="text-primary-foreground/70">+56 61 224 1300</p>
          <p className="text-primary-foreground/70">reservas@cabofroward.dev</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold mb-3"><T k="footer.engine" /></p>
          <p className="text-primary-foreground/70"><T k="footer.engineText" /></p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/50">
        <T k="footer.legal" />
      </div>
    </footer>
    </>
  );
}
