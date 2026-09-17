/**
 * Almacén de la lista de cotización, fuera de React.
 *
 * Es un «external store» leído con useSyncExternalStore: así el servidor y la
 * hidratación ven una lista vacía y el navegador la reemplaza por lo guardado,
 * sin efectos que disparen renders en cascada.
 *
 * Sólo se persiste la selección de artículos.  Los datos personales del
 * formulario nunca pasan por aquí.
 */
import type { ElementoCotizacion, SeleccionOpciones } from '@/lib/types';

const CLAVE = 'zorzal-lirio.cotizacion.v1';
export const CANTIDAD_MAXIMA = 100_000;

const VACIO: readonly ElementoCotizacion[] = [];

let cache: readonly ElementoCotizacion[] = VACIO;
let hidratado = false;
const suscriptores = new Set<() => void>();

export function claveElemento(
  productoId: number,
  variante: string | null,
  opciones: SeleccionOpciones,
): string {
  const ordenadas = Object.keys(opciones)
    .sort()
    .map((k) => `${k}=${opciones[k] ?? ''}`)
    .join('&');
  return `${String(productoId)}|${variante ?? ''}|${ordenadas}`;
}

function esElemento(v: unknown): v is ElementoCotizacion {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o['clave'] === 'string' &&
    typeof o['productoId'] === 'number' &&
    typeof o['slug'] === 'string' &&
    typeof o['nombre'] === 'string' &&
    typeof o['cantidad'] === 'number' &&
    Number.isFinite(o['cantidad']) &&
    o['cantidad'] > 0 &&
    typeof o['opciones'] === 'object' &&
    o['opciones'] !== null &&
    (o['variante'] === null || typeof o['variante'] === 'string') &&
    (o['precioUnitario'] === null || typeof o['precioUnitario'] === 'number')
  );
}

function leerDelNavegador(): readonly ElementoCotizacion[] {
  try {
    const bruto = window.localStorage.getItem(CLAVE);
    if (bruto === null) return VACIO;
    const datos: unknown = JSON.parse(bruto);
    if (!Array.isArray(datos)) return VACIO;
    const validos = datos.filter(esElemento);
    return validos.length === 0 ? VACIO : validos;
  } catch {
    // Modo privado, almacenamiento bloqueado o JSON corrupto.
    return VACIO;
  }
}

function persistir(): void {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(cache));
  } catch {
    // La lista sigue viva en memoria durante la sesión.
  }
}

function avisar(): void {
  for (const fn of suscriptores) fn();
}

export function suscribir(fn: () => void): () => void {
  suscriptores.add(fn);
  // Otra pestaña puede cambiar la lista: la reflejamos.
  const alCambiarAlmacen = (e: StorageEvent) => {
    if (e.key !== null && e.key !== CLAVE) return;
    cache = leerDelNavegador();
    avisar();
  };
  window.addEventListener('storage', alCambiarAlmacen);
  return () => {
    suscriptores.delete(fn);
    window.removeEventListener('storage', alCambiarAlmacen);
  };
}

/** Snapshot en el navegador.  Devuelve siempre la misma referencia si no cambió. */
export function obtener(): readonly ElementoCotizacion[] {
  if (!hidratado) {
    cache = leerDelNavegador();
    hidratado = true;
  }
  return cache;
}

/** Snapshot en el servidor y durante la hidratación. */
export function obtenerEnServidor(): readonly ElementoCotizacion[] {
  return VACIO;
}

/** true sólo en el navegador: distingue «vacía» de «todavía no leída». */
export function estaListo(): boolean {
  return true;
}

export function noEstaListo(): boolean {
  return false;
}

function reemplazar(nuevos: readonly ElementoCotizacion[]): void {
  cache = nuevos;
  hidratado = true;
  persistir();
  avisar();
}

export function agregarElemento(entrada: Omit<ElementoCotizacion, 'clave'>): void {
  const clave = claveElemento(entrada.productoId, entrada.variante, entrada.opciones);
  const actuales = obtener();
  const existente = actuales.find((e) => e.clave === clave);
  if (existente) {
    reemplazar(
      actuales.map((e) =>
        e.clave === clave
          ? { ...e, cantidad: Math.min(e.cantidad + entrada.cantidad, CANTIDAD_MAXIMA) }
          : e,
      ),
    );
    return;
  }
  reemplazar([...actuales, { ...entrada, clave }]);
}

export function cambiarCantidadElemento(clave: string, cantidad: number): void {
  const limpia = Math.max(1, Math.min(Math.round(cantidad), CANTIDAD_MAXIMA));
  reemplazar(obtener().map((e) => (e.clave === clave ? { ...e, cantidad: limpia } : e)));
}

export function eliminarElemento(clave: string): void {
  reemplazar(obtener().filter((e) => e.clave !== clave));
}

export function vaciar(): void {
  reemplazar(VACIO);
}
