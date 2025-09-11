import ejs from 'ejs'
import express from 'express'
import { fileURLToPath } from 'url'
import indexRouter from './routes/index.js'
import path from 'path'
import usersRouter from './routes/users.js'
import { createServer } from 'http'
import { initSocketServer } from './socket.js' 

const app = express()
const server = createServer(app)
const port = 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

initSocketServer(server) // <--- inicializar socket.io con el mismo servidor


// Configuración de vistas: lee los archivos .ejs de la carpeta views
app.set('views', path.join(__dirname, '..', 'views'))
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware para parsear el body de las peticiones: permite poder recibir datos en formato JSON
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Middleware para servir archivos estáticos: permite servir archivos estáticos como imágenes, CSS, JS, etc.
app.use(express.static(path.join(__dirname, 'public')))

/*
 * Configuración de rutas: importa las rutas
 * Si querés agregar nuevas rutas, acá tenes que importarlas y configurarlas
 */
app.use('/', indexRouter)
app.use('/users', usersRouter)

// Inicialización del servidor
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
