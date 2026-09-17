/**
 * Armado de los mensajes de WhatsApp.
 *
 * No hay backend de formularios: la solicitud de cotización se envía por
 * WhatsApp.  El mensaje se muestra al usuario antes de abrir el enlace, y el
 * enlace se codifica con encodeURIComponent.
 */
import { SITIO } from '@/data/sitio';
import { precio as formatearPrecio } from '@/lib/formato';
import type { DatosSolicitante, ElementoCotizacion, Producto, SeleccionOpciones } from '@/lib/types';

/**
 * La ficha en el mensaje de WhatsApp siempre apunta al sitio publicado, sin
 * importar desde qué host se sirvió la página (desarrollo, previsualización,
 * etc.). Usar `window.location.origin` aquí desincroniza el render de
 * servidor y cliente y produce un enlace roto para quien lo recibe.
 */
export function urlFicha(slug: string): string {
  return `${SITIO.url}/tienda/${slug}`;
}

export function enlaceWhatsApp(mensaje: string): string {
  return `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

function lineasOpciones(opciones: SeleccionOpciones): string[] {
  return Object.entries(opciones)
    .filter(([, valor]) => valor !== '')
    .map(([nombre, valor]) => `  - ${nombre}: ${valor}`);
}

/** Mensaje para «Cotizar este producto» desde una ficha. */
export function mensajeProducto(
  producto: Producto,
  opciones: SeleccionOpciones,
  cantidad: number,
  precioUnitario: number | null,
): string {
  const partes: string[] = [
    'Buenos días, quisiera una cotización de este producto:',
    '',
    `Producto: ${producto.nombre} (ID ${String(producto.id)})`,
    `Ficha: ${urlFicha(producto.slug)}`,
  ];

  const opts = lineasOpciones(opciones);
  if (opts.length > 0) {
    partes.push('Opciones:', ...opts);
  }

  partes.push(`Cantidad: ${String(cantidad)}`);

  const p = formatearPrecio(precioUnitario);
  if (p !== null) {
    partes.push(`Precio publicado en el sitio: ${p} por unidad`);
  }

  partes.push(
    '',
    'Les agradezco confirmarme precio y disponibilidad para esta cantidad.',
  );

  return partes.join('\n');
}

/** Mensaje para la lista de cotización completa. */
export function mensajeCotizacion(
  elementos: readonly ElementoCotizacion[],
  datos: DatosSolicitante,
): string {
  const partes: string[] = ['Buenos días, quisiera una cotización de los siguientes artículos:', ''];

  elementos.forEach((e, i) => {
    partes.push(`${String(i + 1)}. ${e.nombre} (ID ${String(e.productoId)})`);
    partes.push(`   Cantidad: ${String(e.cantidad)}`);
    if (e.variante !== null) partes.push(`   Variante: ${e.variante}`);
    const opts = Object.entries(e.opciones)
      .filter(([nombre, valor]) => valor !== '' && nombre !== e.variante)
      .map(([nombre, valor]) => `   ${nombre}: ${valor}`);
    partes.push(...opts);
    const p = formatearPrecio(e.precioUnitario);
    if (p !== null) partes.push(`   Precio publicado: ${p} por unidad`);
    partes.push(`   Ficha: ${urlFicha(e.slug)}`);
    partes.push('');
  });

  partes.push('Datos de contacto:');
  const campos: [string, string][] = [
    ['Nombre', datos.nombre],
    ['Empresa', datos.empresa],
    ['Teléfono', datos.telefono],
    ['Correo', datos.correo],
    ['Ciudad', datos.ciudad],
    ['Fecha requerida', datos.fechaRequerida],
  ];
  for (const [etiqueta, valor] of campos) {
    if (valor.trim() !== '') partes.push(`  ${etiqueta}: ${valor.trim()}`);
  }

  if (datos.comentarios.trim() !== '') {
    partes.push('', 'Comentarios:', datos.comentarios.trim());
  }

  partes.push(
    '',
    'Les agradezco confirmarme precios y disponibilidad para estas cantidades.',
  );

  return partes.join('\n');
}

/** Mensaje general de contacto, sin productos asociados. */
export function mensajeGeneral(asunto?: string): string {
  const base = asunto ?? 'uniformes para mi empresa';
  return [
    `Buenos días, quisiera información sobre ${base}.`,
    '',
    'Les comparto los datos de la solicitud:',
    '  Tipo de uniforme:',
    '  Cantidad aproximada:',
    '  Personalización requerida:',
    '  Fecha en que lo necesito:',
  ].join('\n');
}
