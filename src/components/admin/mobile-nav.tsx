"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/reservas", label: "Reservas" },
  { href: "/admin/calendario", label: "Calendario" },
  { href: "/admin/habitaciones", label: "Habitaciones y tarifas" },
  { href: "/admin/paquetes", label: "Paquetes promocionales" },
  { href: "/admin/huespedes", label: "Huéspedes" },
  { href: "/admin/marketing", label: "Marketing y fidelización" },
  { href: "/admin/integraciones", label: "Integraciones" },
  { href: "/admin/reportes", label: "Reportes" },
  { href: "/admin/documentos-tributarios", label: "Documentos tributarios" },
  { href: "/admin/configuracion", label: "Configuración" },
];

export function AdminMobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-background border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo-plaza-dark.png"
            alt="Hotel Plaza"
            width={26}
            height={33}
            priority
            className="h-9 w-auto dark:hidden"
          />
          <Image
            src="/logo-plaza-white.png"
            alt="Hotel Plaza"
            width={26}
            height={33}
            priority
            className="hidden h-9 w-auto dark:block"
          />
          <span className="font-serif text-sm font-semibold">Hotel Plaza — Admin</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border p-2 space-y-0.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-md px-3 py-2 text-sm",
                pathname === item.href
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
