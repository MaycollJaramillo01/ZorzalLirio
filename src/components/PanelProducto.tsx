'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CANTIDAD_MAXIMA, useCotizacion } from '@/lib/useCotizacion';
import { SelectorCantidad } from '@/components/SelectorCantidad';
import { VistaPreviaWhatsApp } from '@/components/VistaPreviaWhatsApp';
import { precio as formatearPrecio, SIN_PRECIO } from '@/lib/formato';
import { mensajeProducto } from '@/lib/whatsapp';
import type { Producto, SeleccionOpciones } from '@/lib/types';

export function PanelProducto({ producto }: { readonly producto: Producto }) {
  const { agregar } = useCotizacion();

  const grupoPrecio = producto.opciones.find((o) => o.determinaPrecio) ?? null;
  const primeraVariante = producto.variantes[0]?.nombre ?? null;

  const [seleccion, setSeleccion] = useState<SeleccionOpciones>(() =>
    grupoPrecio !== null && primeraVariante !== null ? { [grupoPrecio.nombre]: primeraVariante } : {},
  );
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  const varianteElegida = useMemo(() => {
    if (grupoPrecio === null) return null;
    const valor = seleccion[grupoPrecio.nombre];
    if (valor === undefined) return null;
    return producto.variantes.find((v) => v.nombre === valor) ?? null;
  }, [grupoPrecio, seleccion, producto.variantes]);

  // El precio de la variante manda sobre el precio base publicado.
  const precioActual = varianteElegida?.precio ?? producto.precio;
  const precioAnterior = varianteElegida ? varianteElegida.precioAnterior : producto.precioAnterior;

  const p = formatearPrecio(precioActual);
  const anterior = formatearPrecio(precioAnterior);

  const mensaje = mensajeProducto(producto, seleccion, cantidad, precioActual);

  function elegir(grupo: string, valor: string) {
    setSeleccion((actual) => {
      const copia = { ...actual };
      if (copia[grupo] === valor) delete copia[grupo];
      else copia[grupo] = valor;
      return copia;
    });
    setAgregado(false);
  }

  return (
    <div className="panel-producto">
      <div className="panel-producto__encabezado">
        <p className="etiqueta">
          {producto.categoriasPublicadas.map((c) => c.nombre).join(' · ')}
        </p>
        <h1>{producto.nombre}</h1>
        <p className="panel-producto__precio">
          {p !== null ? (
            <>
              <span className="precio-actual">{p}</span>
              {anterior !== null ? (
                <>
                  <span className="precio-anterior">{anterior}</span>
                  <span className="distintivo distintivo--oferta">Oferta publicada</span>
                </>
              ) : null}
              {producto.modalidad === 'membresia' && producto.periodicidad !== null ? (
                <span className="texto-aux">por {producto.periodicidad}</span>
              ) : (
                <span className="texto-aux">por unidad</span>
              )}
            </>
          ) : (
            <span className="precio-nulo">{SIN_PRECIO}</span>
          )}
        </p>
        <p className="panel-producto__descripcion">{producto.descripcion}</p>
      </div>

      {producto.opciones.length > 0 ? (
        <div className="pila g5">
          {producto.opciones.map((opcion) => (
            <fieldset key={opcion.nombre} className="opciones-grupo" style={{ border: 0, padding: 0 }}>
              <legend className="campo-etiqueta" style={{ padding: 0 }}>
                {opcion.nombre}
                {opcion.determinaPrecio ? (
                  <span className="campo-opcional"> · define el precio</span>
                ) : (
                  <span className="campo-opcional"> · opcional</span>
                )}
              </legend>
              <div className="opciones-valores">
                {opcion.valores.map((valor) => (
                  <button
                    key={valor}
                    type="button"
                    className="opcion-chip"
                    aria-pressed={seleccion[opcion.nombre] === valor}
                    onClick={() => {
                      elegir(opcion.nombre, valor);
                    }}
                  >
                    {valor}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
          <p className="texto-nota">
            Estas son las opciones publicadas en la ficha original. Las combinaciones disponibles
            se confirman al cotizar.
          </p>
        </div>
      ) : null}

      <div className="panel-producto__acciones">
        <div className="fila g4">
          <SelectorCantidad
            valor={cantidad}
            maximo={CANTIDAD_MAXIMA}
            etiqueta="Cantidad solicitada"
            onCambio={(v) => {
              setCantidad(v);
              setAgregado(false);
            }}
          />
          {agregado ? (
            <Link href="/cotizacion" className="btn btn--secundario">
              En la lista · Ver solicitud
            </Link>
          ) : (
            <button
              type="button"
              className="btn btn--secundario"
              onClick={() => {
                agregar({
                  productoId: producto.id,
                  slug: producto.slug,
                  nombre: producto.nombre,
                  cantidad,
                  opciones: seleccion,
                  variante: varianteElegida?.nombre ?? null,
                  precioUnitario: precioActual,
                });
                setAgregado(true);
              }}
            >
              Agregar a mi cotización
            </button>
          )}
        </div>

        <VistaPreviaWhatsApp
          mensaje={mensaje}
          textoBoton="Cotizar este producto"
          claseBoton="btn btn--primario btn--lg btn--ancho"
        />
      </div>

      <dl className="ficha-datos">
        <dt>Referencia</dt>
        <dd>ID {producto.id}</dd>
        {producto.sku !== null ? (
          <>
            <dt>SKU publicado</dt>
            <dd>{producto.sku}</dd>
          </>
        ) : null}
        <dt>Moneda</dt>
        <dd>Dólares estadounidenses (USD), según el catálogo publicado.</dd>
        <dt>Inventario</dt>
        <dd>
          {producto.inventario === null
            ? 'No publicado. Confirmamos disponibilidad al cotizar.'
            : `${String(producto.inventario)} unidades`}
        </dd>
      </dl>
    </div>
  );
}
