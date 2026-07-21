"use client";

import * as React from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth-context";

export function AdminSessionBar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card/50 px-4 py-2.5 mb-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-gold" />
        <span>
          Conectado como{" "}
          <span className="font-medium text-foreground">{user.nombre}</span>
          {" · "}
          <span className="capitalize">{user.rol === "administrador" ? "Administrador" : "Recepción"}</span>
        </span>
      </div>
      <Button variant="ghost" size="sm" onClick={logout} className="text-xs gap-1.5">
        <LogOut className="h-3.5 w-3.5" />
        Cerrar sesión
      </Button>
    </div>
  );
}
