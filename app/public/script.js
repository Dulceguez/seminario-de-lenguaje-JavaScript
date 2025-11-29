const socket = io(); //Se conecta al server en tiempo real usando socker.io
let jugadorId = null;
let jugadores = []; //Lista de jugadores activos
let preguntas = []; //Lista de preguntas
let turnoActual = 0; //Para controlar de quien es el turno
let colorElegido = false;
const dadoImg = document.getElementById('dadoImg');

//  Tirar dado
const tirarDadoBtn = document.getElementById('tirarDado');
tirarDadoBtn.addEventListener('click', () => {
 //solo puedo tirar si es mi turno
  if (!jugadores.length || !jugadores[turnoActual]) { return;}
  if (jugadorId !== jugadores[turnoActual].id) {
    alert('No es tu turno.');
    return;
  }
  tirarDadoBtn.disabled = true;
  let contador = 0;
   const intervalo = setInterval(() => {
    const numero = Math.floor(Math.random() * 6) + 1;
    dadoImg.src = `/img/dado${numero}.png`;
    contador++;
    if (contador >= 10) {
      clearInterval(intervalo);

      const resultadoFinal = Math.floor(Math.random() * 6) + 1;
      dadoImg.src = `/img/dado${resultadoFinal}.png`;

      // Enviamos el resultado real al servidor
      socket.emit('tirarDado', {
        jugadorId,
        numeroDado: resultadoFinal
      });
    }
  }, 100);
});

function actualizarFichas(jugadores) {
  // Eliminar fichas anteriores para evitar duplicados
  document.querySelectorAll('.ficha').forEach(ficha => ficha.remove());

  jugadores.forEach(j => {
    const casilla = document.getElementById(`casilla-${j.posicion}`);
    if (casilla) {
      const ficha = document.createElement('div');
      ficha.classList.add('ficha');
      ficha.style.backgroundColor = j.color;
      ficha.textContent = j.nombre[0].toUpperCase();
      casilla.appendChild(ficha);
    }
  });
}

//  Mostrar pregunta
function mostrarPregunta(pregunta) {
  const contenedor = document.getElementById('preguntaContainer');
  contenedor.innerHTML = ''; //limpia la pregunta anterior
  if (!pregunta) {
    console.warn('Se intentó mostrar una pregunta nula');
    return;
  }
  const p = document.createElement('p');
  p.textContent = pregunta.texto;
  contenedor.appendChild(p);

  pregunta.respuestas.forEach((resp, idx) => {
    const btn = document.createElement('button');
    btn.textContent = resp.texto;
    btn.onclick = () => {
      // Le avisamos al server si la respuesta fue correcta o no
      socket.emit('responderPregunta', {
        jugadorId,
        correcta: resp.correcta
      });
      contenedor.innerHTML = ''; // Ocultar pregunta
    };
    contenedor.appendChild(btn);
  });
}
// Le pido las preguntas al servidor
fetch('/preguntas')
  .then(res => res.json())
  .then(data => {
    //se Mesclan aleatoriamente y se eligen 20
    preguntas = data.sort(() => 0.5 - Math.random()).slice(0, 21);
  });

window.addEventListener('DOMContentLoaded', () => {
// Conexión inicial al servidor
 socket.on('connect', () => {
  let nombre ="";
  let color = "";

  while(!nombre || nombre.trim() === ""){
    nombre = prompt("Ingresá tu nombre:");
  }

  // while (!color || color.trim() === ""){
  //   color = prompt("Elegí tu color de ficha (por ej: red, blue, green):");
  // }
  const selector = document.getElementById('selectorColor');
  const botones = document.querySelectorAll('.color-btn');

  if (!colorElegido) {
    selector.style.display = 'flex';
  }

  botones.forEach(btn => {
       btn.addEventListener('click', () => {
         
         if (btn.classList.contains('bloqueado')) {
          alert('Este color ya fue elegido. Elegí otro.');
          return;
        }
         color = btn.dataset.color.toLowerCase(); 
         colorElegido = true;
         // Ocultás el selector después de elegir
         selector.style.display = 'none';
         console.log('Color elegido:', color);
         
         actualizarColores();
         jugadorId = socket.id;
         socket.emit('nuevoJugador', { nombre, color }); //se le avisa al servidor que hay un nuevo jugador
         console.log('Jugador:', nombre, 'Color:', color);
      });
  });
});
});

