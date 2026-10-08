import FormularioReserva from "@/components/formularioReserva";
import MapaAsientos from "@/components/Mapa-Asientos";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing } from "@/constants/theme";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { cargarReservas } from "@/redux/thunk/reservas";
import { normalizarFechaFuncion } from "@/services/api";
import { Asiento } from "@/types/Asiento";
import { Pelicula } from "@/types/Peliculas";
import { Sala } from "@/types/Sala";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function crearSalaDeFuncion(pelicula: Pelicula, sala?: Sala): Sala {
  const asientos: Asiento[] = sala?.asientos ?? Array.from({ length: 16 }, (_, index) => {
    const fila = Math.floor(index / 4) + 1;
    const butaca = (index % 4) + 1;
    const codigo = `F-${fila} B-${butaca}`;
    return { id: `SALA-${pelicula.salaID}-${codigo}`, codigo, salaID: pelicula.salaID, ocupado: false };
  });
  return {
    id: pelicula.salaID,
    peliculaId: pelicula.id,
    nombre: pelicula.salaNombre,
    asientos,
  };
}

function fechaLocal() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function GenerarReserva() {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "light" ? "light" : "dark";
  const colors = Colors[theme];
  const { salaId, peliculaId } = useLocalSearchParams<{ salaId: string; peliculaId: string }>();
  const salas = useAppSelector((state) => state.sala.list);
  const peliculas = useAppSelector((state) => state.pelicula.list);
  const reservas = useAppSelector((state) => state.reserva.list);
  const loadingReservas = useAppSelector((state) => state.reserva.loading);
  const offline = useAppSelector((state) => state.reserva.offline);
  const error = useAppSelector((state) => state.reserva.error);
  const [reservasListas, setReservasListas] = useState(false);
  const [paso, setPaso] = useState(1);
  const [asientos, setAsientos] = useState<string[]>([]);

  useEffect(() => {
    void dispatch(cargarReservas()).finally(() => setReservasListas(true));
  }, [dispatch]);

  const pelicula = peliculas.find((item) => item.id === peliculaId);
  if (!pelicula) {
    return <ThemedView style={styles.center}><ThemedText>No se encontró la película solicitada.</ThemedText></ThemedView>;
  }

  const sala = crearSalaDeFuncion(pelicula, salas.find((item) => item.id === Number(salaId)));
  const fechaFuncion = normalizarFechaFuncion(`${fechaLocal()} ${pelicula.horaInicio.padStart(5, "0")}:00`);
  const asientosOcupados = reservas.filter((reservation) =>
      {
        console.log("------");
        console.log(reservation.peliculaApiId + "--> reservaPeliculaId");
        console.log(pelicula.apiId + "--> peliculaId");
        console.log("------");
        console.log(reservation.sala + "---> reservaSala");
        console.log(pelicula.salaNombre + "---> peliculaSalaNombre");
        console.log("------");
        console.log(normalizarFechaFuncion(reservation.fechaFuncion) + "---> reservaFechaFuncion");
        console.log(fechaFuncion + "----> fechaFuncion");
        console.log("------");
        return reservation.peliculaApiId === pelicula.apiId
      && reservation.sala === pelicula.salaNombre
      }
    )
    .flatMap((reservation) => reservation.asientos);
    console.log(asientosOcupados);
  const regresarAlMapa = () => {
    setAsientos([]);
    setPaso(1);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {paso === 1 ? (
          <>
            <View style={{ paddingLeft: 20, paddingTop: Spacing.five }}>
              <ThemedText type="subtitle" style={{ fontWeight: "bold", color: colors.primary }}>
                {pelicula.salaNombre}
              </ThemedText>
              <ThemedText type="small">{pelicula.nombre}</ThemedText>
            </View>
            {!reservasListas || loadingReservas ? (
              <ThemedText style={{ padding: 20, color: colors.textSecondary }}>Consultando asientos ocupados...</ThemedText>
            ) : offline ? (
              <View style={{ padding: 20, gap: Spacing.two }}>
                <ThemedText style={{ color: colors.textSecondary }}>
                  Sin conexión: puedes consultar tus reservas guardadas, pero no reservar asientos.
                </ThemedText>
                <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => {
                  setReservasListas(false);
                  void dispatch(cargarReservas()).finally(() => setReservasListas(true));
                }}>
                  <ThemedText style={styles.buttonText}>Reintentar conexión</ThemedText>
                </TouchableOpacity>
              </View>
            ) : error ? (
              <View style={{ padding: 20, gap: Spacing.two }}>
                <ThemedText style={{ color: colors.textSecondary }}>{error}</ThemedText>
                <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => {
                  setReservasListas(false);
                  void dispatch(cargarReservas()).finally(() => setReservasListas(true));
                }}>
                  <ThemedText style={styles.buttonText}>Actualizar mapa</ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ padding: 20 }}>
                <MapaAsientos
                  sala={sala}
                  asientosOcupados={asientosOcupados}
                  onSubmit={(selected) => {
                    setAsientos(selected);
                    setPaso(2);
                  }}
                />
              </View>
            )}
          </>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <FormularioReserva
                asientosID={asientos}
                pelicula={pelicula}
                onSubmit={(id) => router.push({
                  pathname: "/(client)/reservas/[idReserva]",
                  params: { idReserva: String(id) },
                })}
                onConflict={regresarAlMapa}
              />
            </ScrollView>
            <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
              <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={regresarAlMapa}>
                <ThemedText style={styles.buttonText}>Regresar</ThemedText>
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.three, paddingTop: Spacing.two, paddingBottom: Spacing.five },
  footer: { paddingHorizontal: Spacing.three, paddingTop: Spacing.three, paddingBottom: Spacing.three, borderTopWidth: 1 },
  button: { paddingVertical: Spacing.three, borderRadius: 100, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
});
