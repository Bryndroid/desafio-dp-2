import { peliculas } from "@/store/peliculas";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const cargarPeliculas = createAsyncThunk(
  "peliculas/cargar",
  async () => {
    const data = await AsyncStorage.getItem("peliculas");

    if (data) {
      return JSON.parse(data);
    }

    await AsyncStorage.setItem("peliculas", JSON.stringify(peliculas));
    return peliculas;
  }
);