'use client';

import { useState } from 'react';
import type { ImagenProducto } from '@/lib/types';

interface Props {
  readonly imagenes: readonly ImagenProducto[];
  readonly nombre: string;
  /** Explicación cuando la tienda no publica ninguna imagen válida. */
  readonly avisoSinImagen?: string;
}

export function Galeria({ imagenes, nombre, avisoSinImagen }: Props) {
  const [indice, setIndice] = useState(0);
  const activa = imagenes[indice] ?? imagenes[0];

  if (!activa) {
    return (
      <div className="galeria__sin-imagen">
        <strong>Sin fotografía publicada</strong>
        <p>{avisoSinImagen ?? `No hay una imagen publicada que corresponda a ${nombre}.`}</p>
      </div>
    );
  }

  return (
    <div className="galeria">
      <div className="galeria__principal">
        <img
          key={activa.src}
          src={activa.src}
          srcSet={activa.srcset}
          sizes="(max-width: 940px) 92vw, 620px"
          width={activa.width}
          height={activa.height}
          alt={activa.alt}
          decoding="async"
          fetchPriority="high"
        />
      </div>

      {imagenes.length > 1 ? (
        <ul className="galeria__miniaturas">
          {imagenes.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                className="galeria__mini"
                aria-current={i === indice ? 'true' : undefined}
                onClick={() => {
                  setIndice(i);
                }}
              >
                <img
                  src={img.src}
                  width={img.width}
                  height={img.height}
                  alt={`Ver imagen ${String(i + 1)} de ${String(imagenes.length)}: ${img.alt}`}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
