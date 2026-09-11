import { Stack } from "expo-router";

export default function ClientLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(drawer)" />
      <Stack.Screen name="peliculas/[idPelicula]" />
      <Stack.Screen name="reservas/generar" />
      <Stack.Screen name="reservas/[idReserva]" />
    </Stack>
  );
}