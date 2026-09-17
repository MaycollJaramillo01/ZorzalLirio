import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const config = [
  { ignores: ['.next/**', 'out/**', 'node_modules/**', 'public/**'] },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // Las imágenes del catálogo ya vienen optimizadas por scripts/prepare_media.py
      // y se sirven con <img srcset>: no se usa next/image.
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;
