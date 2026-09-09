import { salas } from "@/store/salas";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const cargarSalas = createAsyncThunk(
  "salas/cargar",
  async () => {
    const data = await AsyncStorage.getItem("salas");

    if (data) {
      return JSON.parse(data);
    }

    await AsyncStorage.setItem("salas", JSON.stringify(salas));
    return salas;
  }
);