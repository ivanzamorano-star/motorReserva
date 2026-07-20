import { reservationRepository } from "@/data/repository";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function ConfiguracionPage() {
  const [hotel, staff] = await Promise.all([
    reservationRepository.getHotel(),
    reservationRepository.listarStaff(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Configuración</h1>
        <p className="text-sm text-muted-foreground mt-1">Datos del hotel, política de cancelación y equipo.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos del hotel</CardTitle>
          <CardDescription>Información que aparece en el sitio de reservas y en comprobantes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input defaultValue={hotel.nombre} />
            </div>
            <div className="space-y-1.5">
              <Label>Dirección</Label>
              <Input defaultValue={hotel.direccion} />
            </div>
            <div className="space-y-1.5">
              <Label>Teléfono</Label>
              <Input defaultValue={hotel.telefono} />
            </div>
            <div className="space-y-1.5">
              <Label>Correo de reservas</Label>
              <Input defaultValue={hotel.email} />
            </div>
            <div className="space-y-1.5">
              <Label>Moneda</Label>
              <Input defaultValue={hotel.moneda} disabled />
            </div>
            <div className="space-y-1.5">
              <Label>Zona horaria</Label>
              <Input defaultValue={hotel.zonaHoraria} disabled />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Política de cancelación</Label>
            <Input defaultValue={hotel.politicaCancelacion} />
          </div>
          <div className="flex justify-end">
            <Button variant="gold">Guardar cambios</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Equipo</CardTitle>
          <CardDescription>Usuarios con acceso al panel de administración.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {staff.map((s, i) => (
            <div key={s.id}>
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{s.avatarIniciales}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{s.nombre}</p>
                    <p className="text-xs text-muted-foreground">{s.email}</p>
                  </div>
                </div>
                <Badge variant={s.rol === "administrador" ? "gold" : "outline"} className="capitalize">
                  {s.rol}
                </Badge>
              </div>
              {i < staff.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
          <div className="pt-2">
            <Button variant="outline" size="sm">
              Invitar usuario
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
