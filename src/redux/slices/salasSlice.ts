import { generarAsientosIniciales, salas } from "@/store/salas";
import type { Asiento } from "@/types/Asiento";
import type { Sala } from "@/types/Sala";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cargarSalas } from "../thunk/salas";
interface SalasState {
    list: Sala[],
    error: string | null
}

const salasConAsientos = (lista: Sala[]): Sala[] =>
    lista.map((sala) => ({
        ...sala,
        asientos: generarAsientosIniciales(sala.id),
    }));

const initialState: SalasState = { list: salasConAsientos(salas), error: null }
const salasSlice = createSlice(
    {
        name: "sala",
        initialState,
        reducers: {
            
            apartarAsiento: (state, action: PayloadAction<Asiento>) => {
                state.error = null;
                const asientoApartar = action.payload;
                const salaIndex = state.list.findIndex((sala) => {
                    return sala.id === asientoApartar.salaID
                });

                const asientoEncontrado = state.list[salaIndex].asientos?.find(asiento => {

                    return asiento.codigo === asientoApartar.codigo
                });

                if (!asientoEncontrado) {
                    state.error = `Error: No existe este asiento`;
                    return;
                }

                if (asientoEncontrado?.ocupado) {
                    state.error = `Error: Asiento ya esta apartado por el ususario ${asientoEncontrado.usuarioID}`;
                    return;
                }
                //Mutacion directa!.
                asientoEncontrado.ocupado = true;
                asientoEncontrado.usuarioID = asientoApartar.usuarioID;
            },
            desapartar: (state, action: PayloadAction<string>) => {
                state.error = null;

                const id = action.payload;

                for (const sala of state.list) {
                    const asientoEncontrado = sala.asientos?.find(
                        (asiento) => asiento.id === id
                    );

                    if (asientoEncontrado) {
                        asientoEncontrado.ocupado = false;
                        asientoEncontrado.usuarioID = undefined;
                        return;
                    }
                }

                state.error = "Error: No existe este asiento";
            },
            clearError: (state) => {
                state.error = null
            },
            crearSala: (state, action: PayloadAction<{ peliculaId: string; nombre: string }>) => {
                const id = state.list.length > 0
                    ? Math.max(...state.list.map((sala) => sala.id)) + 1
                    : 1;

                state.list.push({
                    id,
                    peliculaId: action.payload.peliculaId,
                    nombre: action.payload.nombre,
                    asientos: generarAsientosIniciales(id),
                });
            }
        },
        extraReducers: (builder) => {
            builder.addCase(cargarSalas.fulfilled, (state, action) => {
                if (action.payload) {
                    state.list = salasConAsientos(action.payload);
                }
            });
        },
    }
)

export const {
    apartarAsiento,
    desapartar,
    crearSala,
} = salasSlice.actions;

export default salasSlice.reducer;