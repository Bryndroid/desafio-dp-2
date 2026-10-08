import { API_BASE_URL } from "@/config";
import type { Pelicula } from "@/types/Peliculas";
import type { Reserva } from "@/types/Reserva";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number | null,
    readonly network = false,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError(
      "Configura EXPO_PUBLIC_API_URL con la URL base de la API desplegada en Railway.",
      null,
      true,
    );
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor. Revisa tu conexión a internet.", null, true);
  }

  if (!response.ok) {
    let message = `Error del servidor (${response.status}).`;
    try {
      const body: unknown = await response.json();
      if (body && typeof body === "object" && "error" in body && typeof body.error === "string") {
        message = body.error;
      } else if (body && typeof body === "object" && "message" in body && typeof body.message === "string") {
        message = body.message;
      }
    } catch {
      if (response.status === 409) message = "El recurso cambió o ya no está disponible. Actualiza los datos.";
      else if (response.status === 404) message = "No se encontró el recurso solicitado.";
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export interface ApiPelicula {
  id: number;
  codigo: string;
  nombre: string;
  genero: string;
  duracion: number;
  clasificacion: string;
  sala: string;
  hora_inicio: string;
  hora_finalizacion: string;
  img_ref: string;
  precio: number | string;
  estado: "Disponible" | "No disponible";
}

export interface ApiReserva {
  id: number;
  codigo: string;
  usuario_id: number;
  pelicula_id: number;
  nombre_cliente: string;
  sala: string;
  fecha_iniciacion_funcion: string;
  asientos: string;
  cantidad: number;
  total: number | string;
  utilizado: number | boolean;
  fecha_compra: string;
}

export interface ApiPeliculaPayload {
  codigo: string;
  nombre: string;
  genero: string;
  duracion: number;
  clasificacion: string;
  sala: string;
  hora_inicio: string;
  img_ref: string;
  precio: number;
  estado: "Disponible" | "No disponible";
}

export function mapApiPelicula(movie: ApiPelicula): Pelicula {
  const salaNumero = Number(movie.sala.match(/\d+/)?.[0]);
  return {
    id: movie.codigo,
    apiId: movie.id,
    nombre: movie.nombre,
    genero: movie.genero,
    duracion: Number(movie.duracion),
    clasificacion: movie.clasificacion,
    salaID: salaNumero > 0 ? salaNumero : 1,
    salaNombre: movie.sala,
    horaInicio: movie.hora_inicio.slice(0, 5),
    horaFinalizacion: movie.hora_finalizacion.slice(0, 5),
    imgRef: movie.img_ref,
    precio: Number(movie.precio),
    estado: movie.estado === "Disponible",
  };
}

export function toApiPelicula(movie: Pelicula): ApiPeliculaPayload {
  const hora = movie.horaInicio.length === 5 ? `${movie.horaInicio}:00` : movie.horaInicio;
  return {
    codigo: movie.id,
    nombre: movie.nombre.trim(),
    genero: movie.genero.trim(),
    duracion: movie.duracion,
    clasificacion: movie.clasificacion,
    sala: movie.salaNombre,
    hora_inicio: hora,
    img_ref: movie.imgRef,
    precio: movie.precio,
    estado: movie.estado ? "Disponible" : "No disponible",
  };
}
//Aqui lo desformateo
export function mapAsientoApi(asiento: string): string {
  console.log(asiento);
  const match = /^([A-Z])(\d+)$/i.exec(asiento.trim());
  return match ? `F-${match[1].toUpperCase().charCodeAt(0) - 64} B-${match[2]}` : asiento;
}
//Aqui mapeo los asientos a un formato mas comun
export function mapAsientoCliente(asiento: string): string {
  const match = /^F-(\d+)\s+B-(\d+)$/i.exec(asiento.trim());
  return match ? `${String.fromCharCode(64 + Number(match[1]))}${match[2]}` : asiento;
}

export function normalizarFechaFuncion(fecha: string): string {
  const match = /^(\d{4}-\d{2}-\d{2})[T ](\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(fecha.trim());
  if (!match) {
    throw new Error("La API devolvió una fecha de función con formato no válido.");
  }

  return `${match[1]} ${match[2].padStart(2, "0")}:${match[3]}:${match[4] ?? "00"}`;
}

export function mapApiReserva(reservation: ApiReserva, movies: Pelicula[] = []): Reserva {
  const functionDate = normalizarFechaFuncion(reservation.fecha_iniciacion_funcion);
  const movie = movies.find((item) => item.apiId === Number(reservation.pelicula_id));
  const start = new Date(`1970-01-01T${functionDate.slice(11, 19)}`);
  if (movie) start.setMinutes(start.getMinutes() + movie.duracion);
  const end = `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`;

  return {
    Id: Number(reservation.id),
    codigo: reservation.codigo,
    usuarioID: Number(reservation.usuario_id),
    nombreUsuario: reservation.nombre_cliente,
    peliculaID: movie?.id ?? String(reservation.pelicula_id),
    peliculaApiId: Number(reservation.pelicula_id),
    sala: reservation.sala,
    fechaFuncion: functionDate,
    total: Number(reservation.total),
    horaInicio: functionDate.slice(11, 16),
    horaFinalizacion: end,
    fechaCompra: reservation.fecha_compra.replace("T", " ").slice(0, 19),
    asientos: reservation.asientos.split(",").filter(Boolean).map(mapAsientoApi),
    usado: Boolean(reservation.utilizado),
  };
}
