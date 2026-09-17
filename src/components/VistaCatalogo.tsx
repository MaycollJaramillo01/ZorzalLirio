'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { TarjetaProducto } from '@/components/TarjetaProducto';
import { LINEAS, PRODUCTOS, conteoPorLinea } from '@/data/catalogo';
import { plural } from '@/lib/formato';
import type { LineaId, Producto } from '@/lib/types';

type Orden = 'nombre-asc' | 'nombre-desc' | 'precio-asc' | 'precio-desc';

const ORDENES: readonly { readonly valor: Orden; readonly etiqueta: string }[] = [
  { valor: 'nombre-asc', etiqueta: 'Nombre (A–Z)' },
  { valor: 'nombre-desc', etiqueta: 'Nombre (Z–A)' },
  { valor: 'precio-asc', etiqueta: 'Precio (menor a mayor)' },
  { valor: 'precio-desc', etiqueta: 'Precio (mayor a menor)' },
];

const ORDEN_POR_DEFECTO: Orden = 'nombre-asc';

function esOrden(v: string | null): v is Orden {
  return v !== null && ORDENES.some((o) => o.valor === v);
}

function esLinea(v: string | null): v is LineaId {
  return v !== null && LINEAS.some((l) => l.id === v);
}

/** Normaliza para buscar sin acentos ni mayúsculas. */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function ordenar(productos: readonly Producto[], orden: Orden): Producto[] {
  const copia = [...productos];
  switch (orden) {
    case 'nombre-asc':
      return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    case 'nombre-desc':
      return copia.sort((a, b) => b.nombre.localeCompare(a.nombre, 'es'));
    case 'precio-asc':
    case 'precio-desc': {
      // Los productos sin precio publicado quedan siempre al final.
      const dir = orden === 'precio-asc' ? 1 : -1;
      return copia.sort((a, b) => {
        if (a.precio === null && b.precio === null) {
          return a.nombre.localeCompare(b.nombre, 'es');
        }
        if (a.precio === null) return 1;
        if (b.precio === null) return -1;
        if (a.precio === b.precio) return a.nombre.localeCompare(b.nombre, 'es');
        return (a.precio - b.precio) * dir;
      });
    }
  }
}

