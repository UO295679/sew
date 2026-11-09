class Buscador {

    constructor() {

        const lupa = document.querySelector("search label img");

        const entrada = document.querySelector(
            'search input[type="search"]'
        );

        lupa.addEventListener(
            "click",
            this.buscar.bind(this)
        );

        entrada.addEventListener("keypress", (evento) => {

            if (evento.key === "Enter") {

                evento.preventDefault();

                this.buscar();
            }

        });
    }

    buscar() {

        this.limpiar_busqueda();

        const resultados = [];

        const texto = document.querySelector(
            'search input[type="search"]'
        ).value;

        if (texto !== "") {

            // Crear la expresión regular
            const textoSeguro = texto.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            const regexp = new RegExp(textoSeguro, "gi");

            // Obtener los nodos de texto del documento
            const walker = document.createTreeWalker(
                document.querySelector("body"),
                NodeFilter.SHOW_TEXT
            );

            // Obtener el primer nodo
            let nodo = walker.nextNode();

            // Recorrer los nodos
            while (nodo) {

                const elementoPadre = nodo.parentElement;

                if (elementoPadre &&
                    !["SCRIPT", "STYLE", "SEARCH", "MARK"]
                        .includes(elementoPadre.tagName)) {

                    regexp.lastIndex = 0;

                    if (regexp.test(nodo.textContent)) {

                        resultados.push(nodo);
                    }
                }

                nodo = walker.nextNode();
            }

            // Resaltar los resultados
            resultados.forEach(nodo => {

                const nuevoTexto = nodo.textContent.replaceAll(
                    regexp,
                    "<mark>$&</mark>"
                );

                nodo.parentElement.innerHTML = nuevoTexto;

            });
        }
    }

    limpiar_busqueda() {

        const marcas = document.querySelectorAll("mark");

        marcas.forEach(marca => {

            marca.replaceWith(
                document.createTextNode(marca.textContent)
            );

        });

        document.body.normalize();
    }
}

const buscador = new Buscador();