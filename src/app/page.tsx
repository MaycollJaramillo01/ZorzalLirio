import type { Metadata } from 'next';
import Link from 'next/link';
import { TarjetaProducto } from '@/components/TarjetaProducto';
import { EnlaceWhatsApp } from '@/components/EnlaceWhatsApp';
import {
  DESTACADOS,
  EXTRAIDO_EL,
  LINEAS,
  PRODUCTOS,
  conteoPorLinea,
  valoresDeOpcion,
} from '@/data/catalogo';
import { SITIO, media } from '@/data/sitio';
import { plural } from '@/lib/formato';

export const metadata: Metadata = {
  title: 'Uniformes empresariales en San Pedro Sula',
  description:
    'Prendas de trabajo para oficina, industria, seguridad y salud. Asesoría en telas, colores y opciones para vestir a su equipo. Zorzal Lirio, San Pedro Sula, desde 2010.',
  alternates: { canonical: '/' },
};

const hero = media('hero-industrial');
const asesoria = media('asesoria-telas');
const plan = media('plan-corporativo');
const empresa = media('equipo-oficina');

export default function Inicio() {
  const conteo = conteoPorLinea();
  const telas = valoresDeOpcion('Tela', 'Telas');
  const colores = valoresDeOpcion('Color');
  const tallas = valoresDeOpcion('Talla');
  const fechaExtraccion = new Date(`${EXTRAIDO_EL}T12:00:00Z`).toLocaleDateString('es-HN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="contenedor hero__reticula">
          <div className="hero__texto">
            <p className="hero__sello">
              Desde {SITIO.anioInicio} · {SITIO.direccion.ciudad}
            </p>
            <h1>Uniformes que representan a su empresa.</h1>
            <p className="hero__entrada">
              Prendas de trabajo para oficina, industria, seguridad y salud. Le asesoramos en
              telas, colores y opciones para vestir a su equipo.
            </p>
            <div className="hero__acciones">
              <Link href="/tienda" className="btn btn--primario btn--lg">
                Explorar catálogo
              </Link>
              <EnlaceWhatsApp className="btn btn--wa btn--lg">Cotizar por WhatsApp</EnlaceWhatsApp>
            </div>
            <p className="hero__lineas">
              {LINEAS.filter((l) => l.id !== 'otros').map((l) => (
                <span key={l.id}>{l.nombre}</span>
              ))}
            </p>
          </div>

          <figure className="hero__figura">
            <img
              src={hero.src}
              srcSet={hero.srcset}
              sizes="(max-width: 900px) 92vw, 640px"
              width={hero.width}
              height={hero.height}
              alt="Dos colaboradores con camisas de trabajo con cintas reflectivas y pantalón caqui."
              decoding="async"
              fetchPriority="high"
            />
            <figcaption className="hero__pie">
              Camisa industrial con reflectivos, una de las {PRODUCTOS.length} referencias
              publicadas en el catálogo.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- Líneas ---------- */}
      <section className="seccion" aria-labelledby="t-lineas">
        <div className="contenedor">
          <div className="enc-seccion enc-seccion--partido">
            <div>
              <p className="enc-seccion__ojal">Líneas de trabajo</p>
              <h2 id="t-lineas">Cuatro líneas para cuatro entornos distintos</h2>
            </div>
            <Link href="/tienda" className="enlace-flecha">
              Ver todos los productos
            </Link>
          </div>

          <ul className="lineas">
            {LINEAS.filter((l) => l.imagen !== null).map((linea) => {
              const img = media(linea.imagen as string);
              const n = conteo[linea.id];
              return (
                <li key={linea.id}>
                  <Link href={`/tienda?categoria=${linea.id}`} className="linea">
                    <img
                      src={img.src}
                      srcSet={img.srcset}
                      sizes="(max-width: 520px) 38vw, (max-width: 1000px) 46vw, 300px"
                      width={img.width}
                      height={img.height}
                      alt={linea.alt}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="linea__cuerpo">
                      <span className="linea__nombre">
                        {linea.nombre}
                        <span className="linea__conteo">
                          {n} {plural(n, 'producto', 'productos')}
                        </span>
                      </span>
                      <span className="linea__texto">{linea.descripcion}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------- Destacados ---------- */}
      <section className="seccion seccion--blanca" aria-labelledby="t-destacados">
        <div className="contenedor">
          <div className="enc-seccion enc-seccion--partido">
            <div>
              <p className="enc-seccion__ojal">Selección</p>
              <h2 id="t-destacados">Prendas representativas de cada línea</h2>
              <p className="enc-seccion__texto">
                Precios publicados en dólares, tomados del catálogo el {fechaExtraccion}. Son
                precios de referencia, no una cotización.
              </p>
            </div>
            <Link href="/tienda" className="enlace-flecha">
              Catálogo completo
            </Link>
          </div>

          <ul className="rejilla-productos">
            {DESTACADOS.map((p) => (
              <TarjetaProducto key={p.id} producto={p} />
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Personalización y asesoría ---------- */}
      <section className="seccion" aria-labelledby="t-asesoria">
        <div className="contenedor">
          <div className="dos-columnas">
            <div className="pila g5">
              <div className="pila g3">
                <p className="enc-seccion__ojal">Asesoría</p>
                <h2 id="t-asesoria">Le acompañamos en el diseño del uniforme</h2>
                <p className="enc-seccion__texto">
                  Nuestra pasión es su marca: le asesoramos en todo el proceso de diseño de los
                  uniformes en lo referente a telas, presupuesto, tiempos de entrega y combinación
                  de colores.
                </p>
              </div>

              <dl className="ficha-datos" style={{ gap: '0.9rem 1.5rem' }}>
                <dt>Telas publicadas</dt>
                <dd>{telas.join(', ')}.</dd>
                <dt>Colores publicados</dt>
                <dd>{colores.join(', ')}.</dd>
                <dt>Tallas publicadas</dt>
                <dd>
                  Camisas {tallas.filter((t) => Number.isNaN(Number(t))).join(', ')}; pantalón y
                  calzado por número.
                </dd>
                <dt>Personalización</dt>
                <dd>
                  Varias fichas indican que los colores, los bordados y los detalles son
                  personalizables, y que las telas quedan a criterio del cliente.
                </dd>
              </dl>

              <p className="texto-aux">
                Las combinaciones disponibles se confirman al cotizar. Consúltenos antes de cerrar
                el diseño para revisar existencias de tela y tiempos.
              </p>
            </div>

            <figure className="figura-editorial figura-editorial--recorte">
              <img
                src={asesoria.src}
                srcSet={asesoria.srcset}
                sizes="(max-width: 880px) 92vw, 600px"
                width={asesoria.width}
                height={asesoria.height}
                alt="Dos colaboradores con camisas tipo polo en azul marino y vino, con vivos de contraste."
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                Polos con vivos de contraste, del material fotográfico publicado por la empresa.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ---------- Plan corporativo ---------- */}
      <section className="seccion seccion--hondo" aria-labelledby="t-plan">
        <div className="contenedor">
          <div className="dos-columnas dos-columnas--invertida">
            <figure className="figura-editorial figura-editorial--recorte">
              <img
                src={plan.src}
                srcSet={plan.srcset}
                sizes="(max-width: 880px) 92vw, 600px"
                width={plan.width}
                height={plan.height}
                alt="Dos colaboradores con camisas tipo polo blancas y pantalón caqui en un corredor de oficina."
                loading="lazy"
                decoding="async"
              />
            </figure>

            <div className="pila g5">
              <div className="pila g3">
                <p className="enc-seccion__ojal">Plan corporativo</p>
                <h2 id="t-plan">Inventario, tallas y plazos para necesidades recurrentes</h2>
                <p className="enc-seccion__texto">
                  Para empresas que reponen uniformes durante todo el año: mantenemos el inventario
                  y gestionamos las tallas de sus colaboradores, sin que su empresa inmovilice
                  capital ni asuma la operación.
                </p>
              </div>

              <ul className="lista-pasos">
                <li>
                  <div>
                    <h3>Inventario de uniformes</h3>
                    <p>
                      Nos hacemos cargo del inventario a lo largo del año, según lo publicado en el
                      plan corporativo.
                    </p>
                  </div>
                </li>
                <li>
                  <div>
                    <h3>Coordinación de tallas</h3>
                    <p>Gestionamos la toma de tallas directamente con sus colaboradores.</p>
                  </div>
                </li>
                <li>
                  <div>
                    <h3>Facilidades de pago</h3>
                    <p>
                      El plan permite negociar plazos y precios. Cada caso queda sujeto a
                      evaluación y acuerdo con la empresa.
                    </p>
                  </div>
                </li>
              </ul>

              <div className="fila g3">
                <Link href="/plan-corporativo" className="btn btn--primario">
                  Consultar plan corporativo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Empresa ---------- */}
      <section className="seccion" aria-labelledby="t-empresa">
        <div className="contenedor">
          <div className="dos-columnas">
            <div className="pila g5">
              <div className="pila g3">
                <p className="enc-seccion__ojal">La empresa</p>
                <h2 id="t-empresa">Uniformes empresariales desde 2010, en San Pedro Sula</h2>
              </div>
              <div className="prosa" style={{ fontSize: 'var(--t-lead)' }}>
                <p>
                  Nacimos en el año 2010 como una alternativa para crear uniformes empresariales
                  memorables: quisimos ir más allá de prendas genéricas y aburridas, acompañadas de
                  una filosofía de servicio diferencial.
                </p>
                <p>
                  Trabajamos uniformes empresariales y calzado de trabajo. Atendemos desde{' '}
                  {SITIO.direccion.calle}, {SITIO.direccion.ciudad}, {SITIO.direccion.departamento}.
                </p>
              </div>
              <Link href="/quienes-somos" className="enlace-flecha">
                Conocer más sobre la empresa
              </Link>
            </div>

            <figure className="figura-editorial figura-editorial--recorte">
              <img
                src={empresa.src}
                srcSet={empresa.srcset}
                sizes="(max-width: 880px) 92vw, 600px"
                width={empresa.width}
                height={empresa.height}
                alt="Equipo de oficina reunido alrededor de una mesa de trabajo."
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* ---------- Cierre ---------- */}
      <section className="seccion cierre" aria-labelledby="t-cierre">
        <div className="contenedor">
          <div className="dos-columnas">
            <div className="pila g4">
              <p className="enc-seccion__ojal">Solicitar cotización</p>
              <h2 id="t-cierre">Cuéntenos qué necesita vestir y le preparamos la propuesta</h2>
              <p className="cierre__texto">
                Con estos cuatro datos podemos responderle con precio, telas disponibles y plazo.
              </p>
              <div className="fila g3" style={{ marginTop: '0.5rem' }}>
                <Link href="/cotizacion" className="btn btn--primario btn--lg">
                  Armar mi solicitud
                </Link>
                <EnlaceWhatsApp className="btn btn--secundario btn--lg">
                  Escribir por WhatsApp
                </EnlaceWhatsApp>
              </div>
            </div>

            <ul className="cierre__lista">
              <li>Tipo de uniforme: oficina, industrial, seguridad o salud.</li>
              <li>Cantidad aproximada de prendas y de colaboradores.</li>
              <li>Si necesita personalización: colores, bordados o detalles.</li>
              <li>Fecha en que necesita recibir el pedido.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
