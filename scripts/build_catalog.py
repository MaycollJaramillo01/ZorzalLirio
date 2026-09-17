#!/usr/bin/env python3
"""Genera src/data/catalogo.json a partir de la extraccion original.

Une tres fuentes:
  1. datos/extraccion.json  -> ids, nombres, precios, opciones, variantes, URLs
  2. src/data/media-manifest.json -> rutas y dimensiones reales de las imagenes
  3. la tabla MAPEO de este archivo -> que imagen corresponde a cada producto,
     su texto alternativo y las notas de inconsistencia del material de origen

No inventa datos: lo que la tienda no publica queda en null.

Uso:  python scripts/build_catalog.py
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
MANIFIESTO = RAIZ / "src" / "data" / "media-manifest.json"
SALIDA = RAIZ / "src" / "data" / "catalogo.json"

LINEAS_POR_SLUG = {
    "oficina": "oficina",
    "industrial": "industrial",
    "seguridad": "seguridad",
    "salud": "salud",
}

# id -> (imagenes [(clave manifiesto, alt)], lineas, nota, es_linea_principal)
MAPEO: dict[int, dict[str, object]] = {
    35: {
        "imagenes": [],
        "lineas": ["otros"],
        "principal": False,
        "nota": (
            "La única imagen que la tienda original asocia a esta ficha es el logotipo de "
            "«Green Building Group S.A.S», que no corresponde al artículo. No se publica "
            "ninguna fotografía en su lugar. La tienda lo clasifica en «Oficina»; aquí se "
            "lista fuera de las líneas de uniformes para no presentarlo como especialidad."
        ),
    },
    34: {
        "imagenes": [
            (
                "audifonos-panasonic",
                "Audífonos inalámbricos Panasonic blancos junto a su estuche de carga.",
            )
        ],
        "lineas": ["otros"],
        "principal": False,
        "nota": (
            "La ficha original asocia dos imágenes más que no corresponden al producto: una "
            "gorra negra con la palabra «Security» y el logotipo de «V-KOOL». No se muestran."
        ),
    },
    30: {
        "imagenes": [
            (
                "camisa-seguridad-manga-larga-1",
                "Camisa blanca de seguridad manga larga con charreteras y bolsillos de tapa "
                "negros, vista de frente.",
            ),
            (
                "camisa-seguridad-manga-larga-2",
                "La misma camisa de seguridad manga larga vista de tres cuartos.",
            ),
            (
                "camisa-seguridad-manga-larga-3",
                "La misma camisa de seguridad manga larga vista de espalda.",
            ),
        ],
        "lineas": ["seguridad"],
        "principal": True,
        "nota": (
            "Las tres vistas son fotogramas del GIF animado que publica la ficha original "
            "(6,7 MB). No se generó ninguna imagen nueva. Lleva el mismo nombre publicado "
            "que el artículo ID 24, con distinto precio y distinta descripción."
        ),
    },
    29: {
        "imagenes": [
            (
                "camisa-polo-algodon",
                "Camisa tipo polo de algodón con logotipo bordado en el pecho, mostrada en "
                "gris y en azul.",
            )
        ],
        "lineas": ["oficina", "seguridad"],
        "principal": True,
        "nota": (
            "Comparte nombre, precio, descripción y fotografía con el artículo ID 11. La "
            "tienda original los publica como dos fichas distintas y así se conservan."
        ),
    },
    28: {
        "imagenes": [
            (
                "pantalon-formal",
                "Pantalón formal negro de vestir, presentado con camisa blanca y zapatos "
                "de vestir.",
            )
        ],
        "lineas": ["oficina", "seguridad"],
        "principal": True,
        "nota": None,
    },
    27: {
        "imagenes": [
            (
                "pantalon-ranger",
                "Pantalón de trabajo negro tipo ranger con refuerzo doble en las rodillas.",
            )
        ],
        "lineas": ["seguridad"],
        "principal": True,
        "nota": (
            "La fotografía publicada muestra la etiqueta de un fabricante ajeno. Se conserva "
            "porque es la imagen que publica la tienda original."
        ),
    },
    24: {
        "imagenes": [
            (
                "camisa-seguridad-bordada",
                "Camisa blanca de seguridad manga larga con charreteras y parches bordados "
                "en los hombros y el pecho.",
            )
        ],
        "lineas": ["seguridad"],
        "principal": True,
        "nota": (
            "Lleva el mismo nombre publicado que el artículo ID 30, con distinto precio y "
            "distinta descripción. La fotografía publicada mide 500 × 500 px."
        ),
    },
    20: {
        "imagenes": [
            (
                "gabacha-medica",
                "Gabacha médica blanca de manga larga sobre pantalón oscuro.",
            )
        ],
        "lineas": ["salud"],
        "principal": True,
        "nota": (
            "La fotografía publicada mide 225 × 225 px. Se conserva a su tamaño original "
            "sin ampliar, por lo que se ve pequeña en la ficha."
        ),
    },
    18: {
        "imagenes": [
            (
                "botas-swat",
                "Bota táctica negra estilo SWAT de caña alta, con cierre lateral y suela "
                "antideslizante.",
            )
        ],
        "lineas": ["seguridad"],
        "principal": True,
        "nota": "La fotografía publicada mide 247 × 296 px. Se conserva sin ampliar.",
    },
    17: {
        "imagenes": [
            (
                "botas-jungla-1",
                "Bota estilo jungla negra en cuero y lona, vista de tres cuartos.",
            ),
            (
                "botas-jungla-2",
                "La misma bota estilo jungla vista de perfil, con suela de tacos.",
            ),
            (
                "botas-jungla-3",
                "Par de botas estilo jungla, una de ellas volteada para mostrar la suela.",
            ),
            (
                "botas-jungla-4",
                "Bota estilo jungla negra de caña alta, vista lateral.",
            ),
        ],
        "lineas": ["seguridad"],
        "principal": True,
        "nota": (
            "La galería se reordenó para abrir con la fotografía de mayor resolución: la "
            "primera imagen que publica la tienda original mide 299 × 300 px y aquí aparece "
            "al final."
        ),
    },
    16: {
        "imagenes": [
            (
                "botas-comando",
                "Par de botas tácticas estilo comando en cuero y lona negra con suela de "
                "tacos.",
            )
        ],
        "lineas": ["seguridad"],
        "principal": True,
        "nota": None,
    },
    14: {
        "imagenes": [
            (
                "camisa-poplin-manga-larga",
                "Camisa formal manga larga de popelina azul con cinturón, corte para dama.",
            )
        ],
        "lineas": ["oficina"],
        "principal": True,
        "nota": (
            "El nombre publicado dice «Manga corta», pero la descripción, la URL original "
            "(camisa-formal-manga-larga) y la fotografía corresponden a manga larga. Se "
            "conserva el nombre publicado."
        ),
    },
    13: {
        "imagenes": [
            (
                "camisa-seguridad-manga-corta",
                "Agente de seguridad con camisa blanca de charreteras, corbata y gorra "
                "azul marino.",
            )
        ],
        "lineas": ["oficina"],
        "principal": True,
        "nota": (
            "La tienda original la publica únicamente en la categoría «Oficina», aunque el "
            "nombre y la descripción indican seguridad. Se conserva la categoría publicada."
        ),
    },
    12: {
        "imagenes": [
            (
                "camisa-polo-waffit",
                "Camisa tipo polo azul royal con vivos de contraste en cuello y puños y "
                "logotipos bordados en el pecho.",
            )
        ],
        "lineas": ["oficina", "seguridad"],
        "principal": True,
        "nota": None,
    },
    11: {
        "imagenes": [
            (
                "camisa-polo-algodon",
                "Camisa tipo polo de algodón con logotipo bordado en el pecho, mostrada en "
                "gris y en azul.",
            )
        ],
        "lineas": ["oficina"],
        "principal": True,
        "nota": (
            "Comparte nombre, precio, descripción y fotografía con el artículo ID 29. La "
            "tienda original los publica como dos fichas distintas y así se conservan."
        ),
    },
    10: {
        "imagenes": [
            (
                "camisa-reflectivos",
                "Camisa de trabajo manga larga color gris claro con cintas reflectivas en "
                "el torso y las mangas.",
            )
        ],
        "lineas": ["oficina", "seguridad"],
        "principal": True,
        "nota": (
            "El nombre publicado dice «Manga corta formal», pero la descripción y la "
            "fotografía corresponden a una camisa industrial manga larga con reflectivos. "
            "Se conserva el nombre publicado."
        ),
    },
    9: {
        "imagenes": [
            (
                "camisa-columbia-emaus",
                "Camisa manga corta tipo columbia azul marino con logotipo bordado en el "
                "pecho.",
            )
        ],
        "lineas": ["oficina"],
        "principal": True,
        "nota": "La fotografía publicada mide 300 × 300 px. Se conserva sin ampliar.",
    },
    8: {
        "imagenes": [
            (
                "camisa-oxford-manga-corta",
                "Tres personas con camisas de vestir en celeste, rayas y rosado.",
            )
        ],
        "lineas": ["oficina"],
        "principal": True,
        "nota": None,
    },
    7: {
        "imagenes": [
            (
                "camisa-manga-larga-detalles",
                "Camisa manga larga azul marino con detalles de contraste en color en la "
                "botonadura y el cuello.",
            )
        ],
        "lineas": ["oficina"],
        "principal": True,
        "nota": None,
    },
    6: {
        "imagenes": [
            (
                "camisa-columbia-fed-1",
                "Camisa blanca tipo columbia manga corta con logotipos de empresas bordados "
                "en el pecho y la manga.",
            ),
            (
                "camisa-columbia-fed-2",
                "Dos colaboradores con camisas blancas tipo columbia bordadas, sosteniendo "
                "cascos de seguridad.",
            ),
        ],
        "lineas": ["oficina", "industrial", "seguridad"],
        "principal": True,
        "nota": None,
    },
}

# Productos destacados en la portada (6-8 de las lineas principales).
DESTACADOS = [6, 10, 7, 12, 20, 24, 16, 28]


def localizar_fuente() -> Path:
    candidatos: list[str | None] = [os.environ.get("ZORZAL_FUENTE")]
    candidatos += [str(p) for p in RAIZ.parents]
    for c in candidatos:
        if c and (Path(c) / "datos" / "extraccion.json").is_file():
            return Path(c)
    sys.exit(
        "No encuentro datos/extraccion.json.\n"
        "Indica la carpeta con:  ZORZAL_FUENTE=/ruta python scripts/build_catalog.py"
    )


def limpiar(texto: str) -> str:
    return " ".join(texto.replace("\xa0", " ").split()).strip()


def main() -> None:
    fuente = localizar_fuente()
    extraccion = json.loads((fuente / "datos" / "extraccion.json").read_text(encoding="utf-8"))
    manifiesto = json.loads(MANIFIESTO.read_text(encoding="utf-8"))

    productos: list[dict[str, object]] = []
    for p in extraccion["products"]:
        pid = int(p["id"])
        mapa = MAPEO.get(pid)
        if mapa is None:
            sys.exit(f"Producto {pid} sin mapeo de imágenes. Añádelo a MAPEO.")

        en_oferta = bool(p["onSale"]) and float(p["salePrice"]) > 0
        precio = float(p["salePrice"]) if en_oferta else float(p["price"])
        precio_anterior = float(p["price"]) if en_oferta else None

        variantes = []
        for c in p["combinations"]:
            v_oferta = bool(c["onSale"]) and float(c["salePrice"]) > 0
            variantes.append(
                {
                    "nombre": limpiar(c["name"]),
                    "precio": float(c["salePrice"]) if v_oferta else float(c["price"]),
                    "precioAnterior": float(c["price"]) if v_oferta else None,
                    "sku": (c["sku"] or None),
                }
            )

        imagenes = []
        for clave, alt in mapa["imagenes"]:  # type: ignore[union-attr]
            if clave not in manifiesto:
                sys.exit(f"Falta la imagen «{clave}» en el manifiesto. Ejecuta prepare_media.py")
            m = manifiesto[clave]
            imagenes.append(
                {
                    "src": m["src"],
                    "srcset": ", ".join(m["srcset"]),
                    "width": m["width"],
                    "height": m["height"],
                    "alt": alt,
                    "origen": m["origen"],
                }
            )

        productos.append(
            {
                "id": pid,
                "slug": p["url"],
                "nombre": limpiar(p["title"]),
                "descripcion": limpiar(p["description_plain"]),
                "modalidad": "membresia" if p["type"] == "membership" else "articulo",
                "periodicidad": p["subscriptionPeriod"] if p["withSubscription"] else None,
                "precio": precio if precio > 0 else None,
                "precioAnterior": precio_anterior,
                "moneda": "USD",
                "sku": (p["sku"] or None),
                "inventario": p["quantity"],
                "categoriasPublicadas": [
                    {"id": c["id"], "nombre": c["name"], "slug": c["url"]}
                    for c in p["categories"]
                ],
                "lineas": mapa["lineas"],
                "opciones": [
                    {
                        "nombre": limpiar(v["name"]),
                        "valores": [limpiar(x) for x in v["values"]],
                        "determinaPrecio": bool(v["advanced"]) and bool(p["combinations"]),
                    }
                    for v in p["variations"]
                ],
                "variantes": variantes,
                "imagenes": imagenes,
                "fuente": p["source"],
                "nota": mapa["nota"],
                "esLineaPrincipal": mapa["principal"],
            }
        )

    faltan = [i for i in DESTACADOS if i not in {p["id"] for p in productos}]
    if faltan:
        sys.exit(f"Destacados inexistentes: {faltan}")

    SALIDA.write_text(
        json.dumps(
            {
                "extraidoEl": extraccion["date"],
                "destacados": DESTACADOS,
                "productos": productos,
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"{len(productos)} productos escritos en {SALIDA}")
    sin_imagen = [p["id"] for p in productos if not p["imagenes"]]
    if sin_imagen:
        print(f"Sin fotografía válida publicada: {sin_imagen}")


if __name__ == "__main__":
    main()
