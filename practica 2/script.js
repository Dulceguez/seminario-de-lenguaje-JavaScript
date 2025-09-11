var  prices  = [1.2, 2, 22, -33, 12, 0.0, "13", Math.PI];

var  names  = ["John", "Paul", "George", "Ringo"];
function  max(values) { /* retorna el valor máximo */
    let max = values[0];
    for(let value of values){
        if(value > max){
            max = value;
        }
    }
    
    return max;
}

function  min(values) { /* retorna el valor mínimo */
    let min = values[0];
    for (let value of values){
        if(value < min){
            min = value;
        }
    }
    return min;
 }

 // me tira NaN

 function  avg(values) { /* retorna el valor promedio */ 
    let sum = 0;
    for(let value of values) {
        sum += value;
    }
    return sum / values.length;
 }

 function  sum(values) { /* retorna la sumatoria de los valores */ 
    let sum = 0;
    for(let value of values){
        sum += value;
    }
    return sum;
 }
 // 4) Resuelva el ejercicio 3 utilizando reduce, Math.max y Math.min
 
 /*
 *  Verifico si el arreglo es vacio. Si es vacio, reduce retorna error.
 */
 function isEmpty(thing){
    return Array.isArray(thing) && thing.lenght === 0;
 }
 
 function maxMelhor(values) {
    if (isEmpty(values)){
        console.log("El arreglo esta vacio.");
       return;
    }
    const max = Math.max(values);
    return max;
}

function minMelhor(values){
    if(isEmpty(values)){
        console.log("El arreglo esta vacio.");
        return;
    }
    const min = Math.min(min);
    return min;
}

function sumMejor(values){
    if(isEmpty(values)){
        console.log("El arreglo esta vacio.");
        return;
    }
    const sum = values.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
    );
    return sum;
}

function avgMejor(values){
    if(isEmpty(values)){
        console.log("El arreglo esta vacio.");
        return;
    }
    const sum = sumMejor(values) / values.lenght;
    return sum;
}
 /*    Punto 5
 */
var  a  = [1,2,3,4]; var  b  = [1,2,3,4];
// Dos arrays son iguales si tienen la misma longitud y elementos iguales en c/ posicion.
function arrayEquals(a,b){
    let aux;
    if (a.lenght != b.lenght) { return false; } 

    // === igualdad estricta, comapara el valor y el tipo
    // == compara solo valor
    return a.every((elem,i) => elem === b[i]);
}    
console.log(arrayEquals(a,b));

// PUNTO 6
let x = 2;
function  isInteger(x){ // determina si un valor es un numero entero
    return Number.isInteger(x);
}
console.log('Es entero??? ',isInteger(x));

//          ***  punto 7  ***
// verifica si un string es numerico
let str = "2";
function isNumeric(str){
    return typeof str === "string" && str.trim() !== "" && !isNaN(parseFloat(str))
        ? "A numer definitely Rick."
        : "Not a Number Rick!";  
}
console.log("Is a number?? ",isNumeric(str));

//              *** Punto 8 ***

 var  prices  = {
 MILK: 48.90,
 BREAD: 90.50,
 BUTTER: 130.12
 };
 var  amounts  = {
 MILK: 1,
 BREAD: 0.5,
 BUTTER: 0.2
 }
// funcion total retorna el valor total de amounts de acuerdo a
//  los valores de prices tiene los precios por unidad (kilo o
//  litro) y amounts tiene la cantidad comprada de c/ producto.

function  total(prices, amounts) {
    let tot = 0;
    for(let product of Object.keys(amounts)){
        if (product in prices){
            tot += amounts[product] * prices[product];
        }
    }
    return tot;
}
console.log("Total: ",total(prices,amounts));

//          *** Punto 9 ***
// Ordena un arreglo de palabras alfabéticamente y en orden 
// inverso.  Verifique que con su implementación la palabra 
// árbol quede ubicada en la posición correcta.

var vec = ['perro', 'gato', 'casa',
 'árbol', 'nube', 'día', 'noche',
 'zanahoria', 'babuino'];

