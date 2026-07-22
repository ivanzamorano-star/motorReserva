// Capa de dominio — entidades centrales del motor de reservas.
// Corresponde 1:1 al diccionario de entidades del documento técnico
// "Especificación Técnica: Motor de Reservas Hotelero".

export type Idioma = "es" | "en";
export type Moneda = "CLP" | "USD";

// Staff Tag de una mucama — sin cuenta de usuario real. `pisoACargo` es el piso
// que tiene asignado de forma fija; si se deja indefinido, es "flotante" y puede
// cubrir cualquier piso cuando no hay una encargada fija disponible.
export interface MucamaStaff {
  nombre: string;
  pisoACargo?: number;
}

export interface Hotel {
  id: string;
  nombre: string;
  direccion: string;
  moneda: Moneda;
  idioma: Idioma;
  zonaHoraria: string;
  politicaCancelacion: string;
  telefono: string;
  email: string;
  // Sistema ligero de incentivos — Ingreso Prioritario (early check-in).
  precioIngresoPrioritario: number; // tarifa plana configurable
  mucamas: MucamaStaff[]; // "Staff Tags", sin cuentas de usuario reales
  incentivoIngresoPrioritarioPct: number; // 0–1, % de precioIngresoPrioritario que se paga de bono
}

export interface TipoHabitacion {
  id: string;
  hotelId: string;
  nombre: string;
  descripcion: string;
  nombreEn?: string; // nombre en inglés (i18n); cae a `nombre` si no existe
  descripcionEn?: string; // descripción en inglés (i18n)
  amenitiesEn?: string[]; // amenities en inglés, en el mismo orden que `amenities`
  capacidad: number;
  cantidadUnidades: number;
  metros2: number;
  piso: number; // piso donde se ubica este tipo de habitación (para asignar mucama de Ingreso Prioritario)
  amenities: string[];
  imagenGradient: string; // gradiente de respaldo / overlay sobre la foto
  imagenUrl: string; // foto real de la habitación
}

export interface Tarifa {
  id: string;
  tipoHabitacionId: string;
  fechaInicio: string;
  fechaFin: string;
  precioNoche: number;
  temporada: "baja" | "media" | "alta";
}

export type EstadoReserva =
  | "pendiente_pago"
  | "confirmada"
  | "expirada"
  | "cancelada_huesped"
  | "cancelada_hotel"
  | "no_show"
  | "reembolsada";

export type CanalOrigen = "directo" | "booking" | "expedia" | "telefono";

export interface Huesped {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  pais: string;
  nivel?: NivelCliente;
}

export interface Pago {
  id: string;
  reservaId: string;
  monto: number;
  estado: "aprobado" | "rechazado" | "pendiente" | "reembolsado";
  tokenTransbank: string;
  fecha: string;
  metodo: "credito" | "debito";
  ultimos4: string;
}

export type TipoDocumentoTributario = "boleta" | "factura";

// Datos comerciales para Factura Electrónica (mercado chileno / DTE del SII).
export interface DatosFactura {
  razonSocial: string;
  rut: string;
  giro: string;
  direccion: string;
  emailDTE: string; // correo donde la empresa recibe sus documentos tributarios
}

export interface DocumentoTributario {
  tipo: TipoDocumentoTributario;
  factura?: DatosFactura;
}

export type EstadoSolicitudExtra = "pendiente_confirmacion" | "aprobada" | "rechazada";

// Solicitud de Ingreso Prioritario (early check-in) — tarifa plana fijada por
// configuración del hotel al momento de la solicitud. Recepción la aprueba y,
// al hacer el check-in, asigna qué mucama preparó la habitación (para el
// sistema de incentivos).
export interface SolicitudEarlyCheckin {
  estado: EstadoSolicitudExtra;
  monto: number;
  solicitadaEn: string;
  mucamaAsignada?: string;
}

export type FranjaLateCheckout = "franja1" | "franja2" | "franja3"; // 14:00 / 16:00 / +18:00

// Solicitud de Late Check-out — tarificación proporcional (30% / 55% / 100% de la
// tarifa/noche vigente), calculada al momento de la solicitud y sujeta a confirmación
// y cobro final por parte de recepción (no se cobra en el checkout).
export interface SolicitudLateCheckout {
  franja: FranjaLateCheckout;
  montoEstimado: number;
  estado: EstadoSolicitudExtra;
  solicitadaEn: string;
}

