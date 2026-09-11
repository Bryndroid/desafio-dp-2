import store, { persistor } from "@/redux/store";
import { Stack } from 'expo-router';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
//Todos los archivos añadidos dentro de este directorio, de app, seran convertidos en paginas dentro de la app
//Dentro de este layout define elementos UI compartidos como headers, tab bars, etc para que sea consistentes en cada ruta. No necesariamente es de rutas este archivo, aca podes dejar estilosxd.
//Para el archivo index.tsx unicamente se accede a el por la /.
//En este ejemplo, todo lo del layout esta aca xd

//Por default existe una ruta default que es +not-found. Dentro de esa ruta se renderiza una view que es la que veras cuando accedes a un lugar random.
 {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider> */}

    // 1. Crea un componente hijo que se encargue de inicializar los datos
function AppInitializer() {
 
 
  return <Stack >
      <Stack.Screen name="(client)" options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name="admin" options={{title: "Vista admin Cargada"}}></Stack.Screen>
    </Stack>; 
}
export default function MainLayout() {
   //Se tiene que CREAR primero el store, y eso es lo que le decimos a React Native que proveaa el store para nosotros luego inicializar todo
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppInitializer></AppInitializer>
      </PersistGate>
    </Provider>

  );
}
