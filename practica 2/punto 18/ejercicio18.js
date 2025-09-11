    function cambiarColor() {
      const selector = document.getElementById("selectorDeColor");
      const colorElegido = selector.value;
      document.body.style.backgroundColor = colorElegido;

      // guarda el color seleccionado el local storage
      localStorage.setItem("colorFondo", colorElegido);
    }

    // Al cargar la pagina, aplica el color guardado
    window.addEventListener("load",function() {
      const colorGuardado = this.localStorage.getItem("colorFondo");
      if (colorGuardado){
        this.document.body.style.background = colorGuardado;

        // Asegurar que el valor <select> coincida con el valor guardado
        const selector = this.document.getElementById("selectorDeColor");
        selector.value = colorGuardado;
      }
     
      // Selecciona el valor del <select> 
      const selector = this.document.getElementById("selectorDeColor");
      selector.addEventListener("input",cambiarColor);
    });