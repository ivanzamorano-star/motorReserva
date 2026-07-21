import type {
  Hotel,
  TipoHabitacion,
  Tarifa,
  Reserva,
  Huesped,
  Pago,
  UsuarioStaff,
  IntegracionExterna,
  CampanaEmail,
  EnvioEmail,
  ServicioAdicional,
  PaquetePromocional,
} from "@/domain/types";

export const HOTEL: Hotel = {
  id: "hotel-plaza",
  nombre: "Hotel Plaza",
  direccion: "Plaza de Armas, Punta Arenas, Magallanes",
  moneda: "CLP",
  idioma: "es",
  zonaHoraria: "America/Santiago",
  politicaCancelacion: "Cancelación gratuita hasta 48 horas antes del check-in.",
  telefono: "+56 61 224 1300",
  email: "reservas@hotelplaza.cl",
};

export const TIPOS_HABITACION: TipoHabitacion[] = [
  {
    id: "hab-estandar",
    hotelId: "hotel-plaza",
    nombre: "Habitación Estándar",
    descripcion: "Habitación cálida y luminosa en el edificio histórico, con vista a la Plaza de Armas.",
    nombreEn: "Standard Room",
    descripcionEn: "Warm, bright room in the historic building, overlooking the Plaza de Armas.",
    amenitiesEn: ["Wi-Fi", "Central heating", "Private bathroom", "Cable TV"],
    capacidad: 2,
    cantidadUnidades: 8,
    metros2: 18,
    amenities: ["Wi-Fi", "Calefacción central", "Baño privado", "TV cable"],
    imagenGradient: "from-slate-900/70 via-slate-900/10 to-transparent",
    imagenUrl: "https://www.hotelplaza.cl/images/47.webp",
  },
  {
    id: "hab-superior",
    hotelId: "hotel-plaza",
    nombre: "Habitación Superior",
    descripcion: "Espacio ampliado con escritorio de trabajo, ideal para estadías de negocios.",
    nombreEn: "Superior Room",
    descripcionEn: "Larger space with a work desk, ideal for business stays.",
    amenitiesEn: ["Wi-Fi", "Desk", "Minibar", "Private bathroom", "Cable TV"],
    capacidad: 2,
    cantidadUnidades: 6,
    metros2: 24,
    amenities: ["Wi-Fi", "Escritorio", "Minibar", "Baño privado", "TV cable"],
    imagenGradient: "from-blue-950/70 via-slate-900/10 to-transparent",
    imagenUrl: "https://www.hotelplaza.cl/images/36.webp",
  },
  {
    id: "hab-suite",
    hotelId: "hotel-plaza",
    nombre: "Suite Estrecho de Magallanes",
    descripcion: "La habitación más exclusiva del hotel, con living separado y vista panorámica.",
    nombreEn: "Strait of Magellan Suite",
    descripcionEn: "The hotel's most exclusive room, with a separate living area and panoramic views.",
    amenitiesEn: ["Wi-Fi", "Separate living area", "Premium minibar", "Robe and slippers", "Panoramic view"],
    capacidad: 3,
    cantidadUnidades: 3,
    metros2: 34,
    amenities: ["Wi-Fi", "Living separado", "Minibar premium", "Bata y pantuflas", "Vista panorámica"],
    imagenGradient: "from-amber-900/70 via-slate-900/10 to-transparent",
    imagenUrl: "https://www.hotelplaza.cl/images/78.webp",
  },
];

export const TARIFAS: Tarifa[] = [
  { id: "tar-1", tipoHabitacionId: "hab-estandar", fechaInicio: "2026-07-01", fechaFin: "2026-09-30", precioNoche: 52000, temporada: "baja" },
  { id: "tar-2", tipoHabitacionId: "hab-superior", fechaInicio: "2026-07-01", fechaFin: "2026-09-30", precioNoche: 68000, temporada: "baja" },
  { id: "tar-3", tipoHabitacionId: "hab-suite", fechaInicio: "2026-07-01", fechaFin: "2026-09-30", precioNoche: 98000, temporada: "baja" },
  { id: "tar-4", tipoHabitacionId: "hab-estandar", fechaInicio: "2026-10-01", fechaFin: "2027-04-30", precioNoche: 71000, temporada: "alta" },
  { id: "tar-5", tipoHabitacionId: "hab-superior", fechaInicio: "2026-10-01", fechaFin: "2027-04-30", precioNoche: 89000, temporada: "alta" },
  { id: "tar-6", tipoHabitacionId: "hab-suite", fechaInicio: "2026-10-01", fechaFin: "2027-04-30", precioNoche: 132000, temporada: "alta" },
];

