import type { Metadata } from 'next';
import Link from 'next/link';
import { EncabezadoPagina } from '@/components/EncabezadoPagina';
import { DIRECCION_COMPLETA, SITIO, media } from '@/data/sitio';
import { PRODUCTOS, valoresDeOpcion } from '@/data/catalogo';

export const metadata: Metadata = {
  title: 'Nosotros',
  description:
    'Zorzal Lirio nació en 2010 en San Pedro Sula como alternativa para crear uniformes empresariales memorables. Uniformes empresariales y calzado de trabajo, con asesoría en telas, colores, presupuesto y tiempos de entrega.',
  alternates: { canonical: '/quienes-somos' },
  openGraph: {
    title: 'Nosotros · Zorzal Lirio',
    description:
      'Uniformes empresariales y calzado de trabajo desde 2010, en San Pedro Sula, Honduras.',
    url: '/quienes-somos',
  },
};

const equipo = media('equipo-oficina');
const servicio = media('servicio-detalle');

export default function QuienesSomos() {
  const telas = valoresDeOpcion('Tela', 'Telas');

  return (
    <>
      <EncabezadoPagina
        ojal="La empresa"
        titulo="Su marca, nuestra pasión"
        entrada="Nuestra pasión es su marca, y le asesoramos en todo el proceso de diseño de los uniformes en lo referente a telas, presupuesto, tiempos de entrega y combinación de colores."
      />

      <section className="seccion">
        <div className="contenedor">
          <div className="dos-columnas">
            <div className="prosa">
              <h2>Servicio</h2>
              <p>
                Nacimos en el año 2010 como una alternativa para crear uniformes empresariales
                memorables. Quisimos ir más allá de prendas genéricas y aburridas, acompañado con
                una filosofía de servicio diferencial.
              </p>
              <h2>Innovación</h2>
              <p>
                Somos una empresa innovadora en el rubro de uniformes empresariales y calzado de
                trabajo. Nuestra propuesta de valor es dar la mejor calidad al mejor precio.
                Pregunte por nuestros{' '}
                <Link href="/plan-corporativo">planes corporativos</Link>.
              </p>
              <h2>Especialidad</h2>
              <p>
                Trabajamos cuatro líneas: oficina, industrial, seguridad y salud. El catálogo
                publicado reúne {PRODUCTOS.length} referencias entre camisas formales y tipo
                columbia, polos, pantalones, gabachas médicas y calzado de trabajo, con{' '}
                {telas.length} telas publicadas para elegir.
              </p>
            </div>

            <figure className="figura-editorial figura-editorial--recorte">
              <img
                src={equipo.src}
                srcSet={equipo.srcset}
                sizes="(max-width: 880px) 92vw, 600px"
                width={equipo.width}
                height={equipo.height}
                alt="Equipo de oficina reunido alrededor de una mesa de trabajo."
                decoding="async"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="seccion seccion--blanca" aria-labelledby="t-datos-empresa">
        <div className="contenedor">
          <div className="dos-columnas dos-columnas--invertida">
            <figure className="figura-editorial figura-editorial--recorte">
              <img
                src={servicio.src}
                srcSet={servicio.srcset}
                sizes="(max-width: 880px) 92vw, 520px"
                width={servicio.width}
                height={servicio.height}
                alt="Colaborador con camisa blanca y delantal de trabajo."
                loading="lazy"
                decoding="async"
              />
            </figure>

            <div className="pila g5">
              <div className="pila g3">
                <p className="enc-seccion__ojal">Datos de la empresa</p>
                <h2 id="t-datos-empresa">Imagen, confianza y servicio</h2>
              </div>
              <dl className="ficha-datos" style={{ gap: '0.9rem 1.5rem' }}>
                <dt>Nombre comercial</dt>
                <dd>{SITIO.nombre}</dd>
                <dt>Razón social</dt>
                <dd>{SITIO.razonSocial}</dd>
                <dt>Año de inicio</dt>
                <dd>{SITIO.anioInicio}</dd>
                <dt>Actividad</dt>
                <dd>
                  Uniformes empresariales y calzado de trabajo. Asesoría de diseño, telas,
                  presupuesto, tiempos de entrega y combinación de colores.
                </dd>
                <dt>Dirección</dt>
                <dd>{DIRECCION_COMPLETA}</dd>
                <dt>Cobertura</dt>
                <dd>
                  Honduras. Según la política de entrega publicada, también se realizan envíos al
                  extranjero.
                </dd>
              </dl>
              <div className="fila g3">
                <Link href="/contacto" className="btn btn--primario">
                  Datos de contacto
                </Link>
                <Link href="/tienda" className="btn btn--secundario">
                  Ver el catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <p className="nota-datos" style={{ maxWidth: '72ch' }}>
            <span>
              <strong>Sobre esta página.</strong> Los textos reproducen lo publicado por la empresa
              en su sitio. No incluimos cantidades de clientes, de colaboradores ni de prendas
              fabricadas, ni testimonios, porque no figuran en el material disponible. Tampoco
              publicamos logotipos de terceros como referencia comercial: los que aparecían en el
              sitio anterior no venían acompañados de constancia de una relación vigente.
            </span>
          </p>
        </div>
      </section>
    </>
  );
}
