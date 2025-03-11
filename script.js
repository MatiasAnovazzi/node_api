import puppeteer from 'puppeteer';
import readline from 'readline';
import cliProgress from 'cli-progress';

// Crear interfaz de lectura desde la consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para capturar la entrada del usuario
const askQuestion = (question) => {
  return new Promise(resolve => rl.question(question, resolve));
};

const buscarProductos = async (url, selectors) => {
  const browser = await puppeteer.launch({ headless: false, args: ['--window-size=1200,800'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  // Configurar User-Agent para que parezca una versión de Chrome
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');

  // Barra de progreso
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  progressBar.start(100, 0);

  // Agregar cookie si es necesario
  if (selectors.cookie) {
    const context = browser.defaultBrowserContext();
    await context.setCookie(selectors.cookie);
    console.log('Cookies configuradas:', await context.cookies());
  }
  progressBar.update(30);

  // Ir a la página de productos
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 1200000 });

  // Esperar a que los precios carguen
  await page.waitForSelector(selectors.item, { timeout: 10000 });
  progressBar.update(60);

  // Extraer los datos de los productos
  const productos = await page.evaluate((selectors) => {
    const items = document.querySelectorAll(selectors.item);
    return Array.from(items).map(item => ({
      nombre: item.querySelector(selectors.nombre)?.innerText.trim() || 'Nombre no encontrado',
      precio: item.querySelector(selectors.precio)?.innerText.trim() || 'Precio no encontrado'
    }));
  }, selectors);
  progressBar.update(90);

  // Verificar si el array de productos está vacío
  if (productos.length === 0) {
    console.log("No hay productos en stock.");
  } else {
    console.table(productos);
  }

  progressBar.update(100);
  progressBar.stop();

  await browser.close();
};

const buscarProductos_tiendamovil = async (searchTerm) => {
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
  await buscarProductos(url, selectors);
};

const buscarProductos_celuphone = async (searchTerm) => {
  const url = `https://celuphone.com.ar/?s=${encodeURIComponent(searchTerm)}&post_type=product`;
  const selectors = {
    item: 'ul.products.columns-3 li.product',
    nombre: '.woocommerce-loop-product__title',
    precio: '.price span.woocommerce-Price-amount.amount bdi'
  };
  await buscarProductos(url, selectors);
};

const buscarProductos_evophone = async (searchTerm) => {
  const url = `https://evophone.com.ar/?s=${encodeURIComponent(searchTerm)}&post_type=product`;
  const selectors = {
    item: 'div.products div.product-grid-item',
    nombre: 'h3',
    precio: '.price span.woocommerce-Price-amount.amount bdi'
  };
  await buscarProductos(url, selectors);
};

// Ejemplo de uso de la función
async function main() {
  const searchTerm = await askQuestion('Ingresa el texto a buscar: ');
  rl.close();
  await buscarProductos_tiendamovil(searchTerm);
  await buscarProductos_celuphone(searchTerm);
  await buscarProductos_evophone(searchTerm);
};

main();