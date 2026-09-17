'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCotizacion } from '@/lib/useCotizacion';
import { LINEAS } from '@/data/catalogo';
import { precio as formatearPrecio, SIN_PRECIO } from '@/lib/formato';
import type { Producto } from '@/lib/types';

interface Props {
  readonly producto: Producto;
  /** Query del catálogo para volver a la misma búsqueda desde la ficha. */
  readonly volverA?: string;
  /** false en el primer bloque visible, para no diferir la carga. */
  readonly diferida?: boolean;
}

function nombresLinea(producto: Producto): string {
  return producto.lineas
    .map((id) => LINEAS.find((l) => l.id === id)?.nombre ?? id)
    .join(' · ');
}

export function TarjetaProducto({ producto, volverA, diferida = true }: Props) {
  const { agregar } = useCotizacion();
  const [agregado, setAgregado] = useState(false);
  const imagen = producto.imagenes[0];
  const href = volverA ? `/tienda/${producto.slug}?volver=${encodeURIComponent(volverA)}` : `/tienda/${producto.slug}`;
  const p = formatearPrecio(producto.precio);
  const anterior = formatearPrecio(producto.precioAnterior);
  const requiereOpciones = producto.opciones.length > 0;

  return (
    <li className="tarjeta">
      <Link href={href} className="tarjeta__marco" tabIndex={-1} aria-hidden="true">
        {imagen ? (
          <img
            src={imagen.src}
            srcSet={imagen.srcset}
            sizes="(max-width: 420px) 88vw, (max-width: 820px) 44vw, (max-width: 1100px) 30vw, 300px"
            width={imagen.width}
            height={imagen.height}
            alt=""
            loading={diferida ? 'lazy' : 'eager'}
            decoding="async"
          />
        ) : (
          <span className="tarjeta__sin-imagen">Sin fotografía publicada</span>
        )}
        {anterior !== null ? (
          <span className="distintivo distintivo--oferta tarjeta__oferta">Oferta publicada</span>
        ) : null}
      </Link>

      <div className="tarjeta__cuerpo">
        <p className="etiqueta">{nombresLinea(producto)}</p>
        <h3 className="tarjeta__titulo">
          <Link href={href}>{producto.nombre}</Link>
        </h3>
        <p className="tarjeta__precio">
          {p !== null ? (
            <>
              <span className="precio-actual">{p}</span>
              {anterior !== null ? <span className="precio-anterior">{anterior}</span> : null}
              {producto.modalidad === 'membresia' && producto.periodicidad !== null ? (
                <span className="texto-nota">por {producto.periodicidad}</span>
              ) : null}
            </>
          ) : (
            <span className="precio-nulo">{SIN_PRECIO}</span>
          )}
        </p>
      </div>

      <div className="tarjeta__acciones">
        {agregado ? (
          <Link href="/cotizacion" className="btn btn--secundario btn--sm">
            En la lista · Ver
          </Link>
        ) : (
          <button
            type="button"
            className="btn btn--primario btn--sm"
            onClick={() => {
              agregar({
                productoId: producto.id,
                slug: producto.slug,
                nombre: producto.nombre,
                cantidad: 1,
                opciones: {},
                variante: null,
                precioUnitario: producto.precio,
              });
              setAgregado(true);
            }}
          >
            Agregar a cotización
          </button>
        )}
        <Link href={href} className="btn btn--secundario btn--sm">
          Ficha
          <span className="solo-lectores"> de {producto.nombre}</span>
        </Link>
      </div>

      {agregado && requiereOpciones ? (
        <p className="tarjeta__aviso">
          Abra la ficha para indicar {producto.opciones.map((o) => o.nombre.toLowerCase()).join(', ')}.
        </p>
      ) : null}
    </li>
  );
}
