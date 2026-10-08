import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

// Prefijo para poder distinguir nuestros boletos de cualquier otro QR
// que la cámara pudiera leer por error.
export const QR_PREFIX = "CINE-RESERVA-";

export function construirCodigoQR(codigo: string): string {
  return `${QR_PREFIX}${codigo}`;
}

interface TicketQRCodeProps {
  codigo: string;
  size?: number;
}

export function TicketQRCode({ codigo, size = 140 }: TicketQRCodeProps) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", padding: 8 }}>
      <QRCode value={construirCodigoQR(codigo)} size={size} />
    </View>
  );
}