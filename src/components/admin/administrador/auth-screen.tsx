"use client";

import * as React from "react";
import { LogIn, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "./auth-context";
import type { UsuarioStaff } from "@/domain/types";

export function AuthScreen({ staff }: { staff: UsuarioStaff[] }) {
  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Ingresa tu correo electrónico.");
      return;
    }
    if (!password) {
      setError("Ingresa tu contraseña.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = login(email, password, staff);
    if (!result) {
      setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-lg">Acceso al Centro de Control</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al menú administrador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="auth-email">Correo electrónico</Label>
              <Input
                id="auth-email"
                type="email"
                placeholder="admin@test.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="auth-password">Contraseña</Label>
              <Input
                id="auth-password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" variant="gold" className="w-full" disabled={loading}>
              <LogIn className="h-4 w-4" />
              {loading ? "Verificando…" : "Ingresar"}
            </Button>
          </form>
          <p className="mt-4 text-xs text-center text-muted-foreground">
            Demo: admin@test.cl / admin
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
