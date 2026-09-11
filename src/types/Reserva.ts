
export interface Reserva{
    Id: number,
    usuarioID: number,
    nombreUsuario: string,
    peliculaID: string,
    total: number,
    horaInicio: string,
    horaFinalizacion: string,
    fechaCompra: string,
    asientos: string[],
    // Módulo 7: evita que un mismo boleto se valide/escanee más de una vez
    usado: boolean
}