export function VistaCatalogo() {
  const router = useRouter();
  const params = useSearchParams();

  const qUrl = params.get('q') ?? '';
  const categoriaCruda = params.get('categoria');
  const ordenCrudo = params.get('orden');
  const categoria = esLinea(categoriaCruda) ? categoriaCruda : null;
  const orden = esOrden(ordenCrudo) ? ordenCrudo : ORDEN_POR_DEFECTO;
  const parametrosInvalidos =
    (categoriaCruda !== null && categoria === null) || (ordenCrudo !== null && !esOrden(ordenCrudo));

  const [busqueda, setBusqueda] = useState(qUrl);
  const [qAnterior, setQAnterior] = useState(qUrl);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const idBusqueda = useId();
  const idOrden = useId();
  const idPanel = useId();
  const botonPanelRef = useRef<HTMLButtonElement>(null);
  const cerrarPanelRef = useRef<HTMLButtonElement>(null);
  const relojBusqueda = useRef<number | null>(null);

  // La URL manda: si cambia desde fuera (enlace compartido, atrás/adelante),
  // el cuadro de búsqueda se ajusta durante el render, sin efecto de por medio.
  if (qUrl !== qAnterior) {
    setQAnterior(qUrl);
    setBusqueda(qUrl);
  }

  const consulta = useMemo(() => {
    const p = new URLSearchParams();
    if (qUrl !== '') p.set('q', qUrl);
    if (categoria !== null) p.set('categoria', categoria);
    if (orden !== ORDEN_POR_DEFECTO) p.set('orden', orden);
    return p.toString();
  }, [qUrl, categoria, orden]);

  function navegar(cambios: Readonly<Record<string, string | null>>) {
    const p = new URLSearchParams(params.toString());
    for (const [clave, valor] of Object.entries(cambios)) {
      if (valor === null || valor === '') p.delete(clave);
      else p.set(clave, valor);
    }
    const cadena = p.toString();
    router.replace(cadena === '' ? '/tienda' : `/tienda?${cadena}`, { scroll: false });
  }

  function escribirBusqueda(texto: string) {
    setBusqueda(texto);
    setQAnterior(texto);
    // Un pequeño retardo evita reescribir la URL en cada pulsación.
    if (relojBusqueda.current !== null) window.clearTimeout(relojBusqueda.current);
    relojBusqueda.current = window.setTimeout(() => {
      navegar({ q: texto });
    }, 220);
  }

  function limpiarTodo() {
    if (relojBusqueda.current !== null) window.clearTimeout(relojBusqueda.current);
    setBusqueda('');
    setQAnterior('');
    router.replace('/tienda', { scroll: false });
  }

  // Panel de filtros en móvil: Escape cierra y el foco vuelve al botón.
  useEffect(() => {
    if (!panelAbierto) return;
    cerrarPanelRef.current?.focus();
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPanelAbierto(false);
        botonPanelRef.current?.focus();
      }
    };
    document.addEventListener('keydown', alPulsar);
    return () => {
      document.removeEventListener('keydown', alPulsar);
    };
  }, [panelAbierto]);

  const conteo = conteoPorLinea();
  const terminos = normalizar(busqueda.trim());

  const resultados = useMemo(() => {
    const porCategoria =
      categoria === null ? PRODUCTOS : PRODUCTOS.filter((p) => p.lineas.includes(categoria));
    const buscados =
      terminos === ''
        ? porCategoria
        : porCategoria.filter((p) => {
            const heno = normalizar(`${p.nombre} ${p.descripcion}`);
            return terminos.split(/\s+/).every((t) => heno.includes(t));
          });
    return ordenar(buscados, orden);
  }, [categoria, terminos, orden]);

  const hayFiltros = qUrl !== '' || categoria !== null || orden !== ORDEN_POR_DEFECTO;

  function cerrarPanel() {
    setPanelAbierto(false);
    botonPanelRef.current?.focus();
  }

  const panelFiltros = (
    <div className="filtros">
      <button ref={cerrarPanelRef} type="button" className="filtros__cerrar" onClick={cerrarPanel}>
        <span aria-hidden="true">✕</span>
        <span className="solo-lectores">Cerrar filtros</span>
      </button>

      <div className="filtros__grupo">
        <label className="filtros__titulo" htmlFor={idBusqueda}>
          Buscar
        </label>
        <input
          id={idBusqueda}
          type="search"
          value={busqueda}
          placeholder="Camisa, bota, gabacha…"
          autoComplete="off"
          onChange={(e) => {
            escribirBusqueda(e.target.value);
          }}
        />
        <p className="campo-pista">Busca en el nombre y en la descripción del producto.</p>
      </div>

      <div className="filtros__grupo">
        <h2 className="filtros__titulo" id="titulo-categorias">
          Categoría
        </h2>
        <ul className="filtros__opciones" aria-labelledby="titulo-categorias">
          <li>
            <button
              type="button"
              className="filtro-opcion"
              aria-pressed={categoria === null}
              onClick={() => {
                navegar({ categoria: null });
              }}
            >
              <span>Todos los productos</span>
              <span>{PRODUCTOS.length}</span>
            </button>
          </li>
          {LINEAS.map((linea) => (
            <li key={linea.id}>
              <button
                type="button"
                className="filtro-opcion"
                aria-pressed={categoria === linea.id}
                onClick={() => {
                  navegar({ categoria: categoria === linea.id ? null : linea.id });
                }}
              >
                <span>{linea.nombre}</span>
                <span>{conteo[linea.id]}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="filtros__grupo">
        <label className="filtros__titulo" htmlFor={idOrden}>
          Ordenar por
        </label>
        <select
          id={idOrden}
          value={orden}
          onChange={(e) => {
            navegar({ orden: e.target.value === ORDEN_POR_DEFECTO ? null : e.target.value });
          }}
        >
          {ORDENES.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.etiqueta}
            </option>
          ))}
        </select>
      </div>

      <div className="filtros__grupo">
        <button
          type="button"
          className="btn btn--secundario btn--sm btn--ancho"
          disabled={!hayFiltros}
          onClick={limpiarTodo}
        >
          Limpiar filtros
        </button>
      </div>

      <p className="texto-nota">
        Los precios están publicados en dólares (USD), tal como aparecen en el catálogo de origen.
        No se convierten a lempiras.
      </p>
    </div>
  );

  return (
    <div className="catalogo">
      {/*
        Un solo bloque de filtros.  En escritorio es una columna de la retícula
        (display: contents); en móvil, un panel superpuesto que se abre y cierra.
      */}
      <div
        className={panelAbierto ? 'panel-filtros panel-filtros--abierto' : 'panel-filtros'}
        id={idPanel}
      >
        <button
          type="button"
          className="panel-filtros__fondo"
          onClick={cerrarPanel}
          tabIndex={-1}
          aria-hidden="true"
        />
        {panelFiltros}
      </div>

      <div>
        <div className="barra-resultados">
          <p className="barra-resultados__conteo" role="status">
            <strong>{resultados.length}</strong>{' '}
            {plural(resultados.length, 'producto', 'productos')}
            {categoria !== null ? ` en ${LINEAS.find((l) => l.id === categoria)?.nombre ?? ''}` : ''}
            {qUrl !== '' ? ` para «${qUrl}»` : ''}
            {resultados.length !== PRODUCTOS.length ? ` de ${PRODUCTOS.length}` : ''}
          </p>

          <div className="fila g2">
            <button
              ref={botonPanelRef}
              type="button"
              className="btn btn--secundario btn--sm filtros-boton-movil"
              aria-expanded={panelAbierto}
              aria-controls={idPanel}
              onClick={() => {
                setPanelAbierto(true);
              }}
            >
              Filtros y orden
              {hayFiltros ? <span className="cabecera__conteo" aria-hidden="true">•</span> : null}
            </button>
            {hayFiltros ? (
              <button
                type="button"
                className="btn btn--secundario btn--sm"
                onClick={limpiarTodo}
              >
                Limpiar
              </button>
            ) : null}
          </div>
        </div>

        {parametrosInvalidos ? (
          <p className="nota-datos" style={{ marginBottom: 'var(--e5)' }}>
            <span>
              La dirección incluye un filtro que no reconocemos, así que se ignoró. Puede usar los
              filtros de la izquierda o{' '}
              <Link href="/tienda" className="enlace">
                ver todos los productos
              </Link>
              .
            </span>
          </p>
        ) : null}

        {resultados.length === 0 ? (
          <div className="vacio">
            <h2>Ningún producto coincide con esta búsqueda</h2>
            <p className="texto-aux">
              Pruebe con un término más corto —«camisa», «bota», «pantalón»— o quite el filtro de
              categoría. Si busca una prenda que no aparece en el catálogo, podemos cotizarla:
              trabajamos sobre pedido.
            </p>
            <div className="fila g3">
              <button
                type="button"
                className="btn btn--secundario"
                onClick={limpiarTodo}
              >
                Limpiar filtros
              </button>
              <Link href="/contacto" className="btn btn--primario">
                Consultar una prenda
              </Link>
            </div>
          </div>
        ) : (
          <ul className="rejilla-productos">
            {resultados.map((p, i) => (
              <TarjetaProducto
                key={p.id}
                producto={p}
                volverA={consulta}
                diferida={i >= 4}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
