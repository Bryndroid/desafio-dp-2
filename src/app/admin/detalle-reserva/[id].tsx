import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing } from "@/constants/theme";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { obtenerReserva } from "@/redux/thunk/reservas";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetalleReservaAdmin() {
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const reserva = useAppSelector((state) => state.reserva.list.find((item) => item.Id === Number(id)));
  const loading = useAppSelector((state) => state.reserva.loading);
  const error = useAppSelector((state) => state.reserva.error);
  const peliculas = useAppSelector((state) => state.pelicula.list);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  useEffect(() => {
    void dispatch(obtenerReserva(Number(id)));
  }, [dispatch, id]);

  const pelicula = peliculas.find((item) => item.apiId === reserva?.peliculaApiId);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: Spacing.four }}>
          <ThemedText type="link">‹ Volver a reservas</ThemedText>
        </TouchableOpacity>
        <ScrollView>
          <ThemedText type="subtitle" style={{ fontSize: 24, marginBottom: Spacing.four }}>
            Detalle de reserva
          </ThemedText>
          {loading && !reserva ? <ThemedText>Cargando...</ThemedText> : reserva ? (
            <View style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <Detalle label="Código" value={reserva.codigo} />
              <Detalle label="Cliente" value={reserva.nombreUsuario} />
              <Detalle label="Película" value={pelicula?.nombre ?? reserva.peliculaID} />
              <Detalle label="Sala" value={reserva.sala} />
              <Detalle label="Función" value={reserva.fechaFuncion} />
              <Detalle label="Asientos" value={reserva.asientos.join(", ")} />
              <Detalle label="Cantidad" value={String(reserva.asientos.length)} />
              <Detalle label="Fecha de compra" value={reserva.fechaCompra} />
              <Detalle label="Total" value={`$${reserva.total.toFixed(2)}`} />
              <Detalle label="Estado" value={reserva.usado ? "Utilizada" : "Válida"} />
            </View>
          ) : error ? <ThemedText style={{ color: "#DC2626" }}>{error}</ThemedText> : <ThemedText>No se encontró la reserva.</ThemedText>}
          {!!error && reserva && <ThemedText style={{ color: colors.textSecondary, marginTop: Spacing.two }}>
            Se está mostrando la última información guardada.
          </ThemedText>}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function Detalle({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 4 }}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <ThemedText>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: Spacing.four },
  card: { padding: Spacing.four, borderRadius: Spacing.three, borderWidth: 1, gap: Spacing.three },
});
