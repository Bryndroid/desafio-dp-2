import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

// Tus slices actuales
import peliculasSlice from "./slices/peliculasSlice";
import reservaSlice from "./slices/reservasSlice";
import salasSlice from "./slices/salasSlice";

// 1. Configuración de persistencia
const persistConfig = {
  key: "root", // La llave principal que se usará en AsyncStorage
  storage: AsyncStorage,
};

// 2. Agrupamos todos tus reducers
const rootReducer = combineReducers({
  pelicula: peliculasSlice,
  sala: salasSlice,
  reserva: reservaSlice,
});

// 3. Creamos el reducer persistente
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configuramos el store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Esto es necesario para que Redux no tire warnings con las acciones de redux-persist
      serializableCheck: false, 
    }),
});

// 5. Exportamos el persistor (lo usaremos en el Layout)
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;