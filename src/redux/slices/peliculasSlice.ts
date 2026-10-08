import { createSlice } from "@reduxjs/toolkit";
import type { Pelicula } from "@/types/Peliculas";
import {
  actualizarPelicula,
  cambiarEstadoPelicula,
  cargarPeliculas,
  crearPelicula,
  eliminarPelicula,
} from "../thunk/peliculas";

interface PeliculaState {
  list: Pelicula[];
  error: string | null;
  loading: boolean;
  saving: boolean;
  offline: boolean;
}

const initialState: PeliculaState = {
  list: [],
  error: null,
  loading: false,
  saving: false,
  offline: false,
};

const peliculaSlice = createSlice({
  name: "pelicula",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarPeliculas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cargarPeliculas.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.peliculas;
        state.offline = action.payload.offline;
        state.error = action.payload.warning ?? null;
      })
      .addCase(cargarPeliculas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "No se pudieron cargar las películas.";
      })
      .addCase(crearPelicula.pending, (state) => { state.saving = true; state.error = null; })
      .addCase(actualizarPelicula.pending, (state) => { state.saving = true; state.error = null; })
      .addCase(eliminarPelicula.pending, (state) => { state.saving = true; state.error = null; })
      .addCase(cambiarEstadoPelicula.pending, (state) => { state.saving = true; state.error = null; })
      .addCase(crearPelicula.fulfilled, (state, action) => {
        state.saving = false;
        state.list.push(action.payload);
        state.offline = false;
      })
      .addCase(actualizarPelicula.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.list.findIndex((movie) => movie.apiId === action.payload.apiId);
        if (index !== -1) state.list[index] = action.payload;
        state.offline = false;
      })
      .addCase(eliminarPelicula.fulfilled, (state, action) => {
        state.saving = false;
        state.list = state.list.filter((movie) => movie.apiId !== action.payload);
        state.offline = false;
      })
      .addCase(cambiarEstadoPelicula.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.list.findIndex((movie) => movie.apiId === action.payload.apiId);
        if (index !== -1) state.list[index] = action.payload;
        state.offline = false;
      })
      .addCase(crearPelicula.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? action.error.message ?? "No se pudo crear la película.";
      })
      .addCase(actualizarPelicula.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? action.error.message ?? "No se pudo actualizar la película.";
      })
      .addCase(eliminarPelicula.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? action.error.message ?? "No se pudo eliminar la película.";
      })
      .addCase(cambiarEstadoPelicula.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? action.error.message ?? "No se pudo cambiar el estado.";
      });
  },
});

export const { clearError } = peliculaSlice.actions;
export default peliculaSlice.reducer;
