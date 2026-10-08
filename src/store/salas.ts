import { Asiento } from "../types/Asiento";
import { Sala } from "../types/Sala";

export const generarAsientosIniciales = (salaId: number): Asiento[] => {
  const asientos: Asiento[] = [];

  for (let fila = 1; fila <= 4; fila++) {
    for (let butaca = 1; butaca <= 4; butaca++) {

      const codigo = `F-${fila} B-${butaca}`;
      const id = `SALA-${salaId}-${codigo}`;

      asientos.push({
        id: id,
        codigo: codigo,
        salaID: salaId,

        ocupado: false,
      });
    }
  }

  return asientos;
};

export const salas: Sala[] = [
  {
    id: 1,
    nombre: "Sala 1",
  },
  {
    id: 2,
    nombre: "Sala 2",
  },
  {
    id: 3,
    nombre: "Sala 3",
  },
  {
    id: 4,
    nombre: "Sala 4",
  },
  {
    id: 5,
    nombre: "Sala 5"
  }
];