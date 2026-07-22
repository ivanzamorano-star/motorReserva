import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { T } from "@/lib/idioma";

export function SiteFooter() {
  return (
    <>
    <WhatsAppButton />
    <footer id="contacto" className="border-t border-border bg-primary text-primary-foreground">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="container pt-16 pb-10 grid gap-12 md:grid-cols-3 text-sm md:divide-x md:divide-primary-foreground/10">
        <div className="md:pr-10 flex items-center">
          <Link href="/">
            <Image
              src="/logo-cabo-froward.png"
              alt="Hotel Cabo Froward"
              width={410}
              height={350}
              className="h-32 sm:h-40 w-auto"
            />
          </Link>
        </div>
        <div className="md:px-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold mb-4"><T k="footer.contact" /></p>
          <div className="space-y-2.5">
            <a href="tel:+56612241300" className="flex items-center gap-2.5 text-primary-foreground/70 hover:text-gold transition-colors w-fit">
              <Phone className="h-4 w-4 shrink-0 text-gold/80" /> +56 61 224 1300
            </a>
            <a href="mailto:reservas@cabofroward.dev" className="flex items-center gap-2.5 text-primary-foreground/70 hover:text-gold transition-colors w-fit">
              <Mail className="h-4 w-4 shrink-0 text-gold/80" /> reservas@cabofroward.dev
            </a>
          </div>
        </div>
        <div className="md:pl-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold mb-4"><T k="footer.engine" /></p>
          <p className="text-primary-foreground/70 leading-relaxed"><T k="footer.engineText" /></p>
        </div>
      </div>
      <div className="container pb-10">
        <div className="flex items-start gap-2.5 border-t border-primary-foreground/10 pt-6 text-sm text-primary-foreground/70">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" />
          <p><T k="footer.address" /> · <T k="footer.region" /></p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/50">
        <T k="footer.legal" />
      </div>
    </footer>
    </>
  );
}
