

const puppeteer = require('puppeteer');

// Array para almacenar los resultados y la hora de impresión
const resultados = [];

async function extraerDatos() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.google.com/maps/dir/18.4507649,-69.9193002/Universidad+Iberoamericana,+Av.+Francia+129,+Santo+Domingo+10203/@18.471834,-69.9322297,14z/data=!4m10!4m9!1m1!4e1!1m5!1m1!1s0x8eaf89e0e548e50d:0x293769af0b2a3335!2m2!1d-69.9097635!2d18.4747545!3e0?entry=ttu');

    // Espera a que la página se cargue completamente
    await page.waitForSelector('body');

    // Obtiene el contenido completo de la página
    const contenidoPagina = await page.content();

    // Busca los elementos con la clase deseada
    const regex = /<div class="Fk3sm fontHeadlineSmall delay-light"[^>]*>(.*?)<\/div>/g;
    const matches = [...contenidoPagina.matchAll(regex)];

    // Obtiene la hora actual
    const horaActual = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    // Crea un objeto con los datos de esta ejecución
    const datosEjecucion = {
      hora: horaActual,
      opciones: matches.map((match) => match[1]),
    };

    // Agrega los datos al array de resultados
    resultados.push(datosEjecucion);

    // Ordena los resultados por el tiempo de opción 1 (asumiendo que opción 1 siempre está presente)
    resultados.sort((a, b) => {
      const tiempoOpcion1A = parseInt(a.opciones[0].split(' ')[0]);
      const tiempoOpcion1B = parseInt(b.opciones[0].split(' ')[0]);
      return tiempoOpcion1A - tiempoOpcion1B;
    });

    // Imprime los resultados
    resultados.forEach((resultado, index) => {
      console.log(`Ejecución ${index + 1}:`);
      console.log(`Hora: ${resultado.hora}`);
      resultado.opciones.forEach((opcion, i) => {
        console.log(`Opción ${i + 1}: ${opcion}`);
      });
      console.log('\n');
    });

    await browser.close();
    console.log(' ----------------------------');
  } catch (error) {
    console.error('Error al extraer datos:', error);
  }
}

// Ejecuta la función cada hora
setInterval(extraerDatos, 10000); // 1 hora = 3600000 ms
