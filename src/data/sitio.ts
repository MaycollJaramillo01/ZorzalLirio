/**
 * Datos de la empresa.  Todos provienen de las páginas publicadas en
 * zorzallirio.com (Contact-Us, quienes-somos, catalogo, plan-corporativo).
 * No se añade ningún dato que no esté en el material extraído.
 */
import manifiesto from './media-manifest.json';

export const SITIO = {
  nombre: 'Zorzal Lirio',
  razonSocial: 'Distribuidora Zorzal Lirio S. de R.L.',
  descripcion:
    'Uniformes empresariales y calzado de trabajo para oficina, industria, seguridad y salud. Asesoría en telas, colores, presupuesto y tiempos de entrega.',
  anioInicio: 2010,
  url: 'https://zorzallirio.com',
  direccion: {
    calle: 'Col. Villas del Sol, Bloque F #15',
    ciudad: 'San Pedro Sula',
    departamento: 'Cortés',
    pais: 'Honduras',
  },
  telefonos: ['+504 8832-8459', '+504 9550-8426'],
  correos: ['ventas@zorzallirio.com', 'imagenempresarial@zorzallirio.com'],
  whatsapp: '50488328459',
  facebook: 'https://www.facebook.com/zorzallirio/',
} as const;

export const DIRECCION_COMPLETA = `${SITIO.direccion.calle}, ${SITIO.direccion.ciudad}, ${SITIO.direccion.departamento}, ${SITIO.direccion.pais}`;

/** Teléfonos citados únicamente dentro de las políticas extraídas. */
export const TELEFONOS_EN_POLITICAS = ['+504 2516-5022', '+504 9771-6164'] as const;

export const NAVEGACION = [
  { href: '/tienda', etiqueta: 'Catálogo' },
  { href: '/plan-corporativo', etiqueta: 'Plan corporativo' },
  { href: '/quienes-somos', etiqueta: 'Nosotros' },
  { href: '/contacto', etiqueta: 'Contacto' },
] as const;

export const LEGALES = [
  { href: '/politica-de-privacidad', etiqueta: 'Política de privacidad' },
  { href: '/politica-de-entrega', etiqueta: 'Política de entrega' },
  { href: '/politica-de-reembolso', etiqueta: 'Cancelación y reembolso' },
] as const;

export interface RecursoImagen {
  readonly src: string;
  readonly srcset: string;
  readonly width: number;
  readonly height: number;
}

interface EntradaManifiesto {
  readonly src: string;
  readonly srcset: readonly string[];
  readonly width: number;
  readonly height: number;
  readonly origen: string;
}

const MEDIA = manifiesto as unknown as Readonly<Record<string, EntradaManifiesto>>;

/** Devuelve una imagen del manifiesto; falla en build si la clave no existe. */
export function media(clave: string): RecursoImagen {
  const entrada = MEDIA[clave];
  if (!entrada) {
    throw new Error(`Imagen «${clave}» ausente del manifiesto. Ejecuta: npm run media`);
  }
  return {
    src: entrada.src,
    srcset: entrada.srcset.join(', '),
    width: entrada.width,
    height: entrada.height,
  };
}
