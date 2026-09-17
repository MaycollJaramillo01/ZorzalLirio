import Link from 'next/link';
import { DIRECCION_COMPLETA, LEGALES, SITIO, media } from '@/data/sitio';
import { LINEAS } from '@/data/catalogo';

const logo = media('logo-zorzal-lirio');

export function Pie() {
  return (
    <footer className="pie">
      <div className="contenedor">
        <div className="pie__reticula">
          <div>
            <div className="pie__logo">
              <img
                src={logo.src}
                srcSet={logo.srcset}
                width={logo.width}
                height={logo.height}
                alt="Zorzal Lirio"
                loading="lazy"
                style={{ height: 30, width: 'auto' }}
              />
            </div>
            <p>
              Uniformes empresariales y calzado de trabajo desde {SITIO.anioInicio}. Asesoría en
              telas, colores, presupuesto y tiempos de entrega.
            </p>
          </div>

          <div>
            <h2>Catálogo</h2>
            <ul>
              {LINEAS.filter((l) => l.id !== 'otros').map((l) => (
                <li key={l.id}>
                  <Link href={`/tienda?categoria=${l.id}`}>{l.nombre}</Link>
                </li>
              ))}
              <li>
                <Link href="/tienda">Todos los productos</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2>Empresa</h2>
            <ul>
              <li>
                <Link href="/plan-corporativo">Plan corporativo</Link>
              </li>
              <li>
                <Link href="/quienes-somos">Nosotros</Link>
              </li>
              <li>
                <Link href="/contacto">Contacto</Link>
              </li>
              <li>
                <Link href="/cotizacion">Solicitar cotización</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2>Contacto</h2>
            <ul>
              <li>{DIRECCION_COMPLETA}</li>
              {SITIO.telefonos.map((t) => (
                <li key={t}>
                  <a href={`tel:${t.replace(/[^+\d]/g, '')}`}>{t}</a>
                </li>
              ))}
              {SITIO.correos.map((c) => (
                <li key={c}>
                  <a href={`mailto:${c}`}>{c}</a>
                </li>
              ))}
              <li>
                <a href={SITIO.facebook} rel="noreferrer noopener" target="_blank">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pie__legal">
          <p>
            © {SITIO.anioInicio}–{new Date().getFullYear()} {SITIO.razonSocial}. San Pedro Sula,
            Honduras.
          </p>
          <ul className="fila g4" style={{ listStyle: 'none' }}>
            {LEGALES.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.etiqueta}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
