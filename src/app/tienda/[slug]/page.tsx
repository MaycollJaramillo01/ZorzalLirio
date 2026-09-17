import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Galeria } from '@/components/Galeria';
import { PanelProducto } from '@/components/PanelProducto';
import { MigasProducto, VolverAlCatalogo } from '@/components/MigasProducto';
import { TarjetaProducto } from '@/components/TarjetaProducto';
import { LINEAS, PRODUCTOS, productoPorSlug } from '@/data/catalogo';
import { SITIO } from '@/data/sitio';
import type { Producto } from '@/lib/types';

interface Props {
  readonly params: Promise<{ readonly slug: string }>;
}

export function generateStaticParams() {
  return PRODUCTOS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const producto = productoPorSlug(slug);
  if (!producto) return { title: 'Producto no encontrado', robots: { index: false } };

  const lineas = producto.categoriasPublicadas.map((c) => c.nombre).join(', ');
  const imagen = producto.imagenes[0];

  return {
    title: producto.nombre,
    description: `${producto.descripcion} Línea: ${lineas}. Zorzal Lirio, uniformes empresariales en San Pedro Sula.`,
    alternates: { canonical: `/tienda/${producto.slug}` },
    openGraph: {
      type: 'website',
      title: `${producto.nombre} · Zorzal Lirio`,
      description: producto.descripcion,
      url: `/tienda/${producto.slug}`,
      images: imagen
        ? [{ url: imagen.src, width: imagen.width, height: imagen.height, alt: imagen.alt }]
        : undefined,
    },
  };
}

/** Datos estructurados del producto: sólo campos publicados y verificados. */
function datosProducto(producto: Producto) {
  const oferta: Record<string, unknown> = {
    '@type': 'Offer',
    price: producto.precio,
    priceCurrency: producto.moneda,
    url: `${SITIO.url}/tienda/${producto.slug}`,
    seller: { '@type': 'Organization', name: SITIO.nombre },
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.nombre,
    description: producto.descripcion,
    productID: String(producto.id),
    ...(producto.sku !== null ? { sku: producto.sku } : {}),
    ...(producto.imagenes.length > 0
      ? { image: producto.imagenes.map((i) => `${SITIO.url}${i.src}`) }
      : {}),
    category: producto.categoriasPublicadas.map((c) => c.nombre).join(' > '),
    brand: { '@type': 'Brand', name: SITIO.nombre },
    // Sin availability ni reviews: la tienda no publica inventario ni reseñas.
    ...(producto.precio !== null ? { offers: oferta } : {}),
  };
}

function relacionados(producto: Producto): readonly Producto[] {
  return PRODUCTOS.filter(
    (p) => p.id !== producto.id && p.esLineaPrincipal && p.lineas.some((l) => producto.lineas.includes(l)),
  ).slice(0, 4);
}

export default async function FichaProducto({ params }: Props) {
  const { slug } = await params;
  const producto = productoPorSlug(slug);
  if (!producto) notFound();

  const similares = relacionados(producto);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datosProducto(producto)) }}
      />

      <section className="seccion--compacta" style={{ paddingBottom: 0, paddingTop: 'var(--e5)' }}>
        <div className="contenedor">
          <Suspense fallback={null}>
            <MigasProducto nombre={producto.nombre} />
          </Suspense>
        </div>
      </section>

      <section className="seccion--compacta" style={{ paddingTop: 0 }}>
        <div className="contenedor">
          <div className="ficha">
            <Galeria
              imagenes={producto.imagenes}
              nombre={producto.nombre}
              avisoSinImagen={
                producto.nota ??
                'La tienda original no publica una fotografía que corresponda a este artículo.'
              }
            />
            <PanelProducto producto={producto} />
          </div>

          {producto.nota !== null ? (
            <p className="nota-datos" style={{ marginTop: 'var(--e6)', maxWidth: '68ch' }}>
              <span>
                <strong>Nota sobre los datos publicados.</strong> {producto.nota}
              </span>
            </p>
          ) : null}

          <div className="fila g4" style={{ marginTop: 'var(--e6)', justifyContent: 'space-between' }}>
            <Suspense fallback={null}>
              <VolverAlCatalogo />
            </Suspense>
            <p className="texto-nota">
              Ficha original:{' '}
              <a className="enlace" href={producto.fuente} rel="noreferrer noopener nofollow" target="_blank">
                {producto.fuente.replace('https://', '')}
              </a>
            </p>
          </div>
        </div>
      </section>

      {similares.length > 0 ? (
        <section className="seccion seccion--blanca" aria-labelledby="t-similares">
          <div className="contenedor">
            <div className="enc-seccion enc-seccion--partido">
              <div>
                <p className="enc-seccion__ojal">
                  {producto.lineas
                    .map((id) => LINEAS.find((l) => l.id === id)?.nombre ?? id)
                    .join(' · ')}
                </p>
                <h2 id="t-similares">Otras prendas de la misma línea</h2>
              </div>
              <Link href="/tienda" className="enlace-flecha">
                Ver el catálogo completo
              </Link>
            </div>
            <ul className="rejilla-productos">
              {similares.map((p) => (
                <TarjetaProducto key={p.id} producto={p} />
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
