import { createServer } from 'node:http';
import puppeteer from 'puppeteer';

const resultados =[]
const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Permite todas las solicitudes CORS

  if (req.method === 'GET' && req.url.startsWith('/extraerDatos')) {
    const url = req.url.split('=')[1];

    const data = await extraerDatos(decodeURIComponent(url));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Método no permitido.\n');
  }
});

// Inicia el servidor localmente en el puerto 3000
server.listen(3000, '127.0.0.1', () => {
  console.log('Servidor escuchando en http://127.0.0.1:3000/');
});


// Función para extraer los datos utilizando Puppeteer
async function extraerDatos(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    await page.waitForSelector('body');

    const opciones = await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('.XdKEzd .Fk3sm.fontHeadlineSmall'));
      return divs.map(div => div.innerText);
    });
    
    const horaActual = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    
    const datosEjecucion = {
      hora: horaActual,
      opciones: opciones,
    };
      
    resultados.push(datosEjecucion);

    resultados.sort((a, b) => {
      const tiempoOpcion1A = parseInt(a.opciones[0].split(' ')[0]);
      const tiempoOpcion1B = parseInt(b.opciones[0].split(' ')[0]);
      return tiempoOpcion1A - tiempoOpcion1B;
    });

    console.log(resultados);

    await browser.close();
    console.log(' ----------------------------');

    return resultados;
  } catch (error) {
    console.error('Error al extraer datos:', error);
    return { error: 'Error al extraer datos' };
  }
}
