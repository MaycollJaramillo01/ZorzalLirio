/**
 * Modelo de datos del catálogo.
 *
 * Todo lo que aparece aquí proviene de la extracción de zorzallirio.com del
 * 17/09/2026 (datos/extraccion.json y Zorzal_Lirio_Catalogo.xlsx).  Los campos
 * sin valor publicado se representan como `null`: eso significa «no publicado»,
 * nunca «cero» ni «agotado».
 */

/** Líneas con las que se filtra el catálogo. */
export type LineaId = 'oficina' | 'industrial' | 'seguridad' | 'salud' | 'otros';

export interface Linea {
  readonly id: LineaId;
  readonly nombre: string;
  /** Texto corto para la portada y las fichas. */
  readonly descripcion: string;
  /** Clave del manifiesto de imágenes; `null` en «otros», que no se destaca. */
  readonly imagen: string | null;
  readonly alt: string;
}

/** Categoría tal como la publica la tienda original, con su id y slug. */
export interface CategoriaPublicada {
  readonly id: number;
  readonly nombre: string;
  readonly slug: string;
}

/** Una imagen ya optimizada en public/media, con sus dimensiones reales. */
export interface ImagenProducto {
  readonly src: string;
  readonly srcset: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  /** Ruta del archivo original en el material extraído (trazabilidad). */
  readonly origen: string;
}

/** Grupo de opciones publicado en la ficha (Talla, Color, Tela, Género…). */
export interface OpcionPublicada {
  readonly nombre: string;
  readonly valores: readonly string[];
  /** true cuando la opción determina el precio (variantes con precio propio). */
  readonly determinaPrecio: boolean;
}

/** Variante con precio propio publicado. */
export interface VariantePrecio {
  readonly nombre: string;
  readonly precio: number;
  /** Precio regular cuando la variante está en oferta; `null` si no aplica. */
  readonly precioAnterior: number | null;
  readonly sku: string | null;
}

export type ModalidadProducto = 'articulo' | 'membresia';

export interface Producto {
  /** ID original de la tienda.  Es la clave estable; el nombre no es único. */
  readonly id: number;
  /** Slug original: /tienda/<slug>. */
  readonly slug: string;
  readonly nombre: string;
  readonly descripcion: string;
  readonly modalidad: ModalidadProducto;
  /** Periodicidad publicada para las membresías (p. ej. «mes»). */
  readonly periodicidad: string | null;
  /** Precio publicado en USD; `null` si la tienda no publica precio. */
  readonly precio: number | null;
  /** Precio regular cuando hay oferta publicada; `null` si no hay oferta. */
  readonly precioAnterior: number | null;
  readonly moneda: 'USD';
  readonly sku: string | null;
  /** Cantidad en inventario.  Siempre `null`: la tienda no la publica. */
  readonly inventario: number | null;
  readonly categoriasPublicadas: readonly CategoriaPublicada[];
  /** Líneas usadas por el filtro del catálogo. */
  readonly lineas: readonly LineaId[];
  readonly opciones: readonly OpcionPublicada[];
  readonly variantes: readonly VariantePrecio[];
  readonly imagenes: readonly ImagenProducto[];
  /** URL de la ficha en el sitio original. */
  readonly fuente: string;
  /**
   * Nota de trazabilidad cuando el material de origen presenta una
   * inconsistencia (imagen que no corresponde, título que no coincide con la
   * descripción…).  Se muestra en la ficha.
   */
  readonly nota: string | null;
  /** true si es prenda o calzado de trabajo: solo estos se destacan. */
  readonly esLineaPrincipal: boolean;
}

/** Selección de opciones del usuario: nombre del grupo -> valor elegido. */
export type SeleccionOpciones = Readonly<Record<string, string>>;

/** Un renglón de la lista de cotización. */
export interface ElementoCotizacion {
  /** Identificador del renglón: productoId + variante + opciones. */
  readonly clave: string;
  readonly productoId: number;
  readonly slug: string;
  readonly nombre: string;
  readonly cantidad: number;
  readonly opciones: SeleccionOpciones;
  /** Nombre de la variante con precio propio, si el producto tiene variantes. */
  readonly variante: string | null;
  /** Precio unitario publicado al momento de agregar; `null` si no hay. */
  readonly precioUnitario: number | null;
}

/** Datos de contacto que acompañan la solicitud.  No se persisten. */
export interface DatosSolicitante {
  nombre: string;
  empresa: string;
  telefono: string;
  correo: string;
  ciudad: string;
  fechaRequerida: string;
  comentarios: string;
}
