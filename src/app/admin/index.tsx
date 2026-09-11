
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { clearError, marcarComoUsado } from "@/redux/slices/reservasSlice";
import store from "@/redux/store";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { QR_PREFIX } from "@/components/ticket-qr-code";
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from "@/constants/theme";

type Resultado =
  | {
    tipo: "exito";
    mensaje: string;
    detalle: string;
  }
  | {
    tipo: "error";
    mensaje: string;
  };

export default function EscanerScreen() {
  const dispatch = useAppDispatch();

  const peliculas = useAppSelector(
    (state) => state.pelicula.list
  );

  const [permiso, solicitarPermiso] = useCameraPermissions();

  const [bloqueado, setBloqueado] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const colorScheme = useColorScheme();
  const theme = colorScheme === "light" ? "light" : "dark";
  const colors = Colors[theme];

  const reiniciarEscaneo = () => {
    setResultado(null);
    setBloqueado(false);
    dispatch(clearError());
  };

  const manejarEscaneo = ({ data }: { data: string }) => {
    if (bloqueado) return;

    setBloqueado(true);

    console.log("QR ESCANEADO:", data);

    // Verificar que sea un QR generado por nuestra aplicación
    if (!data.startsWith(QR_PREFIX)) {
      setResultado({
        tipo: "error",
        mensaje:
          "Este código QR no pertenece a un boleto del cine.",
      });
      return;
    }

    const idReserva = Number(
      data.replace(QR_PREFIX, "")
    );

    const reservaAntes = store.getState().reserva.list.find((r) => r.Id === idReserva);

    if (!reservaAntes) {
      setResultado({
        tipo: "error",
        mensaje:
          "Boleto no reconocido. Verifica el código QR.",
      });
      return;
    }

    if (reservaAntes.usado) {
      setResultado({
        tipo: "error",
        mensaje:
          "Este boleto ya fue utilizado anteriormente.",
      });
      return;
    }

    dispatch(marcarComoUsado(idReserva));

    const error = store.getState().reserva.error;

    if (error) {
      setResultado({
        tipo: "error",
        mensaje: error,
      });
      return;
    }

    const pelicula = peliculas.find(
      (p) => p.id === reservaAntes.peliculaID
    );

    setResultado({
      tipo: "exito",
      mensaje: "¡Boleto válido!",
      detalle: `${pelicula?.nombre ?? "Película"} · ${reservaAntes.nombreUsuario
        } · Asientos: ${reservaAntes.asientos.join(", ")}`,
    });
  };

  /*
   * Todavía estamos esperando que Expo nos diga
   * si ya tenemos permiso.
   */
  if (!permiso) {
    return (
      <ThemedView style={styles.centrado}>
        <ThemedText>
          Comprobando permiso de cámara...
        </ThemedText>
      </ThemedView>
    );
  }

  /*
   * Si no tenemos permiso, lo solicitamos.
   */
  if (!permiso.granted) {
    return (
      <ThemedView style={styles.centrado}>
        <ThemedText
          style={{
            textAlign: "center",
            marginBottom: Spacing.four,
            color: colors.textSecondary,
          }}
        >
          Se necesita acceso a la cámara para escanear los
          boletos en la entrada.
        </ThemedText>

        <TouchableOpacity
          style={[
            styles.boton,
            { backgroundColor: colors.primary },
          ]}
          onPress={solicitarPermiso}
        >
          <ThemedText
            style={{
              color: "#FFFFFF",
              fontWeight: "bold",
              paddingHorizontal: 10,
              paddingTop: 5,
              paddingBottom: 5
            }}
          >
            Dar permiso de cámara
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  /*
   * Cámara funcionando.
   *
   * IMPORTANTE:
   * CameraView ya NO depende de enFoco ni de useFocusEffect.
   */
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false} >
          <ThemedText
            type="subtitle"
            style={{
              fontSize: 22,
              marginBottom: Spacing.three,
            }}
          >
            Validar boleto
          </ThemedText>

          <View
            style={[
              styles.cameraWrapper,
              {
                borderColor: colors.border,
              },
            ]}
          >
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={
                bloqueado ? undefined : manejarEscaneo
              }
            />
          </View>

          {resultado && (
            <View
              style={[
                styles.resultado,
                {
                  backgroundColor:
                    resultado.tipo === "exito"
                      ? "#D1FAE5"
                      : "#FEE2E2",
                },
              ]}
            >
              <ThemedText
                style={{
                  fontWeight: "bold",
                  color:
                    resultado.tipo === "exito"
                      ? "#059669"
                      : "#DC2626",
                }}
              >
                {resultado.mensaje}
              </ThemedText>

              {resultado.tipo === "exito" && (
                <ThemedText
                  style={{
                    color: "#065F46",
                    marginTop: 4,
                  }}
                >
                  {resultado.detalle}
                </ThemedText>
              )}
            </View>
          )}

          {bloqueado && (
            <TouchableOpacity
              style={[
                styles.boton,
                {
                  backgroundColor: colors.primary,
                  marginTop: Spacing.three,
                },
              ]}
              onPress={reiniciarEscaneo}
            >
              <ThemedText
                style={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  paddingHorizontal: 10,
                  paddingTop: 5,
                  paddingBottom:5
                }}
              >
                Escanear otro boleto
              </ThemedText>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    display: "flex",
    justifyContent: "center",
    paddingBottom: BottomTabInset,
    width: '100%',
    alignSelf: 'center',
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.five,
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },

  cameraWrapper: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: Spacing.three,
    overflow: "hidden",
    borderWidth: 1,
  },

  resultado: {
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },

  boton: {
    paddingVertical: Spacing.three,
    borderRadius: 100,
    alignItems: "center",
  },
});