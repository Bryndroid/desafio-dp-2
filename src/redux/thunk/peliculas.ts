import type { RootState } from "@/redux/store";
import { ApiError, apiFetch, mapApiPelicula, toApiPelicula, type ApiPelicula } from "@/services/api";
import type { Pelicula } from "@/types/Peliculas";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

const CACHE_KEY = "cine_peliculas";
type ThunkConfig = { state: RootState; rejectValue: string };

async function cacheMovies(movies: Pelicula[]) {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(movies));
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Ocurrió un error al comunicarse con la API.";
}

export const cargarPeliculas = createAsyncThunk<{ peliculas: Pelicula[]; offline: boolean; warning?: string },void,ThunkConfig>("peliculas/cargar", async (_, { rejectWithValue }) => {
  try {
    const response = await apiFetch<ApiPelicula[]>("/peliculas");
    const peliculas = response.map(mapApiPelicula);
    await cacheMovies(peliculas);
    return { peliculas, offline: false };
  } catch (error) {
    if (error instanceof ApiError && error.network) {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) return { peliculas: JSON.parse(cached) as Pelicula[], offline: true };
      return { peliculas: [], offline: true, warning: error.message };
    }
    return rejectWithValue(errorMessage(error));
  }
});

export const crearPelicula = createAsyncThunk<Pelicula, Pelicula, ThunkConfig>(
  "peliculas/crear",
  async (movie, { getState, rejectWithValue }) => {
    try {
      const response = await apiFetch<ApiPelicula>("/peliculas", {
        method: "POST",
        body: JSON.stringify(toApiPelicula(movie)),
      });
      const created = mapApiPelicula(response);
      await cacheMovies([...getState().pelicula.list, created]);
      return created;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const actualizarPelicula = createAsyncThunk<Pelicula, Pelicula, ThunkConfig>(
  "peliculas/actualizar",
  async (movie, { getState, rejectWithValue }) => {
    if (!movie.apiId) return rejectWithValue("No se encontró el identificador de la película en la API.");
    try {
      const response = await apiFetch<ApiPelicula>(`/peliculas/${movie.apiId}`, {
        method: "PUT",
        body: JSON.stringify(toApiPelicula(movie)),
      });
      const updated = mapApiPelicula(response);
      await cacheMovies(getState().pelicula.list.map((item) => item.apiId === updated.apiId ? updated : item));
      return updated;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const eliminarPelicula = createAsyncThunk<number, Pelicula, ThunkConfig>(
  "peliculas/eliminar",
  async (movie, { getState, rejectWithValue }) => {
    if (!movie.apiId) return rejectWithValue("No se encontró el identificador de la película en la API.");
    try {
      await apiFetch<void>(`/peliculas/${movie.apiId}`, { method: "DELETE" });
      await cacheMovies(getState().pelicula.list.filter((item) => item.apiId !== movie.apiId));
      return movie.apiId;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const cambiarEstadoPelicula = createAsyncThunk<Pelicula, Pelicula, ThunkConfig>(
  "peliculas/cambiarEstado",
  async (movie, { dispatch, rejectWithValue }) => {
    const updated = { ...movie, estado: !movie.estado };
    const result = await dispatch(actualizarPelicula(updated));
    if (actualizarPelicula.fulfilled.match(result)) return result.payload;
    return rejectWithValue(typeof result.payload === "string" ? result.payload : "No se pudo cambiar el estado.");
  },
);
