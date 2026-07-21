import { Skeleton } from "@/components/ui/skeleton";

// Estado de carga del panel: se muestra mientras la vista async resuelve sus datos,
// para que la navegación se sienta instantánea (evita el "salto en blanco").
export default function AdminLoading() {
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="border-b border-border pb-5 space-y-2.5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Tarjetas KPI */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      {/* Tabla / contenido */}
      <div className="rounded-xl border border-border p-5 space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
