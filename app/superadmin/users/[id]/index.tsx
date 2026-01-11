import AppHeader from "@/components/AppHeader";
import { StatBox } from "@/components/ui/stat-box"; // Assuming you have this component
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../../../lib/apiService";

export default function UserOverview() {
    const { userUUID } = useLocalSearchParams();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserDetails();
    }, [userUUID]);

    const fetchUserDetails = async () => {
        try {
            const response: any = await api(`/superadmin/users/user/${userUUID}`); // Adjust endpoint as needed
            if (response.success) {
                setUser(response.data);
            }
        } catch (e) {
            console.log("Error fetching user details", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading Profile...</Text>
            </View>
        );
    }

    // Fallback data if API returns null (for UI testing)
    const userData = user || {
        name: "Unknown User",
        email: "user@example.com",
        phone: "+91 98765 43210",
        role: "USER",
        joinDate: "2024-01-15",
        status: "active",
        totalSpend: 12500,
        ordersCount: 15,
        walletBalance: 250
    };

    return (
        <View style={styles.container}>
            <AppHeader title="User Profile" showBack={true} />

            <ScrollView contentContainerStyle={styles.content}>

                {/* --- 1. USER IDENTITY CARD --- */}
                <View style={styles.card}>
                    <View style={styles.userHeader}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={32} color="#fff" />
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{userData.name}</Text>
                            <Text style={styles.userSub}>{userData.email}</Text>
                            <Text style={styles.userSub}>{userData.phone}</Text>
                        </View>
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>{userData.role}</Text>
                        </View>
                    </View>
                </View>

                {/* --- 2. STATISTICS GRID --- */}
                <Text style={styles.sectionTitle}>Spending Habits</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statWrapper}>
                        <StatBox title="Total Orders" value={userData.ordersCount.toString()} icon="receipt" color="#3B82F6" />
                    </View>
                    <View style={styles.statWrapper}>
                        <StatBox title="Lifetime Spend" value={`₹${userData.totalSpend}`} icon="wallet" color="#10B981" />
                    </View>
                    <View style={styles.statWrapper}>
                        <StatBox title="Wallet Bal" value={`₹${userData.walletBalance}`} icon="cash" color="#F59E0B" />
                    </View>
                    <View style={styles.statWrapper}>
                        <StatBox title="Avg Order" value="₹850" icon="stats-chart" color="#8B5CF6" />
                    </View>
                </View>

                {/* --- 3. ACCOUNT DETAILS --- */}
                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Account Details</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Joined On:</Text>
                        <Text style={styles.value}>{userData.joinDate}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Current Status:</Text>
                        <Text style={[styles.value, { color: userData.status === 'active' ? '#10B981' : '#EF4444', fontWeight: 'bold', textTransform: 'capitalize' }]}>
                            {userData.status}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>User ID:</Text>
                        <Text style={[styles.value, { fontSize: 12 }]}>{userUUID}</Text>
                    </View>
                </View>

                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { marginTop: 10, color: "#6B7280" },
    content: { padding: 16 },

    // User Card
    card: { backgroundColor: "#fff", padding: 20, borderRadius: 16, marginBottom: 24, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    userHeader: { flexDirection: "row", alignItems: "center" },
    avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#2563EB", justifyContent: "center", alignItems: "center", marginRight: 16 },
    userInfo: { flex: 1 },
    userName: { fontSize: 20, fontWeight: "700", color: "#111827" },
    userSub: { fontSize: 13, color: "#6B7280", marginTop: 2 },
    roleBadge: { backgroundColor: "#EFF6FF", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: "#DBEAFE" },
    roleText: { fontSize: 12, color: "#2563EB", fontWeight: "700" },

    // Stats
    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 12 },
    statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12, marginBottom: 24 },
    statWrapper: { width: '48%' },

    // Info Card
    infoCard: { backgroundColor: "#fff", padding: 16, borderRadius: 16, shadowColor: "#000", shadowOpacity: 0.05, elevation: 1 },
    cardTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 12 },
    row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
    label: { color: "#6B7280", fontSize: 14 },
    value: { color: "#111827", fontSize: 14, fontWeight: "500" },
    divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 4 }
});