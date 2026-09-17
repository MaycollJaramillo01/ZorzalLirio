'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { CANTIDAD_MAXIMA, useCotizacion } from '@/lib/useCotizacion';
import { SelectorCantidad } from '@/components/SelectorCantidad';
import { precio as formatearPrecio, plural, SIN_PRECIO } from '@/lib/formato';
import { enlaceWhatsApp, mensajeCotizacion } from '@/lib/whatsapp';
import type { DatosSolicitante } from '@/lib/types';

type Campo = keyof DatosSolicitante;

const VACIO: DatosSolicitante = {
  nombre: '',
  empresa: '',
  telefono: '',
  correo: '',
  ciudad: '',
  fechaRequerida: '',
  comentarios: '',
};

/** Reglas de validación con mensajes en lenguaje claro. */
function validar(datos: DatosSolicitante): Partial<Record<Campo, string>> {
  const errores: Partial<Record<Campo, string>> = {};

  if (datos.nombre.trim().length < 3) {
    errores.nombre = 'Escriba su nombre completo para que sepamos con quién hablamos.';
  }
  if (datos.empresa.trim().length < 2) {
    errores.empresa = 'Indique el nombre de la empresa que va a uniformar.';
  }

  const digitos = datos.telefono.replace(/\D/g, '');
  if (digitos.length < 8) {
    errores.telefono = 'Escriba un teléfono con al menos 8 dígitos, por ejemplo 9999-9999.';
  }

  if (datos.correo.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(datos.correo.trim())) {
    errores.correo = 'Revise el correo: debe tener la forma nombre@empresa.com.';
  }

  if (datos.ciudad.trim().length < 3) {
    errores.ciudad = 'Indique la ciudad donde necesita recibir el pedido.';
  }

  if (datos.fechaRequerida !== '' && Number.isNaN(Date.parse(datos.fechaRequerida))) {
    errores.fechaRequerida = 'Elija una fecha válida o deje el campo vacío.';
  }

  return errores;
}

