'use client';

/**
 * Acceso a la lista de cotización desde los componentes.
 *
 * El estado vive en src/lib/almacenCotizacion.ts y se lee con
 * useSyncExternalStore, la vía que React ofrece para fuentes externas como
 * localStorage: el servidor y la hidratación ven la lista vacía y el navegador
 * la reemplaza por lo guardado, sin efectos que disparen renders en cascada.
 */
import { useSyncExternalStore } from 'react';
import {
  agregarElemento,
  cambiarCantidadElemento,
  eliminarElemento,
  estaListo,
  noEstaListo,
  obtener,
  obtenerEnServidor,
  suscribir,
  vaciar,
} from '@/lib/almacenCotizacion';
import type { ElementoCotizacion } from '@/lib/types';

export { CANTIDAD_MAXIMA, claveElemento } from '@/lib/almacenCotizacion';

interface Cotizacion {
  readonly elementos: readonly ElementoCotizacion[];
  readonly total: number;
  /** false mientras el navegador aún no ha leído la lista guardada. */
  readonly listo: boolean;
  readonly agregar: (elemento: Omit<ElementoCotizacion, 'clave'>) => void;
  readonly cambiarCantidad: (clave: string, cantidad: number) => void;
  readonly eliminar: (clave: string) => void;
  readonly limpiar: () => void;
}

export function useCotizacion(): Cotizacion {
  const elementos = useSyncExternalStore(suscribir, obtener, obtenerEnServidor);
  const listo = useSyncExternalStore(suscribir, estaListo, noEstaListo);

  return {
    elementos,
    total: elementos.reduce((suma, e) => suma + e.cantidad, 0),
    listo,
    agregar: agregarElemento,
    cambiarCantidad: cambiarCantidadElemento,
    eliminar: eliminarElemento,
    limpiar: vaciar,
  };
}
