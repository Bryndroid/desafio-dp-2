import { USUARIO_GENERICO_ID } from "@/config";
import type { RootState } from "@/redux/store";
import { ApiError, apiFetch, mapApiReserva, mapAsientoCliente, type ApiReserva } from "@/services/api";
import type { Pelicula } from "@/types/Peliculas";
import type { Reserva } from "@/types/Reserva";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

const CACHE_KEY = "cine_reservas";
type ThunkConfig = { state: RootState; rejectValue: string };
type CrearReservaConfig = {
  state: RootState;
  rejectValue: { message: string; status: number | null };
};

interface CrearReservaPayload {
  peliculaId: number;
  nombreCliente: string;
  sala: string;
  fechaFuncion: string;
  asientos: string[];
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Ocurrió un error al comunicarse con la API.";
}

function mapReservation(response: ApiReserva, movies: Pelicula[]) {
  return mapApiReserva(response, movies);
}

export const cargarReservas = createAsyncThunk<{ reservas: Reserva[]; offline: boolean; warning?: string },void,ThunkConfig>("reservas/cargar", async (_, { getState, rejectWithValue }) => {
  try {
    const response = await apiFetch<ApiReserva[]>("/reservas");
    const reservas = response.map((item) => mapReservation(item, getState().pelicula.list));
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(reservas));
    return { reservas, offline: false };
  } catch (error) {
    if (error instanceof ApiError && error.network) {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) return { reservas: JSON.parse(cached) as Reserva[], offline: true };
      return { reservas: [], offline: true, warning: error.message };
    }
    return rejectWithValue(errorMessage(error));
  }
});

export const guardarReserva = createAsyncThunk<Reserva, CrearReservaPayload, CrearReservaConfig>(
  "reservas/crear",
  async (booking, { getState, rejectWithValue }) => {
    try {
      const response = await apiFetch<ApiReserva>("/reservas", {
        method: "POST",
        body: JSON.stringify({
          pelicula_id: booking.peliculaId,
          usuario_id: USUARIO_GENERICO_ID,
          nombre_cliente: booking.nombreCliente.trim(),
          sala: booking.sala,
          fecha_iniciacion_funcion: booking.fechaFuncion,
          asientos: booking.asientos.map(mapAsientoCliente),
        }),
      });
      const reserva = mapReservation(response, getState().pelicula.list);
      const current = getState().reserva.list;
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify([...current.filter((item) => item.Id !== reserva.Id), reserva]),
      );
      return reserva;
    } catch (error) {
      return rejectWithValue({
        message: errorMessage(error),
        status: error instanceof ApiError ? error.status : null,
      });
    }
  },
);

export const obtenerReserva = createAsyncThunk<Reserva, number, ThunkConfig>(
  "reservas/obtener",
  async (id, { getState, rejectWithValue }) => {
    try {
      const response = await apiFetch<ApiReserva>(`/reservas/${id}`);
      const reserva = mapReservation(response, getState().pelicula.list);
      const current = getState().reserva.list;
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify([...current.filter((item) => item.Id !== reserva.Id), reserva]),
      );
      return reserva;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const validarReserva = createAsyncThunk<
  { id: number; codigo: string },
  string,
  ThunkConfig
>("reservas/validar", async (codigo, { getState, rejectWithValue }) => {
  try {
    const response = await apiFetch<{ id: number; codigo: string; utilizado: number }>(
      `/reservas/${encodeURIComponent(codigo)}/validar`,
      { method: "PUT" },
    );
    const updated = getState().reserva.list.map((item) =>
      item.Id === response.id || item.codigo === response.codigo ? { ...item, usado: true } : item
    );
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    return { id: response.id, codigo: response.codigo };
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});
