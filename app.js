// Le Parfum (DEMO) · catálogo de perfumes con pedido por WhatsApp. Basado en CyR Shop.
// WHATSAPP: en la demo llega al número de Richard; en la tienda real va el número de Le Parfum.
const WHATSAPP = '593983185069';
const TIENDA = 'Le Parfum';
const CLAVE_BOLSA = 'leparfum-bolsa';
const CLAVE_ENTREGA = 'leparfum-entrega';

const FAMILIAS = {
  dulce: 'Dulce',
  fresco: 'Fresco',
  amaderado: 'Amaderado',
  especiado: 'Especiado',
  oud: 'Oud y ámbar',
};

const ENTREGAS = {
  local: 'Entrega personal en Ibarra o Atuntaqui',
  servientrega: 'Envío por Servientrega a otra ciudad',
};

const $ = (selector) => document.querySelector(selector);

const dinero = (valor) => '$' + valor.toFixed(valor % 1 === 0 ? 0 : 2);

const enlaceWhatsapp = (texto) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

const opcionDe = (producto, nombre) => producto.opciones.find((o) => o.nombre === nombre) || producto.opciones[0];

const precioDe = (producto, nombre) => opcionDe(producto, nombre).precio;

const desde = (producto) => Math.min(...producto.opciones.map((o) => o.precio));

let bolsa = leerBolsa();
let actual = null;
const filtro = { familia: 'todo', marca: 'todas', texto: '' };

function leerBolsa() {
  try {
    const guardada = JSON.parse(localStorage.getItem(CLAVE_BOLSA));

    return Array.isArray(guardada)
      ? guardada.filter((item) => PRODUCTOS.some((p) => p.id === item.id))
      : [];
  } catch {
    return [];
  }
}

function guardarBolsa() {
  try {
    localStorage.setItem(CLAVE_BOLSA, JSON.stringify(bolsa));
  } catch {
  }
}

const normalizar = (texto) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function coincide(producto) {
  if (filtro.familia !== 'todo' && producto.familia !== filtro.familia) {
    return false;
  }

  if (filtro.marca !== 'todas' && producto.marca !== filtro.marca) {
    return false;
  }

  if (!filtro.texto) {
    return true;
  }

  const n = producto.notas;
  const textoProducto = normalizar([producto.nombre, producto.marca, FAMILIAS[producto.familia], n.salida, n.corazon, n.fondo].join(' '));

  return normalizar(filtro.texto).split(/\s+/).every((palabra) => textoProducto.includes(palabra));
}

function pintarCatalogo() {
  const rejilla = $('#rejilla');
  const lista = PRODUCTOS.filter(coincide);

  rejilla.innerHTML = '';
  lista.forEach((producto) => rejilla.append(tarjeta(producto)));
  $('#sin-resultados').hidden = lista.length > 0;
  $('#cuantos').textContent = lista.length === 1 ? '1 perfume' : `${lista.length} perfumes`;
}

function tarjeta(producto) {
  const boton = document.createElement('button');

  boton.type = 'button';
  boton.className = 'tarjeta';
  boton.innerHTML = `
    <div class="tarjeta__foto">
      <img class="tarjeta__imagen" src="${producto.opciones[0].fotos[0]}" alt="${producto.marca} ${producto.nombre}" loading="lazy" width="600" height="600">
      ${producto.oferta ? `<span class="insignia">${producto.oferta}</span>` : ''}
    </div>
    <div class="tarjeta__cuerpo">
      <span class="tarjeta__marca">${producto.marca}</span>
      <span class="tarjeta__nombre">${producto.nombre}</span>
      <span class="etiquetas"><i>${FAMILIAS[producto.familia]}</i><i>${producto.genero}</i></span>
      <span class="tamanos">${producto.opciones.map((o) => o.nombre.replace('Decant ', '')).join(' · ')}</span>
      <div class="tarjeta__pie">
        <span class="tarjeta__precio"><small>Desde</small> ${dinero(desde(producto))}</span>
        <span class="tarjeta__ver" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
      </div>
    </div>`;
  boton.addEventListener('click', () => abrirFicha(producto));

  return boton;
}

function abrirFicha(producto) {
  actual = { producto, tamano: producto.opciones[0].nombre, cantidad: 1 };

  $('#ficha-marca').textContent = producto.marca;
  $('#ficha-nombre').textContent = producto.nombre;
  $('#ficha-descripcion').textContent = producto.descripcion;
  $('#ficha-oferta').hidden = !producto.oferta;
  $('#ficha-oferta').textContent = producto.oferta || '';
  $('#ficha-etiquetas').innerHTML = `<i>${FAMILIAS[producto.familia]}</i><i>${producto.genero}</i>`;
  $('#nota-salida').textContent = producto.notas.salida;
  $('#nota-corazon').textContent = producto.notas.corazon;
  $('#nota-fondo').textContent = producto.notas.fondo;
  $('#ficha-duracion').textContent = producto.duracion;
  $('#ficha-aviso').textContent = '';

  pintarTamanos();
  pintarCantidad();

  $('#ficha').showModal();
  $('#ficha').scrollTop = 0;
}

