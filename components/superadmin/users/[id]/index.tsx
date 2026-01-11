import AppHeader from "@/components/AppHeader";
import { StatBox } from "@/components/ui/stat-box"; // Assuming you have this
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../../../../app/lib/apiService"; // Adjust path as needed

export default function UserOverview() {
    const { id } = useLocalSearchParams();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        try {
            // Replace with your actual endpoint
            const response: any = await api(`/superadmin/users/${id}`);
            if (response.success) {
                setUser(response.data);
            }
        } catch (e) {
            console.log("Error fetching user details", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2563EB" />;

    // Dummy Fallback Data if API fails (for preview)
    const userData = user || {
        name: "Aakash Kumar",
        email: "aakash@example.com",
        phone: "9876543210",
        role: "USER",
        joinDate: "2024-01-15",
        totalSpend: 12500,
        ordersCount: 15,
        walletBalance: 250
    };

    return (
        <View style={styles.container}>
            <AppHeader title="User Profile" showBack={true} />

            <ScrollView contentContainerStyle={styles.content}>

                {/* User Identity Card */}
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

                {/* Stats Grid */}
                <Text style={styles.sectionTitle}>Spending Habits</Text>
                <View style={styles.statsGrid}>
                    <StatBox title="Total Orders" value={userData.ordersCount} icon="receipt" color="#3B82F6" />
                    <StatBox title="Lifetime Spend" value={`₹${userData.totalSpend}`} icon="wallet" color="#10B981" />
                    <StatBox title="Wallet Bal" value={`₹${userData.walletBalance}`} icon="cash" color="#F59E0B" />
                    <StatBox title="Avg Order" value="₹850" icon="stats-chart" color="#8B5CF6" />
                </View>

                {/* Contact Info */}
                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Account Details</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Joined On:</Text>
                        <Text style={styles.value}>{userData.joinDate}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Status:</Text>
                        <Text style={[styles.value, { color: '#10B981', fontWeight: 'bold' }]}>Active</Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    content: { padding: 16 },

    card: { backgroundColor: "#fff", padding: 20, borderRadius: 16, marginBottom: 24, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    userHeader: { flexDirection: "row", alignItems: "center" },
    avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#2563EB", justifyContent: "center", alignItems: "center", marginRight: 16 },
    userInfo: { flex: 1 },
    userName: { fontSize: 20, fontWeight: "700", color: "#111827" },
    userSub: { fontSize: 13, color: "#6B7280", marginTop: 2 },
    roleBadge: { backgroundColor: "#EFF6FF", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: "#DBEAFE" },
    roleText: { fontSize: 12, color: "#2563EB", fontWeight: "700" },

    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 12 },
    statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12, marginBottom: 24 },

    infoCard: { backgroundColor: "#fff", padding: 16, borderRadius: 16 },
    cardTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 12 },
    row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
    label: { color: "#6B7280", fontSize: 14 },
    value: { color: "#111827", fontSize: 14, fontWeight: "500" },
    divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 4 }
});