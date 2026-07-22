"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

type NavLeaf = { href: string; label: string };
type NavGroupItem = { label: string; groupHref?: string; children: NavLeaf[] };
type NavItem = NavLeaf | NavGroupItem;

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  {
    label: "Reservas",
    children: [
      { href: "/admin/reservas", label: "Todas las reservas" },
      { href: "/admin/calendario", label: "Calendario" },
    ],
  },
  { href: "/admin/habitaciones", label: "Habitaciones y tarifas" },
  { href: "/admin/huespedes", label: "Huéspedes" },
  {
    label: "Marketing y ventas",
    children: [
      { href: "/admin/paquetes#paquetes", label: "Paquetes" },
      { href: "/admin/paquetes#codigos", label: "Códigos promocionales" },
      { href: "/admin/marketing#campanias", label: "Campañas y correos" },
      { href: "/admin/marketing#automations", label: "Automatizaciones de Ingresos" },
    ],
  },
  { href: "/admin/reportes", label: "Reportes" },
  { href: "/admin/documentos-tributarios", label: "Documentos tributarios" },
  { href: "/admin/integraciones", label: "Integraciones" },
  { href: "/admin/configuracion", label: "Configuración" },
  {
    label: "Administrador",
    groupHref: "/admin/administrador",
    children: [
      { href: "/admin/administrador/nueva-reserva", label: "Nueva reserva" },
      { href: "/admin/administrador/reservas", label: "Gestión de reservas" },
      { href: "/admin/administrador/usuarios", label: "Usuarios" },
      { href: "/admin/administrador/bloqueos", label: "Bloqueos de habitación" },
    ],
  },
];

function MobileNavGroup({
  item,
  pathname,
  onNavigate,
}: {
  item: NavGroupItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const router = useRouter();
  const groupActive = item.children.some((c) => pathname === c.href.split("#")[0]);
  const [open, setOpen] = React.useState(groupActive);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (item.groupHref && pathname !== item.groupHref && !groupActive) {
            router.push(item.groupHref);
          }
        }}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
          groupActive ? "text-foreground font-medium" : "text-muted-foreground hover:bg-accent"
        )}
      >
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 text-gold transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-3 border-l border-border/70 pl-2 space-y-0.5 py-0.5">
              {item.children.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  onClick={onNavigate}
                  className={cn(
                    "block rounded-md px-3 py-1.5 text-[13px] transition-colors",
                    pathname === c.href.split("#")[0]
                      ? "bg-accent text-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent/60"
                  )}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AdminMobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-background border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo-cabo-froward-mark.png"
            alt="Hotel Cabo Froward"
            width={36}
            height={45}
            priority
            className="h-9 w-auto"
          />
          <span className="font-serif text-sm font-semibold">Hotel Cabo Froward — Admin</span>
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
          {NAV.map((item) =>
            "children" in item ? (
              <MobileNavGroup
                key={item.label}
                item={item}
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />
            ) : (
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
            )
          )}
        </nav>
      )}
    </div>
  );
}