export const HUESPEDES: Huesped[] = [
  { id: "hu-1", nombre: "Marcela Ortúzar", email: "marcela.ortuzar@example.com", telefono: "+56 9 8123 4455", pais: "Chile", nivel: "vip" },
  { id: "hu-2", nombre: "James Whitfield", email: "j.whitfield@example.com", telefono: "+1 415 555 0142", pais: "Estados Unidos", nivel: "frecuente" },
  { id: "hu-3", nombre: "Laura Fernández", email: "laura.fernandez@example.com", telefono: "+54 9 11 4455 8899", pais: "Argentina", nivel: "frecuente" },
  { id: "hu-4", nombre: "Hans Müller", email: "hans.muller@example.com", telefono: "+49 151 2345 6789", pais: "Alemania", nivel: "frecuente" },
  { id: "hu-5", nombre: "Renata Silva", email: "renata.silva@example.com", telefono: "+55 21 99887 6655", pais: "Brasil", nivel: "nuevo" },
  { id: "hu-6", nombre: "Ignacio Pérez", email: "ignacio.perez@example.com", telefono: "+56 9 7766 5544", pais: "Chile", nivel: "nuevo" },
];

export const PAGOS: Pago[] = [
  { id: "pg-1", reservaId: "res-1", monto: 156000, estado: "aprobado", tokenTransbank: "TBK-9F31C2", fecha: "2026-07-10T14:22:00", metodo: "credito", ultimos4: "4291" },
  { id: "pg-2", reservaId: "res-2", monto: 204000, estado: "aprobado", tokenTransbank: "TBK-7A02E9", fecha: "2026-07-11T09:05:00", metodo: "debito", ultimos4: "0087" },
  { id: "pg-4", reservaId: "res-4", monto: 132000, estado: "aprobado", tokenTransbank: "TBK-3D88B1", fecha: "2026-07-14T18:40:00", metodo: "credito", ultimos4: "5510" },
  { id: "pg-6", reservaId: "res-6", monto: 98000, estado: "reembolsado", tokenTransbank: "TBK-1C77F4", fecha: "2026-07-09T11:12:00", metodo: "credito", ultimos4: "3342" },
];

const RESERVAS_BASE: Reserva[] = [
  { id: "res-1", codigo: "HP-2607-001", hotelId: "hotel-plaza", tipoHabitacionId: "hab-superior", huespedId: "hu-1", checkIn: "2026-07-18", checkOut: "2026-07-21", huespedes: 2, estado: "confirmada", canalOrigen: "directo", montoTotal: 156000, creadaEn: "2026-07-10T14:20:00", pagoId: "pg-1" },
  { id: "res-2", codigo: "HP-2607-002", hotelId: "hotel-plaza", tipoHabitacionId: "hab-suite", huespedId: "hu-2", checkIn: "2026-07-19", checkOut: "2026-07-21", huespedes: 2, estado: "confirmada", canalOrigen: "directo", montoTotal: 204000, creadaEn: "2026-07-11T09:02:00", pagoId: "pg-2" },
  { id: "res-3", codigo: "HP-2607-003", hotelId: "hotel-plaza", tipoHabitacionId: "hab-estandar", huespedId: "hu-3", checkIn: "2026-07-20", checkOut: "2026-07-22", huespedes: 1, estado: "confirmada", canalOrigen: "booking", montoTotal: 104000, creadaEn: "2026-07-08T20:15:00" },
  { id: "res-4", codigo: "HP-2607-004", hotelId: "hotel-plaza", tipoHabitacionId: "hab-suite", huespedId: "hu-4", checkIn: "2026-07-22", checkOut: "2026-07-23", huespedes: 3, estado: "confirmada", canalOrigen: "directo", montoTotal: 132000, creadaEn: "2026-07-14T18:38:00", pagoId: "pg-4" },
  { id: "res-5", codigo: "HP-2607-005", hotelId: "hotel-plaza", tipoHabitacionId: "hab-estandar", huespedId: "hu-5", checkIn: "2026-07-23", checkOut: "2026-07-25", huespedes: 2, estado: "confirmada", canalOrigen: "expedia", montoTotal: 148000, creadaEn: "2026-07-06T10:40:00" },
  { id: "res-6", codigo: "HP-2607-006", hotelId: "hotel-plaza", tipoHabitacionId: "hab-suite", huespedId: "hu-6", checkIn: "2026-07-16", checkOut: "2026-07-17", huespedes: 2, estado: "cancelada_huesped", canalOrigen: "directo", montoTotal: 98000, creadaEn: "2026-07-09T11:10:00", pagoId: "pg-6" },
  { id: "res-7", codigo: "HP-2607-007", hotelId: "hotel-plaza", tipoHabitacionId: "hab-superior", huespedId: "hu-1", checkIn: "2026-07-25", checkOut: "2026-07-27", huespedes: 2, estado: "pendiente_pago", canalOrigen: "directo", montoTotal: 178000, creadaEn: "2026-07-17T19:50:00" },
  { id: "res-8", codigo: "HP-2607-008", hotelId: "hotel-plaza", tipoHabitacionId: "hab-estandar", huespedId: "hu-3", checkIn: "2026-07-15", checkOut: "2026-07-16", huespedes: 1, estado: "no_show", canalOrigen: "booking", montoTotal: 52000, creadaEn: "2026-07-05T08:20:00" },
  { id: "res-9", codigo: "HP-2607-009", hotelId: "hotel-plaza", tipoHabitacionId: "hab-estandar", huespedId: "hu-6", checkIn: "2026-07-17", checkOut: "2026-07-19", huespedes: 1, estado: "confirmada", canalOrigen: "booking", montoTotal: 104000, creadaEn: "2026-07-12T16:05:00" },
  { id: "res-10", codigo: "HP-2607-010", hotelId: "hotel-plaza", tipoHabitacionId: "hab-superior", huespedId: "hu-5", checkIn: "2026-07-15", checkOut: "2026-07-17", huespedes: 2, estado: "confirmada", canalOrigen: "directo", montoTotal: 136000, creadaEn: "2026-07-04T12:30:00" },
];

