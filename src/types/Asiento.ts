//Aca habria que cambiarlo el ID por un ID UNICO!!. y la fila y butaca pasa a ser un solo campo!.
export interface Asiento {
    id: string,
    codigo: string;
    salaID: number,
    ocupado: boolean,
    usuarioID?: number
}