export interface Reserva {
  id: string;
  codigo: string;
  hotelId: string;
  tipoHabitacionId: string;
  huespedId: string;
  checkIn: string;
  checkOut: string;
  huespedes: number;
  estado: EstadoReserva;
  canalOrigen: CanalOrigen;
  montoTotal: number;
  creadaEn: string;
  pagoId?: string;
  documentoTributario?: DocumentoTributario;
  // Datos del huésped capturados en reservas creadas manualmente desde el panel
  // (cuando no existe un registro de Huesped asociado por huespedId).
  huespedNombre?: string;
  huespedEmail?: string;
  huespedTelefono?: string;
  // Solicitudes especiales (early check-in / late check-out) — modalidad "solo
  // solicitud": no se cobran en el checkout, quedan pendientes de aprobación y
  // cobro por parte de recepción 24 hrs antes.
  solicitudEarlyCheckin?: SolicitudEarlyCheckin;
  solicitudLateCheckout?: SolicitudLateCheckout;
  // Se marca true cuando recepción entrega la habitación (check-in operativo).
  checkInRealizado?: boolean;
}

export interface UsuarioStaff {
  id: string;
  hotelId: string;
  nombre: string;
  email: string;
  rol: "administrador" | "recepcion";
  avatarIniciales: string;
}

// Bloqueo operativo de una habitación: la deja fuera del inventario disponible
// para un rango de fechas (mantenimiento, fuera de servicio, uso interno, etc.).
export interface BloqueoHabitacion {
  id: string;
  tipoHabitacionId: string;
  desde: string; // YYYY-MM-DD
  hasta: string; // YYYY-MM-DD
  motivo: string;
  creadoEn: string;
}

export type TipoIntegracion = "channel_manager" | "pms";

export interface IntegracionExterna {
  id: string;
  hotelId: string;
  tipo: TipoIntegracion;
  nombre: string;
  activo: boolean;
  ultimaSincronizacion: string;
  canalesConectados?: string[];
}

export type TriggerEmail = "post_estadia" | "cumpleanos" | "recompra" | "resena" | "manual";

export interface CampanaEmail {
  id: string;
  hotelId: string;
  nombre: string;
  trigger: TriggerEmail;
  diasDelay: number; // días desde el evento disparador (check-out, cumpleaños, etc.)
  asunto: string;
  descripcion: string;
  activa: boolean;
  enviosTotales: number;
  tasaAperturaPorcentaje: number;
}

export interface EnvioEmail {
  id: string;
  huespedId: string;
  asunto: string;
  cuerpo: string;
  tipo: "automatizado" | "personalizado";
  fecha: string;
  estado: "enviado" | "abierto" | "programado";
}

export type CategoriaServicioAdicional = "tour" | "spa" | "traslado" | "gastronomia" | "otro";

export interface ServicioAdicional {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: CategoriaServicioAdicional;
  precio: number;
}

export type PublicoPaquete = "todos" | "frecuente" | "empresa";

export interface PaquetePromocional {
  id: string;
  hotelId: string;
  nombre: string;
  descripcion: string;
  tipoHabitacionId: string;
  serviciosIds: string[];
  precioReferencia: number; // suma de habitación (1 noche) + servicios a precio de lista
  precioPaquete: number; // precio final ofrecido
  publico: PublicoPaquete;
  activo: boolean;
  vecesVendido: number;
  vigenciaInicio: string;
  vigenciaFin: string;
}

// Vistas compuestas usadas por la UI (no son entidades de base de datos)
// Nivel de fidelización del huésped — usado por el motor para aplicar tarifas secretas.
export type NivelCliente = "nuevo" | "frecuente" | "vip";

export interface HabitacionConDisponibilidad extends TipoHabitacion {
  tarifaNoche: number; // tarifa efectiva (ya con beneficio de nivel aplicado)
  unidadesDisponibles: number;
  tarifaBase?: number; // tarifa pública antes del beneficio (si hubo descuento)
  descuentoPct?: number; // porcentaje de descuento aplicado (0–1)
  nivelAplicado?: NivelCliente; // nivel reconocido que originó el beneficio
}

export interface KpiDashboard {
  reservasHoy: number;
  ocupacionPorcentaje: number;
  ingresosMes: number;
  reservasDirectasPorcentaje: number;
}
