import type { Metadata } from 'next';
import Link from 'next/link';
import { EncabezadoPagina } from '@/components/EncabezadoPagina';
import { SITIO, TELEFONOS_EN_POLITICAS } from '@/data/sitio';

export const metadata: Metadata = {
  title: 'Política de cancelación y reembolso',
  description:
    'Condiciones de devolución de mercadería, cambios de artículos, reintegro a tarjeta de crédito o débito y reversión de pagos publicadas por Distribuidora Zorzal Lirio.',
  alternates: { canonical: '/politica-de-reembolso' },
};

const correo = SITIO.correos[1] ?? SITIO.correos[0];
const telefonoAtencion = TELEFONOS_EN_POLITICAS[0];

export default function PoliticaDeReembolso() {
  return (
    <>
      <EncabezadoPagina
        ojal="Documento legal"
        titulo="Política de cancelación y reembolso"
        entrada="Texto publicado por Distribuidora Zorzal Lirio. Se reproduce en su contenido sustantivo, sin añadir ni quitar plazos ni condiciones."
      />

      <section className="seccion">
        <div className="contenedor">
          <div className="prosa">
            <p>
              Bienvenidos a www.zorzallirio.com. Por favor, lea las políticas relacionadas a la
              devolución de mercadería que se describen a continuación. Estas se aplicarán para la
              navegación del sitio de internet www.zorzallirio.com y los servicios ofrecidos en él.
            </p>

            <h2>Devolución de mercadería</h2>
            <p>
              Como parte de nuestro servicio al cliente se ofrece la opción de cambios y
              devoluciones de mercadería cuando el cliente desea devolver o cambiar el producto
              comprado por motivos que el artículo presenta algún desperfecto de fábrica, o por el
              tamaño o color del artículo, o alguna variación en cuanto a los términos de
              adquisición por parte del cliente.
            </p>

            <h2>1. Devoluciones</h2>
            <p>
              Las devoluciones deben ser autorizadas por uno de los colaboradores de servicio al
              cliente de Distribuidora Zorzal Lirio, así como aprobadas por un supervisor, y deben
              ser solicitadas por el cliente al correo{' '}
              <a href={`mailto:${correo}`}>{correo}</a> por motivos que el artículo presenta algún
              desperfecto de fábrica, o por el tamaño o color del artículo, o alguna variación en
              cuanto a los términos de adquisición por parte del cliente, detallando los motivos de
              la misma y que aplique.
            </p>
            <p>
              Las devoluciones de los artículos deben hacerse dentro del período de 30 a 90 días
              hábiles. Los reembolsos son únicamente realizados directamente al tarjetahabiente; no
              se hacen reembolsos en efectivo.
            </p>

            <h2>2. Cambios de artículos</h2>
            <p>
              Se denomina cambio de artículo al cambio por uno de las mismas características e
              igual precio. Si el cliente desea llevarse otro de precio mayor, deberá cancelar la
              diferencia de éste. Aplica por defectos de fábrica irreparables o porque el cliente
              desea cambiarlo de color y tamaño.
            </p>
            <p>A continuación se detallan las políticas a tener en cuenta para realizar un cambio:</p>
            <ul>
              <li>
                Se aceptarán cambios de artículos por defectos de fábrica o por cambio de opinión
                del cliente.
              </li>
              <li>
                Si un cliente desea efectuar un cambio deberá presentar el correo del detalle del
                pedido de dicho artículo (en físico o digital); de lo contrario no se podrá efectuar
                la transacción. El cliente deberá expresar su deseo de cambiar el artículo mediante
                correo a <a href={`mailto:${correo}`}>{correo}</a>, enviando así mismo el detalle
                del pedido.
              </li>
              <li>
                Los cambios deben efectuarse sobre artículos vendidos o que se estén vendiendo en la
                tienda en línea.
              </li>
              <li>
                Los cambios por desperfecto de fábrica deben ser autorizados por un agente de
                servicio al cliente y revisados por un supervisor, previa revisión de este último.
              </li>
              <li>
                Es responsabilidad del taller de Distribuidora Zorzal Lirio identificar si el
                artículo a reparar es por defecto de fábrica o porque el cliente hizo mal uso de él.
              </li>
              <li>
                Todo cambio de artículo deberá ser enviado a la misma dirección donde fue solicitado
                el artículo original de la compra.
              </li>
              <li>
                Se efectuará cambio del artículo sólo si se hace por uno de la misma marca y modelo,
                o de diferente marca y modelo pero igual precio; y si el cliente desea llevarse otro
                de precio mayor deberá cancelar la diferencia de éste.
              </li>
            </ul>

            <h2>Reintegro a tarjeta de crédito y/o débito</h2>
            <p>
              Una vez anulado el pedido realizado, se solicitará el reintegro al tarjetahabiente del
              pago efectuado. Este puede variar según el banco emisor de la tarjeta, siendo efectivo
              dentro de un periodo de 30 días hábiles.
            </p>
            <p>
              La solicitud del reintegro a la tarjeta de crédito y/o débito se realizará una vez que
              el cliente requiera de dicho servicio.
            </p>
            <p>
              El servicio de reintegro puede ser solicitado a través del número de teléfono de
              atención al cliente: {telefonoAtencion} a nivel nacional, o al correo electrónico{' '}
              <a href={`mailto:${correo}`}>{correo}</a>.
            </p>

            <h2>3. Reversión de pago de cuotas de créditos</h2>
            <p>
              En caso de requerir asistencia para reversión de pagos o cancelaciones totales de
              crédito, puede ser solicitado a través del número de teléfono de atención al cliente:{' '}
              {telefonoAtencion} en horas de oficina.
            </p>

            <hr className="regla" />

            <p className="nota-datos">
              <span>
                <strong>Notas de esta versión del sitio.</strong> El texto original numera dos
                secciones distintas como «2» (cambios de artículos y reintegro a tarjeta); aquí se
                mantiene el orden publicado y se deja el reintegro sin número para poder leerlo. La
                política está redactada para una tienda en línea con pago por tarjeta; el sitio
                actual no tiene pasarela de pago y funciona con{' '}
                <Link href="/cotizacion">solicitudes de cotización</Link>. El teléfono citado (
                {telefonoAtencion}) es distinto de los publicados en la{' '}
                <Link href="/contacto">página de contacto</Link>.
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
