/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Imágenes ya optimizadas en build de recursos (scripts/prepare_media.py) y servidas con <img srcset>.
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: '/catalogo', destination: '/tienda', permanent: true },
      { source: '/tienda/page/:page', destination: '/tienda', permanent: true },
      { source: '/Contact-Us', destination: '/contacto', permanent: true },
      { source: '/contact-us', destination: '/contacto', permanent: true },
      { source: '/multi-product-funnel/seguridad', destination: '/tienda?categoria=seguridad', permanent: true },
      { source: '/blog', destination: '/', permanent: true },
      { source: '/politica-de-cancelacion-y-reembolso', destination: '/politica-de-reembolso', permanent: true },
      { source: '/nosotros', destination: '/quienes-somos', permanent: true },
    ];
  },
};

export default nextConfig;
