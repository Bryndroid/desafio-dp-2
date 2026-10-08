import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { cargarReservas, guardarReserva } from "@/redux/thunk/reservas";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import { Pelicula } from "../types/Peliculas";

// Componentes y Tema
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing } from "@/constants/theme";

interface ReservaProp {
    asientosID: string[];
    pelicula: Pelicula;
    onSubmit: (reservaID: number) => void;
    onConflict: () => void;
}

const calcularHoraFin = (horaInicio: string, duracionMinutos: number) => {
    const [horas, minutos] = horaInicio.split(":").map(Number);
    const fechaTemp = new Date();
    fechaTemp.setHours(horas, minutos + duracionMinutos, 0);
    return `${fechaTemp.getHours().toString().padStart(2, '0')}:${fechaTemp.getMinutes().toString().padStart(2, '0')}`;
};

export default function FormularioReserva({ asientosID, pelicula, onSubmit, onConflict }: ReservaProp) {
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const guardando = useAppSelector((state) => state.reserva.saving);

    const colorScheme = useColorScheme();
    const theme = colorScheme === "light" ? "light" : "dark";
    const colors = Colors[theme];

    // Colores específicos para el estado de éxito (verde) ya que no están en el theme principal
    const successColor = theme === "light" ? "#059669" : "#34D399";
    const successBgColor = theme === "light" ? "#D1FAE5" : "#064E3B";

    // Búsqueda de las entidades involucradas
    if (!pelicula) {
        return (
            <View style={{ padding: Spacing.four }}>
                <ThemedText style={{ color: colors.textSecondary }}>
                    Error: No se pudo cargar la información de la reserva.
                </ThemedText>
            </View>
        );
    }

    // Cálculos de la reserva
    const totalPagar = asientosID.length * pelicula.precio;
    const horaFinalizacion = calcularHoraFin(pelicula.horaInicio, pelicula.duracion);
    const now = new Date();
    const fechaCompra = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const handleSubmit = async () => {
        if (!pelicula.apiId || !nombreUsuario.trim()) {
            setErrorEnvio("Escribe el nombre del cliente para continuar.");
            return;
        }
        setErrorEnvio(null);
        try {
            const fechaFuncion = `${fechaCompra} ${pelicula.horaInicio.padStart(5, "0")}:00`;
            const reserva = await dispatch(guardarReserva({
                peliculaId: pelicula.apiId,
                nombreCliente: nombreUsuario,
                sala: pelicula.salaNombre,
                fechaFuncion,
                asientos: asientosID,
            })).unwrap();
            onSubmit(reserva.Id);
        } catch (error) {
            const failure = error && typeof error === "object" && "message" in error
                ? error as { message: string; status?: number | null }
                : null;
            const message = typeof error === "string"
                ? error
                : failure?.message ?? "No se pudo guardar la reserva.";
            setErrorEnvio(message);
            if (failure?.status === 409 || message.toLowerCase().includes("asientos ocupados")) {
                await dispatch(cargarReservas());
                onConflict();
            }
        }
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
            
            {/* Cabecera del Ticket */}
            <View style={styles.ticketHeader}>
                <ThemedText style={[styles.ticketTitle, { color: colors.primary }]}>
                    Resumen de Venta
                </ThemedText>
                <ThemedText style={[styles.ticketDate, { color: colors.textSecondary }]}>
                    {fechaCompra}
                </ThemedText>
            </View>

            {/* Separador Punteado */}
            <View style={[styles.divider, { borderColor: colors.border }]} />

            {/* Detalles de la compra */}
            <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                    <ThemedText style={[styles.detailLabel, { color: colors.textSecondary }]}>Película</ThemedText>
                    <ThemedText style={styles.detailValue}>{pelicula.nombre}</ThemedText>
                </View>
                <View style={styles.detailItem}>
                    <ThemedText style={[styles.detailLabel, { color: colors.textSecondary }]}>Sala</ThemedText>
                    <ThemedText style={styles.detailValue}>{pelicula.salaNombre}</ThemedText>
                </View>
                <View style={styles.detailItem}>
                    <ThemedText style={[styles.detailLabel, { color: colors.textSecondary }]}>Horario</ThemedText>
                    <ThemedText style={styles.detailValue}>{pelicula.horaInicio} - {horaFinalizacion}</ThemedText>
                </View>
                <View style={styles.detailItem}>
                    <ThemedText style={[styles.detailLabel, { color: colors.textSecondary }]}>Asientos ({asientosID.length})</ThemedText>
                    <View style={styles.badgesContainer}>
                        {asientosID.map(asiento => (
                            <View key={asiento} style={[styles.badge, { backgroundColor: colors.primarySoft, borderColor: colors.primary }]}>
                                <ThemedText style={[styles.badgeText, { color: colors.text }]}>{asiento}</ThemedText>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {/* Separador Punteado */}
            <View style={[styles.divider, { borderColor: colors.border }]} />

            {/* Total a Pagar */}
            <View style={[styles.totalContainer, { backgroundColor: successBgColor }]}>
                <ThemedText style={[styles.totalLabel, { color: successColor }]}>Total a Pagar</ThemedText>
                <ThemedText style={[styles.totalValue, { color: successColor }]}>${totalPagar.toFixed(2)}</ThemedText>
            </View>

            {/* Formulario (Inputs) */}
            <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <ThemedText style={styles.inputLabel}>Nombre del Cliente</ThemedText>
                    <TextInput 
                        style={[
                            styles.input, 
                            { 
                                backgroundColor: colors.background, 
                                borderColor: colors.border, 
                                color: colors.text 
                            }
                        ]} 
                        placeholder="Ej. Laura Gómez" 
                        placeholderTextColor={colors.textSecondary}
                        value={nombreUsuario}
                        onChangeText={setNombreUsuario} // Equivalente a onChange en React Native
                    />
                </View>

                {/* Botón de Confirmación */}
                <TouchableOpacity 
                    style={[styles.btnSubmit, { backgroundColor: successColor }]}
                    activeOpacity={0.8}
                    disabled={guardando}
                    onPress={() => void handleSubmit()}
                >
                    <ThemedText style={styles.btnSubmitText}>
                        {guardando ? "Guardando..." : "Confirmar y Finalizar Venta"}
                    </ThemedText>
                </TouchableOpacity>
                {errorEnvio && (
                    <ThemedText style={{ color: colors.textSecondary }}>
                        {errorEnvio}
                    </ThemedText>
                )}
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 12,
        padding: Spacing.five,
        width: "100%",
        maxWidth: 500,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
    },
    ticketHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    ticketTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    ticketDate: {
        fontSize: 14,
        fontWeight: "500",
    },
    divider: {
        borderTopWidth: 2,
        borderStyle: "dashed",
        marginVertical: Spacing.four,
    },
    detailsGrid: {
        flexDirection: "column",
        gap: Spacing.three,
    },
    detailItem: {
        flexDirection: "column",
        gap: 2,
    },
    detailLabel: {
        fontSize: 12,
        textTransform: "uppercase",
        fontWeight: "bold",
    },
    detailValue: {
        fontSize: 16,
        fontWeight: "500",
    },
    badgesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: Spacing.one,
        marginTop: 4,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: Spacing.three,
        borderRadius: 8,
        marginBottom: Spacing.four,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: "bold",
    },
    totalValue: {
        fontSize: 24,
        fontWeight: "900",
    },
    formContainer: {
        flexDirection: "column",
        gap: Spacing.four,
    },
    inputGroup: {
        flexDirection: "column",
        gap: Spacing.two,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "bold",
    },
    input: {
        paddingHorizontal: Spacing.three,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
    },
    btnSubmit: {
        marginTop: Spacing.two,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    btnSubmitText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    }
});