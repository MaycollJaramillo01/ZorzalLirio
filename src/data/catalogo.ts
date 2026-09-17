/**
 * Carga y valida el catálogo generado desde la extracción original.
 *
 * catalogo.json lo produce scripts/build_catalog.py.  La validación corre en
 * tiempo de build (este módulo se evalúa al prerenderizar): si el JSON cambia
 * de forma o pierde un dato obligatorio, el build falla en lugar de publicar
 * una ficha incompleta.
 */
import crudo from './catalogo.json';
import type { Linea, LineaId, Producto } from '@/lib/types';

export const LINEAS: readonly Linea[] = [
  {
    id: 'oficina',
    nombre: 'Oficina',
    descripcion: 'Camisas formales, tipo columbia y polos para personal administrativo y de atención.',
    imagen: 'linea-oficina',
    alt: 'Colaboradora con camisa de oficina celeste de manga larga.',
  },
  {
    id: 'industrial',
    nombre: 'Industrial',
    descripcion: 'Prendas de trabajo para planta y operación, con detalles de alta visibilidad.',
    imagen: 'linea-industrial',
    alt: 'Camisa de trabajo con cintas reflectivas en el torso y las mangas.',
  },
  {
    id: 'seguridad',
    nombre: 'Seguridad',
    descripcion: 'Camisas con charreteras, pantalón ranger y calzado táctico para empresas de vigilancia.',
    imagen: 'linea-seguridad',
    alt: 'Agente de seguridad de espaldas con radio en mano frente a un portón.',
  },
  {
    id: 'salud',
    nombre: 'Salud',
    descripcion: 'Gabachas y prendas clínicas en las telas que elija cada institución.',
    imagen: 'linea-salud',
    alt: 'Profesional de salud con gabacha blanca y estetoscopio.',
  },
  {
    id: 'otros',
    nombre: 'Otros artículos',
    descripcion: 'Artículos publicados en la tienda que no pertenecen a las líneas de uniformes.',
    imagen: null,
    alt: '',
  },
] as const;

const IDS_LINEA = new Set<string>(LINEAS.map((l) => l.id));

function fallo(mensaje: string): never {
  throw new Error(`catalogo.json inválido: ${mensaje}`);
}

function validar(productos: readonly Producto[]): void {
  const ids = new Set<number>();
  const slugs = new Set<string>();

  for (const p of productos) {
    const ref = `producto id=${String(p.id)}`;
    if (!Number.isInteger(p.id) || p.id <= 0) fallo(`${ref}: id no es un entero positivo`);
    if (ids.has(p.id)) fallo(`${ref}: id duplicado`);
    ids.add(p.id);

    if (!p.slug || !/^[a-z0-9-]+$/.test(p.slug)) fallo(`${ref}: slug inválido «${p.slug}»`);
    if (slugs.has(p.slug)) fallo(`${ref}: slug duplicado «${p.slug}»`);
    slugs.add(p.slug);

    if (!p.nombre.trim()) fallo(`${ref}: sin nombre`);
    if (p.moneda !== 'USD') fallo(`${ref}: moneda distinta de USD`);
    if (p.precio !== null && !(p.precio > 0)) fallo(`${ref}: precio no positivo`);
    if (p.precioAnterior !== null) {
      if (p.precio === null) fallo(`${ref}: precio anterior sin precio actual`);
      if (p.precioAnterior <= p.precio) fallo(`${ref}: precio anterior no mayor al actual`);
    }
    if (p.lineas.length === 0) fallo(`${ref}: sin línea asignada`);
    for (const l of p.lineas) {
      if (!IDS_LINEA.has(l)) fallo(`${ref}: línea desconocida «${l}»`);
    }

    for (const o of p.opciones) {
      if (!o.nombre.trim()) fallo(`${ref}: grupo de opciones sin nombre`);
      if (o.valores.length === 0) fallo(`${ref}: opción «${o.nombre}» sin valores`);
    }

    const conPrecio = p.opciones.filter((o) => o.determinaPrecio);
    if (p.variantes.length > 0 && conPrecio.length !== 1) {
      fallo(`${ref}: ${String(p.variantes.length)} variantes con precio y ${String(conPrecio.length)} grupos marcados`);
    }
    for (const v of p.variantes) {
      if (!v.nombre.trim()) fallo(`${ref}: variante sin nombre`);
      if (!(v.precio > 0)) fallo(`${ref}: variante «${v.nombre}» sin precio válido`);
      if (v.precioAnterior !== null && v.precioAnterior <= v.precio) {
        fallo(`${ref}: variante «${v.nombre}» con precio anterior no mayor`);
      }
      const grupo = conPrecio[0];
      if (grupo && !grupo.valores.includes(v.nombre)) {
        fallo(`${ref}: variante «${v.nombre}» no está en el grupo «${grupo.nombre}»`);
      }
    }

    for (const img of p.imagenes) {
      if (!img.src.startsWith('/media/')) fallo(`${ref}: imagen fuera de /media (${img.src})`);
      if (!(img.width > 0) || !(img.height > 0)) fallo(`${ref}: imagen sin dimensiones`);
      if (img.alt.trim().length < 12) fallo(`${ref}: texto alternativo demasiado corto`);
      if (!img.origen) fallo(`${ref}: imagen sin archivo de origen`);
    }

    if (!p.fuente.startsWith('https://zorzallirio.com/')) fallo(`${ref}: fuente inesperada`);
  }
}

