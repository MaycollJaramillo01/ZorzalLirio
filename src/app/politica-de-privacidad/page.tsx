import type { Metadata } from 'next';
import { EncabezadoPagina } from '@/components/EncabezadoPagina';
import { SITIO } from '@/data/sitio';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description:
    'Política de privacidad de Distribuidora Zorzal Lirio: uso de los datos de clientes, cookies, tratamiento de datos de tarjetas y canales de consulta.',
  alternates: { canonical: '/politica-de-privacidad' },
};

export default function PoliticaDePrivacidad() {
  return (
    <>
      <EncabezadoPagina
        ojal="Documento legal"
        titulo="Política de privacidad"
        entrada="Texto publicado por Distribuidora Zorzal Lirio. Se reproduce en su contenido sustantivo, sin añadir ni quitar condiciones."
      />

      <section className="seccion">
        <div className="contenedor">
          <div className="prosa">
            <p>
              Distribuidora Zorzal Lirio y sus sitios web autorizados respetan la confidencialidad
              de todos los datos relativos a visitantes y/o clientes según esta política.
            </p>
            <p>
              Los datos entregados por nuestros clientes o recolectados en nuestra página web y
              demás canales digitales autorizados, se usarán sólo con fines de registro, trámite de
              ventas, garantías de fábrica y para envío de información promocional sobre los
              productos, servicios y beneficios que comercializa nuestra empresa.
            </p>
            <p>
              Al navegar en nuestro sitio web el cliente acepta que utilicemos los datos
              almacenados.
            </p>

            <h2>Cookies y tecnologías de identificación</h2>
            <p>
              Zorzal Lirio utiliza cookies y otras tecnologías de identificación en las apps, los
              sitios web, los correos electrónicos y demás canales digitales autorizados para fines
              comerciales, identificar tendencias de navegación del visitante y/o cliente, buscando
              mejorar, facilitar y personalizar su navegación y acceso en el futuro. Las cookies
              también están destinadas a recordar la información que se ha introducido previamente
              en cualquier formulario.
            </p>
            <p>
              Para fines informativos, las cookies son pequeños archivos de texto que los sitios
              web, las apps, los medios en línea y los anuncios almacenan en su navegador o
              dispositivo.
            </p>

            <h2>Datos de tarjetas de crédito</h2>
            <p>
              Los datos y/o información referente a tarjetas de crédito serán manejados solamente
              por la empresa con quienes mantenga una relación comercial vigente para la
              realización de venta a través de tarjetas de crédito en los diferentes países donde
              operamos. Por lo que nuestro servidor no capturará dichos datos, sólo registrará los
              datos del comprador y de la operación de venta realizada.
            </p>

            <h2>Seguridad de la información</h2>
            <p>
              Para garantizar la protección de privacidad y confidencialidad de la información, el
              Sitio Web aplica medidas tales como certificado SSL, el cual permite establecer un
              canal de comunicación seguro entre el comprador y nuestro servidor, encriptando la
              información transmitida por Internet entre ellos.
            </p>

            <h2>Modificaciones</h2>
            <p>
              Distribuidora Zorzal Lirio S. de R.L. se reserva el derecho de efectuar, en cualquier
              momento, modificaciones o actualizaciones a esta Política de Cookies para la atención
              de novedades legislativas, políticas internas o nuevos requerimientos para la
              prestación u ofrecimiento de productos o servicios, por lo que se recomienda al
              cliente revisarla frecuentemente, con el objetivo de estar adecuadamente informados
              sobre cómo y para qué utilizamos las cookies.
            </p>

            <h2>Consultas</h2>
            <p>
              Para consultas o dudas adicionales, ponemos a su disposición nuestros canales de
              contacto, los cuales son los siguientes:{' '}
              <a href={`mailto:${SITIO.correos[1] ?? SITIO.correos[0]}`}>
                {SITIO.correos[1] ?? SITIO.correos[0]}
              </a>{' '}
              o enviar un formulario de contacto a: zorzallirio.com/Contact-Us.
            </p>

            <hr className="regla" />

            <p className="nota-datos">
              <span>
                <strong>Nota de esta versión del sitio.</strong> El sitio actual no cuenta con
                formulario de contacto propio ni con pasarela de pago: la solicitud de cotización
                se envía por WhatsApp y el sitio no almacena sus datos personales. Los datos que
                escriba en el formulario de cotización viven únicamente en su navegador durante la
                sesión y viajan dentro del mensaje que usted envía. La dirección
                «zorzallirio.com/Contact-Us» citada arriba corresponde a la página de contacto, hoy
                publicada en /contacto.
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
