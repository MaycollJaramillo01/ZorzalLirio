import type { Metadata } from 'next';
import { FormularioCotizacion } from '@/components/FormularioCotizacion';
import { SITIO } from '@/data/sitio';

export const metadata: Metadata = {
  title: 'Solicitar cotización de uniformes',
  description:
    'Arme su lista de uniformes, indique cantidades y opciones, y envíenos la solicitud por WhatsApp. Zorzal Lirio, San Pedro Sula.',
  alternates: { canonical: '/cotizacion' },
  robots: { index: false, follow: true },
};

export default function Cotizacion() {
  return (
    <section className="seccion--compacta" style={{ paddingTop: 'var(--e6)' }}>
      <div className="contenedor">
        <div className="enc-seccion" style={{ marginBottom: 'var(--e6)' }}>
          <p className="enc-seccion__ojal">Solicitud de cotización</p>
          <h1>Su solicitud de cotización</h1>
          <p className="enc-seccion__texto">
            Revise los artículos, ajuste cantidades y complete sus datos. Le responderemos con
            precio, telas disponibles y plazo de entrega. También puede llamarnos al{' '}
            {SITIO.telefonos[0]}.
          </p>
        </div>

        <FormularioCotizacion />
      </div>
    </section>
  );
}
