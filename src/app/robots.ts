import type { MetadataRoute } from 'next';
import { SITIO } from '@/data/sitio';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /cotizacion depende del estado del navegador: no aporta a la indexación.
        disallow: ['/cotizacion'],
      },
    ],
    sitemap: `${SITIO.url}/sitemap.xml`,
    host: SITIO.url,
  };
}
