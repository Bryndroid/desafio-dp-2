import { useAppSelector } from "@/redux/hook";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";

// Componentes y Tema
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TicketQRCode } from "@/components/ticket-qr-code";
import { Colors, Spacing } from "@/constants/theme";

export default function MostrarInfoReserva() {
    // 1. Obtenemos el parámetro de la URL (Query Params)
    const { idReserva } = useLocalSearchParams<{ idReserva: string }>();
    const router = useRouter();

    // 2. Traemos las listas de Redux
    const reservas = useAppSelector((state) => state.reserva.list);
    const peliculas = useAppSelector((state) => state.pelicula.list);

    // 3. Tema y colores
    const colorScheme = useColorScheme();
    const theme = colorScheme === "light" ? "light" : "dark";
    const colors = Colors[theme];
    const successColor = theme === "light" ? "#059669" : "#34D399"; // Verde para el total

    // 4. Filtramos la reserva convirtiendo el ID a número (ya que en tu interfaz es un number)
    const reserva = reservas.find((r) => r.Id === Number(idReserva));

    // Validamos si existe
    if (!reserva) {
        return (
            <ThemedView style={styles.centerContainer}>
                <ThemedText style={{ color: colors.textSecondary, fontSize: 16 }}>
                    No se encontró la reserva #{idReserva}
                </ThemedText>
                <TouchableOpacity 
                    style={[styles.btnVolver, { backgroundColor: colors.primary, marginTop: Spacing.four }]}
                    onPress={() => router.back()}
                >
                    <ThemedText style={styles.btnVolverText}>Regresar</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    // Buscamos el nombre de la película para que sea más amigable al usuario
    const pelicula = peliculas.find(p => p.id === reserva.peliculaID);
    const nombrePelicula = pelicula ? pelicula.nombre : "Película desconocida";

    return (
        <ThemedView style={{ flex: 1, backgroundColor: colors.background, paddingTop:50, paddingHorizontal: 15 }}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                
                {/* Mensaje de Éxito */}
                <View style={styles.headerContainer}>
                    <ThemedText style={[styles.successTitle, { color: successColor }]}>
                        ¡Reserva Confirmada!
                    </ThemedText>
                    <ThemedText style={{ color: colors.textSecondary, textAlign: 'center' }}>
                        Presenta este ticket digital en la entrada de la sala.
                    </ThemedText>
                </View>

                {/* Tarjeta del Ticket */}
                <View style={[styles.ticketCard, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
                    
                    <View style={styles.ticketHeader}>
                        <ThemedText style={[styles.ticketId, { color: colors.primary }]}>
                            Ticket #{reserva.Id}
                        </ThemedText>
                        <ThemedText style={[styles.ticketDate, { color: colors.textSecondary }]}>
                            {reserva.fechaCompra}
                        </ThemedText>
                    </View>

                    <View style={[styles.divider, { borderColor: colors.border }]} />

                    {/* Información Principal */}
                    <View style={styles.infoGroup}>
                        <View style={styles.infoRow}>
                            <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>Película</ThemedText>
                            <ThemedText style={[styles.infoValue, { fontSize: 18, fontWeight: "bold" }]}>{nombrePelicula}</ThemedText>
                        </View>

                        <View style={styles.infoRow}>
                            <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>Cliente</ThemedText>
                            <ThemedText style={styles.infoValue}>
                                {reserva.nombreUsuario ? reserva.nombreUsuario : "Cliente General"}
                            </ThemedText>
                        </View>

                        <View style={styles.infoRow}>
                            <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>Horario</ThemedText>
                            <ThemedText style={styles.infoValue}>{reserva.horaInicio} - {reserva.horaFinalizacion}</ThemedText>
                        </View>
                    </View>

                    <View style={[styles.divider, { borderColor: colors.border }]} />

                    {/* Asientos */}
                    <View style={styles.asientosContainer}>
                        <ThemedText style={[styles.infoLabel, { color: colors.textSecondary, marginBottom: Spacing.two }]}>
                            Asientos ({reserva.asientos.length})
                        </ThemedText>
                        <View style={styles.badgesWrapper}>
                            {reserva.asientos.map(asiento => (
                                <View key={asiento} style={[styles.badge, { backgroundColor: colors.primarySoft, borderColor: colors.primary }]}>
                                    <ThemedText style={[styles.badgeText, { color: colors.primary }]}>{asiento}</ThemedText>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* QR real: el personal lo escanea en la entrada para validar el boleto (Módulo 7) */}
                    <View style={styles.qrContainer}>
                        <TicketQRCode idReserva={reserva.Id} />
                        {reserva.usado && (
                            <ThemedText style={[styles.usadoBadge, { color: colors.textSecondary }]}>
                                Este boleto ya fue validado en la entrada
                            </ThemedText>
                        )}
                    </View>

                </View>

                {/* Resumen Total */}
                <View style={[styles.totalCard, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
                    <ThemedText style={[styles.totalLabel, { color: colors.textSecondary }]}>Total Pagado</ThemedText>
                    <ThemedText style={[styles.totalValue, { color: successColor }]}>${reserva.total.toFixed(2)}</ThemedText>
                </View>

                {/* Botón Volver al Inicio */}
                <TouchableOpacity 
                    style={[styles.btnVolver, { backgroundColor: colors.primary }]}
                    onPress={() => router.push("/")} // Ajusta la ruta a tu Home
                >
                    <ThemedText style={styles.btnVolverText}>Ir a la Cartelera</ThemedText>
                </TouchableOpacity>

            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.four,
    },
    scrollContainer: {
        padding: Spacing.four,
        alignItems: "center",
        paddingBottom: Spacing.six, // Espacio extra al final
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: Spacing.four,
        gap: Spacing.one,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: "900",
    },
    ticketCard: {
        width: "100%",
        maxWidth: 400,
        borderRadius: 16,
        borderWidth: 1,
        padding: Spacing.four,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    ticketHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    ticketId: {
        fontSize: 18,
        fontWeight: "900",
        textTransform: "uppercase",
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
    infoGroup: {
        gap: Spacing.three,
    },
    infoRow: {
        flexDirection: "column",
        gap: 2,
    },
    infoLabel: {
        fontSize: 12,
        textTransform: "uppercase",
        fontWeight: "bold",
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: "500",
    },
    asientosContainer: {
        marginTop: Spacing.one,
    },
    badgesWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: Spacing.two,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    qrContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: Spacing.five,
        gap: Spacing.two,
    },
    usadoBadge: {
        fontSize: 12,
        fontStyle: "italic",
    },
    totalCard: {
        width: "100%",
        maxWidth: 400,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: Spacing.four,
        borderRadius: 12,
        borderWidth: 1,
        marginTop: Spacing.four,
        marginBottom: Spacing.five,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: "bold",
    },
    totalValue: {
        fontSize: 22,
        fontWeight: "900",
    },
    btnVolver: {
        width: "100%",
        maxWidth: 400,
        paddingVertical: 16,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    btnVolverText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    }
}); 