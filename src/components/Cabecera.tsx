'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { NAVEGACION, media } from '@/data/sitio';
import { useCotizacion } from '@/lib/useCotizacion';

const logo = media('logo-zorzal-lirio');

export function Cabecera() {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [rutaAnterior, setRutaAnterior] = useState(ruta);
  const idPanel = useId();
  const botonRef = useRef<HTMLButtonElement>(null);
  const { total, listo } = useCotizacion();

  // Al navegar, el menú se cierra.  Ajuste durante el render: no hace falta
  // un efecto para derivar estado de otro estado.
  if (ruta !== rutaAnterior) {
    setRutaAnterior(ruta);
    setAbierto(false);
  }

  // Escape cierra el panel y devuelve el foco al botón.
  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAbierto(false);
        botonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', alPulsar);
    return () => {
      document.removeEventListener('keydown', alPulsar);
    };
  }, [abierto]);

  const activa = (href: string) =>
    ruta === href || (href !== '/' && ruta.startsWith(`${href}/`));

  return (
    <header className="cabecera">
      <div className="contenedor cabecera__fila">
        <Link href="/" className="cabecera__logo" aria-label="Zorzal Lirio, inicio">
          <img
            src={logo.src}
            srcSet={logo.srcset}
            width={logo.width}
            height={logo.height}
            alt="Zorzal Lirio"
            style={{ height: 34, width: 'auto' }}
          />
        </Link>

        <nav className="cabecera__nav" aria-label="Principal">
          {NAVEGACION.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={activa(item.href) ? 'page' : undefined}
            >
              {item.etiqueta}
            </Link>
          ))}
        </nav>

        <div className="cabecera__acciones">
          <Link
            href="/cotizacion"
            className="btn btn--secundario btn--sm"
            aria-current={activa('/cotizacion') ? 'page' : undefined}
          >
            Mi cotización
            {listo && total > 0 ? (
              <span className="cabecera__conteo" aria-hidden="true">
                {total}
              </span>
            ) : null}
            {listo && total > 0 ? (
              <span className="solo-lectores">
                {total === 1 ? '1 artículo en la lista' : `${String(total)} artículos en la lista`}
              </span>
            ) : null}
          </Link>
          <Link href="/cotizacion" className="btn btn--primario btn--sm">
            Solicitar cotización
          </Link>
          <button
            ref={botonRef}
            type="button"
            className="menu-boton"
            aria-expanded={abierto}
            aria-controls={idPanel}
            onClick={() => {
              setAbierto((v) => !v);
            }}
          >
            <span className="solo-lectores">{abierto ? 'Cerrar menú' : 'Abrir menú'}</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              {abierto ? (
                <path d="M4 4l12 12M16 4L4 16" />
              ) : (
                <path d="M2.5 5.5h15M2.5 10h15M2.5 14.5h15" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className="menu-panel" id={idPanel} hidden={!abierto}>
        <div className="contenedor">
          <ul>
            {NAVEGACION.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={activa(item.href) ? 'page' : undefined}>
                  {item.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
          <div className="menu-panel__pie">
            <Link href="/cotizacion" className="btn btn--primario btn--ancho">
              Solicitar cotización
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
