import { createSlice } from "@reduxjs/toolkit";
import type { Reserva } from "@/types/Reserva";
import { cargarReservas, guardarReserva, obtenerReserva, validarReserva } from "../thunk/reservas";

interface ReservasState {
  list: Reserva[];
  error: string | null;
  loading: boolean;
  saving: boolean;
  offline: boolean;
  validating: boolean;
}

const initialState: ReservasState = {
  list: [],
  error: null,
  loading: false,
  saving: false,
  offline: false,
  validating: false,
};

function guardarEnLista(state: ReservasState, reserva: Reserva) {
  const index = state.list.findIndex((item) => item.Id === reserva.Id);
  if (index === -1) state.list.push(reserva);
  else state.list[index] = reserva;
}

const reservaSlice = createSlice({
  name: "reserva",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarReservas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cargarReservas.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.reservas;
        state.offline = action.payload.offline;
        state.error = action.payload.warning ?? null;
      })
      .addCase(cargarReservas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "No se pudieron cargar las reservas.";
      })
      .addCase(guardarReserva.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(guardarReserva.fulfilled, (state, action) => {
        state.saving = false;
        state.offline = false;
        guardarEnLista(state, action.payload);
      })
      .addCase(guardarReserva.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message ?? action.error.message ?? "No se pudo guardar la reserva.";
      })
      .addCase(obtenerReserva.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerReserva.fulfilled, (state, action) => {
        state.loading = false;
        guardarEnLista(state, action.payload);
      })
      .addCase(obtenerReserva.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "No se pudo cargar el detalle.";
      })
      .addCase(validarReserva.pending, (state) => {
        state.validating = true;
        state.error = null;
      })
      .addCase(validarReserva.fulfilled, (state, action) => {
        state.validating = false;
        const reserva = state.list.find((item) => item.Id === action.payload.id || item.codigo === action.payload.codigo);
        if (reserva) reserva.usado = true;
      })
      .addCase(validarReserva.rejected, (state, action) => {
        state.validating = false;
        state.error = action.payload ?? action.error.message ?? "No se pudo validar el boleto.";
      });
  },
});

export const { clearError } = reservaSlice.actions;
export default reservaSlice.reducer;
