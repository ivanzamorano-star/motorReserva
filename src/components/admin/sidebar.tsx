"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarRange,
  BedDouble,
  ClipboardList,
  Users,
  Plug,
  BarChart3,
  Settings,
  ArrowLeftRight,
  Mail,
  PackageCheck,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/reservas", label: "Reservas", icon: ClipboardList },
  { href: "/admin/calendario", label: "Calendario", icon: CalendarRange },
  { href: "/admin/habitaciones", label: "Habitaciones y tarifas", icon: BedDouble },
  { href: "/admin/paquetes", label: "Paquetes promocionales", icon: PackageCheck },
  { href: "/admin/huespedes", label: "Huéspedes", icon: Users },
  { href: "/admin/marketing", label: "Marketing y fidelización", icon: Mail },
  { href: "/admin/integraciones", label: "Integraciones", icon: Plug },
  { href: "/admin/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/admin/documentos-tributarios", label: "Documentos tributarios", icon: FileText },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 shrink-0 flex-col border-r border-border bg-card/50 h-screen sticky top-0">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border">
        <Image
          src="/logo-plaza-dark.png"
          alt="Hotel Plaza"
          width={34}
          height={43}
          priority
          className="h-11 w-auto dark:hidden"
        />
        <Image
          src="/logo-plaza-white.png"
          alt="Hotel Plaza"
          width={34}
          height={43}
          priority
          className="hidden h-11 w-auto dark:block"
        />
        <div className="leading-tight">
          <p className="font-serif text-sm font-semibold">Hotel Plaza</p>
          <p className="text-[11px] text-muted-foreground -mt-0.5">Panel de administración</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
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
        })}
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
