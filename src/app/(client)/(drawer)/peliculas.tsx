import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Colors, Spacing } from '@/constants/theme';
import { useAppSelector } from '@/redux/hook';

// Importa el componente de la tarjeta
import { MovieCard } from '@/components/movie-card';

export default function MostrarCatalogo() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "light" ? "light" : "dark";
    const colors = Colors[theme];

    // Estados para la búsqueda y los filtros
    const [busqueda, setBusqueda] = useState('');
    const [filtroGenero, setFiltroGenero] = useState<string | null>(null);

    const peliculas = useAppSelector((state) => state.pelicula.list);

    // Obtener lista de géneros únicos (solo de películas disponibles) para los botones de filtro
    const generosDisponibles = useMemo(() => {
        const generos = peliculas.filter(p => p.estado).map(p => p.genero);
        return Array.from(new Set(generos));
    }, [peliculas]);

    // Core Logic: Filtrado y Segmentación
    const peliculasAgrupadas = useMemo(() => {
        // 1. Filtrar las películas
        const filtradas = peliculas.filter(p => {
            // REQUERIMIENTO: Ver únicamente las películas disponibles para compra
            if (!p.estado) return false;

            // Búsqueda dinámica (Nombre, Género, Clasificación, Sala)
            const texto = busqueda.toLowerCase();
            const coincideBusqueda = 
                p.nombre.toLowerCase().includes(texto) ||
                p.genero.toLowerCase().includes(texto) ||
                p.clasificacion.toLowerCase().includes(texto) ||
                p.salaID.toString().includes(texto);

            // Filtro específico por botón de género
            const coincideGenero = filtroGenero ? p.genero === filtroGenero : true;

            return coincideBusqueda && coincideGenero;
        });

        // 2. Segmentar/Agrupar por categoría (género)
        return filtradas.reduce((acumulador, pelicula) => {
            if (!acumulador[pelicula.genero]) {
                acumulador[pelicula.genero] = [];
            }
            acumulador[pelicula.genero].push(pelicula);
            return acumulador;
        }, {} as Record<string, typeof peliculas>);
        
    }, [peliculas, busqueda, filtroGenero]);

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Cabecera y Barra de Búsqueda */}
                    <View style={styles.header}>
                        <ThemedText type="subtitle" style={{ color: colors.text }}>
                            Catalogo
                        </ThemedText>
                        
                        <TextInput
                            style={[
                                styles.searchInput, 
                                { 
                                    backgroundColor: colors.backgroundElement, 
                                    color: colors.text, 
                                    borderColor: colors.border 
                                }
                            ]}
                            placeholder="Buscar por nombre, género, sala..."
                            placeholderTextColor={colors.textSecondary}
                            value={busqueda}
                            onChangeText={setBusqueda}
                        />
                    </View>

                    {/* Filtros por Género (Chips) */}
                    <View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
                            <TouchableOpacity 
                                style={[
                                    styles.chip, 
                                    { backgroundColor: filtroGenero === null ? colors.primary : colors.backgroundElement }
                                ]}
                                onPress={() => setFiltroGenero(null)}
                            >
                                <ThemedText style={{ color: filtroGenero === null ? '#FFF' : colors.text }}>Todos</ThemedText>
                            </TouchableOpacity>

                            {generosDisponibles.map(genero => (
                                <TouchableOpacity 
                                    key={genero}
                                    style={[
                                        styles.chip, 
                                        { backgroundColor: filtroGenero === genero ? colors.primary : colors.backgroundElement }
                                    ]}
                                    onPress={() => setFiltroGenero(genero)}
                                >
                                    <ThemedText style={{ color: filtroGenero === genero ? '#FFF' : colors.text }}>
                                        {genero}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Renderizado Segmentado (Categorías) */}
                    <View style={styles.catalogContainer}>
                        {Object.keys(peliculasAgrupadas).length === 0 ? (
                            <ThemedText style={{ textAlign: 'center', marginTop: Spacing.four, color: colors.textSecondary }}>
                                No se encontraron películas.
                            </ThemedText>
                        ) : (
                            Object.entries(peliculasAgrupadas).map(([genero, peliculasCategoria]) => (
                                <View key={genero} style={styles.categoryBlock}>
                                    <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: Spacing.two, marginLeft: Spacing.two, color: colors.text }}>
                                        {genero}
                                    </ThemedText>
                                    
                                    {/* Scroll horizontal para las películas de esta categoría */}
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.two }}>
                                        {peliculasCategoria.map(p => (
                                            <MovieCard key={p.id} pelicula={p} colors={colors} />
                                        ))}
                                    </ScrollView>
                                </View>
                            ))
                        )}
                    </View>
                        
                </ScrollView>
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
    },
    scrollContent: {
        paddingTop: Spacing.two,
        paddingBottom: BottomTabInset + Spacing.four,
    },
    header: {
        paddingHorizontal: Spacing.four,
        gap: Spacing.three,
        marginBottom: Spacing.three,
    },
    searchInput: {
        height: 48,
        borderWidth: 1,
        borderRadius: 12, // Borde redondeado Apple-style
        paddingHorizontal: Spacing.three,
        fontSize: 16,
    },
    filtersContainer: {
        paddingHorizontal: Spacing.four,
        gap: Spacing.two,
        marginBottom: Spacing.four,
    },
    chip: {
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.two,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    catalogContainer: {
        flex: 1,
        gap: Spacing.four,
    },
    categoryBlock: {
        marginBottom: Spacing.two,
    }
});