import AppHeader from '@/components/profileHeader';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/apiService";

export default function RiderProfileScreen() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // 1️⃣ Fetch Rider Profile Stats from Backend
    const fetchProfile = async () => {
        try {
            // Ensure this API endpoint exists in your backend
            // It should return User data + RiderProfile data
            const res: any = await api('/riders/profile/me');
            if (res.success) {
                setProfile(res.data);
            }
        } catch (e) {
            console.log("Profile Fetch Error", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout", style: "destructive", onPress: async () => {
                    await logout();
                    router.replace("/");
                }
            }
        ]);
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#FF6B35" /></View>;

    return (
        <ScrollView style={styles.container}>

            <AppHeader title="Profile" showBack={true} />

            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: user?.profilePicUrl || 'https://via.placeholder.com/150' }}
                        style={styles.avatar}
                    />
                    {/* Online Status Indicator */}
                    <View style={[styles.statusDot, { backgroundColor: profile?.isOnline ? '#2ECC71' : '#CCC' }]} />
                </View>
                <Text style={styles.name}>{user?.fullName || "Rider Name"}</Text>
                <Text style={styles.role}>Delivery Partner</Text>
                <View style={styles.idBadge}>
                    <Text style={styles.idText}>ID: {user?.userUUID?.slice(-6).toUpperCase()}</Text>
                </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{profile?.totalDeliveries || 0}</Text>
                    <Text style={styles.statLabel}>Total Orders</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={[styles.statValue, { color: '#2ECC71' }]}>₹{profile?.earnings || 0}</Text>
                    <Text style={styles.statLabel}>Total Earnings</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={[styles.statValue, { color: '#FFA500' }]}>4.8 ★</Text>
                    <Text style={styles.statLabel}>Rating</Text>
                </View>
            </View>

            {/* Vehicle Details Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vehicle Details</Text>
                <View style={styles.row}>
                    <View style={styles.iconBox}>
                        <Ionicons name="bicycle" size={20} color="#555" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Vehicle Type</Text>
                        <Text style={styles.value}>{profile?.vehicleType || "Not Set"}</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <View style={styles.iconBox}>
                        <Ionicons name="car-sport" size={20} color="#555" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Vehicle Number</Text>
                        <Text style={styles.value}>{profile?.vehicleNumber || "Not Set"}</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <View style={styles.iconBox}>
                        <Ionicons name="card" size={20} color="#555" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>License Number</Text>
                        <Text style={styles.value}>{profile?.licenseNumber || "Not Set"}</Text>
                    </View>
                </View>
            </View>

            {/* Personal Info Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Info</Text>
                <View style={styles.row}>
                    <View style={styles.iconBox}>
                        <Ionicons name="call" size={20} color="#555" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Mobile Number</Text>
                        <Text style={styles.value}>{user?.mobile}</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <View style={styles.iconBox}>
                        <Ionicons name="mail" size={20} color="#555" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Email Address</Text>
                        <Text style={styles.value}>{user?.email || "Not Added"}</Text>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#FFF" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F6F8' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    // Header
    header: { backgroundColor: '#FFF', padding: 20, alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 4 },
    avatarContainer: { position: 'relative', marginBottom: 10 },
    avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#EEE' },
    statusDot: { width: 15, height: 15, borderRadius: 8, position: 'absolute', bottom: 5, right: 5, borderWidth: 2, borderColor: '#FFF' },
    name: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    role: { fontSize: 14, color: '#666', marginBottom: 8 },
    idBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
    idText: { color: '#1E88E5', fontWeight: 'bold', fontSize: 12 },

    // Stats Grid
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, marginTop: 15 },
    statCard: { flex: 1, backgroundColor: '#FFF', marginHorizontal: 5, padding: 15, borderRadius: 12, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
    statValue: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    statLabel: { fontSize: 11, color: '#888', textTransform: 'uppercase', fontWeight: '600' },

    // Detail Sections
    section: { backgroundColor: '#FFF', marginHorizontal: 15, marginTop: 15, padding: 20, borderRadius: 12, elevation: 2 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },

    row: { flexDirection: 'row', alignItems: 'center', gap: 15, paddingVertical: 5 },
    iconBox: { width: 36, height: 36, backgroundColor: '#F5F5F5', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    label: { fontSize: 12, color: '#888' },
    value: { fontSize: 15, fontWeight: '500', color: '#333' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10, marginLeft: 50 },

    // Logout Button
    logoutBtn: { flexDirection: 'row', backgroundColor: '#FF3B30', margin: 15, padding: 15, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 20 },
    logoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});