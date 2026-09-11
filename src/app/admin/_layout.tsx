
import { BottomTabInset, Colors, Spacing } from "@/constants/theme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

export default function AdminLayout() {
    const colorScheme = useColorScheme();

    const themeMode: "light" | "dark" =
        colorScheme === "dark" ? "dark" : "light";

    const theme = Colors[themeMode];

    return (
        <Tabs
            screenOptions={{
                headerShown: false,

                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.textSecondary,

                tabBarStyle: {
                    backgroundColor: theme.backgroundElement,
                    borderTopColor: theme.border,
                    paddingBottom: BottomTabInset + Spacing.five,
                    borderTopWidth: 1,
                    height: 68,
                    paddingTop: 8,
                },

                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#f70b0b"
                },

                tabBarItemStyle: {
                    borderRadius: 14,
                    marginHorizontal: 6,
                    marginVertical: 6,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Inicio",
                    
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialIcons
                            name={focused ? "dashboard" : "dashboard-customize"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="gestion-peliculas"
                options={{
                    title: "Películas",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "film" : "film-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}