// importacion de librerias

import express from 'express' // Para creacion de rutas
import { readFile } from 'fs/promises' // Para poder leer archivos JSON (datos)
import path from 'path'
import { fileURLToPath } from 'url' //para manejar rutas y ubicaciones

const router = express.Router() //creo un router de express

//estas lineas son para obtener la ruta absoluta del archivo json, para poder leer el archivo sin problemas
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataPath = path.join(__dirname, '../data/vehicles.json')

//esta funcion devuelve un array de objetos, con los vehiculos que se encuentan en el json
async function getVehicles() { // 'async' porque leer un archivo es una operación que tarda un tiempo y queremos esperar a que termine
  const raw = await readFile(dataPath, 'utf-8') // 'await' espera que termine la lectura
  return JSON.parse(raw) // Convertimos el texto JSON a objeto JS
}

//endpoint que calcula la distancia total y devuelve un json con la propiedad totalDistance
router.get('/distancia-total', async (req, res) => {
  const vehicles = await getVehicles()
  const total = vehicles.reduce((sum, v) => sum + v.distance, 0)
  res.json({ totalDistance: total })
})

//endpoint que calcula el promedio de km recorrridos por tipo y retonra un json con cada tipo y su promedio
router.get('/distancia-promedio-por-tipo', async (req, res) => {
  const vehicles = await getVehicles()
  const agrupados = {}

  //agrupo los vehiculos por su tipo
  vehicles.forEach(v => {
    if (!agrupados[v.type]) agrupados[v.type] = { total: 0, count: 0 } //si aun no existe la clave para el tipo de vehiculo crea una e inicializa total=0 y count=0
    agrupados[v.type].total += v.distance
    agrupados[v.type].count += 1
  })

  //calculo el promedio de los tipos de vehiculo
  const result = {}
  for (const type in agrupados) {
    result[type] = agrupados[type].total / agrupados[type].count
  }

  res.json(result)
})

// endpoint --> devuelve el vehiculo con el mayor consumo de combustible, basandose en 
//              distancia recorrida y consumo de combustible (se consideran solo vehiculos que utilizan combustible)
router.get('/mayor-consumidor-de-combustible', async (req, res) => {
  const vehicles = await getVehicles();

  const conCombustible = vehicles.filter(v => 'fuelConsumption' in v) 
  
    const mayor = conCombustible.reduce((max,v) => {
      const consumo = (v.distance / 100) * v.fuelConsumption
      const consumoMax = (max.distance / 100) * max.fuelConsumption
      return consumo > consumoMax ? v : max
  })
    res.json(mayor)
})

/*  endpoint --> devuelve el vehiculo que ha recorrido la mayor distancia.
*/
router.get('/mayor-distancia', async (req, res) => {
  const vehicles = await getVehicles();
  
  const maxDistancia = vehicles.reduce((max,v) => {
    return max.distance > v.distance ? max : v
  })
  res.json(maxDistancia)
})

export default router
