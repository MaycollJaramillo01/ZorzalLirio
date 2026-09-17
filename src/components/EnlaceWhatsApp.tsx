'use client';

import type { ReactNode } from 'react';
import { enlaceWhatsApp, mensajeGeneral } from '@/lib/whatsapp';

interface Props {
  readonly children: ReactNode;
  readonly className?: string;
  /** Tema del mensaje, p. ej. «el plan corporativo». */
  readonly asunto?: string;
}

/**
 * Enlace a WhatsApp con un mensaje general preparado.  El enlace se arma en el
 * cliente para que la URL de las fichas apunte al dominio real donde se
 * publique el sitio.
 */
export function EnlaceWhatsApp({ children, className, asunto }: Props) {
  return (
    <a
      className={className}
      href={enlaceWhatsApp(mensajeGeneral(asunto))}
      target="_blank"
      rel="noreferrer noopener"
    >
      {children}
      <span className="solo-lectores">
        {' '}
        Se abre WhatsApp con un mensaje preparado que puede revisar antes de enviarlo.
      </span>
    </a>
  );
}
