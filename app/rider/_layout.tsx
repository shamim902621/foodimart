import { Stack } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function RiderLayout() {
    const { user, loading } = useAuth();

    if (loading) {
        return <ActivityIndicator size="large" color="#FF6B35" style={{flex:1}} />;
    }

    if (!user || user.role !== 'RIDER') {
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text>Access Denied. Delivery Partners Only.</Text>
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="order-details" />
            <Stack.Screen name="history" />
            <Stack.Screen name="profile" />
        </Stack>
    );
}