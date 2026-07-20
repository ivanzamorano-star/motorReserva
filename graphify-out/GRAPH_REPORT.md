# Graph Report - .  (2026-07-17)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 330 nodes · 855 edges · 15 communities (10 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- utils.ts
- repository.ts
- dependencies
- formatCLP
- room-card.tsx
- compilerOptions
- MockReservationRepository
- enviar-promocion-form.tsx
- package.json
- dialog.tsx
- layout.tsx
- next.config.mjs
- next-env.d.ts
- postcss.config.mjs
- tailwind.config.ts

## God Nodes (most connected - your core abstractions)
1. `ReservationRepository` - 41 edges
2. `cn()` - 27 edges
3. `MockReservationRepository` - 26 edges
4. `formatCLP()` - 23 edges
5. `delay()` - 21 edges
6. `formatDate()` - 17 edges
7. `Badge()` - 16 edges
8. `Card` - 16 edges
9. `compilerOptions` - 16 edges
10. `CardContent` - 15 edges

## Surprising Connections (you probably didn't know these)
- `AdminMobileNav()` --references--> `react`  [EXTRACTED]
  src/components/admin/mobile-nav.tsx → package.json
- `CheckoutForm()` --references--> `react`  [EXTRACTED]
  src/components/booking/checkout-form.tsx → package.json
- `SearchBar()` --references--> `react`  [EXTRACTED]
  src/components/booking/search-bar.tsx → package.json
- `ThemeToggle()` --references--> `react`  [EXTRACTED]
  src/components/theme-toggle.tsx → package.json
- `CampaniasList()` --references--> `react`  [EXTRACTED]
  src/components/admin/campanias-list.tsx → package.json

## Import Cycles
- None detected.

## Communities (15 total, 5 thin omitted)

### Community 0 - "utils.ts"
Cohesion: 0.11
Nodes (36): CalendarioPage(), toISODate(), KpiCard(), PaqueteConHabitacion, ReservaFila, AdminSidebar(), NAV, Avatar (+28 more)

### Community 1 - "repository.ts"
Cohesion: 0.08
Nodes (32): TRIGGER_ICON, TRIGGER_LABEL, CAMPANIAS_EMAIL, ENVIOS_EMAIL, HOTEL, INTEGRACIONES, PAGOS, PAQUETES_PROMOCIONALES (+24 more)

### Community 2 - "dependencies"
Cohesion: 0.04
Nodes (49): autoprefixer, class-variance-authority, clsx, framer-motion, lucide-react, next, next-themes, dependencies (+41 more)

### Community 3 - "formatCLP"
Cohesion: 0.10
Nodes (22): react, react, HabitacionesPage(), IntegracionesPage(), AdminDashboardPage(), ReportesPage(), CampaniasList(), CanalChart() (+14 more)

### Community 4 - "room-card.tsx"
Cohesion: 0.12
Nodes (14): metadata, HabitacionesPage(), AdminMobileNav(), NAV, CheckoutForm(), ConfirmacionAnimada(), RoomCard(), RoomVisual() (+6 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 6 - "MockReservationRepository"
Cohesion: 0.16
Nodes (5): HUESPEDES, TARIFAS, TIPOS_HABITACION, delay(), MockReservationRepository

### Community 7 - "enviar-promocion-form.tsx"
Cohesion: 0.18
Nodes (15): PUBLICOS, EnvioConHuesped, EnvioConHuesped, PaqueteConHabitacion, Paso, Button, ButtonProps, buttonVariants (+7 more)

### Community 8 - "package.json"
Cohesion: 0.20
Nodes (9): name, packageManager, private, scripts, build, dev, lint, start (+1 more)

### Community 9 - "dialog.tsx"
Cohesion: 0.33
Nodes (5): DialogContent, DialogDescription, DialogHeader(), DialogOverlay, DialogTitle

## Knowledge Gaps
- **91 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `packageManager` (+86 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`, `formatCLP`?**
  _High betweenness centrality (0.278) - this node is a cross-community bridge._
- **Why does `react` connect `formatCLP` to `dependencies`, `room-card.tsx`?**
  _High betweenness centrality (0.260) - this node is a cross-community bridge._
- **Why does `ReservationRepository` connect `repository.ts` to `utils.ts`, `formatCLP`, `room-card.tsx`, `MockReservationRepository`, `enviar-promocion-form.tsx`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _91 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11338398597311514 - nodes in this community are weakly interconnected._
- **Should `repository.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07857142857142857 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._