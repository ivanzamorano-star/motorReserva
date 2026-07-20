"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HabitacionGrid {
  id: string;
  numero: string;
  tipo: string;
}

interface CeldaReserva {
  huesped: string;
  noches: number;
  posicion: "inicio" | "medio" | "fin" | "unica";
}

const HABITACIONES: HabitacionGrid[] = [
  { id: "h101", numero: "101", tipo: "Estándar" },
  { id: "h102", numero: "102", tipo: "Estándar" },
  { id: "h201", numero: "201", tipo: "Superior" },
  { id: "h202", numero: "202", tipo: "Superior" },
  { id: "h301", numero: "301", tipo: "Suite Estrecho de Magallanes" },
];

const HUESPEDES_DEMO = [
  "Marcela Ortúzar",
  "James Whitfield",
  "Laura Fernández",
  "Hans Müller",
  "Renata Silva",
  "Ignacio Pérez",
  "Carlos Bahamonde",
  "Sofía Reyes",
];

const NOMBRES_MES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DIAS_SEMANA = ["D", "L", "M", "M", "J", "V", "S"];

// Mes de referencia de la demo (independiente del reloj real, para mantener la narrativa consistente).
const ANIO_INICIAL = 2026;
const MES_INICIAL = 6; // 0-based → julio

// PRNG determinístico (mulberry32) para que el mock sea estable entre servidor y cliente,
// y para que cada mes tenga una ocupación distinta pero reproducible.
function mulberry32(seed: number) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generarReservasMock(anio: number, mesIndex: number, diasEnMes: number): Map<string, CeldaReserva> {
  const seed = anio * 1000 + mesIndex * 31 + 17;
  const rand = mulberry32(seed);
  const mapa = new Map<string, CeldaReserva>();

  HABITACIONES.forEach((hab) => {
    const bloques = 2 + Math.floor(rand() * 3); // 2 a 4 estadías en el mes
    for (let b = 0; b < bloques; b++) {
      const largo = 1 + Math.floor(rand() * 4); // 1 a 4 noches
      const inicio = 1 + Math.floor(rand() * Math.max(1, diasEnMes - largo));
      const huesped = HUESPEDES_DEMO[Math.floor(rand() * HUESPEDES_DEMO.length)];

      for (let d = inicio; d < inicio + largo && d <= diasEnMes; d++) {
        const posicion: CeldaReserva["posicion"] =
          largo === 1 ? "unica" : d === inicio ? "inicio" : d === inicio + largo - 1 ? "fin" : "medio";
        mapa.set(`${hab.id}-${d}`, { huesped, noches: largo, posicion });
      }
    }
  });

  return mapa;
}

// Ocupación resumen (%) de un mes cualquiera, para el mini-resumen de 12 meses.
function ocupacionDelMes(anio: number, mesIndex: number): number {
  const diasEnMes = new Date(anio, mesIndex + 1, 0).getDate();
  const mapa = generarReservasMock(anio, mesIndex, diasEnMes);
  const totalCeldas = HABITACIONES.length * diasEnMes;
  return Math.round((mapa.size / totalCeldas) * 100);
}

