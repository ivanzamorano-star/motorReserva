import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MonedaProvider } from "@/lib/moneda";
import { IdiomaProvider } from "@/lib/idioma";

export const metadata: Metadata = {
  title: "Hotel Plaza — Reserva directa",
  description: "Motor de reservas propio de Hotel Plaza, Punta Arenas. Demo comercial de ia works spa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400;1,9..144,500&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <IdiomaProvider>
            <MonedaProvider>{children}</MonedaProvider>
          </IdiomaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
