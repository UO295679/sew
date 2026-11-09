class Formulario {

    constructor() {

        this.puntuacion = 0;

        this.dureza = 0;
        this.descripcion = "";
        this.usuario = "";

        const boton = document.querySelector(
            'form button[type="submit"]'
        );

        boton.addEventListener("click", this.analizar.bind(this));

        // Los checkbox deben ser excluyentes
        const casillas = document.querySelectorAll(
            'input[name="hitos"]'
        );

        casillas.forEach(casilla => {

            casilla.addEventListener("change", function () {

                if (this.checked) {

                    casillas.forEach(otraCasilla => {

                        if (otraCasilla !== this) {
                            otraCasilla.checked = false;
                        }

                    });

                }

            });

        });
    }

    analizar(event) {

        event.preventDefault();

        this.puntuacion = 0;

        const form = event.target.closest("form");

        // Pregunta 1: número de etapa
        const numero = form.querySelector(
            'input[name="numero-etapa"]'
        ).value;

        if (numero === "21") {
            this.puntuacion++;
        }

        // Pregunta 2: fecha
        const fecha = form.querySelector(
            'input[name="fecha-etapa"]'
        ).value;

        if (fecha === "2026-09-13") {
            this.puntuacion++;
        }

        // Pregunta 3: salida
        const salida = form.querySelector(
            'select[name="salida"]'
        ).value;

        if (salida === "Carrefour Granada") {
            this.puntuacion++;
        }

        // Pregunta 4: llegada
        const llegada = form.querySelector(
            'select[name="llegada"]'
        ).value;

        if (llegada === "Granada") {
            this.puntuacion++;
        }

        // Pregunta 5: tipo de etapa
        const tipo = form.querySelector(
            'input[name="tipo-etapa"]:checked'
        );

        if (tipo && tipo.value === "llana") {
            this.puntuacion++;
        }

        // Pregunta 6: hitos
        const hito = form.querySelector(
            'input[name="hitos"]:checked'
        );

        if (hito && hito.value === "sprint") {
            this.puntuacion++;
        }

        // Pregunta 7: dureza (no puntúa)
        this.dureza = form.querySelector(
            'input[name="dureza"]'
        ).value;

        // Pregunta 8: longitud
        const longitud = form.querySelector(
            'input[name="longitud"]'
        ).value;

        if (longitud === "112") {
            this.puntuacion++;
        }

        // Pregunta 9: desnivel
        // No se puntúa al no disponer de un valor
        // acumulado confirmado en la información consultada.

        // Pregunta 10: descripción (no puntúa)
        this.descripcion = form.querySelector(
            'textarea[name="descripcion"]'
        ).value;

        // Nombre del participante
        this.usuario = form.querySelector(
            'input[name="usuario"]'
        ).value;

        this.calificar();
    }

    calificar() {

        const parrafo = document.createElement("p");

        parrafo.textContent =
            this.usuario + " has obtenido " +
            this.puntuacion +
            " puntos, la dureza que has asignado a la etapa es " +
            this.dureza +
            " y tu descripción " +
            this.descripcion;

        // Evitar acumular resultados de intentos anteriores
        const resultadoAnterior = document.querySelector(
            "p.calificacion"
        );

        if (resultadoAnterior) {
            resultadoAnterior.remove();
        }

        const formulario = document.querySelector("form");

        formulario.insertAdjacentElement("afterend", parrafo);
    }
}

const formulario = new Formulario();