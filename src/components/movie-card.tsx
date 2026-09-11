import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { Pelicula } from '@/types/Peliculas';
import { Image } from "expo-image";
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface MovieCardProps {
  pelicula: Pelicula;
  colors: any;
}

export function MovieCard({ pelicula, colors }: MovieCardProps) {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push(`/(client)/peliculas/${pelicula.id}`)}>
      <View style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
        <Image
          source={require("@/assets/images/default-image.webp")}
          style={{ width: 210, height: 200, borderRadius: 10 }}
        />
        <ThemedText style={{ fontWeight: "bold", color: colors.text }} numberOfLines={1}>
          {pelicula.nombre}
        </ThemedText>
        <View>
          <ThemedText type="small" style={{ color: colors.primary, marginTop: 4 }}>
            {pelicula.horaInicio} • Sala {pelicula.salaID}
          </ThemedText>
          <ThemedText type="small" style={{ color: colors.textSecondary }}>
            {pelicula.genero} | {pelicula.clasificacion}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>

  );
}

const styles = StyleSheet.create({
  card: {
    width: 250,
    borderWidth: 1,
    padding: Spacing.three,
    borderRadius: 12,
    marginHorizontal: 10,
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    gap: 5
  },
});