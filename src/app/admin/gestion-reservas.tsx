import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from "@/constants/theme";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { cargarReservas } from "@/redux/thunk/reservas";
import type { Reserva } from "@/types/Reserva";
import { router } from "expo-router";
import { useEffect } from "react";
import { FlatList, Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GestionReservas() {
  const dispatch = useAppDispatch();
  const reservas = useAppSelector((state) => state.reserva.list);
  const loading = useAppSelector((state) => state.reserva.loading);
  const offline = useAppSelector((state) => state.reserva.offline);
  const error = useAppSelector((state) => state.reserva.error);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  useEffect(() => {
    void dispatch(cargarReservas());
  }, [dispatch]);

  const renderItem = ({ item }: { item: Reserva }) => (
    <Pressable
      style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}
      onPress={() => router.push({
        pathname: "/admin/detalle-reserva/[id]",
        params: { id: String(item.Id) },
      })}
    >
      <View style={styles.row}>
        <ThemedText style={styles.title}>Reserva #{item.Id}</ThemedText>
        <ThemedText style={{ color: item.usado ? "#DC2626" : "#059669", fontWeight: "bold" }}>
          {item.usado ? "Utilizada" : "Válida"}
        </ThemedText>
      </View>
      <ThemedText>{item.nombreUsuario}</ThemedText>
      <ThemedText style={{ color: colors.textSecondary }}>
        {item.peliculaID} · {item.sala} · {item.horaInicio}
      </ThemedText>
      <ThemedText style={{ color: colors.textSecondary }}>{item.asientos.join(", ")} · ${item.total.toFixed(2)}</ThemedText>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle" style={{ fontSize: 24, marginVertical: Spacing.three }}>
          Gestión de Reservas
        </ThemedText>
        {offline && (
          <ThemedText style={{ color: colors.textSecondary, marginBottom: Spacing.two }}>
            Sin conexión: consulta de reservas guardadas en este dispositivo.
          </ThemedText>
        )}
        {!!error && <ThemedText style={{ color: "#DC2626", marginBottom: Spacing.two }}>{error}</ThemedText>}
        {loading && reservas.length === 0 ? (
          <ThemedText style={{ color: colors.textSecondary, textAlign: "center" }}>Cargando reservas...</ThemedText>
        ) : (
          <FlatList
            data={reservas}
            keyExtractor={(item) => String(item.Id)}
            renderItem={renderItem}
            contentContainerStyle={{ gap: Spacing.three, paddingBottom: BottomTabInset + Spacing.three }}
            ListEmptyComponent={
              <ThemedText style={{ color: colors.textSecondary, textAlign: "center" }}>
                No hay reservas para mostrar.
              </ThemedText>
            }
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, alignSelf: "center", width: "100%", maxWidth: MaxContentWidth },
  card: { padding: Spacing.four, borderRadius: Spacing.three, borderWidth: 1, gap: Spacing.one },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 17, fontWeight: "bold" },
});
