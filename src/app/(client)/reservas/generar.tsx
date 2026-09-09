//Aqui se va a visualizar el panel de asientos para reservar. 
//Por QueryParams tu vas a poder ver la info de la reserva.
//Luego de aca mismo vas a poder darle confirmar para esos asientos, o vas a poder volver para seleccionar otros asientos. Tambien podras darle un boton para elegir OTRA funcion. Ese boton hara que te rediriga a index de peliculas y todo el progreso SE BORRARA.
import FormularioReserva from "@/components/formularioReserva";
import MapaAsientos from "@/components/Mapa-Asientos";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAppSelector } from "@/redux/hook";
import { Pelicula } from "@/types/Peliculas";
import { Sala } from "@/types/Sala";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
export default function GenerarReserva() {

    const colorScheme = useColorScheme();
    const theme = colorScheme === "light" ? "light" : "dark";
    const colors = Colors[theme];

    const { salaId, peliculaId } = useLocalSearchParams();
    const salas = useAppSelector((state) => state.sala.list);
    const peliculas = useAppSelector((state) => state.pelicula.list);
    const reservas = useAppSelector((state) => state.reserva.list);


    const reservaPayload = {
        pelicula: peliculas.find(p => p.id === peliculaId) as Pelicula,
        sala: salas.find(s => s.id === Number(salaId)) as Sala,
        userId: 22
    }

    const [paso, setPaso] = useState(1);
    const [asientos, setAsientos] = useState<string[]>([]);

    const generarReserva = (asientosApartados: string[]) => {
        setAsientos(asientosApartados);
        setPaso(2);
    }

    const finalizacionReserva = (nombreUsuario: string, reservaID: string) => {
        
        router.push({
            pathname: "/reservas/[idReserva]",
            params:{
                idReserva: reservaID
            }
        });
    }
    return (
        <ThemedView style={styles.container}>
            <SafeAreaView>
                {paso === 1 && (
                    <>
                        <View style={{ paddingLeft: 20, paddingTop: Spacing.five }}>
                            <ThemedText type="subtitle" style={{ fontWeight: "bold", color: colors.primary }}>
                                {reservaPayload.sala.nombre}
                            </ThemedText>
                            <ThemedText type="small">
                                {reservaPayload.pelicula.nombre}
                            </ThemedText>
                        </View>
                        <View style={{ padding: 20 }}>
                            <MapaAsientos salaId={reservaPayload.sala.id} onSubmit={generarReserva} />
                        </View>

                    </>

                )}
                {paso === 2 && (
                    <>
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <FormularioReserva asientosID={asientos} salaID={reservaPayload.sala.id} pelicula={reservaPayload.pelicula} onSubmit={finalizacionReserva}>

                            </FormularioReserva>
                        </ScrollView>
                        <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[styles.reserveButton, { backgroundColor: colors.primary }]}
                                onPress={() => setPaso(1)}
                            >
                                <ThemedText style={styles.reserveButtonText}>
                                    Regresar
                                </ThemedText>
                            </TouchableOpacity>
                        </View>

                    </>
                )}
            </SafeAreaView>
        </ThemedView>
    )
}
const styles = StyleSheet.create({
    footer: {
        paddingHorizontal: Spacing.three,
        paddingTop: Spacing.three,
        paddingBottom: BottomTabInset + Spacing.three,
        borderTopWidth: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.three,
        paddingTop: Spacing.two,
        paddingBottom: Spacing.five,
        gap: Spacing.four,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    viewHint: {
        padding: Spacing.three,
        borderRadius: 1000,
        fontWeight: "bold",

    },
    safeArea: {
        flex: 1,
        paddingHorizontal: Spacing.four,
        alignItems: 'center',
        gap: Spacing.three,
        paddingBottom: BottomTabInset + Spacing.three,
        maxWidth: MaxContentWidth,
    },
    containerFilms: {
        borderBottomWidth: 1,
        padding: 20
    },
    title: {
        textAlign: 'center',
    },
    stepContainer: {
        gap: Spacing.three,
        alignSelf: 'stretch',
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.four,
        borderRadius: Spacing.four,
    },
    reserveButton: {
        paddingVertical: Spacing.three,
        width: "100%",
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginTop: 20
    },
    reserveButtonText: {
        color: "#FFFFFF", // El texto sobre el primary (morado) siempre debe ser blanco para contraste
        fontSize: 18,
        fontWeight: "bold",
    }
});