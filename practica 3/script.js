 var jsonStr = '['
 + '{"name":"Alice","dob": "2001-03-04T00:00:00.000Z","trips": 20},'
 + '{"name":"Robert","dob": "1997-01-31T00:00:00.000Z","trips": 5},'
 + '{"name":"Charles","dob": "1978-10-15T00:00:00.000Z","trips": 12},'
 + '{"name":"Lucía","dob": "1955-08-07T00:00:00.000Z","trips": 30},'
 + '{"name":"Peter","dob": "1988-03-09T00:00:00.000Z","trips": 8},'
 + '{"name":"Lucas","dob": "1910-12-04T00:00:00.000Z","trips": 2}]'

  function frequentTravelers(jsonStr){
 return people
 .filter(p => p.trips > 10)
 .map(p => p.name)
 .reduce((n1, n2) => n1 + ", " + n2)
 }

var people = JSON.parse(jsonStr);
var result = frequentTravelers(people);
console.log(result);
// Este resultado indica quiénes han viajado más de 10 veces, sugiriendo una mayor huella de carbono debido a la frecuencia de sus viajes.

// imprima en la consola el nombre de la próxima persona en cumplir años.
function proxQueCumpleAnios(people){
    const hoy = new Date();
    const ahora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    const cumple = people.map(p => {
        const fechaNac = new Date(p.dob);
        let proxCumple = new Date(hoy.getFullYear(), fechaNac.getMonth(), fechaNac.getDate());

        if (proxCumple < ahora) {
            proxCumple.setFullYear(hoy.getFullYear()+ 1);
        }

        return {
            name : p.name, cumple: proxCumple
        };
    });

    cumple.sort((a,b) => a.cumple - b.cumple);
    return cumple[0].name;
}
console.log(proxQueCumpleAnios(people));

const lista = document.createElement('ul');
document.body.appendChild(lista);

let paises = []; // guardar paises para poder filtrarlos

fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json()) //convierte el formato JSON a un objeto JS usable
    .then(data => {
        paises = data; // guarda todos los paises
        mostrarPaises(data);
    })
    .catch(error => {
        console.error('Error al obtener paises:',error);
        lista.innerHTML = '<li>No se pudo cargar la lista de países </li>';
    });

function mostrarPaises(data) {
    // limpiar lista
    while(lista.firstChild){
        lista.removeChild(lista.firstChild);
    }

    data.forEach(pais => {
        const nombre = pais.name.common;
        const poblacion = pais.population;
        const capital = pais.capital;
        const continente = pais.continents;
        const hora = pais.timezones;

        const li = document. createElement('li');
        li.textContent = `${nombre} - Capital: ${capital}, Poblacion: ${poblacion}, Continente: ${continente}, Hora: ${hora}`;
        lista.appendChild(li);

    });
}


function filtrarPaises(){   
    const texto = document.getElementById('filtro').value.toLowerCase(); // convierte todo a minuscula
    const resultado = paises.filter(p =>
        p.name.common.toLowerCase().includes(texto)
    ); // filtra para quedarme con los paises que contenga 'texto'
    ordenarYMostrar(resultado);
}

// evento para boton de filtrar
document.getElementById('mostrarPaises').addEventListener('click',filtrarPaises);

// evento para enter de filtrar
document.getElementById('filtro').addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        filtrarPaises();
    }
});

document.getElementById('datos').addEventListener('change', () => {
    filtrarPaises();
});

function ordenarYMostrar(datos){
    const criterio = document.getElementById('datos').value;
    
    // [...datos] copia los datos  
    const ordenado = [...datos].sort((a,b) => {
        switch (criterio) {
            case 'nombre':
                return a.name.common.localeCompare(b.name.common);
            case 'poblacion':
                return a.population - b.population;
            case 'capital':
                return a.capital.localeCompare(b.capital);
            case 'continente':
                return a.continents.localeCompare(b.continents);
            case 'hora':
                return a.timezones.localeCompare(b.timezones);
            default:
                return 0;    
        }
    });

    mostrarPaises(ordenado);
}
var pag = 1;
totalPaginas = 1;

function cargarPersonajes(){
    fetch(`https://swapi-node.vercel.app/api/people?page=${pag}&limit=10`) // muestra 10 por pagina
        .then(res => res.json())
        .then(data => {
            console.log(data);
            totalPaginas = data.pages;
            const list = document.getElementById('lista-personajes');
            list.innerHTML = ''; // limpia personajes anteriores
            data.results.forEach(p => {
                const div = document.createElement('div');
                div.textContent = p.fields.name;
                div.addEventListener('click', () => mostrarDetalles(p.fields.url)); //click en el personaje para mostrar los detalles

                list.appendChild(div);
            });
            document.getElementById('pagina-actual').textContent = `Página ${pag} de ${totalPaginas}`;
        })
    .catch(err => console.error("Error:", err));
}

function mostrarDetalles(urlPersonaje) {
    //Informacion del personaje segun su uid
    fetch(`https://swapi-node.vercel.app${urlPersonaje}`) //accede a la api del personaje indicado por el url del personaje
        .then(res => res.json())
        .then(data => {
            const personaje = data.fields;
            const planetaURL = personaje.homeworld; //guarda la url del planeta del personaje
            const films = personaje.films
            //Informacion del planeta del personaje
            fetch(`https://swapi-node.vercel.app${planetaURL}`)
                .then(res => res.json())
                .then(planetData => {
                const planeta = planetData.fields.name;
                // Ahora traemos los films, que puede ser un array vacío o con URLs
                    if (personaje.films.length > 0) {
                        // Mapeamos los fetch de cada film
                        Promise.all(
                            personaje.films.map(filmURL =>
                                fetch(`https://swapi-node.vercel.app${filmURL}`)
                                    .then(res => res.json())
                            )
                        )
                        .then(filmsData => {
                            // filmsData es un array con la info de cada film
                            const nombresFilms = filmsData.map(f => f.fields.title);
                            mostrarEnPantalla(personaje, planeta, nombresFilms);
                        })
                    } else {
                        // No hay films, mando array vacío
                        mostrarEnPantalla(personaje, planeta, []);
                    }
                });
        })  
            .catch (err => console.error("Detalles de error : ", err)); //Aviso si hay algun error

}

function mostrarEnPantalla(personaje, planeta, films) {
    let detalles = document.getElementById('detalles-personaje');
    let listaFilms = films.length > 0
        ? `<ul>${films.map(f => `<li>${f}</li>`).join('')}</ul>`
        : `<p>No tiene films asociados.</p>`;   //Si tiene films, lista films toma el valor de una lista y si no es un parrafo que avisa que no tiene films

    detalles.style.display = 'block'; //muestra los detalles en pantalla
    detalles.innerHTML = `
        <h2>${personaje.name}</h2>
        <p><strong>Altura:</strong> ${personaje.height} cm</p>
        <p><strong>Peso:</strong> ${personaje.mass} kg</p>
        <p><strong>Género:</strong> ${personaje.gender}</p>
        <p><strong>Planeta:</strong> ${planeta}</p>
        ${listaFilms}
   
    `;
}


function siguientePagina(){
    if(pag < totalPaginas){
         pag++; cargarPersonajes();
    }
}

function anteriorPagina(){
    if (pag > 1){
        pag--; cargarPersonajes();
    }
}

cargarPersonajes(); // cargar la primera vez