export function AvailabilityGrid() {
  const [anio, setAnio] = React.useState(ANIO_INICIAL);
  const [mesIndex, setMesIndex] = React.useState(MES_INICIAL);

  function cambiarMes(delta: number) {
    let nuevoMes = mesIndex + delta;
    let nuevoAnio = anio;
    if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAnio -= 1;
    } else if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAnio += 1;
    }
    setMesIndex(nuevoMes);
    setAnio(nuevoAnio);
  }

  const diasEnMes = React.useMemo(() => new Date(anio, mesIndex + 1, 0).getDate(), [anio, mesIndex]);
  const dias = React.useMemo(() => Array.from({ length: diasEnMes }, (_, i) => i + 1), [diasEnMes]);
  const reservaPorCelda = React.useMemo(
    () => generarReservasMock(anio, mesIndex, diasEnMes),
    [anio, mesIndex, diasEnMes]
  );

  // Resumen de ocupación de los 12 meses del año en curso, para comparar de un vistazo.
  const resumenAnual = React.useMemo(
    () => NOMBRES_MES.map((nombre, idx) => ({ nombre, idx, pct: ocupacionDelMes(anio, idx) })),
    [anio]
  );

  const totalCeldas = HABITACIONES.length * diasEnMes;
  const totalOcupadas = reservaPorCelda.size;
  const pctOcupacion = Math.round((totalOcupadas / totalCeldas) * 100);
  const nombreMes = `${NOMBRES_MES[mesIndex]} ${anio}`;

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Grid de disponibilidad — {nombreMes}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Ocupación del mes: {pctOcupacion}% · {HABITACIONES.length} habitaciones · {diasEnMes} días
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-orange-500" /> Ocupada / Reservada
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-white border border-gray-300 dark:bg-transparent dark:border-gray-600" />
            Disponible
          </span>
        </div>
      </div>

      {/* Ocupación por mes (año en curso) — vista rápida antes del detalle día a día */}
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Ocupación por mes — {anio}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => cambiarMes(-1)}
              className="h-7 w-7 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-32 text-center">
              {nombreMes}
            </span>
            <button
              type="button"
              onClick={() => cambiarMes(1)}
              className="h-7 w-7 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
          {resumenAnual.map((m) => {
            const activo = m.idx === mesIndex;
            return (
              <button
                key={m.idx}
                type="button"
                onClick={() => setMesIndex(m.idx)}
                className={`rounded-md border px-2 py-2 text-left transition-colors ${
                  activo
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
              >
                <p
                  className={`text-[10px] font-medium uppercase tracking-wide truncate ${
                    activo ? "text-orange-700 dark:text-orange-400" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {m.nombre.slice(0, 3)}
                </p>
                <div className="flex items-end justify-between mt-1">
                  <span
                    className={`text-sm font-semibold ${
                      activo ? "text-orange-700 dark:text-orange-400" : "text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {m.pct}%
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700 mt-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${activo ? "bg-orange-500" : "bg-gray-400 dark:bg-gray-500"}`}
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse w-full text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-gray-50 dark:bg-gray-900 border-b border-r border-gray-200 dark:border-gray-800 px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300 min-w-[150px]">
                Habitación
              </th>
              {dias.map((d) => {
                const fecha = new Date(anio, mesIndex, d);
                const finde = fecha.getDay() === 0 || fecha.getDay() === 6;
                return (
                  <th
                    key={d}
                    className={`border-b border-gray-200 dark:border-gray-800 px-1.5 py-2 text-center font-medium min-w-[30px] ${
                      finde
                        ? "bg-gray-100 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300"
                        : "bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-500"
                    }`}
                  >
                    <div>{d}</div>
                    <div className="text-[9px] font-normal">{DIAS_SEMANA[fecha.getDay()]}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {HABITACIONES.map((hab) => (
              <tr key={hab.id} className="group">
                <td className="sticky left-0 z-10 bg-white dark:bg-gray-950 group-hover:bg-gray-50 dark:group-hover:bg-gray-900 border-b border-r border-gray-200 dark:border-gray-800 px-3 py-2 min-w-[150px] transition-colors">
                  <p className="font-medium text-gray-900 dark:text-gray-100">Hab. {hab.numero}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{hab.tipo}</p>
                </td>
                {dias.map((d) => {
                  const celda = reservaPorCelda.get(`${hab.id}-${d}`);
                  const ocupada = Boolean(celda);
                  return (
                    <td key={d} className="border-b border-gray-100 dark:border-gray-900 p-0.5">
                      <div
                        title={
                          ocupada
                            ? `${celda!.huesped} — ${celda!.noches} noche${celda!.noches > 1 ? "s" : ""} (día ${d})`
                            : `Disponible — ${d} de ${NOMBRES_MES[mesIndex].toLowerCase()}`
                        }
                        className={
                          ocupada
                            ? "h-8 w-full rounded-sm bg-orange-500 text-white flex items-center justify-center text-[9px] font-medium leading-none cursor-default hover:bg-orange-600 transition-colors px-0.5 truncate"
                            : "h-8 w-full rounded-sm bg-white border border-gray-200 hover:border-gray-300 dark:bg-transparent dark:border-gray-700 dark:hover:border-gray-500 cursor-default transition-colors"
                        }
                      >
                        {ocupada && celda!.posicion !== "medio" && (
                          <span className="truncate">{celda!.huesped.split(" ")[0]}</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