function actualizarColores(){
  console.log('Jugadores:', jugadores);
  const coloresUsados = jugadores.map(j => j.color.toLowerCase());
  console.log('Colores usados:', coloresUsados);
  const botones = document.querySelectorAll('.color-btn');

  botones.forEach(btn => {
    const colorBtn = btn.dataset.color.toLowerCase();
    console.log(`Botón con color: ${colorBtn}, está usado: ${coloresUsados.includes(colorBtn)}`);
    
    if (coloresUsados.includes(colorBtn)) {
      btn.classList.add('bloqueado');
    } else {
      btn.classList.remove('bloqueado');
    }
  });
}
//  Recibir nuevos jugadores conectados
socket.on('actualizarJugadores', (lista) => {
  jugadores = lista;
  console.log('Jugadores:', jugadores);
  // actualizarColores();
  actualizarTablero(); //Mostramos las posiciones en el tablero
});

socket.on('resultadoRespuesta', ({ correcta, nuevaPosicion }) => {
  if (correcta) {
    alert("¡Respuesta correcta! Avanzás a la casilla " + nuevaPosicion);
  } else {
    alert("Respuesta incorrecta. No avanzás.");
  }

  // Podés actualizar la vista de las fichas si querés reflejar el cambio
  actualizarFichas(jugadores);
});


socket.on('actualizarTurno', (idJugadorConTurno) => {
  turnoActual = jugadores.findIndex(j => j.id === idJugadorConTurno);
  if (jugadorId === idJugadorConTurno) {
     alert("¡Es tu turno para tirar el dado!");
    document.getElementById('tirarDado').disabled = false;
  } else {
    document.getElementById('tirarDado').disabled = true;
  }
});

socket.on('mostrarAlerta', (mensaje) => {
  alert(mensaje);
  if (mensaje.includes('color ya está en uso')) {
    // Volvemos a mostrar el selector de color
    const selector = document.getElementById('selectorColor');
    selector.style.display = 'flex';
  }
});

// Avisa si la respuesta es incorrecta
   socket.on('respuestaIncorrecta', () => {
    alert("Respuesta incorrecta. No avanzás.");
   });

// Actualzia el tablero y modifica las casillas segun la posicion de los jugadores
function actualizarTablero() {
  const tablero = document.getElementById('tablero');
  const casillaInicio = document.getElementById('casillaInicio');
  casillaInicio.querySelectorAll('.ficha').forEach(ficha => ficha.remove()); // limpio fichas en largada
 
  tablero.innerHTML = ''; // Limpiar tablero

  for (let i = 1; i < 21; i++) {
    const casilla = document.createElement('div');
    casilla.className = 'casilla';
    casilla.textContent = i;

    // Ver si hay algún jugador en esta casilla
    jugadores.forEach(j => {
      if (j.posicion === i) {
        const ficha = document.createElement('div');
        ficha.className = 'ficha';
        ficha.style.backgroundColor = j.color;
        ficha.title = j.nombre;
        ficha.textContent = (j.nombre && j.nombre.length > 0) ? j.nombre[0].toUpperCase() : '?';
        casilla.appendChild(ficha);
      }
    });

    tablero.appendChild(casilla);
  }
  // Poner las fichas de los jugadores que estén en la posición 0 (largada)
  jugadores.forEach(j => {
    if (j.posicion === 0) {
      const ficha = document.createElement('div');
      ficha.className = 'ficha';
      ficha.style.backgroundColor = j.color;
      ficha.title = j.nombre;
      ficha.textContent = (j.nombre && j.nombre.length > 0) ? j.nombre[0].toUpperCase() : '?';
      casillaInicio.appendChild(ficha);
    }
  });
}

// Recibir aviso del turno actual y actualizarlo localmente
socket.on('turnoActual', (idTurno) => {
  turnoActual = jugadores.findIndex(j => j.id === idTurno);
  //actualizar UI para mostrar quién juega
  console.log('Turno de:', jugadores[turnoActual]?.nombre);
});

// // Mostrar la pregunta enviada por el servidor (despues de tirar el dado)
  socket.on('mostrarPregunta', (pregunta) => {
    //if (pregunta !== null){
    mostrarPregunta(pregunta);
    //} else console.log('Pregunta es null');
    tirarDadoBtn.disabled = true; // ya tiro, no puede volver a tirar
  });

  // Avisar cuando un jugador gana
  socket.on('ganador', (nombre) => {
    alert(`${nombre} ganó la partida`);
  });

  // Avisar cuando un jugador se desconecta 
  socket.on('jugadorDesconectado', (nombre) => {
    alert(`${nombre} se ha desconectado.`);
  });