interface CatalogoCrudo {
  readonly extraidoEl: string;
  readonly destacados: readonly number[];
  readonly productos: readonly Producto[];
}

const catalogo = crudo as unknown as CatalogoCrudo;
validar(catalogo.productos);

/** Los 20 productos extraídos, en el orden publicado por la tienda. */
export const PRODUCTOS: readonly Producto[] = catalogo.productos;

/** Fecha de la extracción (ISO), para mostrar la vigencia de los precios. */
export const EXTRAIDO_EL = catalogo.extraidoEl;

const POR_SLUG = new Map(PRODUCTOS.map((p) => [p.slug, p]));
const POR_ID = new Map(PRODUCTOS.map((p) => [p.id, p]));

export function productoPorSlug(slug: string): Producto | undefined {
  return POR_SLUG.get(slug);
}

export function productoPorId(id: number): Producto | undefined {
  return POR_ID.get(id);
}

/** Selección para la portada: solo prendas y calzado de las líneas principales. */
export const DESTACADOS: readonly Producto[] = catalogo.destacados
  .map((id) => POR_ID.get(id))
  .filter((p): p is Producto => p !== undefined && p.esLineaPrincipal);

export function lineaPorId(id: string): Linea | undefined {
  return LINEAS.find((l) => l.id === id);
}

/**
 * Valores únicos publicados para un grupo de opciones, en todo el catálogo.
 * Sirve para listar telas, colores y tallas reales sin inventar ninguno.
 * La coincidencia del nombre del grupo no distingue mayúsculas ni plural
 * («Tela» y «Telas» son el mismo grupo en la tienda original).
 */
export function valoresDeOpcion(...nombres: readonly string[]): readonly string[] {
  const buscados = new Set(nombres.map((n) => n.toLowerCase()));
  const valores = new Set<string>();
  for (const p of PRODUCTOS) {
    if (!p.esLineaPrincipal) continue;
    for (const o of p.opciones) {
      if (!buscados.has(o.nombre.toLowerCase())) continue;
      for (const v of o.valores) valores.add(v);
    }
  }
  return [...valores].sort((a, b) => a.localeCompare(b, 'es'));
}

/** Cuántos productos hay por línea, para los contadores del catálogo. */
export function conteoPorLinea(): Readonly<Record<LineaId, number>> {
  const conteo = { oficina: 0, industrial: 0, seguridad: 0, salud: 0, otros: 0 };
  for (const p of PRODUCTOS) {
    for (const l of p.lineas) conteo[l] += 1;
  }
  return conteo;
}
