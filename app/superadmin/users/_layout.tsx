import { Stack } from "expo-router";
import React from "react";

export default function UsersLayout() {
    return (
        <Stack
            screenOptions={{
                // ✅ Default Header Hide (Custom AppHeader use hoga)
                headerShown: false,

                // Animation Settings (Smooth transitions)
                animation: "slide_from_right",
                contentStyle: { backgroundColor: "#F3F4F6" },
            }}
        >
            {/* 1. READ (List of Users) */}
            <Stack.Screen
                name="index"
                options={{
                    title: "Manage Users",
                }}
            />

            {/* 2. USER TRACKING (Dynamic Route: [id]) */}
            {/* Ye wo folder hai jisme humne Tabs banaye hain (Overview, Cart, Activity) */}
            <Stack.Screen
                name="[id]"
                options={{
                    title: "User Details",
                    // presentation: "card" // Optional: Agar iOS jaisa popup effect chahiye
                }}
            />
        </Stack>
    );
}