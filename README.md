# Le Parfum · Perfumes & Decants (demo)

Demo de la tienda en línea de **Le Parfum** ([@leparfumfragance](https://www.instagram.com/leparfumfragance/)),
perfumería masculina en Ibarra: perfumes árabes originales en 100 ml y decants de 5 y 10 ml.

> ⚠️ **Es una demostración.** Los productos, precios, notas y fotos son de ejemplo. Los pedidos llegan al WhatsApp de
> Le Parfum (+593 95 946 2741, `WHATSAPP` en `app.js`).

Basada en el catálogo de [CyR Shop](https://cyrshop.app): página estática (HTML, CSS y JavaScript), sin servidor
ni base de datos. El cliente arma su pedido y lo envía por WhatsApp.

## Qué tiene

- **Catálogo** con filtros por **familia olfativa** (dulces, frescos, amaderados, especiados, oud y ámbar),
  **marca** y un **buscador** por nombre o nota ("vainilla", "oud"…).
- **Tres tamaños por perfume** (100 ml, decant 10 ml y decant 5 ml), cada uno con su precio y su foto. La tarjeta
  muestra "Desde $X".
- **Ficha del perfume**: notas de salida, corazón y fondo, duración, género (hombre o unisex).
- **Pedido por WhatsApp** con la zona de entrega: **entrega personal en Ibarra o Atuntaqui** (sin costo) o
  **Servientrega** a otra ciudad (envío según la ciudad). El pago se acuerda por WhatsApp: transferencia, DeUna o
  tarjeta con link de pago (Payphone).
- Sección "Prueba con un decant", cómo comprar y preguntas frecuentes.
- `noindex` y `robots.txt` cerrados mientras sea demo (no aparece en Google).

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La página. |
| `productos.js` | Los perfumes: marca, nombre, familia, género, notas, duración y los tres tamaños con precio y foto. |
| `app.js` | Catálogo, filtros, ficha, pedido, mensaje de WhatsApp y datos para Google. |
| `estilos.css` | Diseño (marfil y negro con dorado; títulos en Cormorant Garamond). |
| `img/perfumes/` | Ilustraciones de ejemplo (frasco y viales). Se reemplazan por fotos reales. |
| `tools/frascos.py` | Genera esas ilustraciones: `python tools/frascos.py`. |

## Agregar o cambiar un perfume

En `productos.js`:

```js
{
  id: 'khamrah',
  nombre: 'Khamrah',
  marca: 'Lattafa',
  genero: 'Unisex',                 // Hombre o Unisex
  familia: 'dulce',                 // dulce, fresco, amaderado, especiado u oud
  oferta: 'Más pedido',             // opcional: etiqueta sobre la foto
  descripcion: '…',
  notas: { salida: '…', corazon: '…', fondo: '…' },
  duracion: 'Alta · 8 a 10 horas',
  opciones: tamanos('khamrah', 55, 10, 6),   // precios de 100 ml, 10 ml y 5 ml
}
```

`tamanos(id, p100, p10, p5)` busca las fotos `img/perfumes/<id>.svg`, `<id>-decant-10.svg` y `<id>-decant-5.svg`.
Con fotos reales, escribe las opciones a mano con sus rutas `.jpg` (cuadradas, hasta 900 px).

En la descripción se cuentan las notas y el estilo. **No usar "réplica de" ni "inspirado en" otra marca.**

## Probar en la computadora

Abre `index.html` en el navegador o sirve la carpeta, por ejemplo con `php -S 127.0.0.1:8766`.

## Para la versión real

1. Fotos reales de los perfumes y precios reales.
2. **Google Sheets como panel:** el dueño edita sus perfumes, precios y stock en una hoja y la página la lee sola.
3. Dominio propio (por ejemplo `leparfum.ec` o un `.com`) y quitar el `noindex`.
4. Fase 2: pago con tarjeta dentro de la página (Payphone) y factura electrónica del SRI.
