
import { Tabs, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "@/components/AppHeader"; // Your reusable header

export default function UserDetailsLayout() {
  // We get the ID here to pass to the header if needed, 
  // but individual pages will handle their specific headers.
  const { id } = useLocalSearchParams();

  return (
    <>
      {/* Shared Layout Settings */}
      <Tabs
        screenOptions={{
          headerShown: false, // We use AppHeader inside screens
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: "#2563EB",
          tabBarInactiveTintColor: "#9CA3AF",
          tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Overview",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Live Cart",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            title: "Activity",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="footsteps-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}