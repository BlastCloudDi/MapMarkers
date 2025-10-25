import { Stack } from "expo-router";
import MarkersProvider from "./context/context";

export default function RootLayout() {
  return (
    <MarkersProvider>
      <Stack />
    </MarkersProvider>
  );
}
