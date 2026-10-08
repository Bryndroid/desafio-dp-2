import { salas } from "@/store/salas";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

const LEGACY_SALAS_KEY = "salas";
const SALAS_CLEANUP_KEY = "salas-legacy-cleanup-v1";

export const cargarSalas = createAsyncThunk(
  "salas/cargar",
  async () => {
    const cleanupCompleted = await AsyncStorage.getItem(SALAS_CLEANUP_KEY);
    if (cleanupCompleted === "true") return null;

    await AsyncStorage.removeItem(LEGACY_SALAS_KEY);
    await AsyncStorage.setItem(SALAS_CLEANUP_KEY, "true");
    return salas;
  }
);