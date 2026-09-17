import type { MetadataRoute } from 'next';
import { EXTRAIDO_EL, PRODUCTOS } from '@/data/catalogo';
import { SITIO } from '@/data/sitio';

const ACTUALIZADO = new Date(`${EXTRAIDO_EL}T12:00:00Z`);

export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = [
    { url: '/', priority: 1, changeFrequency: 'monthly' },
    { url: '/tienda', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/plan-corporativo', priority: 0.8, changeFrequency: 'yearly' },
    { url: '/quienes-somos', priority: 0.6, changeFrequency: 'yearly' },
    { url: '/contacto', priority: 0.7, changeFrequency: 'yearly' },
    { url: '/politica-de-privacidad', priority: 0.2, changeFrequency: 'yearly' },
    { url: '/politica-de-entrega', priority: 0.2, changeFrequency: 'yearly' },
    { url: '/politica-de-reembolso', priority: 0.2, changeFrequency: 'yearly' },
  ] as const;

  const paginas: MetadataRoute.Sitemap = rutas.map((r) => ({
    url: `${SITIO.url}${r.url}`,
    lastModified: ACTUALIZADO,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const fichas: MetadataRoute.Sitemap = PRODUCTOS.map((p) => ({
    url: `${SITIO.url}/tienda/${p.slug}`,
    lastModified: ACTUALIZADO,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...paginas, ...fichas];
}
