# Motor de reservas Hotel Plaza — Análisis competitivo y roadmap

**Equipo:** hotelería + desarrollo senior · **Fecha:** 20 de julio de 2026
**Objetivo:** convertir la demo en el mejor motor de reservas del rubro, que **complemente** un PMS y aporte ventas (promociones) y fidelización (ofertas a clientes antiguos), **sin competir con un CRM** y **sin eliminar nada de lo ya construido**.

---

## 1. Posicionamiento: qué somos y qué no

El producto se define como un **motor de reserva directa + capa de revenue y fidelización**. Se ubica *al lado* del PMS y del CRM, no encima de ellos:

- **Complementa el PMS:** empuja reservas confirmadas, disponibilidad y datos de huésped hacia el PMS; consume tarifas e inventario en tiempo real. No reemplaza la operación (check-in, housekeeping, folios).
- **Complementa el CRM:** captura datos de primera mano (correo, preferencias, historial de reserva directa) y los entrega segmentados. No pretende ser el sistema de gestión de relaciones; solo alimenta al que el hotel ya use y ejecuta acciones puntuales de venta/fidelización desde la reserva.
- **Compite con las OTA**, no con el software del hotel. Todo el foco es recuperar la reserva directa (sin comisión de 15–30%, menor cancelación, dato del huésped propio).

Esta frontera es la que mantiene el producto vendible: "somos el canal directo que hace ganar al hotel, y le paso ordenado el dato a tus otros sistemas".

---

## 2. Qué dice la industria (2026) — hallazgos clave

**El problema real.** En hoteles independientes el **63,4% de las reservas se van por OTA**, no porque tengan mejor habitación sino mejor checkout. Y **~81,7% de las reservas iniciadas no se completan** (85,6% en móvil). La reserva directa cancela mucho menos (**10,6% vs 21,8%** de OTA) y deja el dato del huésped en casa.

**Las 5 causas de abandono** (y su antídoto):
1. **Indecisión** → comunicar USPs, política de cancelación clara, beneficios de reservar directo, *saved-search* por correo para retomar.
2. **Problemas técnicos / lentitud** → velocidad y móvil primero.
3. **UX confusa** → pocos pasos, "Reservar" siempre visible, sin saltos de sitio.
4. **Falta de transparencia de precio** → mostrar el total con impuestos desde el inicio.
5. **Rigidez de pago** → varios métodos seguros (tarjeta, wallets, pagar en hotel, depósito).

**Fidelización que funciona en hoteles independientes:** tarifa de socio **5–15% bajo la pública, visible solo al identificarse** (no rompe paridad con OTA). Programa **simple** (noches → beneficio) antes que puntos complejos. El huésped repetido cuesta **5–7× menos** de captar y gasta **~23% más**. Métricas que importan: **enrollment, active member rate, y direct-booking shift**.

**Motor moderno vs. básico:** embebido en el sitio (no iframe), móvil primero, pagos flexibles, **rate plans + paquetes + upsell en el flujo**, integraciones de analítica (GA4/GTM/pixel), visibilidad SEO/IA, e incentivos de reserva directa (promo, tarifa socio, best-price guarantee). El upsell en el flujo y pre-llegada sube el ingreso por reserva 15–25%.

---

## 3. Cómo estás hoy (fortalezas ya construidas)

Tu demo **ya cubre buena parte del estado del arte**, y eso es una ventaja competitiva real:

| Best practice de la industria | Estado en tu sistema |
|---|---|
| Motor embebido, nativo (no iframe), SEO/IA-friendly | ✅ Next.js App Router — **fortaleza fuerte vs. competidores con iframe** |
| Transparencia de precio (total con impuestos) | ✅ "impuestos incluidos" |
| Beneficios de reserva directa (value-stack) | ✅ "Reservando directo con nosotros" |
| Tarifa de socio oculta por identificación | ✅ Tarifas VIP por correo (NIVEL_DESCUENTO, precio tachado + chip VIP) |
| Señales de confianza en checkout | ✅ cancelación 48h, pago seguro, reseñas 4,8 |
| Multi-moneda en vivo | ✅ CLP/USD |
| Multi-idioma | ✅ ES/EN (en cierre) |
| Recuperación de reservas abandonadas | ✅ en admin (Revenue Automations) |
| Motor de ofertas / promociones | ✅ códigos con reglas, presets flash, ROI |
| Documentos tributarios (DTE Chile) | ✅ boleta/factura — **diferenciador local** |

---

## 4. Brechas priorizadas (qué falta para ser "el mejor")

Priorización por **impacto en conversión/ingreso × esfuerzo**, respetando estética y "una cosa a la vez". Integra las TAREAS ya definidas y agrega ideas nuevas del análisis.

### Prioridad ALTA — impacto directo en conversión y venta

**A1. Terminar i18n ES/EN** *(TAREA 1, en curso)*
Un motor a medias en inglés pierde al turista extranjero (clave en Punta Arenas / Torres del Paine). Bajo esfuerzo, ya arrancado.

