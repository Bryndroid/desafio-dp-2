import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { apartarAsiento, desapartar } from "@/redux/slices/salasSlice";
import { Asiento } from "@/types/Asiento";
import { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";

// Componentes y Tema
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing } from "@/constants/theme";

interface MapaAsientosProps {
    salaId: number;
    onSubmit: (asientos: string[])=>void,
}

export default function MapaAsientos({ salaId, onSubmit }: MapaAsientosProps) {
    const dispatch = useAppDispatch();
    const salas = useAppSelector((state) => state.sala.list);
    const salaActual = salas.find((s) => s.id === salaId);

    const colorScheme = useColorScheme();
    const theme = colorScheme === "light" ? "light" : "dark";
    const colors = Colors[theme];

    if (!salaActual || !salaActual.asientos) {
        return (
            <ThemedView style={styles.centerContainer}>
                <ThemedText>Cargando mapa de asientos...</ThemedText>
            </ThemedView>
        );
    }

    const [seleccionados, setSeleccionados] = useState<string[]>(() => {
        return salaActual.asientos
            ?.filter((asiento) => asiento.ocupado && (asiento.usuarioID === undefined || asiento.usuarioID === null))
            .map((asiento) => asiento.codigo) ?? [];
    });

    const handleAsientoClick = (asiento: Asiento) => {
        if (asiento.ocupado) {
            if (asiento.usuarioID) return;
            dispatch(desapartar(asiento.id));
        }

        setSeleccionados((prev) => {
            if (prev.includes(asiento.codigo)) {
                return prev.filter((codigo) => codigo !== asiento.codigo);
            } else {
                return [...prev, asiento.codigo];
            }
        });
    };

    const handleConfirmar = () => {
        if (seleccionados.length <= 0) {
          
            Alert.alert("Selección vacía", "Por favor, seleccione al menos un asiento para continuar.");
            return;
        }

        seleccionados.forEach(asiento => {
            dispatch(apartarAsiento({
                id: `SALA-${salaId}-${asiento}`,
                codigo: asiento,
                ocupado: true,
                salaID: salaId
            }));
        });
        
        onSubmit(seleccionados);
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: colors.backgroundElement }]}>
            
            {/* 1. LEYENDA INFORMATIVA */}
            <View style={styles.leyendaContainer}>
                <View style={styles.leyendaItem}>
                    <View style={[styles.leyendaColor, { backgroundColor: colors.background, borderColor: colors.primary, borderWidth: 2 }]} />
                    <ThemedText style={{ color: colors.textSecondary, fontSize: 12 }}>Disponible</ThemedText>
                </View>
                <View style={styles.leyendaItem}>
                    <View style={[styles.leyendaColor, { backgroundColor: colors.primary }]} />
                    <ThemedText style={{ color: colors.textSecondary, fontSize: 12 }}>Seleccionado</ThemedText>
                </View>
                <View style={styles.leyendaItem}>
                    <View style={[styles.leyendaColor, { backgroundColor: colors.border, opacity: 0.5 }]} />
                    <ThemedText style={{ color: colors.textSecondary, fontSize: 12 }}>Ocupado</ThemedText>
                </View>
            </View>

            {/* 2. PANTALLA */}
            <View style={styles.pantallaContainer}>
                <View style={[styles.pantallaCurva, { backgroundColor: colors.primarySoft, borderBottomColor: colors.primary }]} />
                <ThemedText style={[styles.pantallaTexto, { color: colors.textSecondary }]}>PANTALLA</ThemedText>
            </View>

            {/* 3. GRID DE ASIENTOS */}
            <View style={styles.gridAsientos}>
                {salaActual.asientos.map((asiento) => {
                    const isSeleccionado = seleccionados.includes(asiento.codigo);
                    const isOcupadoPorOtro = asiento.ocupado && asiento.usuarioID;

                    // Determinar estilos dinámicos del asiento
                    let backgroundColor: string = colors.background;
                    let borderColor: string = colors.primary;
                    let textColor:string = colors.primary;
                    let opacity = 1;

                    if (isOcupadoPorOtro) {
                        backgroundColor = colors.border;
                        borderColor = colors.border;
                        textColor = colors.textSecondary;
                        opacity = 0.5;
                    } else if (isSeleccionado) {
                        backgroundColor = colors.primary;
                        borderColor = colors.primary;
                        textColor = "#FFFFFF"; // Texto blanco para contraste sobre color primario
                    }

                    return (
                        <TouchableOpacity
                            key={asiento.id}
                            activeOpacity={0.7}
                            onPress={() => handleAsientoClick(asiento)}
                            disabled={!!isOcupadoPorOtro}
                            style={[
                                styles.asientoBase,
                                {
                                    backgroundColor,
                                    borderColor,
                                    opacity
                                }
                            ]}
                        >
                            <ThemedText style={[styles.asientoTexto, { color: textColor }]}>
                                {asiento.codigo}
                            </ThemedText>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* 4. RESUMEN Y ACCIÓN */}
            <View style={[styles.resumenContainer, { borderTopColor: colors.border }]}>
                <ThemedText>
                    Asientos: <ThemedText style={{ fontWeight: 'bold' }}>{seleccionados.length}</ThemedText>
                </ThemedText>
                
                <TouchableOpacity 
                    style={[styles.btnConfirmar, { backgroundColor: colors.primary }]} 
                    onPress={handleConfirmar}
                >
                    <ThemedText style={styles.btnConfirmarTexto}>
                        Confirmar
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.four,
    },
    container: {
        padding: Spacing.four,
        borderRadius: 16,
        alignItems: "center",
        width: "100%",
        alignSelf: 'center',
    },
    leyendaContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: Spacing.three,
        marginBottom: Spacing.five,
        flexWrap: "wrap",
        width: "100%",
    },
    leyendaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.one,
    },
    leyendaColor: {
        width: 16,
        height: 16,
        borderRadius: 4,
    },
    pantallaContainer: {
        width: "80%",
        alignItems: "center",
        marginBottom: Spacing.five,
    },
    pantallaCurva: {
        width: "100%",
        height: 15,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomWidth: 3,
    },
    pantallaTexto: {
        marginTop: Spacing.two,
        fontSize: 10,
        letterSpacing: 4,
        fontWeight: "bold",
    },
    gridAsientos: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 15,
        marginBottom: Spacing.five,
    },
    asientoBase: {
        // En lugar de display: grid con 4 columnas, le damos un ancho fijo 
        // para que quepan 4 con su respectivo gap.
        width: 55,
        height: 55,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderWidth: 2,
    },
    asientoTexto: {
        fontSize: 12,
        fontWeight: "bold",
    },
    resumenContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        paddingTop: Spacing.four,
    },
    btnConfirmar: {
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.two,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnConfirmarTexto: {
        color: "#FFFFFF", // Siempre blanco sobre botones primarios
        fontWeight: "bold",
        fontSize: 14,
    }
});