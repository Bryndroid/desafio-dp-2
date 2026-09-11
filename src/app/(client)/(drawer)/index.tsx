import { useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAppSelector } from '@/redux/hook';

// Importamos tu nuevo componente genérico
import { MovieCard } from '@/components/movie-card';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "light" ? "light" : "dark";
  const colors = Colors[theme];
  const router = useRouter();
  const peliculas = useAppSelector((state) => state.pelicula.list);

  // Animación simple: un solo valor que irá de 0 a 1
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (peliculas.length > 0) {
      Animated.loop(
        Animated.timing(moveAnim, {
          toValue: 1,
          duration: peliculas.length * 5000, // Tiempo total (más peliculas = más tiempo para mantener la velocidad)
          easing: Easing.linear,
          useNativeDriver: true, // Optimizado para 60fps
        })
      ).start();
    }
  }, [peliculas.length]);

  // Interpolamos el valor de 0 a 1 hacia píxeles negativos para moverlo a la izquierda
  const translateX = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -(peliculas.length * 260)] // 170 es el ancho de la card (150) + sus margenes (20)
  });

  // Duplicamos el arreglo para el efecto infinito visual
  const carruselInfinito = [...peliculas, ...peliculas, ...peliculas];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false} // Opcional: oculta la barra de scroll
        >

          {/* Header */}
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Cine<ThemedText type='title' style={{ color: colors.primary, fontWeight: "bold" }}>Stream</ThemedText>
            </ThemedText>
            <ThemedText type='small' style={{ color: colors.textSecondary, textAlign: "center" }}>
              Tu película favorita la encuentras y disfrutas aquí primero.
            </ThemedText>
          </ThemedView>

          {/* Tablero de Peliculas*/}
          <ThemedView style={[styles.mainBoard, { backgroundColor: colors.backgroundSelected }]}>


            {/* Carrusel Simple */}
            <ThemedView style={[styles.containerFilms, { borderBottomColor: colors.primary }]}>
              

              <View style={{ overflow: 'hidden' }}>
                <Animated.View style={{ flexDirection: 'row', transform: [{ translateX }] }}>
                  {carruselInfinito.map((p, index) => (
                    // Llamamos a la card genérica y le inyectamos los props
                    <MovieCard key={`${p.id}-${index}`} pelicula={p} colors={colors} />
                  ))}
                </Animated.View>
              </View>
            </ThemedView>

            {/* Botón Inferior */}
            <ThemedView style={[styles.viewHint, { backgroundColor: colors.primarySoft, borderBottomWidth: 5, borderRightWidth:5, borderLeftWidth:5, borderLeftColor: colors.border, borderRightColor: colors.border, borderBottomColor: colors.border }]}>
              <TouchableOpacity onPress={()=> router.push("/(client)/peliculas")}>
                
                <ThemedText style={{ color: colors.text, textAlign: "center", fontWeight: "bold", }}>
                  Reserva YA
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

          </ThemedView>

          
        </ScrollView>


      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  safeArea: {
   flex:1,
    
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    display: "flex",
    justifyContent: "center",
    paddingBottom: BottomTabInset + Spacing.three,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: '100%',
  },
  title: {
    textAlign: 'center',
  },
  mainBoard: {
    padding: Spacing.two,
    borderRadius: 16,
    width: '100%',
  },
  sectionsWrapper: {
    borderRadius: 10,
    display: "flex",
    gap: Spacing.three,
    flexDirection: "column",
    flex: 1,
  },
  containerFilms: {
    borderBottomWidth: 1,
    paddingVertical: Spacing.three,
    backgroundColor: "transparent",
  },
  
  viewHint: {
    padding: Spacing.three,
    borderRadius: 1000,
    marginTop: 20,
  },
});