
export interface Pelicula{
    id: string,
    nombre: string,
    genero: string,
    duracion: number,
    clasificacion: "A" | "B" | "C" | "D" | "E",
    salaID: number,
    horaInicio: string, //Esto esta sujeto a cambios para realizar validaciones
    precio: number,
    estado: boolean
}