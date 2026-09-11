import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { cambiarEstadoPelicula, eliminarPelicula } from "@/redux/slices/peliculasSlice";
import { Pelicula } from "@/types/Peliculas";
import { useState } from "react";
import { Alert, FlatList, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FormularioPelicula from "@/components/formulario-pelicula";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from "@/constants/theme";

export default function GestionPeliculas() {
    const dispatch = useAppDispatch();
    const peliculas = useAppSelector((state) => state.pelicula.list);
    const salas = useAppSelector((state) => state.sala.list);

    const colorScheme = useColorScheme();
    const theme = colorScheme === "light" ? "light" : "dark";
    const colors = Colors[theme];

    const [formVisible, setFormVisible] = useState(false);
    const [peliculaEditar, setPeliculaEditar] = useState<Pelicula | null>(null);

    const abrirCrear = () => {
        setPeliculaEditar(null);
        setFormVisible(true);
    };

    const abrirEditar = (pelicula: Pelicula) => {
        setPeliculaEditar(pelicula);
        setFormVisible(true);
    };

    const confirmarEliminar = (pelicula: Pelicula) => {
        Alert.alert(
            "Eliminar película",
            `¿Seguro que deseas eliminar "${pelicula.nombre}"? Esta acción no se puede deshacer.`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: () => dispatch(eliminarPelicula(pelicula.id)) },
            ]
        );
    };

    const nombreSala = (salaID: number) => salas.find((s) => s.id === salaID)?.nombre ?? `Sala ${salaID}`;

    const renderItem = ({ item }: { item: Pelicula }) => (
        <View style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
                <ThemedText style={{ fontWeight: "bold", fontSize: 16, flex: 1 }} numberOfLines={1}>
                    {item.nombre}
                </ThemedText>
                <View
                    style={[
                        styles.badge,
                        { backgroundColor: item.estado ? "#D1FAE5" : "#FEE2E2" },
                    ]}
                >
                    <ThemedText style={{ fontSize: 11, fontWeight: "bold", color: item.estado ? "#059669" : "#DC2626" }}>
                        {item.estado ? "Disponible" : "No disponible"}
                    </ThemedText>
                </View>
            </View>

            <ThemedText style={{ color: colors.textSecondary }}>
                {item.id} · {item.genero} · {item.clasificacion} · {item.duracion} min
            </ThemedText>
            <ThemedText style={{ color: colors.textSecondary }}>
                {nombreSala(item.salaID)} · {item.horaInicio} · ${item.precio.toFixed(2)}
            </ThemedText>

            <View style={styles.accionesRow}>
                <TouchableOpacity
                    style={[styles.accionBtn, { borderColor: colors.border }]}
                    onPress={() => dispatch(cambiarEstadoPelicula(item.id))}
                >
                    <ThemedText style={{ fontSize: 13 }}>
                        {item.estado ? "Marcar no disp." : "Marcar disponible"}
                    </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.accionBtn, { borderColor: colors.border }]} onPress={() => abrirEditar(item)}>
                    <ThemedText style={{ fontSize: 13 }}>Editar</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.accionBtn, { borderColor: "#DC2626" }]} onPress={() => confirmarEliminar(item)}>
                    <ThemedText style={{ fontSize: 13, color: "#DC2626" }}>Eliminar</ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerRow}>
                    <ThemedText type="subtitle" style={{ fontSize: 24 }}>Películas</ThemedText>
                    <TouchableOpacity style={[styles.btnAgregar, { backgroundColor: colors.primary }]} onPress={abrirCrear}>
                        <ThemedText style={{ color: "#FFFFFF", fontWeight: "bold" }}>+ Agregar</ThemedText>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={peliculas}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ gap: Spacing.three, paddingBottom: BottomTabInset + Spacing.three }}
                    ListEmptyComponent={
                        <ThemedText style={{ color: colors.textSecondary, textAlign: "center", marginTop: Spacing.six }}>
                            No hay películas registradas todavía.
                        </ThemedText>
                    }
                />
            </SafeAreaView>

            <FormularioPelicula visible={formVisible} peliculaEditar={peliculaEditar} onClose={() => setFormVisible(false)} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: {
        flex: 1,
        paddingHorizontal: Spacing.four,
        alignSelf: "center",
        width: "100%",
        maxWidth: MaxContentWidth,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: Spacing.two,
        marginBottom: Spacing.four,
    },
    btnAgregar: {
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.two,
        borderRadius: 100,
    },
    card: {
        borderWidth: 1,
        borderRadius: Spacing.three,
        padding: Spacing.four,
        gap: 4,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.two,
    },
    badge: {
        paddingHorizontal: Spacing.two,
        paddingVertical: 4,
        borderRadius: 100,
    },
    accionesRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: Spacing.two,
        marginTop: Spacing.two,
    },
    accionBtn: {
        borderWidth: 1,
        borderRadius: 100,
        paddingHorizontal: Spacing.three,
        paddingVertical: 6,
    },
});
