
export interface Pelicula{
    id: string,
    apiId?: number,
    nombre: string,
    genero: string,
    duracion: number,
    clasificacion: string,
    salaID: number,
    salaNombre: string,
    horaInicio: string, //Esto esta sujeto a cambios para realizar validaciones
    horaFinalizacion?: string,
    imgRef: string,
    precio: number,
    estado: boolean
}