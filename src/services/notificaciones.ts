import type { Reserva } from "@/types/Reserva";
import { Platform } from "react-native";

export const CANAL_COMPRAS_ID = "compras-boletos";

// IMPORTANTE (Expo Go): el "index" de expo-notifications registra un listener de
// push tokens al cargarse y, en Android + Expo Go (SDK 53+), eso lanza un error y
// tumba la app. Las notificaciones LOCALES no necesitan nada de eso, así que aquí
// se importan solo las piezas que se usan, sin pasar por el index. De esta forma
// funciona en Expo Go sin development build ni cuentas.
type Piezas = {
  setNotificationHandler: typeof import("expo-notifications/build/NotificationsHandler").setNotificationHandler;
  getPermissionsAsync: typeof import("expo-notifications/build/NotificationPermissions").getPermissionsAsync;
  requestPermissionsAsync: typeof import("expo-notifications/build/NotificationPermissions").requestPermissionsAsync;
  setNotificationChannelAsync: typeof import("expo-notifications/build/setNotificationChannelAsync").setNotificationChannelAsync;
  scheduleNotificationAsync: typeof import("expo-notifications/build/scheduleNotificationAsync").scheduleNotificationAsync;
  AndroidImportance: typeof import("expo-notifications/build/NotificationChannelManager.types").AndroidImportance;
  AndroidNotificationVisibility: typeof import("expo-notifications/build/NotificationChannelManager.types").AndroidNotificationVisibility;
};

let piezas: Piezas | null = null;
let intentoFallido = false;

function obtenerPiezas(): Piezas | null {
  if (piezas) return piezas;
  if (intentoFallido) return null;

  try {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const handler = require("expo-notifications/build/NotificationsHandler");
    const permisos = require("expo-notifications/build/NotificationPermissions");
    const canal = require("expo-notifications/build/setNotificationChannelAsync");
    const programar = require("expo-notifications/build/scheduleNotificationAsync");
    const tipos = require("expo-notifications/build/NotificationChannelManager.types");
    /* eslint-enable @typescript-eslint/no-require-imports */

    // Handler: define cómo se muestra una notificación cuando la app está en
    // PRIMER PLANO. Sin esto, la notificación se ignora con la app abierta.
    handler.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    piezas = {
      setNotificationHandler: handler.setNotificationHandler,
      getPermissionsAsync: permisos.getPermissionsAsync,
      requestPermissionsAsync: permisos.requestPermissionsAsync,
      setNotificationChannelAsync: canal.setNotificationChannelAsync,
      scheduleNotificationAsync: programar.scheduleNotificationAsync,
      AndroidImportance: tipos.AndroidImportance,
      AndroidNotificationVisibility: tipos.AndroidNotificationVisibility,
    };
    return piezas;
  } catch (error) {
    // Si el entorno no soporta el módulo, la app sigue funcionando sin notificar.
    intentoFallido = true;
    console.warn("Notificaciones no disponibles en este entorno.", error);
    return null;
  }
}

/**
 * Crea el canal de Android y solicita el permiso de notificaciones si todavía
 * no se ha concedido. Devuelve true si la app puede mostrar notificaciones.
 * Debe llamarse al iniciar la app (el canal debe existir antes de notificar y,
 * en Android 13+, el permiso es obligatorio).
 */
export async function configurarNotificaciones(): Promise<boolean> {
  const n = obtenerPiezas();
  if (!n) return false;

  try {
    if (Platform.OS === "android") {
      await n.setNotificationChannelAsync(CANAL_COMPRAS_ID, {
        name: "Compras de boletos",
        description: "Confirmaciones de compra de boletos del cine",
        importance: n.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lockscreenVisibility: n.AndroidNotificationVisibility.PUBLIC,
      });
    }

    const actual = await n.getPermissionsAsync();
    if (actual.granted) return true;
    if (!actual.canAskAgain) return false;

    const solicitado = await n.requestPermissionsAsync();
    return solicitado.granted;
  } catch (error) {
    console.warn("No se pudieron configurar las notificaciones.", error);
    return false;
  }
}

/**
 * Notificación local de compra. Debe invocarse únicamente cuando la API
 * confirmó la reserva (respuesta exitosa de POST /reservas).
 * Nunca lanza: un fallo de la notificación no debe afectar a la compra ya registrada.
 */
export async function notificarCompra(reserva: Reserva, nombrePelicula: string): Promise<void> {
  try {
    const n = obtenerPiezas();
    if (!n) return;

    const permitido = await configurarNotificaciones();
    if (!permitido) return;

    const cantidad = reserva.asientos.length;
    const asientos = reserva.asientos.join(", ");

    await n.scheduleNotificationAsync({
      content: {
        title: "¡Compra confirmada!",
        subtitle: nombrePelicula,
        body:
          `${nombrePelicula} · ${cantidad} ${cantidad === 1 ? "boleto" : "boletos"}\n` +
          `Asientos: ${asientos}\n` +
          `Total pagado: $${reserva.total.toFixed(2)}\n` +
          `Código de reserva: ${reserva.codigo}`,
        data: { reservaId: reserva.Id, codigo: reserva.codigo },
        sound: true,
      },
      // Sin fecha ni intervalo = se muestra de inmediato (notificación local).
      // channelId hace que Android use nuestro canal de alta importancia.
      trigger: { channelId: CANAL_COMPRAS_ID },
    });
  } catch (error) {
    console.warn("No se pudo mostrar la notificación de compra.", error);
  }
}