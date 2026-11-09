class Ciudad {
    constructor(nombre, pais, gentilicio) {
        this.nombre = nombre;
        this.pais = pais;
        this.gentilicio = gentilicio;
        this.poblacion = 0;
        this.coordenadas = "";
    }

    rellenarAtributos() {
        this.poblacion = 235294;
        this.coordenadas = "37.174, -3.599";
    }

    getCiudad() {
        return this.nombre;
    }

    getPais() {
        return this.pais;
    }

    getInformacionSecundaria() {
        return "<ul>" +
            "<li>Gentilicio: " + this.gentilicio + "</li>" +
            "<li>Población: " + this.poblacion + " habitantes</li>" +
            "</ul>";
    }

    escribeCoordenadas(seccion) {
        let parrafo = document.createElement("p");
        parrafo.textContent = "Coordenadas del centro de la ciudad: " +
            this.coordenadas;
        seccion.appendChild(parrafo);
    }
}


// Crear el objeto Ciudad
let granada = new Ciudad("Granada", "España", "granadino/a");

granada.rellenarAtributos();

// Crear una nueva sección
let seccionCiudad = document.createElement("section");

// Crear el encabezado
let encabezadoCiudad = document.createElement("h3");
encabezadoCiudad.textContent =
    granada.getCiudad() + " (" + granada.getPais() + ")";

seccionCiudad.appendChild(encabezadoCiudad);

// Añadir información secundaria
seccionCiudad.insertAdjacentHTML(
    "beforeend",
    granada.getInformacionSecundaria()
);

// Buscar el encabezado Meteorología
let encabezados = document.querySelectorAll("h2");
let encabezadoMeteorologia = null;

for (let encabezado of encabezados) {
    if (encabezado.textContent.trim().toLowerCase() === "meteorología") {
        encabezadoMeteorologia = encabezado;
        break;
    }
}

// Insertar la sección después del encabezado
if (encabezadoMeteorologia) {
    encabezadoMeteorologia.insertAdjacentElement(
        "afterend",
        seccionCiudad
    );

    // Escribir las coordenadas
    granada.escribeCoordenadas(seccionCiudad);
}