import { ThemedView } from "@/components/themed-view";
import { Link, Stack } from "expo-router";

export default function NotFound(){
    return(
        <>
            <Stack.Screen options ={{title: "Recurso no encontrado"}}></Stack.Screen>
            <ThemedView style={{width: "100%", height:"100%", display:"flex", justifyContent: "center", alignItems: "center"}}>
                <Link href="/">Regresar a casassssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</Link>
            </ThemedView>
        </>
    )
}