export function FormularioCotizacion() {
  const { elementos, total, listo, cambiarCantidad, eliminar, limpiar } = useCotizacion();
  const [datos, setDatos] = useState<DatosSolicitante>(VACIO);
  const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({});
  const [intentado, setIntentado] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const resumenRef = useRef<HTMLDivElement>(null);

  function actualizar(campo: Campo, valor: string) {
    setDatos((d) => ({ ...d, [campo]: valor }));
    setMensaje(null);
    if (intentado) {
      setErrores(validar({ ...datos, [campo]: valor }));
    }
  }

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIntentado(true);
    const nuevos = validar(datos);
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) {
      const primero = Object.keys(nuevos)[0];
      if (primero !== undefined) {
        document.getElementById(`campo-${primero}`)?.focus();
      }
      setMensaje(null);
      return;
    }
    setMensaje(mensajeCotizacion(elementos, datos));
    // Deja que React pinte el resumen antes de mover el foco.
    window.setTimeout(() => {
      resumenRef.current?.focus();
    }, 0);
  }

  function error(campo: Campo): string | undefined {
    return errores[campo];
  }

  if (!listo) {
    return (
      <p className="cargando" role="status">
        Recuperando su lista de cotización…
      </p>
    );
  }

  if (elementos.length === 0) {
    return (
      <div className="vacio" style={{ maxWidth: '52rem' }}>
        <h2>Su lista de cotización está vacía</h2>
        <p className="texto-aux">
          Agregue productos desde el catálogo o desde cualquier ficha. También puede escribirnos
          directamente si necesita una prenda que no aparece publicada.
        </p>
        <div className="fila g3">
          <Link href="/tienda" className="btn btn--primario">
            Ir al catálogo
          </Link>
          <Link href="/contacto" className="btn btn--secundario">
            Escribirnos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pila g6">
      {/* ---------- Artículos ---------- */}
      <section aria-labelledby="t-articulos" className="pila g4">
        <div className="enc-seccion enc-seccion--partido" style={{ marginBottom: 0 }}>
          <div>
            <h2 id="t-articulos" style={{ fontSize: 'var(--t-lg)' }}>
              Artículos en su solicitud
            </h2>
            <p className="texto-aux">
              {elementos.length} {plural(elementos.length, 'renglón', 'renglones')} · {total}{' '}
              {plural(total, 'unidad', 'unidades')} en total.
            </p>
          </div>
          <button type="button" className="btn btn--secundario btn--sm" onClick={limpiar}>
            Vaciar la lista
          </button>
        </div>

        <ul className="lista-cotizacion">
          {elementos.map((e) => {
            const opciones = Object.entries(e.opciones).filter(([, v]) => v !== '');
            const unitario = formatearPrecio(e.precioUnitario);
            return (
              <li key={e.clave} className="renglon">
                <div className="renglon__datos">
                  <h3>
                    <Link href={`/tienda/${e.slug}`}>{e.nombre}</Link>
                  </h3>
                  <p className="texto-nota">ID {e.productoId}</p>
                  {e.variante !== null ? (
                    <p className="texto-aux">
                      Variante: <strong>{e.variante}</strong>
                    </p>
                  ) : null}
                  {opciones.length > 0 ? (
                    <ul className="renglon__opciones">
                      {opciones.map(([nombre, valor]) => (
                        <li key={nombre} className="distintivo">
                          {nombre}: {valor}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="texto-nota">
                      Sin opciones indicadas.{' '}
                      <Link href={`/tienda/${e.slug}`} className="enlace">
                        Elegir talla, color o tela
                      </Link>
                    </p>
                  )}
                  <p className="texto-aux">
                    {unitario !== null ? `${unitario} por unidad (precio publicado)` : SIN_PRECIO}
                  </p>
                </div>

                <div className="renglon__controles">
                  <SelectorCantidad
                    valor={e.cantidad}
                    maximo={CANTIDAD_MAXIMA}
                    etiqueta="Cantidad"
                    onCambio={(v) => {
                      cambiarCantidad(e.clave, v);
                      setMensaje(null);
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn--secundario btn--sm"
                    onClick={() => {
                      eliminar(e.clave);
                      setMensaje(null);
                    }}
                  >
                    Quitar
                    <span className="solo-lectores"> {e.nombre} de la solicitud</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="nota-datos">
          <span>
            Los precios que ve son los publicados en el catálogo, en dólares. Esta lista es una
            solicitud de cotización: no es un pedido ni un pago, y el precio final se confirma por
            escrito.
          </span>
        </p>
      </section>

      {/* ---------- Datos de contacto ---------- */}
      <section aria-labelledby="t-datos" className="pila g4">
        <div>
          <h2 id="t-datos" style={{ fontSize: 'var(--t-lg)' }}>
            Sus datos
          </h2>
          <p className="texto-aux">
            Los usamos para responderle la cotización. No se guardan en este navegador.
          </p>
        </div>

        <form className="pila g5" onSubmit={enviar} noValidate>
          <div className="rejilla-campos">
            <div className="campo">
              <label htmlFor="campo-nombre">Nombre y apellido</label>
              <input
                id="campo-nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                required
                value={datos.nombre}
                aria-invalid={error('nombre') !== undefined}
                aria-describedby={error('nombre') !== undefined ? 'err-nombre' : undefined}
                onChange={(ev) => {
                  actualizar('nombre', ev.target.value);
                }}
              />
              {error('nombre') !== undefined ? (
                <p className="campo-error" id="err-nombre">
                  {error('nombre')}
                </p>
              ) : null}
            </div>

            <div className="campo">
              <label htmlFor="campo-empresa">Empresa</label>
              <input
                id="campo-empresa"
                name="empresa"
                type="text"
                autoComplete="organization"
                required
                value={datos.empresa}
                aria-invalid={error('empresa') !== undefined}
                aria-describedby={error('empresa') !== undefined ? 'err-empresa' : undefined}
                onChange={(ev) => {
                  actualizar('empresa', ev.target.value);
                }}
              />
              {error('empresa') !== undefined ? (
                <p className="campo-error" id="err-empresa">
                  {error('empresa')}
                </p>
              ) : null}
            </div>

            <div className="campo">
              <label htmlFor="campo-telefono">Teléfono</label>
              <input
                id="campo-telefono"
                name="telefono"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="9999-9999"
                required
                value={datos.telefono}
                aria-invalid={error('telefono') !== undefined}
                aria-describedby={error('telefono') !== undefined ? 'err-telefono' : undefined}
                onChange={(ev) => {
                  actualizar('telefono', ev.target.value);
                }}
              />
              {error('telefono') !== undefined ? (
                <p className="campo-error" id="err-telefono">
                  {error('telefono')}
                </p>
              ) : null}
            </div>

            <div className="campo">
              <label htmlFor="campo-correo">
                Correo <span className="campo-opcional">(opcional)</span>
              </label>
              <input
                id="campo-correo"
                name="correo"
                type="email"
                autoComplete="email"
                value={datos.correo}
                aria-invalid={error('correo') !== undefined}
                aria-describedby={error('correo') !== undefined ? 'err-correo' : undefined}
                onChange={(ev) => {
                  actualizar('correo', ev.target.value);
                }}
              />
              {error('correo') !== undefined ? (
                <p className="campo-error" id="err-correo">
                  {error('correo')}
                </p>
              ) : null}
            </div>

            <div className="campo">
              <label htmlFor="campo-ciudad">Ciudad</label>
              <input
                id="campo-ciudad"
                name="ciudad"
                type="text"
                autoComplete="address-level2"
                required
                value={datos.ciudad}
                aria-invalid={error('ciudad') !== undefined}
                aria-describedby={error('ciudad') !== undefined ? 'err-ciudad' : undefined}
                onChange={(ev) => {
                  actualizar('ciudad', ev.target.value);
                }}
              />
              {error('ciudad') !== undefined ? (
                <p className="campo-error" id="err-ciudad">
                  {error('ciudad')}
                </p>
              ) : null}
            </div>

            <div className="campo">
              <label htmlFor="campo-fechaRequerida">
                Fecha en que lo necesita <span className="campo-opcional">(opcional)</span>
              </label>
              <input
                id="campo-fechaRequerida"
                name="fechaRequerida"
                type="date"
                value={datos.fechaRequerida}
                aria-invalid={error('fechaRequerida') !== undefined}
                aria-describedby={
                  error('fechaRequerida') !== undefined ? 'err-fechaRequerida' : undefined
                }
                onChange={(ev) => {
                  actualizar('fechaRequerida', ev.target.value);
                }}
              />
              {error('fechaRequerida') !== undefined ? (
                <p className="campo-error" id="err-fechaRequerida">
                  {error('fechaRequerida')}
                </p>
              ) : null}
            </div>

            <div className="campo rejilla-campos--ancho">
              <label htmlFor="campo-comentarios">
                Comentarios <span className="campo-opcional">(opcional)</span>
              </label>
              <textarea
                id="campo-comentarios"
                name="comentarios"
                value={datos.comentarios}
                placeholder="Personalización requerida, colores corporativos, distribución de tallas, condiciones de entrega…"
                onChange={(ev) => {
                  actualizar('comentarios', ev.target.value);
                }}
              />
            </div>
          </div>

          <div className="pila g3">
            <button type="submit" className="btn btn--primario btn--lg">
              Revisar la solicitud
            </button>
            <p className="texto-nota">
              Al continuar se abre WhatsApp con la solicitud ya escrita. Podrá revisarla y
              modificarla antes de enviarla; mientras no la envíe, nosotros no recibimos nada.
            </p>
          </div>
        </form>
      </section>

      {/* ---------- Resumen previo ---------- */}
      {mensaje !== null ? (
        <section
          className="previo"
          aria-labelledby="t-resumen"
          ref={resumenRef}
          tabIndex={-1}
        >
          <h2 id="t-resumen" style={{ fontSize: 'var(--t-md)' }}>
            Resumen de la solicitud
          </h2>
          <p className="texto-aux">
            Este es el mensaje exacto que se abrirá en WhatsApp. Revíselo antes de enviarlo.
          </p>
          <pre>{mensaje}</pre>
          <div className="fila g3">
            <a
              className="btn btn--primario btn--lg"
              href={enlaceWhatsApp(mensaje)}
              target="_blank"
              rel="noreferrer noopener"
            >
              Abrir WhatsApp y enviar
            </a>
            <button
              type="button"
              className="btn btn--secundario"
              onClick={() => {
                setMensaje(null);
              }}
            >
              Seguir editando
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
