#!/usr/bin/env python3
"""Copia y optimiza las imagenes del material extraido hacia public/media.

Fuente por defecto: la carpeta de extraccion (imagenes/productos e imagenes/sitio).
Se puede indicar otra con la variable de entorno ZORZAL_FUENTE.

Salida: WebP en uno o dos anchos por imagen mas un manifiesto JSON con las
dimensiones reales, para declarar width/height en el HTML y evitar saltos.

Requiere Python 3.10+ y Pillow.  Uso:  python scripts/prepare_media.py
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageSequence
except ImportError:  # pragma: no cover
    sys.exit("Falta Pillow.  Instalalo con:  pip install Pillow")

RAIZ = Path(__file__).resolve().parents[1]
DESTINO = RAIZ / "public" / "media"
MANIFIESTO = RAIZ / "src" / "data" / "media-manifest.json"

# Anchos objetivo.  Nunca se amplia una imagen: si el original es menor,
# se emite un solo archivo con su tamano real.
ANCHOS = (640, 1280)

# clave -> ruta relativa a la fuente.  El orden define el orden de galeria.
PRODUCTOS: dict[str, list[str]] = {
    # ID 35 "Club de Libro los Zorzales": la unica imagen publicada no corresponde
    # al producto (es el logotipo de "Green Building Group S.A.S"); no se usa.
    "audifonos-panasonic": ["imagenes/productos/89c7d226_616ofJfqNyL-9038601.jpg"],
    # ID 30: las vistas salen del GIF publicado, ver GIF_FRAMES.
    "camisa-polo-algodon": ["imagenes/productos/cdb2010b_apparel_0022-7729620.jpg"],
    "pantalon-formal": ["imagenes/productos/b9c2bb18_pantalon-formal-8380836.jpg"],
    "pantalon-ranger": ["imagenes/productos/349a2914_p_1000754291-8380189.jpg"],
    "camisa-seguridad-bordada": [
        "imagenes/productos/18019b4c_security-guard-shirt-500x500-8379406.jpg"
    ],
    "gabacha-medica": ["imagenes/productos/2e4ebeac_images-30-7730969.jpeg"],
    "botas-swat": ["imagenes/productos/272f4e09_Swat_con_zipper-7730582.jpg"],
    "botas-jungla": [
        "imagenes/productos/790d68a6_thumbnail_IMG_2967_Facetune_22-10-2020-20-45-34-7730582.jpg",
        "imagenes/productos/23f9572e_thumbnail_IMG_2968_Facetune_22-10-2020-20-47-59-7730581.jpg",
        "imagenes/productos/a83078c8_panama_sole__85625.1531361965.1280.1280__87526.1578582462-7730501.jpg",
        "imagenes/productos/83b0d77f_Jungla_caribe-7730525.jpg",
    ],
    "botas-comando": ["imagenes/productos/1a7ef34a_IMG_9268-7730317.JPG"],
    "camisa-poplin-manga-larga": [
        "imagenes/productos/a4306028_sp91rb-women-s-royal-blue-long-sleeve-"
        "button-down-poplin-shirts-9-1-colors-15-7728509.jpg"
    ],
    "camisa-seguridad-manga-corta": ["imagenes/productos/2b6c7ac4_unnamed-3-7729407.png"],
    "camisa-polo-waffit": ["imagenes/productos/d6cabf48_unnamed-7728756.png"],
    "camisa-reflectivos": [
        "imagenes/productos/97b07cc5_IMG-3627-Facetune-25-11-2020-13-18-41-7728255.jpg"
    ],
    "camisa-columbia-emaus": [
        "imagenes/productos/be0513d1_Camisa-Tipo-Columbia-Azul-Marino-con-Logo-"
        "Emaus-Unisex-300x300-7728095.png"
    ],
    "camisa-oxford-manga-corta": ["imagenes/productos/c2957b9b_unnamed-2-7727419.png"],
    "camisa-manga-larga-detalles": ["imagenes/productos/21b94047_Portfolio22-7724559.png"],
    "camisa-columbia-fed": [
        "imagenes/productos/a3118cb3_najul_13-7723878.png",
        "imagenes/productos/c649613c_2021-01-13-7724596.jpg",
    ],
}

# Fotogramas a extraer del GIF publicado para "Camisa de seguridad Manga Larga"
# (ID 30 e ID 24 comparten linea).  El GIF original pesa 6,7 MB: se conservan
# tres vistas fijas del mismo archivo publicado.
GIF_FRAMES: dict[str, list[tuple[str, int]]] = {
    "imagenes/productos/906d545a_P1000250-8379035.gif": [
        ("camisa-seguridad-manga-larga-1", 0),
        ("camisa-seguridad-manga-larga-2", 18),
        ("camisa-seguridad-manga-larga-3", 34),
    ]
}

EDITORIAL: dict[str, str] = {
    "hero-industrial": "imagenes/sitio/c9549c2f_ALFILERI19_2438-50-0643438.jpg",
    "linea-oficina": "imagenes/sitio/95ae6834_Uniber-oficina-blusa-4-0751099.jpg",
    "linea-industrial": (
        "imagenes/productos/97b07cc5_IMG-3627-Facetune-25-11-2020-13-18-41-7728255.jpg"
    ),
    "linea-seguridad": (
        "imagenes/sitio/82ce632f_Fotolia_75654347_Subscription_Monthly_M-8165374.jpg"
    ),
    "linea-salud": "imagenes/sitio/6ef85d62_usman-yousaf-pTrhfmj2jDA-unsplash-0750961.jpg",
    "asesoria-telas": (
        "imagenes/sitio/c78f3499_implementa-un-uniforme-en-tu-empresa-1024x662-0835626.png"
    ),
    "plan-corporativo": "imagenes/sitio/45a154ee_FH0A9026-1024x512-0835625.jpg",
    "equipo-oficina": "imagenes/sitio/d05fea00_uniformes-empresariales-1-7876768.jpg",
    "servicio-detalle": "imagenes/sitio/ae9a788b_pexels-kampus-production-5920775-7778327.jpg",
    "polos-contraste": (
        "imagenes/sitio/9bc8e7e8_Colores-de-camisas-en-la-empresa-aprende-su-significado-"
        "uniformes-corporativos-1024x662-7778267.png"
    ),
    "mapa-taller": (
        "imagenes/sitio/287645dc_Captura_de_pantalla_2021-11-25_a_las_11.33.49_a._m.-7861829.png"
    ),
}

# El logotipo conserva transparencia.
MARCA: dict[str, str] = {
    "logo-zorzal-lirio": "imagenes/sitio/5a403993_ZORZAL_LIRIO_PROPUESTA02-01-01-7679685.png",
    "marca-zorzal": "imagenes/sitio/1fa2ca17_ZORZAL_LIRIO_PROPUESTA02-01-01-8306222.png",
}


def localizar_fuente() -> Path:
    candidatos: list[str | None] = [os.environ.get("ZORZAL_FUENTE")]
    candidatos += [str(p) for p in RAIZ.parents]
    for c in candidatos:
        if c and (Path(c) / "imagenes" / "productos").is_dir():
            return Path(c)
    sys.exit(
        "No encuentro la carpeta de extraccion (debe contener imagenes/productos).\n"
        "Indicala con:  ZORZAL_FUENTE=/ruta/a/la/extraccion python scripts/prepare_media.py"
    )


def emitir(img: Image.Image, slug: str, carpeta: str, alpha: bool) -> dict[str, object]:
    """Guarda la imagen en WebP en los anchos aplicables y devuelve sus metadatos."""
    salida = DESTINO / carpeta
    salida.mkdir(parents=True, exist_ok=True)
    img = img.convert("RGBA" if alpha else "RGB")
    anchos = sorted({min(a, img.width) for a in ANCHOS})
    fuentes: list[dict[str, object]] = []
    for ancho in anchos:
        alto = max(1, round(img.height * ancho / img.width))
        copia = img if ancho == img.width else img.resize((ancho, alto), Image.LANCZOS)
        nombre = f"{slug}-{ancho}.webp"
        copia.save(salida / nombre, "WEBP", quality=86, method=6)
        fuentes.append({"src": f"/media/{carpeta}/{nombre}", "width": ancho, "height": alto})
    principal = fuentes[-1]
    return {
        "src": principal["src"],
        "width": principal["width"],
        "height": principal["height"],
        "srcset": [f"{f['src']} {f['width']}w" for f in fuentes],
    }


def main() -> None:
    fuente = localizar_fuente()
    print(f"Fuente: {fuente}")
    manifiesto: dict[str, dict[str, object]] = {}
    faltantes: list[str] = []

    def procesar(clave: str, rel: str, carpeta: str, alpha: bool) -> None:
        ruta = fuente / rel
        if not ruta.is_file():
            faltantes.append(rel)
            return
        with Image.open(ruta) as img:
            datos = emitir(img, clave, carpeta, alpha)
        datos["origen"] = rel
        manifiesto[clave] = datos

    for base, relativos in PRODUCTOS.items():
        for i, rel in enumerate(relativos, start=1):
            clave = base if len(relativos) == 1 else f"{base}-{i}"
            procesar(clave, rel, "productos", rel.endswith(".png"))

    for rel, frames in GIF_FRAMES.items():
        ruta = fuente / rel
        if not ruta.is_file():
            faltantes.append(rel)
            continue
        with Image.open(ruta) as gif:
            cuadros = [c.copy() for c in ImageSequence.Iterator(gif)]
        for clave, indice in frames:
            cuadro = cuadros[min(indice, len(cuadros) - 1)].convert("RGB")
            datos = emitir(cuadro, clave, "productos", False)
            datos["origen"] = f"{rel}#frame{indice}"
            manifiesto[clave] = datos

    for clave, rel in EDITORIAL.items():
        procesar(clave, rel, "editorial", rel.endswith(".png"))

    for clave, rel in MARCA.items():
        procesar(clave, rel, "marca", True)

    MANIFIESTO.parent.mkdir(parents=True, exist_ok=True)
    MANIFIESTO.write_text(
        json.dumps(dict(sorted(manifiesto.items())), indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"{len(manifiesto)} imagenes escritas en {DESTINO}")
    print(f"Manifiesto: {MANIFIESTO}")
    if faltantes:
        print("\nNO ENCONTRADAS en la fuente:")
        for f in faltantes:
            print(f"  - {f}")


if __name__ == "__main__":
    main()
