import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { FlatList, Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importamos los hooks de Redux y tu interfaz
// (Asegúrate de que la ruta a tu RootState o hooks tipados coincida con tu proyecto)
import { useAppSelector } from "@/redux/hook";
import { Reserva } from '@/types/Reserva';
import { router } from "expo-router";

export default function Reservas() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "light" ? "light" : "dark";
  const colors = Colors[theme];

  // Extraemos la lista de reservas directamente desde el slice de Redux
  const reservas = useAppSelector((state) => state.reserva.list);
  const misReservas = reservas.filter(r => r.usuarioID === 106);
  console.log(misReservas);
  if(misReservas === undefined || misReservas.length === 0 ){
    return (
        <ThemedText>
            No tienes ninguna reserva activa.
        </ThemedText>
    )
  }
  const renderItem = ({ item }: { item: Reserva }) => (
    <Pressable 
      style={[
        styles.card, 
        { backgroundColor: colors.backgroundElement, borderColor: colors.border }
      ]}
      onPress={() => {
        // Aquí irá la lógica de navegación para ver la información completa
        router.push({
            pathname:"/reservas/[idReserva]",
            params:{
                idReserva: item.Id
            }
        })
        console.log('Ver detalles de la reserva:', item.Id);
      }}
    >
      <View style={styles.cardHeader}>
        {/* Usamos el ID como nombre/título de la reserva */}
        <ThemedText style={styles.cardTitle}>Reserva #{item.Id}</ThemedText>
        
        {/* Renderizamos el Pago (Total) */}
        <ThemedText style={{ color: colors.primary, fontWeight: "600", fontSize: 16 }}>
          ${item.total.toFixed(2)}
        </ThemedText>
      </View>
      
      {/* Renderizamos Fecha y Hora de Inicio */}
      <ThemedText style={{ color: colors.textSecondary }}>
        Fecha de compra: {item.fechaCompra}
      </ThemedText>
      <ThemedText style={{ color: colors.textSecondary }}>
        Hora de inicio: {item.horaInicio}
      </ThemedText>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        
        <FlatList
          data={misReservas}
          keyExtractor={(item) => item.Id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            gap: Spacing.three, 
            paddingBottom: BottomTabInset + Spacing.three 
          }}
          style={{ width: '100%' }}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: Spacing.four,
    marginTop: Spacing.two,
  },
  card: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});