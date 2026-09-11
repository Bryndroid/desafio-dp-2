import { Tabs } from 'expo-router';
import { Image, StyleSheet } from 'react-native';

export default function AdminLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Inicio",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('@/assets/images/tabIcons/home.png')}
                            style={[styles.icon, { tintColor: color }]}
                        />
                    )
                }}
            />
            
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Dashboard",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('@/assets/images/tabIcons/home.png')}
                            style={[styles.icon, { tintColor: color }]}
                        />
                    )
                }}
            />

            <Tabs.Screen
                name="gestion-peliculas"
                options={{
                    title: "Películas",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('@/assets/images/tabIcons/home.png')}
                            style={[styles.icon, { tintColor: color }]}
                        />
                    )
                }}
            />

            <Tabs.Screen
                name="escanear"
                options={{
                    title: "Escanear",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('@/assets/images/tabIcons/explore.png')}
                            style={[styles.icon, { tintColor: color }]}
                        />
                    )
                }}
            />

        </Tabs>
    );
}

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
    }
});