// Reservas de prueba para el motor de disponibilidad: dejan el hotel 100% ocupado
// (los 3 tipos de habitación, todas sus unidades) del 15 al 17 de agosto de 2026.
// Sirven para probar visualmente que el filtro de disponibilidad oculta las tarjetas
// sin unidades libres y muestra el mensaje de "sin disponibilidad" cuando corresponde.
const FECHA_PRUEBA_SIN_DISPONIBILIDAD = { checkIn: "2026-08-15", checkOut: "2026-08-17" };

function generarReservasHotelCompleto(): Reserva[] {
  const ocupacionPorTipo: { tipoHabitacionId: string; unidades: number }[] = [
    { tipoHabitacionId: "hab-estandar", unidades: 8 },
    { tipoHabitacionId: "hab-superior", unidades: 6 },
    { tipoHabitacionId: "hab-suite", unidades: 3 },
  ];
  const huespedesDemo = ["hu-1", "hu-2", "hu-3", "hu-4", "hu-5", "hu-6"];

  return ocupacionPorTipo.flatMap(({ tipoHabitacionId, unidades }) =>
    Array.from({ length: unidades }, (_, i) => ({
      id: `res-full-${tipoHabitacionId}-${i}`,
      codigo: `HP-2608-${tipoHabitacionId.replace("hab-", "").slice(0, 3).toUpperCase()}${i + 1}`,
      hotelId: "hotel-plaza",
      tipoHabitacionId,
      huespedId: huespedesDemo[i % huespedesDemo.length],
      checkIn: FECHA_PRUEBA_SIN_DISPONIBILIDAD.checkIn,
      checkOut: FECHA_PRUEBA_SIN_DISPONIBILIDAD.checkOut,
      huespedes: 2,
      estado: "confirmada" as const,
      canalOrigen: "directo" as const,
      montoTotal: 90000,
      creadaEn: "2026-06-15T10:00:00",
    }))
  );
}

// Reservas de demo para la ventana de búsqueda por defecto (18–20 jul 2026).
// Junto con las reservas base (res-1 Superior, res-2 Suite), dejan:
//   · Suite    → 3/3 ocupadas  → AGOTADA para estas fechas
//   · Superior → 5/6 ocupadas  → queda solo 1 unidad (estado de escasez)
//   · Estándar → sin cambios    → amplia disponibilidad (estado normal)
// Así el listado de resultados muestra los tres estados de la UI a la vez.
const FECHA_DEMO_ESCASEZ = { checkIn: "2026-07-18", checkOut: "2026-07-20" };

