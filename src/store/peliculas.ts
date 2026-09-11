import { Pelicula } from "../types/Peliculas";

export const peliculas: Pelicula[] = [
  {
    id: "PEL-001",
    nombre: "Spider-Man: Beyond the Spider-Verse",
    genero: "Animación/Acción",
    duracion: 140,
    clasificacion: "B",
    horaInicio: "6:00",
    salaID: 1, // Relación mediante ID
    precio: 7.00,
    estado: true,
  },
  {
    id: "PEL-002",
    nombre: "Intensa Mente 2",
    genero: "Animación",
    duracion: 96,
    horaInicio: "6:00",
    clasificacion: "A",
    salaID: 2, // Relación mediante ID
    precio: 5.50,
    estado: true
  },
  {
    id: "PEL-003",
    nombre: "Alien: Romulus",
    genero: "Terror",
    duracion: 119,
    clasificacion: "D",
    horaInicio: "6:00",
    salaID: 3, // Relación mediante ID
    precio: 10.00,
    estado: true
  },
  {
    id: "PEL-004",
    nombre: "Gladiador 2",
    genero: "Acción/Drama",
    duracion: 150,
    horaInicio: "9:00",
    clasificacion: "C",
    salaID: 4, // Relación mediante ID
    precio: 6.00,
    estado: false
  }
];