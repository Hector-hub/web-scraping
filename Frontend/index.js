  // Función para obtener los resultados de la API y mostrarlos en el DOM
  async function mostrarResultados() {
    try {
      const response = await fetch('http://localhost:3000/extraerDatos?url=' + encodeURIComponent('https://www.google.com/maps/dir/18.4507649,-69.9193002/Universidad+Iberoamericana,+Av.+Francia+129,+Santo+Domingo+10203/@18.471834,-69.9322297,14z/data=!4m10!4m9!1m1!4e1!1m5!1m1!1s0x8eaf89e0e548e50d:0x293769af0b2a3335!2m2!1d-69.9097635!2d18.4747545!3e0?entry=ttu'));
      const data = await response.json();
console.log(data);
      const resultadosDiv = document.getElementById('resultados');
      resultadosDiv.innerHTML = ''; // Limpiar cualquier contenido anterior

      data.forEach((resultado, index) => {
        const ejecucionDiv = document.createElement('div');
        ejecucionDiv.innerHTML = `<p>Top ${index + 1}:</p>
                                  <p>Hora: ${resultado.hora}</p>`;
        
        const opcionesList = document.createElement('ul');
        resultado.opciones.forEach((opcion, i) => {
          const opcionItem = document.createElement('li');
          opcionItem.textContent = `Opción ${i + 1}: ${opcion}`;
          opcionesList.appendChild(opcionItem);
        });

        ejecucionDiv.appendChild(opcionesList);
        resultadosDiv.appendChild(ejecucionDiv);
      });
    } catch (error) {
      console.error('Error al obtener y mostrar los resultados:', error);
    }
  }

  // Llamar a la función para obtener y mostrar los resultados cuando se carga la página
  mostrarResultados()
  setInterval(()=>{
    mostrarResultados()
  },3600000/2)