import type { Metadata } from 'next';
import Link from 'next/link';
import { EncabezadoPagina } from '@/components/EncabezadoPagina';
import { SITIO, TELEFONOS_EN_POLITICAS } from '@/data/sitio';

export const metadata: Metadata = {
  title: 'Política de entrega',
  description:
    'Formas y condiciones de pago, direcciones y tiempos de entrega publicados por Distribuidora Zorzal Lirio para envíos en Honduras y al extranjero.',
  alternates: { canonical: '/politica-de-entrega' },
};

const correo = SITIO.correos[1] ?? SITIO.correos[0];

const PLAZOS = [
  { plazo: '2 a 3 días hábiles', zona: 'Dentro de Tegucigalpa y San Pedro Sula' },
  { plazo: '3 a 5 días hábiles', zona: 'En el resto del territorio nacional' },
  { plazo: 'Menor a 30 días', zona: 'En el extranjero (fuera de Honduras)' },
];

export default function PoliticaDeEntrega() {
  return (
    <>
      <EncabezadoPagina
        ojal="Documento legal"
        titulo="Política de entrega"
        entrada="Texto publicado por Distribuidora Zorzal Lirio. Se reproduce en su contenido sustantivo, sin añadir ni quitar plazos ni condiciones."
      />

      <section className="seccion">
        <div className="contenedor">
          <div className="prosa">
            <h2>Formas y condiciones de pago</h2>
            <p>
              Para pagos con tarjeta de crédito o PayPal tendrás la opción de poder recibir los
              productos en el domicilio que hayas proporcionado (aplican cargos de envío) dentro
              del territorio nacional de Honduras o al extranjero.
            </p>
            <p>
              Las compras a domicilio solo pueden ser entregadas a nivel nacional (Honduras) e
              internacional; los precios por envíos varían dependiendo del tipo de producto o del
              área y/o domicilio donde se realice la entrega y país.
            </p>

            <h2>Direcciones y tiempos de entrega</h2>
            <p>
              Es requisito del usuario proporcionar la dirección del domicilio exacta para hacer la
              entrega del producto. Si la dirección proporcionada no es veraz, es incorrecta,
              inexacta, ilocalizable o desactualizada, DISTRIBUIDORA ZORZAL LIRIO no se hace
              responsable por la entrega del producto en su domicilio, por lo que el cliente o
              beneficiario deberá en tal caso comunicarse a nuestro correo electrónico{' '}
              <a href={`mailto:${correo}`}>{correo}</a> y corregir la dirección, incurriendo en
              nuevos costos de transportación si aplica.
            </p>

            <p>Los tiempos de entrega serán de la siguiente manera:</p>
            <dl className="ficha-datos" style={{ fontSize: 'var(--t-base)', gap: '0.8rem 2rem' }}>
              {PLAZOS.map((p) => (
                <div key={p.plazo} style={{ display: 'contents' }}>
                  <dt style={{ color: 'var(--carbon)', fontWeight: 600 }}>{p.plazo}</dt>
                  <dd>{p.zona}</dd>
                </div>
              ))}
            </dl>

            <p>
              DISTRIBUIDORA ZORZAL LIRIO se reserva el derecho de no entregar pedidos en domicilios
              que se encuentren en zonas que DISTRIBUIDORA ZORZAL LIRIO o las empresas de mensajería
              tipifiquen como zonas de alto riesgo; en estos casos la entrega no se realizará y se
              procederá a hacer un reembolso íntegro del cobro en tarjeta de crédito.
            </p>
            <p>
              Los tiempos de entrega antes descritos iniciarán cuando el pago de la transacción ha
              sido confirmado.
            </p>

            <h2>Identificación al recibir</h2>
            <p>
              Al momento de hacer entrega de los productos, la persona (usuario y/o beneficiario)
              que reciba la entrega en Honduras deberá presentar la tarjeta de identidad original,
              licencia de conducir, carné de residencia o pasaporte. Fuera de Honduras no se
              requiere ningún documento para poder realizar la entrega.
            </p>
            <p>
              En caso que al usuario y/o beneficiario del producto en Honduras no le fuere posible
              recibirlo, autorizará a un tercero notificando su identidad a DISTRIBUIDORA ZORZAL
              LIRIO vía correo electrónico a <a href={`mailto:${correo}`}>{correo}</a> o
              comunicándose a los números telefónicos {TELEFONOS_EN_POLITICAS.join(' | ')}.
            </p>
            <p>
              Al momento de la entrega, la persona autorizada debe presentar los siguientes
              documentos: tarjeta de identidad o identificación válida, nota de autorización y
              fotocopia de la tarjeta de identidad del usuario y/o beneficiario en Honduras. Aplica
              únicamente para entrega a domicilio en Honduras.
            </p>
            <p>
              Si en el acto de la entrega el producto solicitado no es recibido por el usuario y/o
              beneficiario, el producto no será entregado a ninguna persona que no esté previamente
              autorizada, procediendo DISTRIBUIDORA ZORZAL LIRIO a notificar vía correo electrónico
              al usuario y/o beneficiario que no se encontró al responsable de recibirlo, y se
              acordará el retiro del producto, pudiendo incurrir en costos adicionales de transporte
              si DISTRIBUIDORA ZORZAL LIRIO así lo requiere.
            </p>
            <p>
              DISTRIBUIDORA ZORZAL LIRIO se reserva el derecho de restringir el envío a domicilio en
              zonas del territorio hondureño.
            </p>

            <hr className="regla" />

            <p className="nota-datos">
              <span>
                <strong>Notas de esta versión del sitio.</strong> Esta política fue redactada para
                una tienda con pago en línea. El sitio actual no tiene pasarela de pago: el flujo es
                de <Link href="/cotizacion">solicitud de cotización</Link>, y las condiciones de
                pago y entrega de cada pedido se acuerdan por escrito. Los teléfonos citados aquí
                ({TELEFONOS_EN_POLITICAS.join(' y ')}) son distintos de los publicados en la{' '}
                <Link href="/contacto">página de contacto</Link>; se conservan ambos tal como se
                publicaron.
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
