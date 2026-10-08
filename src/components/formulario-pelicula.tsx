import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { actualizarPelicula, crearPelicula } from "@/redux/thunk/peliculas";
import { Pelicula } from "@/types/Peliculas";
import { ReactNode, useState } from "react";
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
    console.log(salas);
    const colorScheme = useColorScheme();
    const theme = colorScheme === "light" ? "light" : "dark";
    const colors = Colors[theme];
    const esEdicion = !!peliculaEditar;

    const [nombre, setNombre] = useState(peliculaEditar?.nombre ?? "");
    const [genero, setGenero] = useState(peliculaEditar?.genero ?? "");
    const [duracion, setDuracion] = useState(peliculaEditar ? String(peliculaEditar.duracion) : "");
    const [clasificacion, setClasificacion] = useState<Pelicula["clasificacion"]>(peliculaEditar?.clasificacion ?? "A");
    const [salaNombre, setSalaNombre] = useState<string | null>(peliculaEditar?.salaNombre ??  null);
    const [horaInicio, setHoraInicio] = useState(peliculaEditar?.horaInicio ?? "");
    const [precio, setPrecio] = useState(peliculaEditar ? String(peliculaEditar.precio) : "");
    const [imgRef, setImgRef] = useState(peliculaEditar?.imgRef ?? "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&h=900&q=80");
    const [guardando, setGuardando] = useState(false);

    const handleGuardar = async () => {
        if (salaNombre === null) {
            Alert.alert("Error", "Selecciona una sala.");
            return;
        }

        if (!imgRef.trim()) {
            Alert.alert("Error", "Ingresa la URL de la imagen.");
            return;
        }

        const salaID = salas.find((sala) => sala.nombre === salaNombre)?.id ?? peliculaEditar?.salaID ?? 1;
        const pelicula: Pelicula = {
            id: esEdicion ? peliculaEditar!.id : generarSiguienteId(peliculas),
            ...(peliculaEditar?.apiId ? { apiId: peliculaEditar.apiId } : {}),
            nombre: nombre.trim(),
            genero: genero.trim(),
            duracion: parseInt(duracion, 10) || 0,
            clasificacion,
            salaID,
            salaNombre,
            horaInicio: horaInicio.trim(),
            imgRef: imgRef.trim(),
            precio: parseFloat(precio) || 0,
            estado: esEdicion ? peliculaEditar!.estado : true,
        };

        setGuardando(true);
        try {
            await dispatch(esEdicion ? actualizarPelicula(pelicula) : crearPelicula(pelicula)).unwrap();
            onClose();
        } catch (error) {
            Alert.alert("No se pudo guardar", typeof error === "string" ? error : "Verifica los datos e intenta nuevamente.");
        } finally {
            setGuardando(false);
        }
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
                                {salas
                                    .filter((sala, index, array) =>
                                        index === array.findIndex((s) => s.nombre === sala.nombre) && sala.nombre !== undefined
                                    )
                                    .map((sala) => (
                                        <Chip
                                            key={sala.id}
                                            label={sala.nombre}
                                            activo={salaNombre === sala.nombre}
                                            colors={colors}
                                            onPress={() => setSalaNombre(sala.nombre)}
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
                        <Campo label="URL de la imagen" colors={colors}>
                            <TextInput
                                value={imgRef}
                                onChangeText={setImgRef}
                                autoCapitalize="none"
                                keyboardType="url"
                                placeholder="https://..."
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
                            disabled={guardando}
                            onPress={() => void handleGuardar()}
                        >
                            <ThemedText style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                                {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Agregar"}
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