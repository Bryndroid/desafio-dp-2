import { useAppDispatch, useAppSelector } from "@/redux/hook";
import store from "@/redux/store";
import { agregarPelicula, modificarPelicula } from "@/redux/slices/peliculasSlice";
import { Pelicula } from "@/types/Peliculas";
import { ReactNode, useEffect, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing } from "@/constants/theme";

const CLASIFICACIONES: Pelicula["clasificacion"][] = ["A", "B", "C", "D", "E"];

interface FormularioPeliculaProps {
    visible: boolean;
    // Si viene una película, el formulario entra en modo edición
    peliculaEditar?: Pelicula | null;
    onClose: () => void;
}

// Genera el siguiente código disponible con formato PEL-000
function generarSiguienteId(lista: Pelicula[]): string {
    const numeros = lista
        .map((p) => parseInt(p.id.replace("PEL-", ""), 10))
        .filter((n) => !isNaN(n));
    const siguiente = numeros.length > 0 ? Math.max(...numeros) + 1 : 1;
    return `PEL-${siguiente.toString().padStart(3, "0")}`;
}

export default function FormularioPelicula({ visible, peliculaEditar, onClose }: FormularioPeliculaProps) {
    const dispatch = useAppDispatch();
    const peliculas = useAppSelector((state) => state.pelicula.list);
    const salas = useAppSelector((state) => state.sala.list);

    const colorScheme = useColorScheme();
    const theme = colorScheme === "light" ? "light" : "dark";
    const colors = Colors[theme];
    const esEdicion = !!peliculaEditar;

    const [nombre, setNombre] = useState("");
    const [genero, setGenero] = useState("");
    const [duracion, setDuracion] = useState("");
    const [clasificacion, setClasificacion] = useState<Pelicula["clasificacion"]>("A");
    const [salaID, setSalaID] = useState<number | null>(null);
    const [horaInicio, setHoraInicio] = useState("");
    const [precio, setPrecio] = useState("");

    // Cada vez que se abre el modal, precargamos (edición) o limpiamos (creación)
    useEffect(() => {
        if (!visible) return;

        if (peliculaEditar) {
            setNombre(peliculaEditar.nombre);
            setGenero(peliculaEditar.genero);
            setDuracion(String(peliculaEditar.duracion));
            setClasificacion(peliculaEditar.clasificacion);
            setSalaID(peliculaEditar.salaID);
            setHoraInicio(peliculaEditar.horaInicio);
            setPrecio(String(peliculaEditar.precio));
        } else {
            setNombre("");
            setGenero("");
            setDuracion("");
            setClasificacion("A");
            setSalaID(salas[0]?.id ?? null);
            setHoraInicio("");
            setPrecio("");
        }
    }, [visible, peliculaEditar, salas]);

    const handleGuardar = () => {
        if (salaID === null) {
            Alert.alert("Error", "Selecciona una sala.");
            return;
        }

        const pelicula: Pelicula = {
            id: esEdicion ? peliculaEditar!.id : generarSiguienteId(peliculas),
            nombre: nombre.trim(),
            genero: genero.trim(),
            duracion: parseInt(duracion, 10) || 0,
            clasificacion,
            salaID,
            horaInicio: horaInicio.trim(),
            precio: parseFloat(precio) || 0,
            estado: esEdicion ? peliculaEditar!.estado : true,
        };

        // El slice ya valida: nombre vacío, precio negativo, ID duplicado y horario repetido en la sala
        dispatch(esEdicion ? modificarPelicula(pelicula) : agregarPelicula(pelicula));

        const error = store.getState().pelicula.error;
        if (error) {
            Alert.alert("No se pudo guardar", error);
            return;
        }

        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <ThemedView style={[styles.card, { borderColor: colors.border }]}>
                    <ThemedText type="subtitle" style={styles.titulo}>
                        {esEdicion ? "Editar película" : "Agregar película"}
                    </ThemedText>

                    <ScrollView contentContainerStyle={{ gap: Spacing.three }} showsVerticalScrollIndicator={false}>
                        <Campo label="Nombre" colors={colors}>
                            <TextInput
                                value={nombre}
                                onChangeText={setNombre}
                                placeholder="Ej. Spider-Man: Beyond the Spider-Verse"
                                placeholderTextColor={colors.textSecondary}
                                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                            />
                        </Campo>

                        <Campo label="Género" colors={colors}>
                            <TextInput
                                value={genero}
                                onChangeText={setGenero}
                                placeholder="Ej. Acción/Drama"
                                placeholderTextColor={colors.textSecondary}
                                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                            />
                        </Campo>

                        <Campo label="Duración (minutos)" colors={colors}>
                            <TextInput
                                value={duracion}
                                onChangeText={setDuracion}
                                keyboardType="numeric"
                                placeholder="Ej. 120"
                                placeholderTextColor={colors.textSecondary}
                                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                            />
                        </Campo>

                        <Campo label="Clasificación" colors={colors}>
                            <View style={styles.chipsRow}>
                                {CLASIFICACIONES.map((c) => (
                                    <Chip
                                        key={c}
                                        label={c}
                                        activo={clasificacion === c}
                                        colors={colors}
                                        onPress={() => setClasificacion(c)}
                                    />
                                ))}
                            </View>
                        </Campo>

                        <Campo label="Sala" colors={colors}>
                            <View style={styles.chipsRow}>
                                {salas.map((sala) => (
                                    <Chip
                                        key={sala.id}
                                        label={sala.nombre}
                                        activo={salaID === sala.id}
                                        colors={colors}
                                        onPress={() => setSalaID(sala.id)}
                                    />
                                ))}
                            </View>
                        </Campo>

                        <Campo label="Hora de inicio (HH:MM)" colors={colors}>
                            <TextInput
                                value={horaInicio}
                                onChangeText={setHoraInicio}
                                placeholder="Ej. 18:30"
                                placeholderTextColor={colors.textSecondary}
                                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                            />
                        </Campo>

                        <Campo label="Precio ($)" colors={colors}>
                            <TextInput
                                value={precio}
                                onChangeText={setPrecio}
                                keyboardType="decimal-pad"
                                placeholder="Ej. 7.00"
                                placeholderTextColor={colors.textSecondary}
                                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                            />
                        </Campo>
                    </ScrollView>

                    <View style={styles.botonesRow}>
                        <TouchableOpacity
                            style={[styles.boton, { backgroundColor: colors.backgroundElement, borderColor: colors.border, borderWidth: 1 }]}
                            onPress={onClose}
                        >
                            <ThemedText>Cancelar</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.boton, { backgroundColor: colors.primary }]}
                            onPress={handleGuardar}
                        >
                            <ThemedText style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                                {esEdicion ? "Guardar cambios" : "Agregar"}
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </ThemedView>
            </View>
        </Modal>
    );
}

