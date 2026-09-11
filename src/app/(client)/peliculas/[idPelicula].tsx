import { HintRow } from "@/components/hint-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from "@/constants/theme";
import { useAppSelector } from "@/redux/hook";
import { Sala } from "@/types/Sala";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InfoPelicula() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "light" ? "light" : "dark";
    const colors = Colors[theme];
    const [salaSelected, setSala] = useState<Sala | null>();
    const peliculas = useAppSelector((state) => state.pelicula.list);
    const salas = useAppSelector((state) => state.sala.list);
    const router = useRouter();
    const { idPelicula } = useLocalSearchParams<{ idPelicula: string }>();

    const pelicula = peliculas.find(p => p.id === idPelicula);
    console.log(pelicula);
    if (!pelicula) return (
        <ThemedView style={styles.centerContainer}>
            <ThemedText>Error Crítico: Película no encontrada</ThemedText>
        </ThemedView>
    );

    const sala = salas.find(s => s.id === pelicula.salaID);
    if (!sala) return (
        <ThemedView style={styles.centerContainer}>
            <ThemedText>Error Crítico: Sala no encontrada</ThemedText>
        </ThemedView>
    );

    const handleReserva = () => {
        if (salaSelected === undefined || salaSelected === null) {
            Alert.alert("Selecciona una sala para continuar");
            return;
        }
        router.push({
            pathname: "/(client)/reservas/generar",
            params: {
                salaId: salaSelected.id,
                peliculaId: pelicula.id
            },
        });
    }
    return (
        <ThemedView style={{ flex: 1, backgroundColor: colors.background }}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Contenedor de la Imagen y Título */}
                    <View style={styles.headerContainer}>
                        <Image
                            source={require("@/assets/images/default-image.webp")}
                            style={styles.heroImage}
                            contentFit="cover"
                        />
                        <View style={styles.titleWrapper}>
                            <ThemedText style={[styles.movieTitle, { color: colors.text }]}>
                                {pelicula.nombre}
                            </ThemedText>
                            <ThemedText style={[styles.movieSubtitle, { color: colors.textSecondary }]}>
                                {pelicula.genero} • {pelicula.duracion} min
                            </ThemedText>
                        </View>
                    </View>


                    <View style={[styles.detailsCard, { backgroundColor: colors.backgroundElement }]}>
                        <HintRow title="Hora Inicio" hint={pelicula.horaInicio} />
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <HintRow title="Clasificación" hint={pelicula.clasificacion} />
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <HintRow title="Precio" hint={`$${pelicula.precio}`} />
                    </View >

                    {/* Sección de Salas */}
                    <View style={styles.salasContainer}>
                        <Collapsible title='Salas Disponibles'>
                            <TouchableOpacity onPress={() => setSala(sala)} style={{backgroundColor:colors.backgroundSelected, borderWidth:3, borderColor: colors.primarySoft, padding: 20, borderRadius: 2000}}>
                                <ThemedText style={{ color: colors.text, textAlign:"center", fontWeight:"bold" }}>
                                    {sala ? sala.nombre : "Sala 1"}
                                </ThemedText>
                            </TouchableOpacity>
                        </Collapsible>
                    </View >
                </ScrollView>


                <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.reserveButton, { backgroundColor: colors.primarySoft,borderBottomWidth: 5, borderRightWidth:5, borderLeftWidth:5, borderLeftColor: colors.border, borderRightColor: colors.border, borderBottomColor: colors.border  }]}
                        onPress={handleReserva}
                    >
                        <ThemedText style={{...styles.reserveButtonText, color: colors.text}}>
                            Reservar {salaSelected !== undefined || salaSelected === null ? "- " + salaSelected?.nombre : ""}
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeArea: {
        flex: 1,
        maxWidth: MaxContentWidth,
        width: "100%",
        alignSelf: 'center',
    },
    scrollContent: {
        paddingHorizontal: Spacing.three,
        paddingTop: Spacing.two,
        paddingBottom: Spacing.five,
        gap: Spacing.four,
    },
    headerContainer: {
        width: "100%",
        gap: Spacing.three,
    },
    heroImage: {
        width: "100%",
        height: 250,
        borderRadius: Spacing.three,
    },
    titleWrapper: {
        paddingHorizontal: Spacing.one,
    },
    movieTitle: {
        fontWeight: "900",
        fontSize: 28,
        letterSpacing: -0.5,
    },
    movieSubtitle: {
        fontSize: 16,
        marginTop: Spacing.one,
        fontWeight: "500",
    },
    detailsCard: {
        padding: Spacing.three,
        borderRadius: Spacing.three,
        gap: Spacing.two,
    },
    divider: {
        height: 1,
        width: '100%',
        opacity: 0.5,
    },
    salasContainer: {
        width: "100%",
    },
    footer: {
        paddingHorizontal: Spacing.three,
        paddingTop: Spacing.three,
        paddingBottom: BottomTabInset + Spacing.three,
        borderTopWidth: 1,
    },
    reserveButton: {
        paddingVertical: Spacing.three,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    reserveButtonText: {
        color: "#FFFFFF", // El texto sobre el primary (morado) siempre debe ser blanco para contraste
        fontSize: 18,
        fontWeight: "bold",
    }
});