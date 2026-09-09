
export interface Reserva{
    Id: number,
    usuarioID: number,
    nombreUsuario: string,
    peliculaID: string,
    total: number,
    horaInicio: string,
    horaFinalizacion: string,
    fechaCompra: string,
    asientos: string[]
}