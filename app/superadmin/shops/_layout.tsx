
import { Stack } from "expo-router";

export default function ShopsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: "#111827",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Manage Shops" }} />
      <Stack.Screen name="create" options={{ title: "Create New Shop" }} />
      <Stack.Screen name="details" options={{ title: "Shop Details" }} />
    </Stack>
  );
}
