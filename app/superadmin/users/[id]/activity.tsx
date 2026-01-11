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
        { id: "5", action: "login", detail: "Logged in from Android", time: "2 days ago", icon: "log-in" },
    ];

    return (
        <View style={styles.container}>
            <AppHeader title="Activity Log" showBack={false} />

            <FlatList
                data={logs}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 20 }}
                renderItem={({ item, index }) => (
                    <View style={styles.logItem}>
                        {/* Timeline Connector Line */}
                        {index !== logs.length - 1 && <View style={styles.line} />}

                        {/* Icon Bubble */}
                        <View style={styles.iconBox}>
                            <Ionicons name={item.icon as any} size={18} color="#4B5563" />
                        </View>

                        {/* Content */}
                        <View style={styles.logContent}>
                            <Text style={styles.logDetail}>{item.detail}</Text>
                            <Text style={styles.logAction}>{item.action.replace(/_/g, " ")}</Text>
                        </View>

                        {/* Time */}
                        <Text style={styles.logTime}>{item.time}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },

    logItem: { flexDirection: "row", marginBottom: 30, position: "relative" },

    // The vertical line connecting logs
    line: {
        position: "absolute", left: 19, top: 40, width: 2, height: 35,
        backgroundColor: "#E5E7EB", zIndex: -1
    },

    iconBox: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff",
        justifyContent: "center", alignItems: "center",
        borderWidth: 1, borderColor: "#E5E7EB",
        marginRight: 16,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, elevation: 1
    },

    logContent: { flex: 1, justifyContent: "center" },
    logDetail: { fontSize: 15, fontWeight: "600", color: "#111827", marginBottom: 2 },
    logAction: { fontSize: 12, color: "#6B7280", textTransform: "uppercase", fontWeight: '600' },

    logTime: { fontSize: 12, color: "#9CA3AF", alignSelf: "flex-start", marginTop: 4 },
});