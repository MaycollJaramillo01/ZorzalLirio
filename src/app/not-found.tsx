import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false },
};

export default function NoEncontrado() {
  return (
    <section className="seccion">
      <div className="contenedor">
        <div className="vacio" style={{ maxWidth: '44rem' }}>
          <p className="enc-seccion__ojal">Error 404</p>
          <h1>No encontramos esta página</h1>
          <p className="texto-aux">
            Es posible que la dirección haya cambiado. Desde el catálogo puede buscar cualquiera de
            los productos publicados.
          </p>
          <div className="fila g3">
            <Link href="/tienda" className="btn btn--primario">
              Ir al catálogo
            </Link>
            <Link href="/" className="btn btn--secundario">
              Inicio
            </Link>
            <Link href="/contacto" className="btn btn--secundario">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
