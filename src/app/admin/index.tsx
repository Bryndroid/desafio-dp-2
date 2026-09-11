import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminHome() {
    return (
        <ThemedView style={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
                <ThemedText type="subtitle" style={{ fontSize: 24, marginBottom: Spacing.two }}>
                    Zona de Personal
                </ThemedText>
                <ThemedText themeColor="textSecondary">
                    Usa las pestañas de abajo para gestionar películas, ver las estadísticas del
                    cine o validar los boletos de los clientes en la entrada.
                </ThemedText>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingHorizontal: Spacing.four,
        paddingTop: Spacing.two,
    },
});