function pintarTamanos() {
  const { producto } = actual;
  const opcion = opcionDe(producto, actual.tamano);
  const contenedor = $('#opciones-tamano');

  $('#ficha-precio').textContent = dinero(opcion.precio);
  $('#ficha-foto').src = opcion.fotos[0];
  $('#ficha-foto').alt = `${producto.marca} ${producto.nombre}, ${opcion.nombre}`;
  contenedor.innerHTML = '';

  producto.opciones.forEach((o) => {
    const boton = document.createElement('button');

    boton.type = 'button';
    boton.className = 'opcion opcion--tamano' + (o.nombre === actual.tamano ? ' activo' : '');
    boton.setAttribute('aria-pressed', o.nombre === actual.tamano);
    boton.innerHTML = `<strong>${o.nombre}</strong><span>${dinero(o.precio)}</span>`;
    boton.addEventListener('click', () => {
      actual.tamano = o.nombre;
      pintarTamanos();
    });
    contenedor.append(boton);
  });
}

function pintarCantidad() {
  $('#cantidad').value = actual.cantidad;
  $('#cantidad').textContent = actual.cantidad;
}

function itemActual() {
  return { id: actual.producto.id, tamano: actual.tamano, cantidad: actual.cantidad };
}

function lineaPedido(item) {
  const producto = PRODUCTOS.find((p) => p.id === item.id);
  const precio = precioDe(producto, item.tamano);

  return `• ${item.cantidad} × ${producto.marca} ${producto.nombre} (${item.tamano}) — ${dinero(item.cantidad * precio)}`;
}

function total(items) {
  return items.reduce((suma, item) => {
    const producto = PRODUCTOS.find((p) => p.id === item.id);

    return suma + item.cantidad * precioDe(producto, item.tamano);
  }, 0);
}

function entregaElegida() {
  return document.querySelector('input[name="entrega"]:checked')?.value || 'local';
}

function mensajePedido(items) {
  const entrega = entregaElegida();
  const lineas = [
    `Hola ${TIENDA} 👋 Quiero hacer este pedido:`,
    '',
    ...items.map(lineaPedido),
    '',
    `Total: ${dinero(total(items))}${entrega === 'servientrega' ? ' + envío' : ''}`,
    `Entrega: ${ENTREGAS[entrega]}`,
    '',
    'Mi nombre:',
    entrega === 'servientrega' ? 'Mi ciudad y dirección:' : 'Sector para la entrega:',
    'Pago (transferencia, DeUna o tarjeta):',
  ];

  return lineas.join('\n');
}

function pintarBolsa() {
  const lista = $('#bolsa-lista');
  const unidades = bolsa.reduce((suma, item) => suma + item.cantidad, 0);
  const entrega = entregaElegida();

  $('#bolsa-cantidad').hidden = unidades === 0;
  $('#bolsa-cantidad').textContent = unidades;
  $('#bolsa-vacia').hidden = bolsa.length > 0;
  $('#bolsa-pie').hidden = bolsa.length === 0;
  $('#bolsa-total').textContent = dinero(total(bolsa));
  $('#bolsa-envio').textContent = entrega === 'servientrega'
    ? 'Más el envío por Servientrega, que depende de la ciudad (te lo confirmamos por WhatsApp).'
    : 'Entrega sin costo en Ibarra y Atuntaqui.';

  lista.innerHTML = '';

  bolsa.forEach((item, indice) => {
    const producto = PRODUCTOS.find((p) => p.id === item.id);
    const opcion = opcionDe(producto, item.tamano);
    const li = document.createElement('li');

    li.className = 'bolsa__item';
    li.innerHTML = `
      <img src="${opcion.fotos[0]}" alt="">
      <div>
        <strong>${producto.nombre}</strong>
        <small>${producto.marca} · ${opcion.nombre}</small>
      </div>
      <div class="bolsa__item-derecha">
        <span>${item.cantidad} × ${dinero(opcion.precio)}</span>
        <button class="enlace" type="button">Quitar</button>
      </div>`;
    li.querySelector('button').addEventListener('click', () => {
      bolsa.splice(indice, 1);
      guardarBolsa();
      pintarBolsa();
    });
    lista.append(li);
  });
}

