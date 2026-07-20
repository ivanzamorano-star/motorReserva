import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCLP(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, opts: Intl.DateTimeFormatOptions = {}): string {
  // Las fechas "YYYY-MM-DD" (sin hora) se interpretan como medianoche UTC; sin este ajuste,
  // en husos horarios negativos (como Chile) se muestran un día antes del real.
  const d =
    typeof date === "string"
      ? new Date(/^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00` : date)
      : date;
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...opts,
  }).format(d);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const inD = new Date(checkIn);
  const outD = new Date(checkOut);
  const ms = outD.getTime() - inD.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}
