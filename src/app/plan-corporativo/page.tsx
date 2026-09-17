import type { Metadata } from 'next';
import Link from 'next/link';
import { EncabezadoPagina } from '@/components/EncabezadoPagina';
import { EnlaceWhatsApp } from '@/components/EnlaceWhatsApp';
import { SITIO, media } from '@/data/sitio';

export const metadata: Metadata = {
  title: 'Plan corporativo de uniformes',
  description:
    'Mantenemos el inventario de uniformes durante todo el año, gestionamos las tallas de sus colaboradores y le damos facilidades de pago sujetas a acuerdo. Para empresas con reposición recurrente.',
  alternates: { canonical: '/plan-corporativo' },
  openGraph: {
    title: 'Plan corporativo de uniformes · Zorzal Lirio',
    description:
      'Inventario de uniformes, coordinación de tallas y facilidades de pago para empresas con alta rotación.',
    url: '/plan-corporativo',
  },
};

const portada = media('plan-corporativo');
const contraste = media('polos-contraste');

const SECTORES = [
  {
    titulo: 'Maquilas',
    texto:
      'Las maquilas son una industria con uno de los índices más altos de rotación de personal y de necesidad de prendas para llevar a cabo la producción.',
  },
  {
    titulo: 'Empresas de seguridad',
    texto:
      'Además de tener que diferenciarse en imagen, las empresas de seguridad tienen grandes gastos anuales en concepto de uniformes.',
  },
  {
    titulo: 'Empresas de limpieza',
    texto:
      'Las empresas de limpieza son uno de los sectores más competitivos: para obtener una ventaja diferencial se necesitan uniformes vistosos.',
  },
];

export default function PlanCorporativo() {
  return (
    <>
      <EncabezadoPagina
        ojal="Plan corporativo"
        titulo="Imagen, confianza y servicio"
        entrada={
          <>
            La solución para empresas que invierten cada año en uniformar a sus colaboradores.
            Mantenemos el inventario, gestionamos las tallas y negociamos plazos, para que su
            empresa no inmovilice capital ni asuma la operación.
          </>
        }
      />

      <section className="seccion">
        <div className="contenedor">
          <div className="dos-columnas">
            <div className="prosa">
              <p>
                Las empresas corporativas invierten miles de lempiras en uniformes para sus
                colaboradores. Queremos ayudarle manteniendo un inventario de uniformes a lo largo
                de todo el año y dándole facilidades de pago para obtenerlo, sin necesidad de tener
                capital dormido ni las complicaciones operativas relacionadas a gestionar
                inventarios directamente.
              </p>
              <p>
                <strong>Si tiene alta rotación de personal, este es su plan.</strong> Cada propuesta
                se arma sobre el consumo real de su empresa; los plazos y precios quedan sujetos a
                evaluación y acuerdo entre las partes.
              </p>
              <div className="fila g3">
                <Link href="/cotizacion" className="btn btn--primario btn--lg">
                  Consultar plan corporativo
                </Link>
                <EnlaceWhatsApp className="btn btn--wa btn--lg" asunto="el plan corporativo">
                  Escribir por WhatsApp
                </EnlaceWhatsApp>
              </div>
              <p className="texto-nota">
                También puede llamarnos al {SITIO.telefonos[0]} o escribir a{' '}
                <a href={`mailto:${SITIO.correos[0]}`}>{SITIO.correos[0]}</a>.
              </p>
            </div>

            <figure className="figura-editorial figura-editorial--recorte">
              <img
                src={portada.src}
                srcSet={portada.srcset}
                sizes="(max-width: 880px) 92vw, 600px"
                width={portada.width}
                height={portada.height}
                alt="Dos colaboradores con camisas tipo polo blancas y pantalón caqui en un corredor de oficina."
                decoding="async"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="seccion seccion--blanca" aria-labelledby="t-beneficios">
        <div className="contenedor">
          <div className="enc-seccion">
            <p className="enc-seccion__ojal">Cómo funciona</p>
            <h2 id="t-beneficios">Tres beneficios concretos</h2>
            <p className="enc-seccion__texto">
              Son los beneficios que la empresa publica en su plan corporativo. El alcance de cada
              uno se define en la propuesta.
            </p>
          </div>

          <ul className="lista-pasos lista-pasos--dos">
            <li>
              <div>
                <h3>Inventarios</h3>
                <p>
                  Nos encargamos de manejar su inventario de uniformes. Si tiene alta rotación,
                  este beneficio le permitirá mucho ahorro operativo.
                </p>
              </div>
            </li>
            <li>
              <div>
                <h3>Gestión de tallas</h3>
                <p>
                  Gestionamos las tallas directamente con sus colaboradores, para que su área de
                  recursos humanos no tenga que levantar y consolidar la información.
                </p>
              </div>
            </li>
            <li>
              <div>
                <h3>Facilidades de pago</h3>
                <p>
                  El plan corporativo le permite negociar plazos y precios. Las condiciones quedan
                  sujetas a evaluación y acuerdo con su empresa.
                </p>
              </div>
            </li>
            <li>
              <div>
                <h3>Reposición durante el año</h3>
                <p>
                  Atendemos necesidades recurrentes: nuevas incorporaciones, cambios de talla y
                  reposición de prendas desgastadas, sin volver a empezar el proceso cada vez.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="seccion" aria-labelledby="t-sectores">
        <div className="contenedor">
          <div className="dos-columnas dos-columnas--invertida">
            <figure className="figura-editorial figura-editorial--recorte">
              <img
                src={contraste.src}
                srcSet={contraste.srcset}
                sizes="(max-width: 880px) 92vw, 600px"
                width={contraste.width}
                height={contraste.height}
                alt="Dos colaboradores con camisas tipo polo negras y grises con vivos de contraste."
                loading="lazy"
                decoding="async"
              />
            </figure>

            <div className="pila g5">
              <div className="pila g3">
                <p className="enc-seccion__ojal">A quién atiende</p>
                <h2 id="t-sectores">Sectores para los que hemos preparado propuestas</h2>
              </div>
              <ul className="lista-pasos">
                {SECTORES.map((s) => (
                  <li key={s.titulo}>
                    <div>
                      <h3>{s.titulo}</h3>
                      <p>{s.texto}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="texto-aux">
                Si su empresa no está en esta lista, contáctenos igualmente: el plan se arma según
                el volumen y la frecuencia de reposición.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="seccion cierre" aria-labelledby="t-cierre-plan">
        <div className="contenedor">
          <div className="dos-columnas">
            <div className="pila g4">
              <p className="enc-seccion__ojal">Siguiente paso</p>
              <h2 id="t-cierre-plan">Preparamos una propuesta con sus números</h2>
              <p className="cierre__texto">
                Cuéntenos cuántos colaboradores debe uniformar, con qué frecuencia repone y en qué
                línea trabaja. Con eso podemos plantear el plan.
              </p>
              <div className="fila g3" style={{ marginTop: '0.5rem' }}>
                <Link href="/cotizacion" className="btn btn--primario btn--lg">
                  Consultar plan corporativo
                </Link>
                <Link href="/tienda" className="btn btn--secundario btn--lg">
                  Ver el catálogo
                </Link>
              </div>
            </div>
            <ul className="cierre__lista">
              <li>Número de colaboradores por área y por línea de uniforme.</li>
              <li>Frecuencia de reposición a lo largo del año.</li>
              <li>Personalización requerida: colores corporativos, bordados, detalles.</li>
              <li>Condiciones de pago que necesita evaluar.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
