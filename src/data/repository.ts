// Capa de repositorio (Clean Architecture) — define el contrato que usaría
// la UI sin importar si los datos vienen de un mock o de una API real.
// Hoy implementa MockReservationRepository; el día de mañana se reemplaza
// por una implementación que llame a la API de Reservas real, sin tocar
// ningún componente de la UI.

import {
  Hotel,
  TipoHabitacion,
  Tarifa,
  Reserva,
  Huesped,
  Pago,
  UsuarioStaff,
  IntegracionExterna,
  HabitacionConDisponibilidad,
  KpiDashboard,
  CampanaEmail,
  EnvioEmail,
  ServicioAdicional,
  PaquetePromocional,
  DocumentoTributario,
} from "@/domain/types";
import {
  HOTEL,
  TIPOS_HABITACION,
  TARIFAS,
  RESERVAS,
  HUESPEDES,
  PAGOS,
  STAFF,
  INTEGRACIONES,
  CAMPANIAS_EMAIL,
  ENVIOS_EMAIL,
  SERVICIOS_ADICIONALES,
  PAQUETES_PROMOCIONALES,
} from "./mock-data";
import { calcularUnidadesDisponibles } from "@/lib/disponibilidad";

function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// El estado mutable de la demo (reservas nuevas, tarifas editadas, paquetes creados, etc.)
// se guarda en `globalThis` en lugar de en un campo de instancia normal. En el servidor de
// desarrollo de Next.js cada módulo puede volver a evaluarse (Fast Refresh / recompilación
// de rutas on-demand), lo que recrearía una instancia nueva de MockReservationRepository y
// perdería los cambios en memoria. `globalThis` sobrevive a esas recargas de módulo dentro
// del mismo proceso de Node, así que los cambios hechos desde el panel se mantienen al
// navegar a cualquier otra parte del sitio (incluido el sitio de reservas fuera del panel).
interface DemoStore {
  // Se compara contra RESERVAS.length en cada acceso: si el archivo mock-data.ts cambia
  // (por ejemplo, se agregan nuevas reservas de prueba) el store se re-siembra solo,
  // sin necesitar reiniciar el servidor de desarrollo.
  version: number;
  reservas: Reserva[];
  campanias: CampanaEmail[];
  envios: EnvioEmail[];
  paquetes: PaquetePromocional[];
  tarifas: Tarifa[];
}

const globalParaStore = globalThis as unknown as { __hotelPlazaStore?: DemoStore };

function sembrarStore(): DemoStore {
  return {
    version: RESERVAS.length,
    reservas: [...RESERVAS],
    campanias: [...CAMPANIAS_EMAIL],
    envios: [...ENVIOS_EMAIL],
    paquetes: [...PAQUETES_PROMOCIONALES],
    tarifas: [...TARIFAS],
  };
}

function getStore(): DemoStore {
  if (!globalParaStore.__hotelPlazaStore || globalParaStore.__hotelPlazaStore.version !== RESERVAS.length) {
    globalParaStore.__hotelPlazaStore = sembrarStore();
  }
  return globalParaStore.__hotelPlazaStore;
}

export interface ReservationRepository {
  getHotel(): Promise<Hotel>;
  getDisponibilidad(checkIn: string, checkOut: string): Promise<HabitacionConDisponibilidad[]>;
  getTipoHabitacion(id: string): Promise<TipoHabitacion | undefined>;
  crearReserva(input: {
    tipoHabitacionId: string;
    checkIn: string;
    checkOut: string;
    huespedes: number;
    nombre: string;
    email: string;
    telefono: string;
    montoTotal: number;
    documentoTributario?: DocumentoTributario;
  }): Promise<Reserva>;
  confirmarPago(reservaId: string): Promise<{ reserva: Reserva; pago: Pago }>;
  listarReservas(): Promise<(Reserva & { huesped?: Huesped; habitacion?: TipoHabitacion })[]>;
  listarHuespedes(): Promise<Huesped[]>;
  listarTiposHabitacion(): Promise<TipoHabitacion[]>;
  listarTarifas(): Promise<Tarifa[]>;
  listarStaff(): Promise<UsuarioStaff[]>;
  listarIntegraciones(): Promise<IntegracionExterna[]>;
  getKpis(): Promise<KpiDashboard>;
  listarCampaniasEmail(): Promise<CampanaEmail[]>;
  toggleCampaniaEmail(id: string): Promise<CampanaEmail>;
  listarEnviosEmail(): Promise<(EnvioEmail & { huesped?: Huesped })[]>;
  enviarEmailPersonalizado(input: { huespedId: string; asunto: string; cuerpo: string }): Promise<EnvioEmail>;
  listarServiciosAdicionales(): Promise<ServicioAdicional[]>;
  listarPaquetes(): Promise<(PaquetePromocional & { tipoHabitacion?: TipoHabitacion })[]>;
  crearPaquete(input: {
    nombre: string;
    descripcion: string;
    tipoHabitacionId: string;
    serviciosIds: string[];
    precioPaquete: number;
    publico: PaquetePromocional["publico"];
    vigenciaInicio: string;
    vigenciaFin: string;
  }): Promise<PaquetePromocional>;
  togglePaquete(id: string): Promise<PaquetePromocional>;
  eliminarPaquete(id: string): Promise<void>;
  actualizarTarifario(updates: { id: string; precioNoche: number }[]): Promise<Tarifa[]>;
}

