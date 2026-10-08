
import type { Asiento } from "./Asiento";

// Cada sala tendrá 4 filas de asientos con 4 columnas.
export interface Sala{
    id: number,
    nombre:string,
    peliculaId?: string,
    asientos?: Asiento[],
}