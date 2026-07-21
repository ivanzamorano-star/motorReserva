"use client";

import * as React from "react";
import type { UsuarioStaff } from "@/domain/types";

export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  rol: "administrador" | "recepcion";
  avatarIniciales: string;
}

const ADMIN_EMAIL = "admin@test.cl";
const ADMIN_PASSWORD = "admin";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, staff: UsuarioStaff[]) => AuthUser | null;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "hotelplaza_admin_auth";

function loadUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function saveUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setUser(loadUser());
    setHydrated(true);
  }, []);

  const login = React.useCallback(
    (email: string, password: string, _staff: UsuarioStaff[]): AuthUser | null => {
      if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) return null;
      const authed: AuthUser = {
        id: "admin-root",
        nombre: "Administrador",
        email: ADMIN_EMAIL,
        rol: "administrador",
        avatarIniciales: "AD",
      };
      setUser(authed);
      saveUser(authed);
      return authed;
    },
    []
  );

  const logout = React.useCallback(() => {
    setUser(null);
    saveUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading: !hydrated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
