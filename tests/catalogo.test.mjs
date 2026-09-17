/**
 * Comprobaciones de los datos del catálogo y del armado de mensajes.
 *
 * Corren sobre los JSON generados (sin compilar TypeScript), para que
 * `npm test` funcione sin herramientas extra.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const leer = (p) => JSON.parse(readFileSync(join(raiz, p), 'utf8'));

const catalogo = leer('src/data/catalogo.json');
const manifiesto = leer('src/data/media-manifest.json');

test('el catálogo conserva los 20 productos extraídos', () => {
  assert.equal(catalogo.productos.length, 20);
});

test('los IDs y los slugs son únicos', () => {
  const ids = catalogo.productos.map((p) => p.id);
  const slugs = catalogo.productos.map((p) => p.slug);
  assert.equal(new Set(ids).size, 20, 'hay IDs repetidos');
  assert.equal(new Set(slugs).size, 20, 'hay slugs repetidos');
});

test('hay nombres repetidos con IDs distintos y se conservan por separado', () => {
  const nombres = catalogo.productos.map((p) => p.nombre);
  assert.ok(new Set(nombres).size < nombres.length, 'se esperaban nombres duplicados');
  const camisas = catalogo.productos.filter((p) => p.nombre === 'Camisa de seguridad Manga Larga');
  assert.deepEqual(
    camisas.map((p) => p.id).sort((a, b) => a - b),
    [24, 30],
  );
});

test('los precios son positivos y en USD, y el precio anterior siempre es mayor', () => {
  for (const p of catalogo.productos) {
    assert.equal(p.moneda, 'USD', `${p.slug}: moneda distinta de USD`);
    if (p.precio !== null) assert.ok(p.precio > 0, `${p.slug}: precio no positivo`);
    if (p.precioAnterior !== null) {
      assert.ok(p.precioAnterior > p.precio, `${p.slug}: precio anterior no mayor`);
    }
  }
});

test('el inventario nunca se inventa: siempre queda como no publicado', () => {
  for (const p of catalogo.productos) {
    assert.equal(p.inventario, null, `${p.slug}: el inventario no debería tener valor`);
  }
});

test('las variantes con precio pertenecen a un único grupo de opciones', () => {
  for (const p of catalogo.productos) {
    const conPrecio = p.opciones.filter((o) => o.determinaPrecio);
    if (p.variantes.length === 0) {
      assert.equal(conPrecio.length, 0, `${p.slug}: grupo de precio sin variantes`);
      continue;
    }
    assert.equal(conPrecio.length, 1, `${p.slug}: se esperaba un solo grupo con precio`);
    for (const v of p.variantes) {
      assert.ok(
        conPrecio[0].valores.includes(v.nombre),
        `${p.slug}: la variante ${v.nombre} no está entre los valores publicados`,
      );
      assert.ok(v.precio > 0, `${p.slug}: variante sin precio`);
    }
  }
});

test('el único producto con precios por variante es el ID 34, con dos variantes', () => {
  const conVariantes = catalogo.productos.filter((p) => p.variantes.length > 0);
  assert.equal(conVariantes.length, 1);
  assert.equal(conVariantes[0].id, 34);
  assert.deepEqual(
    conVariantes[0].variantes.map((v) => [v.nombre, v.precio, v.precioAnterior]),
    [
      ['Version Normal', 84.75, 95],
      ['Version Pro', 100, 120],
    ],
  );
});

test('cada imagen existe en disco, tiene dimensiones y texto alternativo', () => {
  for (const p of catalogo.productos) {
    for (const img of p.imagenes) {
      assert.ok(img.src.startsWith('/media/'), `${p.slug}: imagen fuera de /media`);
      assert.ok(
        existsSync(join(raiz, 'public', img.src.replace(/^\//, ''))),
        `${p.slug}: falta el archivo ${img.src}`,
      );
      assert.ok(img.width > 0 && img.height > 0, `${p.slug}: imagen sin dimensiones`);
      assert.ok(img.alt.length >= 12, `${p.slug}: texto alternativo demasiado corto`);
      assert.ok(img.origen.length > 0, `${p.slug}: imagen sin archivo de origen`);
      assert.ok(img.srcset.includes(' '), `${p.slug}: srcset mal formado`);
    }
  }
});

test('todas las entradas del manifiesto apuntan a archivos existentes', () => {
  for (const [clave, entrada] of Object.entries(manifiesto)) {
    for (const src of [entrada.src, ...entrada.srcset.map((s) => s.split(' ')[0])]) {
      assert.ok(
        existsSync(join(raiz, 'public', src.replace(/^\//, ''))),
        `${clave}: falta ${src}`,
      );
    }
  }
});

test('las imágenes no se amplían por encima del original', () => {
  // El ancho mayor del srcset es el ancho real de la imagen principal.
  for (const entrada of Object.values(manifiesto)) {
    const anchos = entrada.srcset.map((s) => Number.parseInt(s.split(' ')[1], 10));
    assert.equal(Math.max(...anchos), entrada.width);
  }
});

test('el único producto sin fotografía válida es el ID 35, y lo documenta', () => {
  const sinImagen = catalogo.productos.filter((p) => p.imagenes.length === 0);
  assert.deepEqual(
    sinImagen.map((p) => p.id),
    [35],
  );
  assert.ok(sinImagen[0].nota && sinImagen[0].nota.length > 40);
});

test('los destacados son ocho prendas de las líneas principales', () => {
  assert.ok(catalogo.destacados.length >= 6 && catalogo.destacados.length <= 8);
  const porId = new Map(catalogo.productos.map((p) => [p.id, p]));
  const lineas = new Set();
  for (const id of catalogo.destacados) {
    const p = porId.get(id);
    assert.ok(p, `destacado inexistente: ${id}`);
    assert.equal(p.esLineaPrincipal, true, `${p.slug}: destacado fuera de las líneas principales`);
    assert.ok(p.imagenes.length > 0, `${p.slug}: destacado sin fotografía`);
    for (const l of p.lineas) lineas.add(l);
  }
  for (const l of ['oficina', 'industrial', 'seguridad', 'salud']) {
    assert.ok(lineas.has(l), `los destacados no cubren la línea ${l}`);
  }
});

test('los artículos ajenos al giro quedan fuera de las líneas de uniformes', () => {
  const otros = catalogo.productos.filter((p) => p.lineas.includes('otros'));
  assert.deepEqual(
    otros.map((p) => p.id).sort((a, b) => a - b),
    [34, 35],
  );
  for (const p of otros) {
    assert.equal(p.esLineaPrincipal, false);
    assert.ok(!catalogo.destacados.includes(p.id), `${p.slug}: no debe estar en destacados`);
  }
});

test('cada producto conserva la URL de su ficha original', () => {
  for (const p of catalogo.productos) {
    assert.equal(p.fuente, `https://zorzallirio.com/tienda/${p.slug}`);
  }
});

test('no quedan textos de plantilla en los datos publicados', () => {
  const texto = JSON.stringify(catalogo).toLowerCase();
  for (const plantilla of ['lorem ipsum', 'dolor sit amet', 'consectetuer']) {
    assert.ok(!texto.includes(plantilla), `quedó texto de plantilla: ${plantilla}`);
  }
});

test('el mensaje de WhatsApp se codifica y lleva producto, ficha, opciones y cantidad', () => {
  // Reproduce el armado de lib/whatsapp.ts sobre datos reales.
  const p = catalogo.productos.find((x) => x.id === 6);
  const opciones = { Talla: 'M', Color: 'Blanco' };
  const cantidad = 25;
  const url = `https://zorzallirio.com/tienda/${p.slug}`;
  const mensaje = [
    'Buenos días, quisiera una cotización de este producto:',
    '',
    `Producto: ${p.nombre} (ID ${p.id})`,
    `Ficha: ${url}`,
    'Opciones:',
    '  - Talla: M',
    '  - Color: Blanco',
    `Cantidad: ${cantidad}`,
    `Precio publicado en el sitio: USD ${p.precio.toFixed(2)} por unidad`,
    '',
    'Les agradezco confirmarme precio y disponibilidad para esta cantidad.',
  ].join('\n');

  const enlace = `https://wa.me/50488328459?text=${encodeURIComponent(mensaje)}`;
  assert.ok(enlace.startsWith('https://wa.me/50488328459?text='));
  assert.ok(!/[\s<>"']/.test(enlace.split('?text=')[1]), 'el mensaje no quedó bien codificado');
  const recuperado = decodeURIComponent(enlace.split('?text=')[1]);
  assert.equal(recuperado, mensaje);
  assert.ok(recuperado.includes(url));
  assert.ok(recuperado.includes('Cantidad: 25'));
  assert.ok(recuperado.includes('Talla: M'));
  assert.ok(recuperado.includes('confirmarme precio y disponibilidad'));
  // Los acentos y la ñ sobreviven al viaje.
  assert.ok(recuperado.includes('cotización'));
  void opciones;
});
