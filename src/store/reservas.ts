import { Reserva } from "../types/Reserva";

export const reservas: Reserva[] = [
  {
    Id: 1,
    usuarioID: 101,
    nombreUsuario: "Laura Gomez",
    total: 14.00, // Compró 2 boletos ($7.00 c/u)
    horaInicio: "17:30",
    horaFinalizacion: "19:50",
    fechaCompra: "2026-07-21",
    // Relaciones normalizadas:
    peliculaID: "PEL-001", 
    asientos: ["F-2 B-1", "F-2 B-2"], // Se asignan 2 asientos para dar sentido al total
    usado: false
  },
  {
    Id: 2,
    usuarioID: 102,
    nombreUsuario: "Josue",
    total: 5.50, // Compró 1 boleto
    horaInicio: "10:00",
    horaFinalizacion: "11:36",
    fechaCompra: "2026-07-20",
    peliculaID: "PEL-002",
    asientos: ["F-2 B-2"],
    usado: false
  },
  {
    Id: 3,
    usuarioID: 103,
    nombreUsuario: "Carlos Fuentes",
    total: 20.00, // Compró 2 boletos ($10.00 c/u)
    horaInicio: "22:30",
    horaFinalizacion: "00:29",
    fechaCompra: "2026-07-21",
    peliculaID: "PEL-003",
    asientos: ["F-1 B-1", "F-1 B-2"], // Se asignan 2 asientos
    usado: false
  },
  {
    Id: 4,
    usuarioID: 104,
    nombreUsuario: "Elena Rojas",
    total: 6.00, // Compró 1 boleto
    horaInicio: "20:00",
    horaFinalizacion: "22:30",
    fechaCompra: "2026-07-15",
    peliculaID: "PEL-004",
    asientos: ["F-1 B-1"],
    usado: false
  },
  {
    Id: 5,
    usuarioID: 105,
    nombreUsuario: "Mario Silva",
    total: 7.00, // Compró 1 boleto
    horaInicio: "17:30",
    horaFinalizacion: "19:50",
    fechaCompra: "2026-07-21",
    peliculaID: "PEL-001", // Misma película que Laura, pero él tiene su propio asiento
    asientos: ["F-3 B-1"],
    usado: false
  }
];