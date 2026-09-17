import type { Metadata } from 'next';
import Link from 'next/link';
import { EncabezadoPagina } from '@/components/EncabezadoPagina';
import { EnlaceWhatsApp } from '@/components/EnlaceWhatsApp';
import { DIRECCION_COMPLETA, SITIO, TELEFONOS_EN_POLITICAS, media } from '@/data/sitio';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Zorzal Lirio en San Pedro Sula: Col. Villas del Sol, Bloque F #15. Teléfonos +504 8832-8459 y +504 9550-8426, correos ventas@zorzallirio.com e imagenempresarial@zorzallirio.com.',
  alternates: { canonical: '/contacto' },
  openGraph: {
    title: 'Contacto · Zorzal Lirio',
    description: 'Dirección, teléfonos y correos de Zorzal Lirio en San Pedro Sula, Honduras.',
    url: '/contacto',
  },
};

const mapa = media('mapa-taller');

export default function Contacto() {
  return (
    <>
      <EncabezadoPagina
        ojal="Contacto"
        titulo="Hablemos de los uniformes de su equipo"
        entrada="Atendemos consultas de empresas por teléfono, WhatsApp y correo. Si ya sabe qué necesita, la vía más rápida es armar la solicitud de cotización."
      />

      <section className="seccion">
        <div className="contenedor">
          <div className="dos-columnas">
            <div className="datos-contacto">
              <div className="datos-contacto__bloque">
                <p className="etiqueta">Dirección</p>
                <p>{DIRECCION_COMPLETA}</p>
              </div>

              <div className="datos-contacto__bloque">
                <p className="etiqueta">Teléfonos</p>
                {SITIO.telefonos.map((t) => (
                  <p key={t}>
                    <a href={`tel:${t.replace(/[^+\d]/g, '')}`}>{t}</a>
                  </p>
                ))}
              </div>

              <div className="datos-contacto__bloque">
                <p className="etiqueta">Correos</p>
                {SITIO.correos.map((c) => (
                  <p key={c}>
                    <a href={`mailto:${c}`}>{c}</a>
                  </p>
                ))}
              </div>

              <div className="datos-contacto__bloque">
                <p className="etiqueta">WhatsApp y redes</p>
                <p>
                  <a href={`https://wa.me/${SITIO.whatsapp}`} rel="noreferrer noopener" target="_blank">
                    wa.me/{SITIO.whatsapp}
                  </a>
                </p>
                <p>
                  <a href={SITIO.facebook} rel="noreferrer noopener" target="_blank">
                    facebook.com/zorzallirio
                  </a>
                </p>
              </div>

              <div className="datos-contacto__bloque">
                <p className="etiqueta">Horario de atención</p>
                <p className="texto-aux">
                  No está publicado en el material disponible. Le sugerimos confirmarlo por
                  WhatsApp antes de visitarnos.
                </p>
              </div>

              <div className="fila g3">
                <Link href="/cotizacion" className="btn btn--primario btn--lg">
                  Armar mi solicitud
                </Link>
                <EnlaceWhatsApp className="btn btn--wa btn--lg">
                  Escribir por WhatsApp
                </EnlaceWhatsApp>
              </div>
              <p className="texto-nota">
                Al escribir por WhatsApp se abre la conversación con un mensaje preparado que puede
                revisar y modificar antes de enviarlo.
              </p>
            </div>

            <div className="pila g4">
              <figure className="figura-editorial">
                <img
                  src={mapa.src}
                  srcSet={mapa.srcset}
                  sizes="(max-width: 880px) 92vw, 600px"
                  width={mapa.width}
                  height={mapa.height}
                  alt="Mapa de San Pedro Sula con la ubicación de Zorzal Lirio marcada en la Colonia Villas del Sol, cerca de Mall Galerías."
                  decoding="async"
                />
                <figcaption>
                  Ubicación publicada por la empresa: Colonia Villas del Sol, San Pedro Sula.
                </figcaption>
              </figure>

              <p className="nota-datos">
                <span>
                  <strong>Nota.</strong> Las políticas de entrega y de reembolso publicadas citan
                  otros dos números de atención al cliente ({TELEFONOS_EN_POLITICAS.join(' y ')})
                  que no aparecen en la página de contacto. Conservamos ambos juegos de números tal
                  como se publicaron; para consultas comerciales le recomendamos los de esta
                  página.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
