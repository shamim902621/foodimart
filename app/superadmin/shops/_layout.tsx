
// import { Stack } from "expo-router";

// export default function ShopsLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: true,
//         headerStyle: { backgroundColor: "#ffffff" },
//         headerTintColor: "#111827",
//         headerTitleStyle: { fontWeight: "600" },
//       }}
//     >
//       <Stack.Screen name="index" options={{ title: "Manage Shops" }} />
//       <Stack.Screen name="create" options={{ title: "Create New Shop" }} />
//       <Stack.Screen name="details" options={{ title: "Shop Details" }} />
//     </Stack>
//   );
// }

import { Stack } from "expo-router";
import React from "react";

export default function ShopsLayout() {
  return (
    <Stack
      screenOptions={{
        // ✅ Sabse Important: Default header hide karo
        // Taki humara Custom 'AppHeader' dikh sake
        headerShown: false,

        // Animation settings (Optional: Smooth transitions ke liye)
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "#F3F4F6" },
      }}
    >
      {/* 1. READ (List of Shops) */}
      <Stack.Screen
        name="index"
        options={{
          title: "Manage Shops",
          // gestureEnabled: false // Agar tum chahte ho user swipe back na kare list se
        }}
      />

      {/* 2. CREATE (Add New Shop) */}
      <Stack.Screen
        name="create"
        options={{
          title: "Create Shop",
          presentation: "card" // iOS style card effect (optional)
        }}
      />

      {/* 3. READ ONE (Details Page) */}
      <Stack.Screen
        name="details"
        options={{
          title: "Shop Details"
        }}
      />

      {/* 4. UPDATE (Edit Page) */}
      {/* Agar tumhara edit page 'edit.tsx' naam se hai to ye line add karo */}
      <Stack.Screen
        name="edit"
        options={{
          title: "Edit Shop"
        }}
      />
    </Stack>
  );
}