import type { ReactNode } from 'react';

interface Props {
  readonly ojal: string;
  readonly titulo: string;
  readonly entrada?: ReactNode;
}

export function EncabezadoPagina({ ojal, titulo, entrada }: Props) {
  return (
    <section className="seccion--compacta" style={{ paddingTop: 'var(--e6)', paddingBottom: 0 }}>
      <div className="contenedor">
        <div className="enc-seccion" style={{ marginBottom: 0 }}>
          <p className="enc-seccion__ojal">{ojal}</p>
          <h1>{titulo}</h1>
          {entrada !== undefined ? <p className="enc-seccion__texto">{entrada}</p> : null}
        </div>
      </div>
    </section>
  );
}