function agregar(item) {
  const igual = bolsa.find((b) => b.id === item.id && b.tamano === item.tamano);

  if (igual) {
    igual.cantidad += item.cantidad;
  } else {
    bolsa.push(item);
  }

  guardarBolsa();
  pintarBolsa();
}

// ---------- Filtros ----------

document.querySelectorAll('.filtro').forEach((boton) => {
  boton.addEventListener('click', () => {
    document.querySelectorAll('.filtro').forEach((f) => {
      f.classList.toggle('activo', f === boton);
      f.setAttribute('aria-pressed', f === boton);
    });
    filtro.familia = boton.dataset.familia;
    pintarCatalogo();
  });
});

const selectorMarca = $('#filtro-marca');

[...new Set(PRODUCTOS.map((p) => p.marca))].sort().forEach((marca) => {
  selectorMarca.append(new Option(marca, marca));
});
selectorMarca.addEventListener('change', () => {
  filtro.marca = selectorMarca.value;
  pintarCatalogo();
});

$('#buscar').addEventListener('input', (evento) => {
  filtro.texto = evento.target.value.trim();
  pintarCatalogo();
});

$('#limpiar-filtros').addEventListener('click', () => {
  filtro.familia = 'todo';
  filtro.marca = 'todas';
  filtro.texto = '';
  selectorMarca.value = 'todas';
  $('#buscar').value = '';
  document.querySelectorAll('.filtro').forEach((f) => f.classList.toggle('activo', f.dataset.familia === 'todo'));
  pintarCatalogo();
});

// ---------- Ventanas ----------

document.querySelectorAll('[data-cerrar]').forEach((boton) => {
  boton.addEventListener('click', () => boton.closest('dialog').close());
});

document.querySelectorAll('dialog').forEach((dialogo) => {
  dialogo.addEventListener('click', (evento) => {
    if (evento.target === dialogo) {
      dialogo.close();
    }
  });
});

$('#menos').addEventListener('click', () => {
  actual.cantidad = Math.max(1, actual.cantidad - 1);
  pintarCantidad();
});

$('#mas').addEventListener('click', () => {
  actual.cantidad += 1;
  pintarCantidad();
});

$('#agregar').addEventListener('click', () => {
  agregar(itemActual());
  $('#ficha').close();
  $('#bolsa').showModal();
});

$('#pedir-ahora').addEventListener('click', () => {
  window.open(enlaceWhatsapp(mensajePedido([itemActual()])), '_blank', 'noopener');
});

$('#abrir-bolsa').addEventListener('click', () => $('#bolsa').showModal());

$('#enviar-pedido').addEventListener('click', () => {
  window.open(enlaceWhatsapp(mensajePedido(bolsa)), '_blank', 'noopener');
});

$('#vaciar').addEventListener('click', () => {
  bolsa = [];
  guardarBolsa();
  pintarBolsa();
});

document.querySelectorAll('input[name="entrega"]').forEach((opcion) => {
  try {
    opcion.checked = opcion.value === (localStorage.getItem(CLAVE_ENTREGA) || 'local');
  } catch {
  }
  opcion.addEventListener('change', () => {
    try {
      localStorage.setItem(CLAVE_ENTREGA, opcion.value);
    } catch {
    }
    pintarBolsa();
  });
});

const saludo = enlaceWhatsapp(`Hola ${TIENDA} 👋 Vi su catálogo y quisiera más información.`);

$('#whatsapp-flotante').href = saludo;
$('#whatsapp-portada').href = saludo;
$('#whatsapp-pie').href = saludo;

function datosParaBuscadores() {
  const sitio = location.origin + location.pathname.replace(/index\.html$/, '');
  const datos = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Store',
        '@id': sitio + '#tienda',
        name: TIENDA,
        description: 'Perfumería masculina: perfumes árabes originales en 100 ml y decants de 5 y 10 ml.',
        url: sitio,
        telephone: '+' + WHATSAPP,
        priceRange: '$$',
        currenciesAccepted: 'USD',
        address: { '@type': 'PostalAddress', addressLocality: 'Ibarra', addressRegion: 'Imbabura', addressCountry: 'EC' },
      },
      ...PRODUCTOS.map((producto) => ({
        '@type': 'Product',
        name: `${producto.marca} ${producto.nombre}`,
        description: producto.descripcion,
        image: sitio + producto.opciones[0].fotos[0],
        brand: { '@type': 'Brand', name: producto.marca },
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: desde(producto).toFixed(2),
          highPrice: Math.max(...producto.opciones.map((o) => o.precio)).toFixed(2),
          offerCount: producto.opciones.length,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      })),
    ],
  };
  const script = document.createElement('script');

  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(datos);
  document.head.append(script);
}

pintarCatalogo();
pintarBolsa();
datosParaBuscadores();
