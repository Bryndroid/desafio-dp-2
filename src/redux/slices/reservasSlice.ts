import { reservas } from "@/store/reservas";
import { Reserva } from "@/types/Reserva";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReservasState {
    list: Reserva[],
    error: string | null
}
interface ReservaSala{
    reserva: Reserva,
    salaID: number
}
const initialState: ReservasState = { list: reservas, error: null}

const reservaSlice = createSlice({
    name: "reserva",
    initialState,
    reducers: {
        agregarReserva: (state, action: PayloadAction<ReservaSala>) =>{
            const reserva = action.payload;

            state.list.push(reserva.reserva);
        },
        modificarReserva: (state, action: PayloadAction<Reserva>)=>{
            const reserva = action.payload;
            const reservaIndex = state.list.findIndex(r => r.Id === reserva.Id);
            state.list[reservaIndex] = reserva;
            
        },
        //Prob para tener un boton de eliminar reserva.
        eliminarReserva: (state, action: PayloadAction<number>)=>{
            const idReserva = action.payload;

            state.list.filter(reserva =>{
                return reserva.Id !== idReserva
            })
        },
        marcarComoUsado: (state, action: PayloadAction<number>) => {
            state.error = null;
            const idValido = 67;
            const reserva = state.list.find(r => r.Id === action.payload);

            if (!reserva) {
                state.error = "Error: este boleto no existe o no es válido.";
                return;
            }

            if (reserva.usado) {
                state.error = "Error: este boleto ya fue utilizado anteriormente.";
                return;
            }

            reserva.usado = true;
        },
        clearError: (state) => {
            state.error = null;
        }
    }
});

export const {
    agregarReserva,
    modificarReserva,
    eliminarReserva,
    marcarComoUsado,
    clearError
} = reservaSlice.actions

export default reservaSlice.reducer