function ordenarAlfabeticamente(vec){
    return vec.sort((a,b) => a.localeCompare(b, "fr", { ignorePunctuation:
        true }));
}
console.log(ordenarAlfabeticamente(vec));

//          *** Punto 10 ***
// Ordenar vec basado en longitud
function ordenarPorLongitud(vec) {
   const ordenado = vec.sort((a, b) => a.localeCompare(b));
   return ordenado;
}
console.log("Vector ordenado por longitud de palabras: ",ordenarPorLongitud(vec));
//          *** Punto 12 ***
//  Implemente una función equivalente al método reduce de los Arrays (ver ejercicio 4)
var  numbers  = [ 1, 3, 4, 6, 23, 56, 56, 67, 3, 567, 98, 45, 480, 324, 546, 56 ];
var  sum  = (x, y) =>  x  +  y;
console.log(numbers.reduce(sum, 0));

function reduce(array, binaryOperation, initialValue){
    let acumulador = initialValue;
    for(let i=0; i<array.length; i++){
        acumulador = binaryOperation(acumulador,array[i]);
    } 
    return acumulador;
}
console.log(reduce(numbers, sum, 0));

//          ***     Punto 13    ***
var  alice  = {
 name : "Alice",
 dob : new  Date(2001, 3, 4),
 height : 165,
 weight : 68
 };
 var  bob  = {
 name : "Robert",
 dob : new  Date(1997, 0, 31),
 height : 170,
weight : 88
 };
 var  charly  = {
 name : "Charles",
 dob : new  Date(1978, 9, 15),
 height : 188,
 weight : 102
 };
 var  lucy  = {
 name : "Lucía",
 dob : new  Date(1955, 7, 7),
 height : 155,
 weight : 61
 };
 var  peter  = {
 name : "Peter",
 dob : new  Date(1988, 2, 9),
 height : 165,
 weight : 99
 };
 var  luke  = {
 name : "Lucas",
 dob : new  Date(1910, 11, 4),
 height : 172,
 weight : 75
 };

personas = [luke, peter, lucy, charly, bob, alice];
//  devuelve un arreglo con los nombres de las personas con un IMC mayor a 25.
function imcMayorQue25(personas) {
    return personas
    .filter(p => (p.weight/(p.height / 100)**2) > 25) // IMC mayor que 25
    .map(p => p.name); // devuelve solo nombres
}
console.log('Las personas con IMC mayor a 25: ',imcMayorQue25(personas));

// devuelve un arreglo de las edades de las personas indexado por el nombre de cada una. (Por ejemplo algo de la forma ["Bobby": 22, "Mark": 36] ).
function edad(fecha){
    const hoy = new Date();
    const edad = hoy.getFullYear() - fecha.getFullYear(); // restar anios
    const mes = hoy.getMonth - fecha.getMonth();

    // Si aun no llego su cumple, restamos 1
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.dob.getDate())){
        edad--;
    }
    return edad;
}
function arrayIndexadoPorNombre(personas){
    const resultado = {};
    personas.forEach(p => {
        resultado[p.name] = edad(p.dob); // uso name como clave
    });
    return resultado;
}
console.log(arrayIndexadoPorNombre(personas));

// devuelve un arreglo con el IMC de los mayores de 40 anios.
function arrayMayoresDe40(personas){
    
    return personas
            .filter(p => edad(p.dob) > 40)
            .map(p => p.weight/(p.height / 100)**2)
            .map(x => Math.floor(x));
}
console.log('IMC de las personas mayores de 40: ',arrayMayoresDe40(personas));

// devuelve el IMC promedio de todas las personas.
function promedioIMC(personas) {
    const sumaIMC = personas.reduce((acumulador, p) => {
        const altura = p.height / 100;
        const imc = p.weight / (altura ** 2);
        return acumulador + imc;
    }, 0);
    return sumaIMC / personas.lenght;         
}
console.log('IMC promedio: ',promedioIMC(personas));