class MockReservationRepository implements ReservationRepository {
  async getHotel() {
    return delay(HOTEL);
  }

  async getDisponibilidad(checkIn: string, checkOut: string) {
    const store = getStore();
    const resultado: HabitacionConDisponibilidad[] = TIPOS_HABITACION.map((tipo) => {
      const tarifaVigente =
        store.tarifas.find(
          (t) =>
            t.tipoHabitacionId === tipo.id &&
            checkIn >= t.fechaInicio &&
            checkIn <= t.fechaFin
        ) ?? store.tarifas.find((t) => t.tipoHabitacionId === tipo.id);

      const unidadesDisponibles = calcularUnidadesDisponibles(
        checkIn,
        checkOut,
        tipo.id,
        tipo.cantidadUnidades,
        store.reservas
      );

      return {
        ...tipo,
        tarifaNoche: tarifaVigente?.precioNoche ?? 0,
        unidadesDisponibles,
      };
    });
    return delay(resultado, 500);
  }

  async getTipoHabitacion(id: string) {
    return delay(TIPOS_HABITACION.find((t) => t.id === id));
  }

  async crearReserva(input: {
    tipoHabitacionId: string;
    checkIn: string;
    checkOut: string;
    huespedes: number;
    nombre: string;
    email: string;
    telefono: string;
    montoTotal: number;
    documentoTributario?: DocumentoTributario;
  }) {
    const store = getStore();

    // Segunda verificación de disponibilidad en el momento de crear la reserva (no solo
    // al listar), para evitar overbooking si dos personas reservan casi al mismo tiempo.
    const tipo = TIPOS_HABITACION.find((t) => t.id === input.tipoHabitacionId);
    const unidadesDisponibles = calcularUnidadesDisponibles(
      input.checkIn,
      input.checkOut,
      input.tipoHabitacionId,
      tipo?.cantidadUnidades ?? 0,
      store.reservas
    );
    if (unidadesDisponibles <= 0) {
      throw new Error("Ya no quedan unidades disponibles de esta habitación para las fechas seleccionadas.");
    }

    const nueva: Reserva = {
      id: `res-${Date.now()}`,
      codigo: `HP-DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
      hotelId: HOTEL.id,
      tipoHabitacionId: input.tipoHabitacionId,
      huespedId: `hu-demo-${Date.now()}`,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      huespedes: input.huespedes,
      estado: "pendiente_pago",
      canalOrigen: "directo",
      montoTotal: input.montoTotal,
      creadaEn: new Date().toISOString(),
      documentoTributario: input.documentoTributario,
    };
    store.reservas = [nueva, ...store.reservas];
    return delay(nueva, 600);
  }

  async confirmarPago(reservaId: string) {
    const store = getStore();
    const idx = store.reservas.findIndex((r) => r.id === reservaId);
    if (idx === -1) throw new Error("Reserva no encontrada");
    store.reservas[idx] = { ...store.reservas[idx], estado: "confirmada" };
    const pago: Pago = {
      id: `pg-${Date.now()}`,
      reservaId,
      monto: store.reservas[idx].montoTotal,
      estado: "aprobado",
      tokenTransbank: `TBK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      fecha: new Date().toISOString(),
      metodo: "credito",
      ultimos4: String(Math.floor(1000 + Math.random() * 9000)),
    };
    return delay({ reserva: store.reservas[idx], pago }, 900);
  }

  async listarReservas() {
    const store = getStore();
    const enriquecidas = store.reservas.map((r) => ({
      ...r,
      huesped: HUESPEDES.find((h) => h.id === r.huespedId),
      habitacion: TIPOS_HABITACION.find((t) => t.id === r.tipoHabitacionId),
    }));
    return delay(enriquecidas, 400);
  }

  async listarHuespedes() {
    return delay(HUESPEDES, 300);
  }

  async listarTiposHabitacion() {
    return delay(TIPOS_HABITACION, 300);
  }

  async listarTarifas() {
    return delay([...getStore().tarifas], 300);
  }

  async actualizarTarifario(updates: { id: string; precioNoche: number }[]) {
    const store = getStore();
    store.tarifas = store.tarifas.map((t) => {
      const cambio = updates.find((u) => u.id === t.id);
      return cambio ? { ...t, precioNoche: cambio.precioNoche } : t;
    });
    return delay([...store.tarifas], 500);
  }

