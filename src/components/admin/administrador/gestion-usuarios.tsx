"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { UsuarioStaff } from "@/domain/types";
import { crearUsuarioAction, eliminarUsuarioAction } from "@/app/admin/administrador/actions";

export function GestionUsuarios({ usuariosIniciales }: { usuariosIniciales: UsuarioStaff[] }) {
  const [usuarios, setUsuarios] = React.useState(usuariosIniciales);
  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [rol, setRol] = React.useState<UsuarioStaff["rol"]>("recepcion");
  const [enviando, setEnviando] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const admins = usuarios.filter((u) => u.rol === "administrador").length;

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!nombre.trim() || !email.trim()) {
      setError("Nombre y correo son obligatorios.");
      return;
    }
    setEnviando(true);
    try {
      const nuevo = await crearUsuarioAction({ nombre, email, rol });
      setUsuarios((prev) => [...prev, nuevo]);
      setNombre("");
      setEmail("");
      setRol("recepcion");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el usuario.");
    } finally {
      setEnviando(false);
    }
  }

  async function eliminar(u: UsuarioStaff) {
    setUsuarios((prev) => prev.filter((x) => x.id !== u.id));
    await eliminarUsuarioAction(u.id);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* Alta de usuario */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-base">Nuevo usuario</CardTitle>
          <CardDescription>Se enviará una invitación al correo indicado.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={crear} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nombre completo</Label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Camila Soto" />
            </div>
            <div className="space-y-1.5">
              <Label>Correo</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@cabofroward.dev"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Rol</Label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value as UsuarioStaff["rol"])}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="recepcion">Recepción</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" variant="gold" disabled={enviando} className="w-full">
              <UserPlus className="h-4 w-4" />
              {enviando ? "Creando…" : "Crear usuario"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Listado */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Equipo con acceso ({usuarios.length})</CardTitle>
          <CardDescription>Administra las cuentas activas del panel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <AnimatePresence initial={false}>
            {usuarios.map((u, i) => {
              const esUnicoAdmin = u.rol === "administrador" && admins <= 1;
              return (
                <motion.div
                  key={u.id}
                  layout
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{u.avatarIniciales}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{u.nombre}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={u.rol === "administrador" ? "gold" : "outline"} className="capitalize">
                        {u.rol}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={esUnicoAdmin}
                        title={esUnicoAdmin ? "No puedes eliminar al único administrador" : "Eliminar usuario"}
                        onClick={() => eliminar(u)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  {i < usuarios.length - 1 && <Separator />}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
