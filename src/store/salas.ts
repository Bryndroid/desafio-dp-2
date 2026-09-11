import { Asiento } from "../types/Asiento";
import { Sala } from "../types/Sala";
import { peliculas } from "./peliculas";
import { reservas } from "./reservas";

const generarAsientosIniciales = (salaId: number): Asiento[] => {
  const asientos: Asiento[] = [];

  // Obtenemos las reservas que pertenecen a las películas
  // proyectadas en esta sala
  const reservasDeEstaSala = reservas.filter((reserva) => {
    const pelicula = peliculas.find(
      (p) => p.id === reserva.peliculaID
    );

    return pelicula?.salaID === salaId;
  });

  for (let fila = 1; fila <= 4; fila++) {
    for (let butaca = 1; butaca <= 4; butaca++) {

      const codigo = `F-${fila} B-${butaca}`;
      const id = `SALA-${salaId}-${codigo}`;

      // Buscamos si este asiento específico está reservado
      const reservaDelAsiento = reservasDeEstaSala.find((reserva) =>
        reserva.asientos.includes(codigo)
      );

      asientos.push({
        id: id,
        codigo: codigo,
        salaID: salaId,

        // Si encontramos una reserva, está ocupado
        ocupado: !!reservaDelAsiento,

        // Usuario que reservó el asiento
        usuarioID: reservaDelAsiento?.usuarioID,
      });
    }
  }

  return asientos;
};

export const salas: Sala[] = [
  {
    id: 1,
    peliculaId:"PEL-001",
    nombre: "Sala IMAX",
    asientos: generarAsientosIniciales(1),
  },
  {
    id: 2,
    peliculaId:"PEL-002",
    nombre: "Sala Junior",
    asientos: generarAsientosIniciales(2),
  },
  {
    id: 3,
    peliculaId:"PEL-003",
    nombre: "Sala VIP",
    asientos: generarAsientosIniciales(3),
  },
  {
    id: 4,
    peliculaId:"PEL-004",
    nombre: "Sala MacroXE",
    asientos: generarAsientosIniciales(4),
  },
];