import AppHeader from "@/components/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function UserActivity() {
    // Dummy Logs (Replace with API)
    const logs = [
        { id: "1", action: "viewed_shop", detail: "Food Mart Indiranagar", time: "10 mins ago", icon: "storefront" },
        { id: "2", action: "added_to_cart", detail: "Premium Rice 5kg", time: "25 mins ago", icon: "cart" },
        { id: "3", action: "searched", detail: "Best Biryani near me", time: "2 hours ago", icon: "search" },
        { id: "4", action: "order_placed", detail: "Order #ORD-9988", time: "1 day ago", icon: "checkmark-circle" },
    ];

    return (
        <View style={styles.container}>
            <AppHeader title="Activity Log" showBack={false} />

            <FlatList
                data={logs}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item, index }) => (
                    <View style={styles.logItem}>
                        {/* Timeline Line */}
                        {index !== logs.length - 1 && <View style={styles.line} />}

                        <View style={styles.iconBox}>
                            <Ionicons name={item.icon as any} size={18} color="#4B5563" />
                        </View>
                        <View style={styles.logContent}>
                            <Text style={styles.logDetail}>{item.detail}</Text>
                            <Text style={styles.logAction}>{item.action.replace(/_/g, " ")}</Text>
                        </View>
                        <Text style={styles.logTime}>{item.time}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    logItem: { flexDirection: "row", marginBottom: 24, position: "relative" },
    line: {
        position: "absolute", left: 19, top: 40, width: 2, height: 30,
        backgroundColor: "#E5E7EB", zIndex: -1
    },
    iconBox: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff",
        justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E5E7EB",
        marginRight: 12
    },
    logContent: { flex: 1, justifyContent: "center" },
    logDetail: { fontSize: 15, fontWeight: "600", color: "#111827" },
    logAction: { fontSize: 12, color: "#6B7280", textTransform: "capitalize", marginTop: 2 },
    logTime: { fontSize: 12, color: "#9CA3AF", alignSelf: "center" },
});