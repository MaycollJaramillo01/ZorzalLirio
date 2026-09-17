import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VistaCatalogo } from '@/components/VistaCatalogo';
import { PRODUCTOS } from '@/data/catalogo';

export const metadata: Metadata = {
  title: 'Catálogo de uniformes y calzado de trabajo',
  description:
    'Los 20 productos publicados por Zorzal Lirio: camisas de oficina, prendas industriales, uniformes de seguridad, gabachas médicas, pantalones y calzado de trabajo. Búsqueda, filtros por línea y precios en USD.',
  alternates: { canonical: '/tienda' },
  openGraph: {
    title: 'Catálogo de uniformes y calzado de trabajo',
    description:
      'Camisas, pantalones, gabachas y calzado de trabajo para oficina, industria, seguridad y salud.',
    url: '/tienda',
  },
};

export default function Tienda() {
  return (
    <>
      <section className="seccion--compacta" style={{ paddingTop: 'var(--e6)' }}>
        <div className="contenedor">
          <div className="enc-seccion" style={{ marginBottom: 0 }}>
            <p className="enc-seccion__ojal">Catálogo</p>
            <h1>Uniformes y calzado de trabajo</h1>
            <p className="enc-seccion__texto">
              Los {PRODUCTOS.length} productos publicados en la tienda, con las telas, colores y
              tallas que figuran en cada ficha. Agregue a su lista lo que necesite y le preparamos
              la cotización.
            </p>
          </div>
        </div>
      </section>

      <section className="seccion--compacta" style={{ paddingTop: 0 }}>
        <div className="contenedor">
          <Suspense
            fallback={
              <p className="cargando" role="status">
                Cargando el catálogo…
              </p>
            }
          >
            <VistaCatalogo />
          </Suspense>
        </div>
      </section>
    </>
  );
}
