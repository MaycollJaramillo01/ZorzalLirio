'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { SITIO } from '@/data/sitio';

/** Frontera de error de la aplicación: nada queda en blanco sin explicación. */
export default function Error({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    console.error('Error en la página:', error);
  }, [error]);

  return (
    <section className="seccion">
      <div className="contenedor">
        <div className="vacio" style={{ maxWidth: '44rem' }}>
          <p className="enc-seccion__ojal">Algo falló</p>
          <h1>No pudimos mostrar esta página</h1>
          <p className="texto-aux">
            Ocurrió un error al cargar el contenido. Puede volver a intentarlo; si el problema
            continúa, escríbanos y le atendemos directamente al {SITIO.telefonos[0]}.
          </p>
          <div className="fila g3">
            <button type="button" className="btn btn--primario" onClick={reset}>
              Volver a intentar
            </button>
            <Link href="/tienda" className="btn btn--secundario">
              Ir al catálogo
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
