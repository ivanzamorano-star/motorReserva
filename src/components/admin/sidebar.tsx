"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  BedDouble,
  Users,
  Megaphone,
  PackageCheck,
  Ticket,
  Send,
  Sparkles,
  BarChart3,
  FileText,
  Plug,
  Settings,
  ShieldCheck,
  ArrowLeftRight,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type NavLeaf = { href: string; label: string; icon: LucideIcon };
type NavGroupItem = {
  label: string;
  icon: LucideIcon;
  groupHref?: string;
  children: { href: string; label: string }[];
};
type NavItem = NavLeaf | NavGroupItem;

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Reservas",
    icon: ClipboardList,
    children: [
      { href: "/admin/reservas", label: "Todas las reservas" },
      { href: "/admin/calendario", label: "Calendario" },
    ],
  },
  { href: "/admin/habitaciones", label: "Habitaciones y tarifas", icon: BedDouble },
  { href: "/admin/huespedes", label: "Huéspedes", icon: Users },
  {
    label: "Marketing y ventas",
    icon: Megaphone,
    children: [
      { href: "/admin/paquetes#paquetes", label: "Paquetes" },
      { href: "/admin/paquetes#codigos", label: "Códigos promocionales" },
      { href: "/admin/marketing#campanias", label: "Campañas y correos" },
      { href: "/admin/marketing#automations", label: "Automatizaciones de Ingresos" },
    ],
  },
  { href: "/admin/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/admin/documentos-tributarios", label: "Documentos tributarios", icon: FileText },
  { href: "/admin/integraciones", label: "Integraciones", icon: Plug },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
  {
    label: "Administrador",
    icon: ShieldCheck,
    groupHref: "/admin/administrador",
    children: [
      { href: "/admin/administrador/nueva-reserva", label: "Nueva reserva" },
      { href: "/admin/administrador/reservas", label: "Gestión de reservas" },
      { href: "/admin/administrador/usuarios", label: "Usuarios" },
      { href: "/admin/administrador/bloqueos", label: "Bloqueos de habitación" },
    ],
  },
];

function NavLink({ item, active }: { item: NavLeaf; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-primary text-primary-foreground font-medium"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </Link>
  );
}

function NavGroup({ item, pathname }: { item: NavGroupItem; pathname: string }) {
  const router = useRouter();
  const Icon = item.icon;
  const groupActive = item.children.some((c) => pathname === c.href.split("#")[0]);
  const [open, setOpen] = React.useState(groupActive);
  const [hash, setHash] = React.useState("");

  React.useEffect(() => {
    if (groupActive) setOpen(true);
  }, [groupActive]);

  React.useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const isChildActive = (href: string) => {
    const [path, h] = href.split("#");
    if (pathname !== path) return false;
    return h ? hash === `#${h}` : !hash;
  };

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
          "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
          groupActive
            ? "text-foreground font-medium"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-gold transition-transform duration-200",
            open && "rotate-180"
          )}
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
            <div className="mt-0.5 ml-[1.15rem] space-y-0.5 border-l border-border/70 pl-2.5">
              {item.children.map((c) => {
                const active = isChildActive(c.href);
                return (
                  <Link
                    key={c.href}
                    href={c.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] transition-colors",
                      active
                        ? "bg-accent text-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1 w-1 shrink-0 rounded-full transition-colors",
                        active ? "bg-gold" : "bg-muted-foreground/40"
                      )}
                    />
                    {c.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 shrink-0 flex-col border-r border-border bg-card/50 h-screen sticky top-0">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border">
        <Image
          src="/logo-cabo-froward-mark.png"
          alt="Hotel Cabo Froward"
          width={44}
          height={55}
          priority
          className="h-11 w-auto"
        />
        <div className="leading-tight">
          <p className="font-serif text-sm font-semibold">Hotel Cabo Froward</p>
          <p className="text-[11px] text-muted-foreground -mt-0.5">Panel de administración</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {NAV.map((item) =>
          "children" in item ? (
            <NavGroup key={item.label} item={item} pathname={pathname} />
          ) : (
            <NavLink key={item.href} item={item} active={pathname === item.href} />
          )
        )}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors mb-1"
        >
          <ArrowLeftRight className="h-4 w-4" /> Ver sitio de reservas
        </Link>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback>IZ</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-xs font-medium">Iván Zamorano</p>
              <p className="text-[11px] text-muted-foreground">Administrador</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
