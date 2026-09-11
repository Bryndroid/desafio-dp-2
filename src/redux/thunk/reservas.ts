import { reservas } from "@/store/reservas";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const cargarReservas = createAsyncThunk(
  "reservas/cargar",
  async () => {
    const data = await AsyncStorage.getItem("reservas");

    if (data) {
      return JSON.parse(data);
    }

    await AsyncStorage.setItem("reservas", JSON.stringify(reservas));
    return reservas;
  }
);