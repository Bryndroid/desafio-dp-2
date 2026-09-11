import { useAppSelector } from "@/redux/hook";
import { ScrollView, StyleSheet, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from "@/constants/theme";

export default function DashboardScreen() {
  const peliculas = useAppSelector((state) => state.pelicula.list);
  const reservas = useAppSelector((state) => state.reserva.list);
  const salas = useAppSelector((state) => state.sala.list);

  const colorScheme = useColorScheme();
  const theme = colorScheme === "light" ? "light" : "dark";
  const colors = Colors[theme];

  // En este modelo de datos cada película representa una única función
  // (sala + horario fijo), así que "funciones" y "películas" coinciden.
  const totalPeliculas = peliculas.length;
  const totalFunciones = peliculas.length;

  const totalBoletosVendidos = reservas.reduce((acc, r) => acc + r.asientos.length, 0);
  const ingresosGenerados = reservas.reduce((acc, r) => acc + r.total, 0);

  const todosLosAsientos = salas.flatMap((s) => s.asientos ?? []);
  const asientosOcupados = todosLosAsientos.filter((a) => a.ocupado).length;
  const asientosDisponibles = todosLosAsientos.length - asientosOcupados;

  const conteoPorPelicula = new Map<string, number>();
  reservas.forEach((r) => {
    conteoPorPelicula.set(r.peliculaID, (conteoPorPelicula.get(r.peliculaID) ?? 0) + 1);
  });
  let peliculaMasReservada = "N/A";
  let maxReservas = 0;
  conteoPorPelicula.forEach((cantidad, peliculaID) => {
    if (cantidad > maxReservas) {
      maxReservas = cantidad;
      const pelicula = peliculas.find((p) => p.id === peliculaID);
      peliculaMasReservada = pelicula ? pelicula.nombre : peliculaID;
    }
  });

  const stats: { label: string; value: string }[] = [
    { label: "Total de películas", value: String(totalPeliculas) },
    { label: "Total de funciones", value: String(totalFunciones) },
    { label: "Boletos vendidos", value: String(totalBoletosVendidos) },
    { label: "Asientos disponibles", value: String(asientosDisponibles) },
    { label: "Asientos ocupados", value: String(asientosOcupados) },
    { label: "Ingresos generados", value: `$${ingresosGenerados.toFixed(2)}` },
    { label: "Película más reservada", value: peliculaMasReservada },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.three }}>
          <ThemedText type="subtitle" style={{ fontSize: 24, marginTop: Spacing.two, marginBottom: Spacing.four }}>
            Dashboard
          </ThemedText>

          <View style={styles.grid}>
            {stats.map((stat) => (
              <View
                key={stat.label}
                style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}
              >
                <ThemedText
                  style={{ fontSize: stat.label === "Película más reservada" ? 16 : 26, fontWeight: "900", color: colors.primary }}
                  numberOfLines={2}
                >
                  {stat.value}
                </ThemedText>
                <ThemedText style={{ color: colors.textSecondary, marginTop: 4 }}>{stat.label}</ThemedText>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
  },
  card: {
    flexBasis: "47%",
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.four,
  },
});