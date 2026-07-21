// C2 — Analítica de conversión vía dataLayer (esquema GA4).
// No carga Google Analytics real: empuja eventos a window.dataLayer con el
// formato estándar de GA4, dejando el motor "listo para producción" — basta
// conectar Google Tag Manager (o gtag) y los eventos ya estarán disponibles.
// SSR-safe: no hace nada en el servidor.

type Params = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: Params[];
  }
}

export function track(event: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  if (process.env.NODE_ENV !== "production") {
    // Traza visible en la consola del navegador para verificar el cableado.
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, params);
  }
}
