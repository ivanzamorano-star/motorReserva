"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Carga diferida de recharts: es la dependencia más pesada del panel (~100 KB).
// Con next/dynamic el gráfico solo se descarga cuando esta vista se muestra, y
// mientras tanto se ve un skeleton — el resto de la página (KPIs, textos) pinta al instante.
export const CanalChart = dynamic(
  () => import("./canal-chart").then((m) => m.CanalChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[280px] w-full rounded-lg" />,
  }
);
