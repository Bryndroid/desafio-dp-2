import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from "@/constants/theme";
import { USUARIO_GENERICO_ID } from "@/config";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { cargarReservas } from "@/redux/thunk/reservas";
import { Reserva } from "@/types/Reserva";
import { router } from "expo-router";
import { useEffect } from "react";
import { FlatList, Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Reservas() {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "light" ? "light" : "dark";
  const colors = Colors[theme];
  const reservas = useAppSelector((state) => state.reserva.list)
    .filter((reservation) => reservation.usuarioID === USUARIO_GENERICO_ID);
  const loading = useAppSelector((state) => state.reserva.loading);
  const error = useAppSelector((state) => state.reserva.error);
  const offline = useAppSelector((state) => state.reserva.offline);

  useEffect(() => {
    void dispatch(cargarReservas());
  }, [dispatch]);

  const renderItem = ({ item }: { item: Reserva }) => (
    <Pressable
      style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}
      onPress={() => router.push({ pathname: "/(client)/reservas/[idReserva]", params: { idReserva: item.Id } })}
    >
      <View style={styles.cardHeader}>
        <ThemedText style={styles.cardTitle}>Reserva #{item.Id}</ThemedText>
        <ThemedText style={{ color: colors.primary, fontWeight: "600", fontSize: 16 }}>
          ${item.total.toFixed(2)}
        </ThemedText>
      </View>
      <ThemedText style={{ color: colors.textSecondary }}>Fecha de compra: {item.fechaCompra}</ThemedText>
      <ThemedText style={{ color: colors.textSecondary }}>Función: {item.horaInicio} · {item.sala}</ThemedText>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {offline && (
          <ThemedText style={{ color: colors.textSecondary, marginBottom: Spacing.two }}>
            Sin conexión: mostrando las reservas guardadas en este dispositivo.
          </ThemedText>
        )}
        {!!error && <ThemedText style={{ color: colors.textSecondary, marginBottom: Spacing.two }}>{error}</ThemedText>}
        {loading && reservas.length === 0 ? (
          <ThemedText style={{ color: colors.textSecondary, textAlign: "center", marginTop: Spacing.five }}>
            Cargando reservas...
          </ThemedText>
        ) : (
          <FlatList
            data={reservas}
            keyExtractor={(item) => item.Id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: Spacing.three, paddingBottom: BottomTabInset + Spacing.three }}
            ListEmptyComponent={
              <ThemedText style={{ color: colors.textSecondary, textAlign: "center", marginTop: Spacing.five }}>
                No tienes reservas disponibles.
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
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignSelf: "center",
    width: "100%",
    maxWidth: MaxContentWidth,
  },
  card: { padding: Spacing.four, borderRadius: Spacing.three, borderWidth: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
});
