function mostrarImagen(id) {
    //para que siempre que (en caso de que no sea la primera vez que se llame a la funcion) desaparezca la imagen que hicimos aparecer antes.
    document.getElementById("imagen-1").style.display = "none";
    document.getElementById("imagen-2").style.display = "none";
    document.getElementById("imagen-3").style.display = "none";

    document.getElementById(id).style.display = "block";

} 
    // const input = document.getElementById("inputImagen").value.trim().toLowerCase();
   // 16
    // Verificamos el texto ingresado y mostramos la imagen en pantalla
    // if (input === "") {
    //    alert("Por favor, ingresa el nombre de una imagen.");
    //} else if (input === "imagen 1") {
    //   document.getElementById("imagen-1").style.display = "block";
    //} else if (input === "imagen 2") {
    //    document.getElementById("imagen-2").style.display = "block";
    //} else if (input === "imagen 3") {
     //   document.getElementById("imagen-3").style.display = "block";
   // } else {
     //   alert("El nombre de la imagen no es válido. Intenta con 'imagen 1', 'imagen 2' o 'imagen 3'.");
    //}