  async listarStaff() {
    return delay(STAFF, 250);
  }

  async listarIntegraciones() {
    return delay(INTEGRACIONES, 350);
  }

  async getKpis(): Promise<KpiDashboard> {
    const store = getStore();
    const hoy = "2026-07-17";
    const reservasHoy = store.reservas.filter((r) => r.checkIn === hoy).length;
    const confirmadas = store.reservas.filter((r) => r.estado === "confirmada");
    const directas = confirmadas.filter((r) => r.canalOrigen === "directo").length;
    const ingresosMes = confirmadas.reduce((acc, r) => acc + r.montoTotal, 0);
    const totalUnidades = TIPOS_HABITACION.reduce((acc, t) => acc + t.cantidadUnidades, 0);
    const ocupadas = confirmadas.filter((r) => r.checkIn <= hoy && r.checkOut > hoy).length;
    return delay({
      reservasHoy,
      ocupacionPorcentaje: Math.round((ocupadas / totalUnidades) * 100),
      ingresosMes,
      reservasDirectasPorcentaje: confirmadas.length
        ? Math.round((directas / confirmadas.length) * 100)
        : 0,
    }, 400);
  }

  async listarCampaniasEmail() {
    return delay([...getStore().campanias], 300);
  }

  async toggleCampaniaEmail(id: string) {
    const store = getStore();
    const idx = store.campanias.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Campaña no encontrada");
    store.campanias[idx] = {
      ...store.campanias[idx],
      activa: !store.campanias[idx].activa,
    };
    return delay(store.campanias[idx], 300);
  }

  async listarEnviosEmail() {
    const store = getStore();
    const enriquecidos = [...store.envios]
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
      .map((e) => ({ ...e, huesped: HUESPEDES.find((h) => h.id === e.huespedId) }));
    return delay(enriquecidos, 300);
  }

  async enviarEmailPersonalizado(input: { huespedId: string; asunto: string; cuerpo: string }) {
    const store = getStore();
    const nuevo: EnvioEmail = {
      id: `env-${Date.now()}`,
      huespedId: input.huespedId,
      asunto: input.asunto,
      cuerpo: input.cuerpo,
      tipo: "personalizado",
      fecha: new Date().toISOString(),
      estado: "enviado",
    };
    store.envios = [nuevo, ...store.envios];
    return delay(nuevo, 700);
  }

  async listarServiciosAdicionales() {
    return delay(SERVICIOS_ADICIONALES, 300);
  }

  async listarPaquetes() {
    const enriquecidos = [...getStore().paquetes].map((p) => ({
      ...p,
      tipoHabitacion: TIPOS_HABITACION.find((t) => t.id === p.tipoHabitacionId),
    }));
    return delay(enriquecidos, 350);
  }

  async crearPaquete(input: {
    nombre: string;
    descripcion: string;
    tipoHabitacionId: string;
    serviciosIds: string[];
    precioPaquete: number;
    publico: PaquetePromocional["publico"];
    vigenciaInicio: string;
    vigenciaFin: string;
  }) {
    const store = getStore();
    const tarifaBase =
      store.tarifas.find((t) => t.tipoHabitacionId === input.tipoHabitacionId && t.temporada === "baja")
        ?.precioNoche ?? 0;
    const sumaServicios = SERVICIOS_ADICIONALES.filter((s) => input.serviciosIds.includes(s.id)).reduce(
      (acc, s) => acc + s.precio,
      0
    );
    const nuevo: PaquetePromocional = {
      id: `paq-${Date.now()}`,
      hotelId: HOTEL.id,
      nombre: input.nombre,
      descripcion: input.descripcion,
      tipoHabitacionId: input.tipoHabitacionId,
      serviciosIds: input.serviciosIds,
      precioReferencia: tarifaBase + sumaServicios,
      precioPaquete: input.precioPaquete,
      publico: input.publico,
      activo: true,
      vecesVendido: 0,
      vigenciaInicio: input.vigenciaInicio,
      vigenciaFin: input.vigenciaFin,
    };
    store.paquetes = [nuevo, ...store.paquetes];
    return delay(nuevo, 600);
  }

  async togglePaquete(id: string) {
    const store = getStore();
    const idx = store.paquetes.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Paquete no encontrado");
    store.paquetes[idx] = { ...store.paquetes[idx], activo: !store.paquetes[idx].activo };
    return delay(store.paquetes[idx], 300);
  }

  async eliminarPaquete(id: string) {
    const store = getStore();
    store.paquetes = store.paquetes.filter((p) => p.id !== id);
    await delay(undefined, 300);
  }
}

export const reservationRepository: ReservationRepository = new MockReservationRepository();
