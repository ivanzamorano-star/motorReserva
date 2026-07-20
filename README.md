# Hotel Plaza — Motor de Reservas (Demo comercial)

Prototipo de alta fidelidad del motor de reservas diseñado para Hotel Plaza (Punta Arenas), construido con Next.js 15, React 19, TypeScript, Tailwind CSS, componentes estilo shadcn/ui y Framer Motion. Usa una capa de datos simulada (mock repository) siguiendo Clean Architecture, lista para ser reemplazada por una API real sin tocar la UI.

## Cómo ejecutar

Este proyecto usa **pnpm** como gestor de paquetes (`packageManager` fijado en `package.json`).

```bash
pnpm install
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

Para una build de producción:

```bash
pnpm build
pnpm start
```

Si no tienes pnpm instalado: `corepack enable` (viene con Node 16.9+) o `npm install -g pnpm`.

## Qué incluye

**Sitio de reservas del huésped** (`/`)
- Landing con búsqueda de disponibilidad (fechas + huéspedes)
- Resultados de habitaciones con tarifa y disponibilidad en tiempo real (`/habitaciones`)
- Checkout de 3 pasos: datos del huésped → pago (Webpay Plus simulado) → confirmación (`/reserva/[roomId]`)
- Página de confirmación animada con código de reserva (`/confirmacion`)
- Modo oscuro / claro

**Panel de administración** (`/admin`)
- Dashboard con KPIs (reservas hoy, ocupación, ingresos del mes, % venta directa) y tabla de reservas recientes
- Reservas: listado completo, filtrable por canal y buscable
- Calendario de disponibilidad de 21 días por tipo de habitación
- Habitaciones y tarifas: fichas por tipo de habitación con tarifario por temporada
- Huéspedes: base de huéspedes con historial de reservas
- Integraciones: estado de conexión con channel manager (Beds24) y PMS
- Reportes: comparativa de ingresos por canal y comisión OTA evitada (gráfico con recharts)
- Configuración: datos del hotel y equipo con acceso al panel

## Datos simulados

Todos los datos (`src/data/mock-data.ts`) son ficticios y representan un escenario realista para Hotel Plaza: 3 tipos de habitación, tarifas de temporada alta/baja, 8 reservas en distintos estados y canales, 2 usuarios de staff, e integración con Beds24. La lógica de disponibilidad (`src/data/repository.ts`) calcula solapamiento de fechas en tiempo real sobre estos datos, igual que lo haría contra una base de datos real.

## Arquitectura

```
src/
  domain/       → tipos e interfaces del dominio (entidades del sistema)
  data/         → mock-data.ts (datos) + repository.ts (contrato + implementación mock)
  components/
    ui/         → primitivas estilo shadcn/ui (Button, Card, Table, Tabs, etc.)
    booking/    → componentes del flujo de reserva del huésped
    admin/      → componentes del panel de administración
  app/
    (guest)     → páginas del sitio de reservas
    admin/      → páginas del panel de administración
```

La capa `ReservationRepository` es la única frontera entre la UI y los datos. El día que exista backend real, se reemplaza `MockReservationRepository` por una implementación que llame a la API — ningún componente de la UI cambia.
