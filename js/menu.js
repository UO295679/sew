class Menu {

    constructor() {

        this.boton = document.querySelector("header > button");

        this.menu = document.querySelector("header nav");

        this.boton.addEventListener(
            "click",
            this.desplegar.bind(this)
        );
    }

    desplegar() {

        this.menu.classList.toggle("abierto");

        if (this.menu.classList.contains("abierto")) {

            this.boton.textContent = "x";

            this.boton.setAttribute("aria-expanded", "true");

            this.boton.setAttribute(
                "aria-label",
                "Cerrar menú de navegación"
            );

        }
        else {

            this.boton.textContent = "☰";

            this.boton.setAttribute("aria-expanded", "false");

            this.boton.setAttribute(
                "aria-label",
                "Abrir menú de navegación"
            );

        }
    }
}

const menu = new Menu();