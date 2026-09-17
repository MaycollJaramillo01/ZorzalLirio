import type { Metadata, Viewport } from 'next';
import { Archivo, Inter } from 'next/font/google';
import './globals.css';
import { Cabecera } from '@/components/Cabecera';
import { Pie } from '@/components/Pie';
import { BotonWhatsApp } from '@/components/BotonWhatsApp';
import { SITIO } from '@/data/sitio';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-archivo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITIO.url),
  title: {
    default: 'Zorzal Lirio · Uniformes empresariales en San Pedro Sula',
    template: '%s · Zorzal Lirio',
  },
  description: SITIO.descripcion,
  applicationName: SITIO.nombre,
  authors: [{ name: SITIO.razonSocial }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_HN',
    siteName: SITIO.nombre,
    title: 'Zorzal Lirio · Uniformes empresariales en San Pedro Sula',
    description: SITIO.descripcion,
    url: '/',
    images: [{ url: '/media/editorial/hero-industrial-1280.webp', width: 1280, height: 914 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zorzal Lirio · Uniformes empresariales en San Pedro Sula',
    description: SITIO.descripcion,
    images: ['/media/editorial/hero-industrial-1280.webp'],
  },
  icons: {
    icon: [{ url: '/media/marca/marca-zorzal-640.webp', type: 'image/webp' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#f6f4ef',
  width: 'device-width',
  initialScale: 1,
};

/** Datos estructurados del negocio: sólo información verificada en la fuente. */
const datosNegocio = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: SITIO.nombre,
  legalName: SITIO.razonSocial,
  description: SITIO.descripcion,
  url: SITIO.url,
  foundingDate: String(SITIO.anioInicio),
  telephone: SITIO.telefonos,
  email: SITIO.correos,
  sameAs: [SITIO.facebook],
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITIO.direccion.calle,
    addressLocality: SITIO.direccion.ciudad,
    addressRegion: SITIO.direccion.departamento,
    addressCountry: 'HN',
  },
  areaServed: { '@type': 'Country', name: 'Honduras' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-HN" className={`${archivo.variable} ${inter.variable}`}>
      <body>
        <a className="salto-contenido" href="#contenido">
          Ir al contenido
        </a>
        <Cabecera />
        <main id="contenido" className="margen-flotante">
          {children}
        </main>
        <Pie />
        <BotonWhatsApp />
        <script
          type="application/ld+json"
          // Datos del negocio verificados contra el material extraído.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datosNegocio) }}
        />
      </body>
    </html>
  );
}
