class Ciclista {

    constructor(dorsal, nacionalidad, nacionalidad_codigo,
                nombre, apellidos, fecha_nacimiento) {

        this.dorsal = dorsal;
        this.nacionalidad = nacionalidad;
        this.nacionalidad_codigo = nacionalidad_codigo;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.fecha_nacimiento = fecha_nacimiento;
    }

    getNombreCompleto() {
        return this.nombre + " - " + this.apellidos;
    }

    getDorsal() {
        return this.dorsal;
    }

    getInformacionAdicional() {
        return this.fecha_nacimiento + ", " + this.nacionalidad;
    }
}