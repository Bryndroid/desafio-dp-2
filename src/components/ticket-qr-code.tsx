import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

// Prefijo para poder distinguir nuestros boletos de cualquier otro QR
// que la cámara pudiera leer por error.
export const QR_PREFIX = "CINE-RESERVA-";

export function construirCodigoQR(idReserva: number): string {
  return `${QR_PREFIX}${idReserva}`;
}

interface TicketQRCodeProps {
  idReserva: number;
  size?: number;
}

export function TicketQRCode({ idReserva, size = 140 }: TicketQRCodeProps) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", padding: 8 }}>
      <QRCode value={construirCodigoQR(idReserva)} size={size} />
    </View>
  );
}
