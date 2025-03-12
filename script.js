import puppeteer from 'puppeteer';

const buscarProductos = async (url, selectors) => {
  const browser = await puppeteer.launch({ headless : true
  })
  const page = await browser.newPage();

  // Configurar User-Agent para que parezca una versión de Chrome
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');

  // Agregar cookie si es necesario
  if (selectors.cookie) {
    const context = browser.defaultBrowserContext();
    await context.setCookie(selectors.cookie);
    console.log('Cookies configuradas:', await context.cookies());
  }
console.log("aqui estoy 1")
  // Ir a la página de productos
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 1200000 });
  console.log("aqui estoy 2")
  // Esperar a que los precios carguen

  // Extraer los datos de los productos
  const productos = await page.evaluate((selectors) => {
    const items = document.querySelectorAll(selectors.item);
    return Array.from(items).map(item => ({
      nombre: item.querySelector(selectors.nombre)?.innerText.trim() || 'Nombre no encontrado',
      precio: item.querySelector(selectors.precio)?.innerText.trim() || 'Precio no encontrado'
    }));
  }, selectors);
  await browser.close();
  // Verificar si el array de productos está vacío
  if (productos.length === 0) {
    return "No hay productos en stock."
  } else {
    return productos
  }
};

export const buscarProductos_tiendamovil = async (searchTerm) => {
  const url = `https://tiendamovilrosario.com.ar/?s=${encodeURIComponent(searchTerm)}&post_type=product&et_search=true`;
  console.log("buscando en tienda movil")
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
  
  return JSON.stringify(res)
};

export const buscarProductos_celuphone = async (searchTerm) => {
  const url = `https://celuphone.com.ar/?s=${encodeURIComponent(searchTerm)}&post_type=product`;
  console.log("buscando en celuphone")
  const selectors = {
    item: 'ul.products.columns-3 li.product',
    nombre: '.woocommerce-loop-product__title',
    precio: '.price span.woocommerce-Price-amount.amount bdi'
  };
  let res = await buscarProductos(url, selectors);
  return JSON.stringify(res)
};

export const buscarProductos_evophone = async (searchTerm) => {
  const url = `https://evophone.com.ar/?s=${encodeURIComponent(searchTerm)}&post_type=product`;
  console.log("buscando en evophone")
  const selectors = {
    item: 'div.products div.product-grid-item',
    nombre: 'h3',
    precio: '.price span.woocommerce-Price-amount.amount bdi'
  };
  let res = await buscarProductos(url, selectors);
  return JSON.stringify(res)
};
