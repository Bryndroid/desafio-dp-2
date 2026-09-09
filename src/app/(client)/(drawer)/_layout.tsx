import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import {
    Drawer,
    DrawerContentScrollView,
    DrawerItemList,
} from "expo-router/drawer";
import { useColorScheme, View } from "react-native";


export default function DrawerLayout() {
  
  const colorScheme = useColorScheme();
  const theme = colorScheme === "light" ? "light" : "dark";

  const colors = Colors[theme];

  return (
    <Drawer
      drawerContent={(props) => (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
          }}
        >
          {/* Encabezado */}
          <View
            style={{
              marginTop: 20,
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <ThemedText
              type="subtitle"

            >
              Cine
              <ThemedText
                type="subtitle"
                style={{
                  color: colors.primary,
                }}
              >
                Stream
              </ThemedText>
            </ThemedText>
          </View>

          {/* Opciones */}
          <DrawerContentScrollView
            {...props}
            contentContainerStyle={{
              paddingTop: Spacing.three,
              gap: Spacing.three,

            }}
          >
            <DrawerItemList {...props} />
            <ThemedText type="small" style={{ marginTop: "150%", color: "#ffffff28" }}>
              Proyecto realizado para DPS como Desafio #2
            </ThemedText>
          </DrawerContentScrollView>
        </View>
      )}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "700",
        },

        drawerStyle: {
          backgroundColor: colors.background,
          width: 250,
        },

        drawerContentStyle: {
          backgroundColor: colors.background,
        },

        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "600",
          marginLeft: -8,
        },

        drawerActiveBackgroundColor: colors.backgroundSelected,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,

        drawerItemStyle: {
          marginHorizontal: 12,
          marginVertical: 4,
          borderRadius: 12,
          borderLeftWidth: 4,
          borderLeftColor: colors.primary,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Inicio",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="peliculas"
        options={{
          title: "Cartelera",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="film-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="mis-reservas"
        options={{
          title: "Reservas",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="ticket-outline" color={color} size={size} />
          ),
        }}
      />
      
      
    </Drawer>
  );
}