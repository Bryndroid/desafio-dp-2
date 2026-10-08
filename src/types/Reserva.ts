
export interface Reserva{
    Id: number,
    codigo: string,
    usuarioID: number,
    nombreUsuario: string,
    peliculaID: string,
    peliculaApiId: number,
    sala: string,
    fechaFuncion: string,
    total: number,
    horaInicio: string,
    horaFinalizacion: string,
    fechaCompra: string,
    asientos: string[],
    usado: boolean
}