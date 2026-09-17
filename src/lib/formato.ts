/**
 * Formato de precios.  Los precios publicados están en USD; no se convierten
 * a lempiras porque el material de origen no publica ningún tipo de cambio.
 */

const USD = new Intl.NumberFormat('es-HN', {
  style: 'currency',
  currency: 'USD',
  currencyDisplay: 'code',
  minimumFractionDigits: 2,
});

/** «USD 14.90».  Devuelve null cuando la tienda no publica precio. */
export function precio(valor: number | null): string | null {
  if (valor === null) return null;
  return USD.format(valor).replace(/ /g, ' ');
}

/** Etiqueta para un precio ausente. */
export const SIN_PRECIO = 'Precio a cotizar';

export function plural(n: number, singular: string, pluralForma: string): string {
  return n === 1 ? singular : pluralForma;
}