function generarReservasEscasezDemo(): Reserva[] {
  const plan = [
    { tipoHabitacionId: "hab-suite", cantidad: 2 }, // +1 (res-2) = 3/3 → agotada
    { tipoHabitacionId: "hab-superior", cantidad: 4 }, // +1 (res-1) = 5/6 → queda 1
  ];
  const huespedesDemo = ["hu-1", "hu-2", "hu-3", "hu-4", "hu-5", "hu-6"];

  return plan.flatMap(({ tipoHabitacionId, cantidad }) =>
    Array.from({ length: cantidad }, (_, i) => ({
      id: `res-demo-${tipoHabitacionId}-${i}`,
      codigo: `HP-2607-D${tipoHabitacionId.replace("hab-", "").slice(0, 3).toUpperCase()}${i + 1}`,
      hotelId: "hotel-plaza",
      tipoHabitacionId,
      huespedId: huespedesDemo[i % huespedesDemo.length],
      checkIn: FECHA_DEMO_ESCASEZ.checkIn,
      checkOut: FECHA_DEMO_ESCASEZ.checkOut,
      huespedes: 2,
      estado: "confirmada" as const,
      canalOrigen: "directo" as const,
      montoTotal: 90000,
      creadaEn: "2026-07-12T10:00:00",
    }))
  );
}

export const RESERVAS: Reserva[] = [
  ...RESERVAS_BASE,
  ...generarReservasHotelCompleto(),
  ...generarReservasEscasezDemo(),
];

export const STAFF: UsuarioStaff[] = [
  { id: "st-1", hotelId: "hotel-plaza", nombre: "Iván Zamorano", email: "ivan.zamorano@iaworks.cl", rol: "administrador", avatarIniciales: "IZ" },
  { id: "st-2", hotelId: "hotel-plaza", nombre: "Carolina Bahamonde", email: "recepcion@hotelplaza.cl", rol: "recepcion", avatarIniciales: "CB" },
];

export const CAMPANIAS_EMAIL: CampanaEmail[] = [
  {
    id: "camp-1",
    hotelId: "hotel-plaza",
    nombre: "Agradecimiento post-estadía",
    trigger: "post_estadia",
    diasDelay: 2,
    asunto: "Gracias por hospedarse en Hotel Plaza, {{nombre}}",
    descripcion: "Se envía automáticamente 2 días después del check-out. Agradece la estadía e invita a dejar una reseña.",
    activa: true,
    enviosTotales: 34,
    tasaAperturaPorcentaje: 68,
  },
  {
    id: "camp-2",
    hotelId: "hotel-plaza",
    nombre: "Invitación a volver — temporada baja",
    trigger: "recompra",
    diasDelay: 60,
    asunto: "{{nombre}}, vuelva a Punta Arenas con una tarifa especial",
    descripcion: "Se envía 60 días después del check-out a huéspedes que no han vuelto a reservar, con un descuento de temporada baja.",
    activa: true,
    enviosTotales: 21,
    tasaAperturaPorcentaje: 41,
  },
  {
    id: "camp-3",
    hotelId: "hotel-plaza",
    nombre: "Recordatorio de reseña",
    trigger: "resena",
    diasDelay: 5,
    asunto: "¿Cómo fue su experiencia en Hotel Plaza?",
    descripcion: "Se envía 5 días después del check-out si el huésped no dejó reseña, con enlace directo a Google y TripAdvisor.",
    activa: true,
    enviosTotales: 29,
    tasaAperturaPorcentaje: 52,
  },
  {
    id: "camp-4",
    hotelId: "hotel-plaza",
    nombre: "Feliz cumpleaños",
    trigger: "cumpleanos",
    diasDelay: 0,
    asunto: "Feliz cumpleaños, {{nombre}} — un regalo de Hotel Plaza",
    descripcion: "Se envía el día del cumpleaños del huésped (requiere fecha de nacimiento registrada). Incluye un beneficio para su próxima estadía.",
    activa: false,
    enviosTotales: 0,
    tasaAperturaPorcentaje: 0,
  },
];

export const ENVIOS_EMAIL: EnvioEmail[] = [
  {
    id: "env-1",
    huespedId: "hu-1",
    asunto: "Gracias por hospedarse en Hotel Plaza, Marcela",
    cuerpo: "Estimada Marcela, muchas gracias por elegirnos durante su reciente visita a Punta Arenas...",
    tipo: "automatizado",
    fecha: "2026-07-13T09:00:00",
    estado: "abierto",
  },
  {
    id: "env-2",
    huespedId: "hu-6",
    asunto: "¿Cómo fue su experiencia en Hotel Plaza?",
    cuerpo: "Estimado Ignacio, esperamos que haya disfrutado su estadía. Nos encantaría conocer su opinión...",
    tipo: "automatizado",
    fecha: "2026-07-11T09:00:00",
    estado: "enviado",
  },
  {
    id: "env-3",
    huespedId: "hu-3",
    asunto: "Un gesto especial para agradecer su preferencia",
    cuerpo: "Estimada Laura, quisimos escribirle personalmente para agradecer su hospitalidad durante su estadía...",
    tipo: "personalizado",
    fecha: "2026-07-09T15:30:00",
    estado: "abierto",
  },
];

