// Este archivo quedó sin uso. Contenía un modal con lógica de auto-sugerencia
// de mucama (por equidad de carga + piso a cargo) que se usaba al marcar el
// check-in del Ingreso Prioritario.
//
// Se retiró por regla de negocio explícita: la asignación de mucama es
// SIEMPRE manual. El sistema no debe sugerir, ordenar por prioridad ni
// pre-seleccionar a nadie — solo Recepción/Administración tiene el contexto
// en tiempo real (quién está disponible, en qué piso está trabajando cada
// una) para decidir. Ver src/components/admin/incentivos-registro.tsx, que
// reemplaza este modal con un dropdown plano (orden alfabético, sin ningún
// criterio de prioridad) directamente en la fila de la solicitud, dentro de
// la pestaña Incentivos.
//
// No se pudo eliminar el archivo por permisos del sandbox; se deja vacío.
export {};
