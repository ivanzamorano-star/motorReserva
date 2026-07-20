import { reservationRepository } from "@/data/repository";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plug, RefreshCw, CheckCircle2, CircleDashed } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function IntegracionesPage() {
  const integraciones = await reservationRepository.listarIntegraciones();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Integraciones</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Conexiones con channel managers y sistemas de gestión hotelera (PMS).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {integraciones.map((i) => (
          <Card key={i.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Plug className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{i.nombre}</CardTitle>
                  <CardDescription>
                    {i.tipo === "channel_manager" ? "Channel manager" : "PMS externo"}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={i.activo ? "success" : "outline"} className="gap-1">
                {i.activo ? <CheckCircle2 className="h-3 w-3" /> : <CircleDashed className="h-3 w-3" />}
                {i.activo ? "Activo" : "No conectado"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {i.canalesConectados && (
                <div className="flex flex-wrap gap-1.5">
                  {i.canalesConectados.map((c) => (
                    <Badge key={c} variant="outline">
                      {c}
                    </Badge>
                  ))}
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Última sincronización</span>
                <span className="font-medium">
                  {i.ultimaSincronizacion === "—" ? "—" : formatDate(i.ultimaSincronizacion.slice(0, 10))}
                </span>
              </div>
              <Button variant="outline" size="sm" className="w-full" disabled={!i.activo}>
                <RefreshCw className="h-3.5 w-3.5" /> Sincronizar ahora
              </Button>
            </CardContent>
          </Card>
        ))}

        <Card className="border-dashed flex flex-col items-center justify-center text-center p-8 gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
            <Plug className="h-5 w-5" />
          </div>
          <p className="font-medium text-sm">Conectar otra integración</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Beds24, SiteMinder, Cloudbeds u otro PMS/channel manager según lo que use el hotel.
          </p>
          <Button variant="outline" size="sm" className="mt-2">
            Solicitar integración
          </Button>
        </Card>
      </div>
    </div>
  );
}
