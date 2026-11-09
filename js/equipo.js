class Equipo {
    constructor(nombre, codigoUCI, pais) {
        this.nombre = nombre;
        this.codigoUCI = codigoUCI;
        this.pais = pais;
        this.director = "";
        this.categoria = "";
        this.paginaWeb = "";
    }

    rellenarAtributos() {
        this.director = "Phil West";
        this.categoria = "UCI WorldTeam";
        this.paginaWeb =
            "https://www.lavuelta.es/es/equipo/TPP/team-picnic-postnl";
    }

    datosBasicos() {
        return this.nombre + " (" + this.codigoUCI + ")";
    }

    getPais() {
        return this.pais;
    }

    getInformacionSecundaria() {
        return "<ul>" +
            "<li>Director deportivo: " + this.director + "</li>" +
            "<li>Categoría: " + this.categoria + "</li>" +
            "</ul>";
    }

    getPaginaWeb(seccion) {
        let parrafo = document.createElement("p");
        let enlace = document.createElement("a");

        enlace.href = this.paginaWeb;
        enlace.textContent = "Consultar ficha oficial del equipo";
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";

        parrafo.appendChild(enlace);
        seccion.appendChild(parrafo);
    }

    // Crear la alineación completa de corredores
    mostrarCiclistas(corredores, seccion) {

        // Crear el encabezado
        let encabezado = document.createElement("h3");
        encabezado.textContent = "Alineación de corredores";
        seccion.appendChild(encabezado);

        // Ordenar los corredores por dorsal
        corredores.sort(function(a, b) {
            return a.dorsal - b.dorsal;
        });

        // Crear un artículo para cada corredor
        corredores.forEach(function(ciclista) {

            let articulo = document.createElement("article");

            // Nombre del corredor
            let nombre = document.createElement("h4");
            nombre.textContent =
                ciclista.nombre + " " + ciclista.apellidos;

            articulo.appendChild(nombre);

            // Imagen del corredor
            let imagen = document.createElement("img");
            imagen.src = "multimedia/ciclista-generico.png";
            imagen.alt = "Icono genérico de un ciclista";
            imagen.width = 128;
            imagen.height = 128;

            articulo.appendChild(imagen);

            // Dorsal
            let dorsal = document.createElement("p");
            dorsal.textContent = ciclista.dorsal;

            articulo.appendChild(dorsal);

            // Fecha de nacimiento y nacionalidad
            let informacion = document.createElement("p");
            informacion.textContent =
                ciclista.fecha_nacimiento + " – " +
                ciclista.nacionalidad;

            articulo.appendChild(informacion);

            seccion.appendChild(articulo);
        });
    }
}


// Crear el objeto Equipo
let picnicPostNL = new Equipo(
    "Team Picnic-PostNL",
    "TPP",
    "Países Bajos"
);

picnicPostNL.rellenarAtributos();


// Buscar el encabezado Equipo
let encabezadosEquipo = document.querySelectorAll("h2");
let encabezadoEquipoPrincipal = null;

for (let encabezado of encabezadosEquipo) {
    if (encabezado.textContent.trim().toLowerCase() === "equipo") {
        encabezadoEquipoPrincipal = encabezado;
        break;
    }
}


// Crear las secciones
if (encabezadoEquipoPrincipal) {

    // Sección con la información del equipo
    let seccionEquipo = document.createElement("section");

    let encabezado = document.createElement("h3");
    encabezado.textContent =
        picnicPostNL.datosBasicos() + " - " +
        picnicPostNL.getPais();

    seccionEquipo.appendChild(encabezado);

    seccionEquipo.insertAdjacentHTML(
        "beforeend",
        picnicPostNL.getInformacionSecundaria()
    );

    picnicPostNL.getPaginaWeb(seccionEquipo);

    encabezadoEquipoPrincipal.insertAdjacentElement(
        "afterend",
        seccionEquipo
    );


    // Sección con la alineación de corredores
    let seccionAlineacion = document.createElement("section");

    seccionEquipo.insertAdjacentElement(
        "afterend",
        seccionAlineacion
    );


    // Leer los datos del archivo JSON
    fetch("js/lavuelta.json")
        .then(function(respuesta) {
            return respuesta.json();
        })
        .then(function(datos) {

            // Buscar el equipo Team Picnic PostNL
            let equipoJSON = datos.equipos.find(function(equipo) {
                return equipo.codigo_uci === "TPP";
            });

            if (equipoJSON) {
                picnicPostNL.mostrarCiclistas(
                    equipoJSON.corredores,
                    seccionAlineacion
                );
            }

        })
        .catch(function(error) {
            console.error("Error al leer los datos:", error);
        });
}