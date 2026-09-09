import { peliculas } from "@/store/peliculas";
import { Pelicula } from "@/types/Peliculas";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cargarPeliculas } from "../thunk/peliculas";
interface PeliculaState {
    list: Pelicula[],
    error: string | null
}
const initialState: PeliculaState = { list: peliculas, error: null }


// Expresión regular para validar el formato PEL-000
const idRegex = /^PEL-\d{3}$/;

const peliculaSlice = createSlice({
    name: "pelicula",
    initialState,
    reducers: {
        agregarPelicula: (state, action: PayloadAction<Pelicula>) => {
            state.error = null;
            const nueva = action.payload;

            // 1. Validar formato de ID (PEL-000)
            if (!idRegex.test(nueva.id)) {
                state.error = `Error: El ID debe tener el formato PEL-000 (ejemplo: PEL-001).`;
                return;
            }

            const peliculaRepetida = state.list.find(p => p.id === nueva.id);
            if (peliculaRepetida) {
                state.error = `Error: Ya existe una película con el código ${nueva.id}.`;
                return;
            }

            if (!nueva.nombre.trim()) {
                state.error = `Error: El nombre de la película no puede estar vacío`;
                return;
            }

            if (nueva.precio < 0) {
                state.error = `Error: El precio no puede ser negativo.`;
                return;
            }

            const horarioRepetido = state.list.find(
                p => p.salaID === nueva.salaID && p.horaInicio === nueva.horaInicio
            );
            if (horarioRepetido) {
                state.error = `Error: Ya hay una función a las ${nueva.horaInicio} en esa sala.`;
                return;
            }

            state.list.push(nueva);
        },
        modificarPelicula: (state, action: PayloadAction<Pelicula>) => {
            state.error = null;
            const peliculaNueva = action.payload;

            // 1. Validar formato de ID (PEL-000) también al modificar
            if (!idRegex.test(peliculaNueva.id)) {
                state.error = `Error: El ID debe tener el formato PEL-000 (ejemplo: PEL-001).`;
                return;
            }

            const index = state.list.findIndex(p => p.id === peliculaNueva.id);

            if (index === -1) {
                state.error = `Ha ocurrido un error: la película a modificar no existe.`;
                return;
            }

            if (!peliculaNueva.nombre.trim()) {
                state.error = `Error: El nombre de la película no puede estar vacío.`;
                return;
            }

            if (peliculaNueva.precio < 0) {
                state.error = `Error: El precio no puede ser negativo.`;
                return;
            }

            const horarioRepetido = state.list.find(
                p => p.id !== peliculaNueva.id &&
                    p.salaID === peliculaNueva.salaID &&
                    p.horaInicio === peliculaNueva.horaInicio
            );
            if (horarioRepetido) {
                state.error = `Error: Ya hay una función a las ${peliculaNueva.horaInicio} en esa sala.`;
                return;
            }

            state.list[index] = peliculaNueva;
        },
        eliminarPelicula: (state, action: PayloadAction<string>) => {
            state.error = null;
            const existe = state.list.some(p => p.id === action.payload);

            if (!existe) {
                state.error = `Ha ocurrido un error fatal en la eliminación.`;
                return;
            }
            state.list = state.list.filter(p => p.id !== action.payload);
        },
        cambiarEstadoPelicula: (state, action: PayloadAction<string>) => {
            const pelicula = state.list.find(p => p.id === action.payload);
            if (pelicula) {
                pelicula.estado = !pelicula.estado;
            } else {
                state.error = `Error: la película no existe.`;
            }
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(cargarPeliculas.fulfilled, (state, action) => {
            state.list = action.payload;
        })
    }
});

export const {
    agregarPelicula,
    modificarPelicula,
    eliminarPelicula,
    cambiarEstadoPelicula,
    clearError
} = peliculaSlice.actions;

export default peliculaSlice.reducer;