function Campo({ label, colors, children }: { label: string; colors: any; children: ReactNode }) {
    return (
        <View style={{ gap: Spacing.one }}>
            <ThemedText type="smallBold" style={{ color: colors.textSecondary }}>{label}</ThemedText>
            {children}
        </View>
    );
}

function Chip({ label, activo, colors, onPress }: { label: string; activo: boolean; colors: any; onPress: () => void }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.chip,
                {
                    backgroundColor: activo ? colors.primary : colors.backgroundElement,
                    borderColor: activo ? colors.primary : colors.border,
                },
            ]}
        >
            <ThemedText style={{ color: activo ? "#FFFFFF" : colors.text, fontSize: 13 }}>{label}</ThemedText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    card: {
        maxHeight: "85%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        padding: Spacing.four,
        gap: Spacing.three,
    },
    titulo: {
        fontSize: 20,
        marginBottom: Spacing.two,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.two,
        fontSize: 15,
    },
    chipsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: Spacing.two,
    },
    chip: {
        borderWidth: 1,
        borderRadius: 100,
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.one,
    },
    botonesRow: {
        flexDirection: "row",
        gap: Spacing.three,
        marginTop: Spacing.two,
    },
    boton: {
        flex: 1,
        paddingVertical: Spacing.three,
        borderRadius: 100,
        alignItems: "center",
    },
});