**A2. Métodos de pago flexibles** *(TAREA 4)*
Rigidez de pago = causa #5 de abandono. Ofrecer en checkout: tarjeta (Webpay, ya está), **pagar en el hotel** y **depósito/seña parcial**, cada uno explicado en lenguaje simple. Solo UI/lógica demo. Alto impacto, esfuerzo medio.

**A3. Prueba social + urgencia sutil** *(TAREA 3)*
Combate la indecisión (causa #1). Reseñas destacadas (★4,8), micro-señales elegantes ("reservada hace X h", "X personas viendo"), sin saturar, complementando la escasez que ya tienes ("última habitación"). Alto impacto, bajo esfuerzo.

**A4. Upsell / add-ons dentro del flujo**
Extender `additional-services` a upgrades de habitación, late check-out, desayuno, traslados y experiencias (pingüinos, Torres del Paine) en el paso de reserva y en pre-llegada. Sube ingreso por reserva 15–25%. Esfuerzo medio.

### Prioridad ALTA-MEDIA — fidelización (tu foco de "clientes antiguos")

**B1. Portal del huésped** *(TAREA 2)*
El cliente ingresa su correo y ve su **nivel** (Nuevo/Frecuente/VIP), su **beneficio de tarifa**, su **historial** y puede pedir cancelar/modificar (WhatsApp/correo con código). Es la cara visible de la fidelización sin login real. Reutiliza `getNivelPorEmail` y CRM. Esfuerzo medio.

**B2. Programa de fidelización simple (capa de reglas)**
Formalizar el esquema "noches → beneficio" que hoy es implícito: mostrar al huésped cuánto le falta para el siguiente nivel, y disparar **ofertas a clientes antiguos** (win-back) desde el motor de ofertas. Simple primero, sin puntos complejos. Esfuerzo medio.

### Prioridad MEDIA — inteligencia y venta asistida

**C1. Analítica de embudo de conversión** *(TAREA 5)*
Visitas → búsquedas → checkout iniciado → reserva, con tasa de abandono, en Reportes. Refuerza la narrativa de recuperación y le da al hotelero el "dónde pierdo". Esfuerzo medio.

**C2. Integración de marketing/analítica (GA4 / GTM / pixel)** *(brecha nueva)*
Hoy es un hueco. Un motor moderno mide cada peso de marketing. Dejar preparado el cableado de GA4 + eventos de embudo (aunque sea con dataLayer mock) para producción. Esfuerzo bajo-medio.

**C3. Saved-search / retomar reserva por correo (público)** *(brecha nueva)*
Antídoto directo a la indecisión: "te enviamos tu búsqueda para seguir después". Alimenta la recuperación que ya existe en admin, pero desde el lado del huésped. Esfuerzo medio.

### Prioridad ESTRATÉGICA — el "complemento del PMS"

**D1. Sincronización real con PMS / Channel Manager** *(TAREA 6)*
Diseñar el detalle de una conexión: estado de sync, último sync, mapeo de habitaciones, prevención de doble-booking, flujo de inventario en tiempo real. Es lo que convierte la demo en "complemento de PMS" creíble para vender. Mayor esfuerzo; hoy conceptual. Ideal como pieza de cierre comercial.

---

## 5. Orden de ejecución recomendado

Una pantalla a la vez, mostrando avance y esperando aprobación en cada una:

1. **A1** Terminar i18n (ya en curso) — cerrar pantalla por pantalla.
2. **A3** Prueba social + urgencia (alto impacto, bajo esfuerzo — "quick win").
3. **A2** Métodos de pago flexibles.
4. **A4** Upsell/add-ons en el flujo.
5. **B1** Portal del huésped.
6. **B2** Programa de fidelización simple + win-back.
7. **C1** Embudo de conversión + **C2** GA4/eventos + **C3** saved-search.
8. **D1** Detalle de sincronización PMS/Channel (cierre estratégico).

Regla transversal en cada entrega: no romper paleta ni patrones (`eyebrow`, `card-accent`, `btn-gold`, slide-over, `tabular-nums`), lenguaje simple para el huésped, `npx tsc --noEmit` + revisión en navegador, y nada se elimina — todo se suma.

---

## Fuentes
- Cloudbeds — *What is a Hotel Booking Engine? The Complete 2026 Guide*: https://www.cloudbeds.com/articles/hotel-booking-engine-guide/
- Hotelchamp — *Top 5 Reasons for Booking Engine Abandonment*: https://www.hotelchamp.com/blog/5-reasons-booking-engine-abandonment
- RevOptimum — *Loyalty Member Rates in Your Booking Engine*: https://www.revoptimum.com/blog/maximizing-direct-bookings-the-importance-of-loyalty-member-rates-in-your-hotels-booking-engine
- Preferred Patron — *Hotel Loyalty Programs & Direct Bookings*: https://www.preferredpatron.com/blog/2026/05/28/hotel-loyalty-programs-direct-bookings/
- Mews — *Best upselling software for hotels 2026*: https://www.mews.com/en/blog/hotel-upsell-software
- BookingWhizz — *AI-Powered Upselling: What's Working in 2026*: https://bookingwhizz.com/en/blog/ai-upselling-trends-2026
- HotelTechReport — *Best Hotel Booking Engines 2026*: https://hoteltechreport.com/marketing/hotel-booking-engine
