import DatabaseProvider from "@/context/DatabaseContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <Stack>
        <Stack.Screen name={'index'} options={{title: 'Карта'}} />
        <Stack.Screen name={'marker/[id]'} options={{title: 'Маркер'}} />
      </Stack>
    </DatabaseProvider>
  );
}
