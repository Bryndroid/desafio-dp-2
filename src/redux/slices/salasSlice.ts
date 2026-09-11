import { salas } from "@/store/salas";
import { Asiento } from "@/types/Asiento";
import { Sala } from "@/types/Sala";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { agregarReserva } from "./reservasSlice";
interface SalasState {
    list: Sala[],
    error: string | null
}

const initialState: SalasState = { list: salas, error: null }
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
                const asientos: Asiento[] = [];

                for (let fila = 1; fila <= 4; fila++) {
                    for (let butaca = 1; butaca <= 4; butaca++) {
                        const codigo = `F-${fila} B-${butaca}`;
                        asientos.push({
                            id: `SALA-${id}-${codigo}`,
                            codigo,
                            salaID: id,
                            ocupado: false,
                        });
                    }
                }

                state.list.push({
                    id,
                    peliculaId: action.payload.peliculaId,
                    nombre: action.payload.nombre,
                    asientos,
                });
            }
        },
        extraReducers: (builder) => {
            builder.addCase(agregarReserva, (state, action) => {
                const { usuarioID, asientos } = action.payload.reserva;
                const sala = state.list.find(sala => sala.id === action.payload.salaID);

                // 'asientos' trae los códigos (ej. ["A1", "A2"])
                asientos.forEach(codigoAsiento => {
                    // CAMBIO AQUÍ: Buscar por 'codigo' en lugar de 'id'
                    const asientoSala = sala?.asientos?.find(asi => asi.codigo === codigoAsiento);

                    if (asientoSala) {
                        asientoSala.usuarioID = usuarioID;
                        asientoSala.ocupado = true; // Opcional: asegurarte de que quede marcado como ocupado
                    }
                });
            });

        }

    }
)

export const {
    apartarAsiento,
    desapartar,
    crearSala,
} = salasSlice.actions;

export default salasSlice.reducer;