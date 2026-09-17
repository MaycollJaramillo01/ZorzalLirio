'use client';

import { useId, useState } from 'react';
import { enlaceWhatsApp } from '@/lib/whatsapp';

interface Props {
  readonly mensaje: string;
  readonly textoBoton: string;
  readonly claseBoton?: string;
  readonly deshabilitado?: boolean;
}

/**
 * Muestra el mensaje exacto que se enviará y sólo entonces abre WhatsApp.
 * No hay backend de formularios: abrir el enlace no confirma nada, así que
 * nunca se anuncia una solicitud como enviada.
 */
export function VistaPreviaWhatsApp({
  mensaje,
  textoBoton,
  claseBoton = 'btn btn--primario',
  deshabilitado = false,
}: Props) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <div className="pila g3">
      <button
        type="button"
        className={claseBoton}
        aria-expanded={visible}
        aria-controls={id}
        disabled={deshabilitado}
        onClick={() => {
          setVisible((v) => !v);
        }}
      >
        {visible ? 'Ocultar el mensaje' : textoBoton}
      </button>

      <p className="texto-nota">
        Al continuar se abre WhatsApp con la solicitud ya escrita. Puede revisarla y modificarla
        antes de enviarla; la solicitud no se registra hasta que usted la envía.
      </p>

      <div className="previo" id={id} hidden={!visible}>
        <p className="campo-etiqueta">Mensaje que se enviará</p>
        <pre>{mensaje}</pre>
        <a
          className="btn btn--primario"
          href={enlaceWhatsApp(mensaje)}
          target="_blank"
          rel="noreferrer noopener"
        >
          Abrir WhatsApp con este mensaje
        </a>
      </div>
    </div>
  );
}
