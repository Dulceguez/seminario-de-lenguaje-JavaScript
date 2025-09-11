//
alert('¡Bienvenido a JavaScript!');

// punto 4
var text = "Lorem Ipsum dulce de leche";
console.log(text);  

function contarCaracteres(cadena) {
   console.log("La cantidad de caracteres de "+cadena+" son "+cadena.length); 

   let posicion = cadena.indexOf("hola");
   
   if (posicion == -1){
    console.log("No existe la palabra.");
   }else console.log(posicion);
}

contarCaracteres("hola");
let subcadena = text.substring(1,4); // toma los caracteres de la posicion 1,2 y 3 

let subcadenaMayuscula = subcadena.toUpperCase();

console.log(subcadenaMayuscula);

// punto 5

const A = Math.random(), B = Math.random(), C = Math.random();

function operacionNumerica(A,B,C){
    let result = (A + B) ** C;
    console.log(result);

    let max = Math.max(A,B,C);

    console.log("El mas grande es: "+max);
}

operacionNumerica(A,B,C);

// punto 6

let dia1 = new Date();
let dia2 = new Date(1575978300000); // convierte un número en milisegundos desde el 1 de enero de 1970 (timestamp)
console.log(dia1);

function imprimirFecha(){
    const fecha = new Date();

    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // enero = 0
    const anio = fecha.getFullYear();

    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();
  
    console.log(dia+"/"+mes+"/"+anio+" "+hora+":"+minutos+":"+segundos);
}
imprimirFecha();

/*
     Realice una función que reciba dos fechas, asigne el año de dia1 a dia2,
     y viceversa e imprima en consola ambas fechas
*/
const fecha1 = new Date(2025, 3, 15); 
const fecha2 = new Date(2024, 3, 12);

  /*
     Realice una función que reciba dos fechas, asigne el año de dia1 a dia2, y viceversa e imprima en consola ambas fechas.
*/

function cambiarAnios(fecha1, fecha2){
   const aux= fecha1.getFullYear();
   console.log("Los anios antes de cambiarlos. Fecha 1: "+fecha1.getFullYear()+" , el anio de fecha 2: "+fecha2.getFullYear());
   fecha1.setFullYear(fecha2.getFullYear());
   fecha2.setFullYear(aux);
   
 
}

cambiarAnios(fecha1,fecha2);

console.log("Los anios despues de cambiarlos. Fecha 1: "+fecha1.getFullYear()+" , el anio de fecha 2: "+fecha2.getFullYear());
/*
Realice una función que reste dos fechas y retorne una nueva fecha con la diferencia e imprima en consola ambas fechas.
*/

function restarFechas(fecha1,fecha2){
   
    const diferenciaFecha = new Date(fecha1-fecha2);
    console.log("Fecha 1: ", fecha1);
    console.log("Fecha 2: ",fecha2);
    console.log("Diferencia como nueva fecha:", diferenciaFecha);
}
restarFechas(fecha1,fecha2);
//</script>