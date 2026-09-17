'use client';

import { useId, useState } from 'react';

interface Props {
  readonly valor: number;
  readonly maximo: number;
  readonly etiqueta: string;
  readonly onCambio: (valor: number) => void;
}

/** Cantidad con botones de ±1 y entrada numérica.  Mínimo 1. */
export function SelectorCantidad({ valor, maximo, etiqueta, onCambio }: Props) {
  const id = useId();
  const [borrador, setBorrador] = useState<string | null>(null);

  function confirmar(texto: string) {
    const n = Number.parseInt(texto, 10);
    onCambio(Number.isFinite(n) ? Math.max(1, Math.min(n, maximo)) : 1);
    setBorrador(null);
  }

  return (
    <div className="campo">
      <label className="campo-etiqueta" htmlFor={id}>
        {etiqueta}
      </label>
      <div className="cantidad">
        <button
          type="button"
          onClick={() => {
            onCambio(Math.max(1, valor - 1));
          }}
          disabled={valor <= 1}
        >
          <span aria-hidden="true">−</span>
          <span className="solo-lectores">Quitar una unidad</span>
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={1}
          max={maximo}
          step={1}
          value={borrador ?? String(valor)}
          onChange={(e) => {
            setBorrador(e.target.value);
          }}
          onBlur={(e) => {
            confirmar(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              confirmar(e.currentTarget.value);
            }
          }}
        />
        <button
          type="button"
          onClick={() => {
            onCambio(Math.min(maximo, valor + 1));
          }}
          disabled={valor >= maximo}
        >
          <span aria-hidden="true">+</span>
          <span className="solo-lectores">Agregar una unidad</span>
        </button>
      </div>
    </div>
  );
}
