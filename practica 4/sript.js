//importa excpress y el router creado
import express from 'express'
import vehiclesRouter from './routes/vehicles.js'

// se crea la app express y seteamos el puerto en 3000
const app = express()
const port = 3000

//se le dice a express que use el middleware para entender json y que cuando la ruta empiece con /vehicles use las rutas definidas en vehiclesRouter
app.use(express.json())
app.use('/vehicles', vehiclesRouter)

//se inicia el servidor y en consola imprime que se esta corriendo en el puerto 3000
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
})