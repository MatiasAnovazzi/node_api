import axios from 'axios';
import * as cheerio from 'cheerio';


const buscarProductos = async (url, selectors) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        'Cookie': selectors.cookie ? `${selectors.cookie.name}=${selectors.cookie.value}` : ''
      },
      timeout: 1200000
    });

    const $ = cheerio.load(response.data);

    const productos = $(selectors.item).map((i, item) => ({
      nombre: $(item).find(selectors.nombre).text().trim() || 'Nombre no encontrado',
      precio: $(item).find(selectors.precio).text().trim() || 'Precio no encontrado'
    })).get();

    if (productos.length === 0) {
      return "No hay productos en stock.";
    } else {
      return productos;
    }
  } catch (error) {
    console.error('Error al buscar productos:', error);
    return "Error al buscar productos.";
  }
};

export const buscarProductos_tiendamovil = async (searchTerm) => {
  const url = `https://tiendamovilrosario.com.ar/?s=${encodeURIComponent(searchTerm)}&post_type=product&et_search=true`;
  const selectors = {
    item: '.etheme-product-grid-item',
    nombre: '.etheme-product-grid-content h2',
    precio: '.etheme-product-grid-content .price span.woocommerce-Price-amount.amount bdi',
    cookie: {
      name: 'wordpress_logged_in_e02df6b5731bd035517283f9db6b590d',
      value: 'anovazzimatias182%7C1742557502%7CNAxYVMwrQJADcw0c0johQ8mnw5jEmg96VtSyKTLuxCh%7C37cf48ec4adf41497941a8470e60d7f839210af421b23ef35ec723fef1c97945',
      domain: 'tiendamovilrosario.com.ar'
    }
  };
  let res = await buscarProductos(url, selectors);
  return JSON.stringify(res);
};

export const buscarProductos_celuphone = async (searchTerm) => {
  const url = `https://celuphone.com.ar/?s=${encodeURIComponent(searchTerm)}&post_type=product`;
  const selectors = {
    item: 'ul.products.columns-3 li.product',
    nombre: '.woocommerce-loop-product__title',
    precio: '.price span.woocommerce-Price-amount.amount bdi'
  };
  let res = await buscarProductos(url, selectors);
  return JSON.stringify(res);
};

export const buscarProductos_evophone = async (searchTerm) => {
  const url = `https://evophone.com.ar/?s=${encodeURIComponent(searchTerm)}&post_type=product`;
  const selectors = {
    item: 'div.products div.product-grid-item',
    nombre: 'h3',
    precio: '.price span.woocommerce-Price-amount.amount bdi'
  };
  let res = await buscarProductos(url, selectors);
  return JSON.stringify(res);
};

const proof = async () => {
  let res = [
    await buscarProductos_tiendamovil('modulo e22'),
    await buscarProductos_celuphone('modulo e22'),
    await buscarProductos_evophone('modulo e22')
  ];
  console.log(res);
};

proof();
