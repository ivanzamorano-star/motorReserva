// Capa de dominio — entidades centrales del motor de reservas.
// Corresponde 1:1 al diccionario de entidades del documento técnico
// "Especificación Técnica: Motor de Reservas Hotelero".

export type Idioma = "es" | "en";
export type Moneda = "CLP" | "USD";

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
