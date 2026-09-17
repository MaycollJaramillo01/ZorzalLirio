'use client';

import { usePathname } from 'next/navigation';
import { enlaceWhatsApp, mensajeGeneral } from '@/lib/whatsapp';

/**
 * Acceso directo a WhatsApp.  Se oculta en /cotizacion y en las fichas, donde
 * ya existe un botón de cotización con el mensaje del producto: así no queda
 * un control flotante encima de otro.
 */
export function BotonWhatsApp() {
  const ruta = usePathname();
  if (ruta.startsWith('/cotizacion') || ruta.startsWith('/tienda/')) return null;

  return (
    <a
      className="wa-flotante"
      href={enlaceWhatsApp(mensajeGeneral())}
      target="_blank"
      rel="noreferrer noopener"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.18.2-.35.22-.65.07-.3-.15-1.13-.42-2.15-1.33-.8-.71-1.33-1.59-1.48-1.89-.15-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.6-.93-2.19-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.09 3.19 5.07 4.35.71.3 1.26.48 1.69.62.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.31.18-1.43-.08-.13-.28-.2-.58-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.18 4.22-9.4 9.42-9.4a9.34 9.34 0 0 1 6.65 2.76 9.32 9.32 0 0 1 2.76 6.65c0 5.19-4.23 9.41-9.42 9.41zM20.47 3.53A11.36 11.36 0 0 0 12.05 0C5.7 0 .53 5.16.53 11.5c0 2.02.53 3.99 1.53 5.73L0 24l6.94-1.82a11.5 11.5 0 0 0 5.1 1.23h.01c6.34 0 11.51-5.16 11.51-11.5 0-3.07-1.2-5.96-3.09-8.38z" />
      </svg>
      <span>Cotizar por WhatsApp</span>
      <span className="solo-lectores">
        Se abre WhatsApp con un mensaje preparado. Puede revisarlo antes de enviarlo.
      </span>
    </a>
  );
}
