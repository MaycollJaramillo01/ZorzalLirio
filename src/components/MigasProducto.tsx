'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

/**
 * Migas de pan de la ficha.  El parámetro `volver` trae la búsqueda del
 * catálogo para regresar a los mismos filtros.
 */
export function MigasProducto({ nombre }: { readonly nombre: string }) {
  const volver = useSearchParams().get('volver') ?? '';
  const hrefCatalogo = volver === '' ? '/tienda' : `/tienda?${volver}`;

  return (
    <nav aria-label="Ruta de navegación">
      <ol className="migas">
        <li>
          <Link href="/">Inicio</Link>
        </li>
        <li>
          <Link href={hrefCatalogo}>
            {volver === '' ? 'Catálogo' : 'Catálogo (volver a mis filtros)'}
          </Link>
        </li>
        <li aria-current="page">{nombre}</li>
      </ol>
    </nav>
  );
}

export function VolverAlCatalogo() {
  const volver = useSearchParams().get('volver') ?? '';
  const hrefCatalogo = volver === '' ? '/tienda' : `/tienda?${volver}`;

  return (
    <Link href={hrefCatalogo} className="enlace-flecha enlace-flecha--atras">
      {volver === '' ? 'Volver al catálogo' : 'Volver al catálogo con mis filtros'}
    </Link>
  );
}
