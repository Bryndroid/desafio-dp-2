import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { cambiarEstadoPelicula, cargarPeliculas, eliminarPelicula } from "@/redux/thunk/peliculas";
import { Pelicula } from "@/types/Peliculas";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import FormularioPelicula from "@/components/formulario-pelicula";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from "@/constants/theme";

export default function GestionPeliculas() {
    const dispatch = useAppDispatch();
    const peliculas = useAppSelector((state) => state.pelicula.list);
    const offline = useAppSelector((state) => state.pelicula.offline);
    const guardando = useAppSelector((state) => state.pelicula.saving);
    const error = useAppSelector((state) => state.pelicula.error);

    const colorScheme = useColorScheme();
    const theme = colorScheme === "light" ? "light" : "dark";
    const colors = Colors[theme];

    const [formVisible, setFormVisible] = useState(false);
    const [peliculaEditar, setPeliculaEditar] = useState<Pelicula | null>(null);

    useEffect(() => {
        void dispatch(cargarPeliculas());
    }, [dispatch]);

    const cambiarEstado = async (pelicula: Pelicula) => {
        try {
            await dispatch(cambiarEstadoPelicula(pelicula)).unwrap();
        } catch (cause) {
            Alert.alert("No se pudo actualizar", typeof cause === "string" ? cause : "Intenta nuevamente.");
        }
    };

    const abrirCrear = () => {
        setPeliculaEditar(null);
        setFormVisible(true);
    };

    const abrirEditar = (pelicula: Pelicula) => {
        console.log(pelicula);
        setPeliculaEditar(pelicula);
        setFormVisible(true);
    };

    const confirmarEliminar = (pelicula: Pelicula) => {
        Alert.alert(
            "Eliminar película",
            `¿Seguro que deseas eliminar "${pelicula.nombre}"? Esta acción no se puede deshacer.`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => {
                        void dispatch(eliminarPelicula(pelicula)).unwrap().catch((cause: unknown) => {
                            Alert.alert("No se pudo eliminar", typeof cause === "string" ? cause : "Intenta nuevamente.");
                        });
                    },
                },
            ]
        );
    };


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
                {item.salaNombre} · {item.horaInicio} · ${item.precio.toFixed(2)}
            </ThemedText>

            <View style={styles.accionesRow}>
                <TouchableOpacity
                    style={[styles.accionBtn, { borderColor: colors.border }]}
                    disabled={offline || guardando}
                    onPress={() => void cambiarEstado(item)}
                >
                    <ThemedText style={{ fontSize: 13 }}>
                        {item.estado ? "Marcar no disp." : "Marcar disponible"}
                    </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.accionBtn, { borderColor: colors.border }]} disabled={offline || guardando} onPress={() => abrirEditar(item)}>
                    <ThemedText style={{ fontSize: 13 }}>Editar</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.accionBtn, { borderColor: "#DC2626" }]} disabled={offline || guardando} onPress={() => confirmarEliminar(item)}>
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
                    <TouchableOpacity style={[styles.btnAgregar, { backgroundColor: colors.primary, opacity: offline || guardando ? 0.5 : 1 }]} disabled={offline || guardando} onPress={abrirCrear}>
                        <ThemedText style={{ color: "#FFFFFF", fontWeight: "bold" }}>+ Agregar</ThemedText>
                    </TouchableOpacity>
                </View>
                {offline && (
                    <ThemedText style={{ color: colors.textSecondary, marginBottom: Spacing.two }}>
                        Sin conexión: puedes consultar el catálogo guardado, pero no modificarlo.
                    </ThemedText>
                )}
                {error && <ThemedText style={{ color: "#DC2626", marginBottom: Spacing.two }}>{error}</ThemedText>}

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

            <FormularioPelicula
                key={`${formVisible}-${peliculaEditar?.apiId ?? "nueva"}`}
                visible={formVisible}
                peliculaEditar={peliculaEditar}
                onClose={() => setFormVisible(false)}
            />
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