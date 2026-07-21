"use client";

import * as React from "react";
import { useAuth } from "./auth-context";
import { AuthScreen } from "./auth-screen";
import type { UsuarioStaff } from "@/domain/types";

export function AuthGuard({ children, staff }: { children: React.ReactNode; staff: UsuarioStaff[] }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <AuthScreen staff={staff} />;
  }

  return <>{children}</>;
}