export const SERVICIOS_ADICIONALES: ServicioAdicional[] = [
  {
    id: "serv-tour",
    nombre: "Tour Pingüinos & Estrecho de Magallanes",
    descripcion: "Excursión de día completo a la colonia de pingüinos con guía bilingüe.",
    categoria: "tour",
    precio: 45000,
  },
  {
    id: "serv-piscina",
    nombre: "Traslado + acceso a piscina y spa",
    descripcion: "Traslado ida y vuelta más entrada a piscina temperada y tinas de un centro de spa asociado.",
    categoria: "spa",
    precio: 18000,
  },
  {
    id: "serv-masaje",
    nombre: "Masaje relajante 50 minutos",
    descripcion: "Sesión de masaje de relajación en el spa asociado.",
    categoria: "spa",
    precio: 35000,
  },
  {
    id: "serv-cena",
    nombre: "Cena de maridaje regional",
    descripcion: "Menú de degustación con productos de Magallanes y maridaje de vinos.",
    categoria: "gastronomia",
    precio: 28000,
  },
  {
    id: "serv-aeropuerto",
    nombre: "Traslado aeropuerto ida y vuelta",
    descripcion: "Transfer privado desde/hacia el aeropuerto Presidente Carlos Ibáñez del Campo.",
    categoria: "traslado",
    precio: 15000,
  },
];

export const PAQUETES_PROMOCIONALES: PaquetePromocional[] = [
  {
    id: "paq-1",
    hotelId: "hotel-plaza",
    nombre: "Escapada Suite con Descuento",
    descripcion: "Una noche en la Suite Estrecho de Magallanes a tarifa rebajada, ideal para ocupar disponibilidad en baja demanda.",
    tipoHabitacionId: "hab-suite",
    serviciosIds: [],
    precioReferencia: 98000,
    precioPaquete: 79000,
    publico: "todos",
    activo: true,
    vecesVendido: 6,
    vigenciaInicio: "2026-07-01",
    vigenciaFin: "2026-09-30",
  },
  {
    id: "paq-2",
    hotelId: "hotel-plaza",
    nombre: "Experiencia Patagonia Completa",
    descripcion: "Habitación Superior + tour de pingüinos + cena de maridaje. Pensado para huéspedes frecuentes que quieran una estadía superior.",
    tipoHabitacionId: "hab-superior",
    serviciosIds: ["serv-tour", "serv-cena"],
    precioReferencia: 141000,
    precioPaquete: 119000,
    publico: "frecuente",
    activo: true,
    vecesVendido: 9,
    vigenciaInicio: "2026-07-01",
    vigenciaFin: "2026-09-30",
  },
  {
    id: "paq-3",
    hotelId: "hotel-plaza",
    nombre: "Paquete Bienestar",
    descripcion: "Habitación Estándar + traslado a piscina y spa + masaje relajante. Upsell ideal al momento de confirmar la reserva.",
    tipoHabitacionId: "hab-estandar",
    serviciosIds: ["serv-piscina", "serv-masaje"],
    precioReferencia: 105000,
    precioPaquete: 89000,
    publico: "frecuente",
    activo: true,
    vecesVendido: 4,
    vigenciaInicio: "2026-07-01",
    vigenciaFin: "2026-09-30",
  },
  {
    id: "paq-4",
    hotelId: "hotel-plaza",
    nombre: "Paquete Corporativo Magallanes",
    descripcion: "Habitación Superior + traslado aeropuerto ida y vuelta, con facturación a empresa. Pensado para viajeros de negocios.",
    tipoHabitacionId: "hab-superior",
    serviciosIds: ["serv-aeropuerto"],
    precioReferencia: 83000,
    precioPaquete: 75000,
    publico: "empresa",
    activo: false,
    vecesVendido: 0,
    vigenciaInicio: "2026-08-01",
    vigenciaFin: "2026-12-31",
  },
];

export const INTEGRACIONES: IntegracionExterna[] = [
  {
    id: "int-1",
    hotelId: "hotel-plaza",
    tipo: "channel_manager",
    nombre: "Beds24",
    activo: true,
    ultimaSincronizacion: "2026-07-17T20:12:00",
    canalesConectados: ["Booking.com", "Expedia"],
  },
  {
    id: "int-2",
    hotelId: "hotel-plaza",
    tipo: "pms",
    nombre: "PMS externo",
    activo: false,
    ultimaSincronizacion: "—",
  },
];
