// app/socket.js
import { Server as SocketIO } from 'socket.io' // importa y renombra la clase Server de socket.io como SocketIO
import fs from 'fs' // modulo para trabajar con el sistema de archivos
import path from 'path' // modulo para manejar rutas de archivos
import { fileURLToPath } from 'url' // necesario para usar __dirname en modulos

const __filename = fileURLToPath(import.meta.url) // convierte la URL del modulo en una ruta de archivo real
const __dirname = path.dirname(__filename)  // __dirname = ruta del directorio actual

export function initSocketServer(server) {
  const io = new SocketIO(server) // crea una instancia del servidor de sockets conectado al servidor HTTP

  let preguntasPorCasilla = {}  // objeto que asocia una pregunta con cada casilla del tablero
  const preguntasPath = path.join(__dirname, 'data', 'preguntas.json')

  fs.readFile(preguntasPath, 'utf8', (err, data) => { // lee el archivo JSON de preguntas
    if (err) {
      console.error('Error al cargar las preguntas:', err) // muestra error si no se puede leer el archivo
      return
    }
    try {
      const preguntas = JSON.parse(data) // parsea el JSON a un array de objetos
      // Mezcla aleatoriamente las preguntas
      const preguntasMezcladas = preguntas.sort(() => Math.random() - 0.5)
      // Asigna las primeras 21 preguntas mezcladas a las casillas 1 a 21
      for (let i = 1; i <= 21; i++) {
        preguntasPorCasilla[i] = preguntasMezcladas[i - 1]
        }
      console.log('Preguntas cargadas correctamente')
    } catch (e) {
      console.error('Error al parsear preguntas.json:', e)  // Muestra error si el JSON está mal formado
    }
  })

  let jugadores = [] // lista de jugadores conectados
  let turnoActual = 0 // indice del jugador cuyo turno es actualmente
  let juegoIniciado = false // flag para evitar reiniciar el juego cuando ya empezo

  io.on('connection', (socket) => {  // se ejecuta cada vez que un cliente se conecta
    console.log('Jugador conectado:', socket.id)

    socket.on('nuevoJugador', (jugador) => {
      const colorUsado = jugadores.some(j => j.color === jugador.color);
      if(colorUsado){
        socket.emit('mostrarAlerta', 'Ese color ya está en uso. Elegí otro.');
        return;
      }
      if (jugadores.length < 4) { // Acepta hasta 4 jugadores
        jugadores.push({ id: socket.id, ...jugador, posicion: 0 })
        io.emit('actualizarJugadores', jugadores)

        if (jugadores.length >= 2 && !juegoIniciado) {
          juegoIniciado = true
          io.emit('mostrarAlerta', '¡El juego comienza!')
          io.emit('comenzarJuego')  // señal para que los clientes inicien el juego
          io.emit('actualizarTurno', jugadores[turnoActual].id) // indica de quien es el turno
        
        } else if (jugadores.length >= 2 && juegoIniciado) {
             console.log('Reiniciando juego por nuevo jugador...');
             turnoActual = 0;
            //  juegoIniciado = false;

             jugadores = jugadores.map(j => ({ ...j, posicion: 0 })); // pongo a todos en la posicion de largada
             io.emit('mostrarAlerta', 'Se unió un nuevo jugador. El juego se reinicia.');
             console.log('Emitimos resetearJuego a todos los clientes');
             io.emit('resetearJuego', jugadores);
             io.emit('actualizarJugadores', jugadores);
             io.emit('actualizarTurno', jugadores[turnoActual].id) // indica de quien es el turno
         }
      }
    });

    socket.on('tirarDado', ({ jugadorId, numeroDado }) => {
      if (!juegoIniciado) return
      const jugador = jugadores.find(j => j.id === jugadorId)
      if (!jugador) return 

      io.emit('resultadoDado', { jugadorId, numeroDado }) // muestra el numero del dado a todos

      const casillaDestino = jugador.posicion + numeroDado

      const casillaOcupada = jugadores.some(j => j.posicion === casillaDestino);

      if (casillaDestino > 21 || casillaOcupada) {
        if (casillaOcupada) {
          io.to(jugador.id).emit('mostrarAlerta', 'No avanza. La casilla está ocupada.');
        }  
         // si se pasa de la última casilla, no avanza
        turnoActual = (turnoActual + 1) % jugadores.length
        io.emit('actualizarTurno', jugadores[turnoActual].id)
        return
      }
      jugador.posicionPendiente = casillaDestino // guarda la posición destino, aún no se mueve hasta responder
      const pregunta = preguntasPorCasilla[casillaDestino]
      //if (!pregunta) return
      io.to(jugador.id).emit('mostrarPregunta', pregunta) // muestra pregunta solo al jugador correspondiente
    })

    socket.on('responderPregunta', ({ jugadorId, correcta }) => {
      const jugador = jugadores.find(j => j.id === jugadorId)
      if (!jugador || jugador.posicionPendiente === undefined) return

      if (correcta) jugador.posicion = jugador.posicionPendiente // si responde bien, avanza
      delete jugador.posicionPendiente

      io.to(jugador.id).emit('resultadoRespuesta', {
        correcta,
        nuevaPosicion: jugador.posicion,
      })

      io.emit('actualizarJugadores', jugadores) // actualiza posiciones en todos los clientes

      turnoActual = (turnoActual + 1) % jugadores.length
      io.emit('actualizarTurno', jugadores[turnoActual].id)

      if (jugador.posicion === 21) {  // si llega a la última casilla, se declara ganador
        io.emit('ganador', jugador.nombre)
      }
    })

    socket.on('disconnect', () => {
      jugadores = jugadores.filter(j => j.id !== socket.id) // elimina al jugador desconectado
      io.emit('jugadorDesconectado', socket.id)

      if (jugadores.length === 1) { // si queda solo uno, se lo declara ganador
        const ganador = jugadores[0]
        juegoIniciado = false
        turnoActual = 0
        jugadores.forEach(j => j.posicion = 0)  // resetea el estado
        io.emit('ganador', ganador.nombre)
      }
    })
  })
}