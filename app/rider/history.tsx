import AppHeader from '@/components/profileHeader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/apiService";

export default function RiderHistoryScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch History API
    const fetchHistory = async () => {
        try {
            const res: any = await api('/riders/history');
            if (res.success) {
                setHistory(res.history);
            }
        } catch (e) {
            console.log("History Fetch Error", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    // Helper for Status Colors
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered': return '#2ECC71';
            case 'Cancelled': return '#E74C3C';
            case 'Refunded': return '#95A5A6';
            default: return '#333';
        }
    };

    // Render Each History Item
    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            // Optional: Click to view full details again
            onPress={() => router.push({ pathname: "/rider/order-details", params: { orderId: item._id } })}
        >
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.orderId}>Order #{item.orderNumber?.slice(-6)}</Text>
                    <Text style={styles.date}>{new Date(item.createdAt).toDateString()} • {new Date(item.createdAt).toLocaleTimeString()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
                <Ionicons name="location" size={16} color="#555" />
                <Text style={styles.address} numberOfLines={1}>{item.deliveryAddress?.fullAddress}</Text>
            </View>

            <View style={styles.footer}>
                <Text style={styles.customer}>👤 {item.customerInfo?.name}</Text>
                <View style={styles.earningBox}>
                    <Text style={styles.earningLabel}>Earning</Text>
                    {/* Assuming Rider gets Delivery Fee as earning */}
                    <Text style={styles.earningValue}>₹{item.billDetails?.deliveryFee || 0}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <AppHeader title="Delivery History" showBack={true} />

            {loading && !refreshing ? (
                <ActivityIndicator size="large" color="#FF6B35" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item: any) => item._id}
                    renderItem={renderItem}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    contentContainerStyle={{ padding: 15 }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="time-outline" size={60} color="#CCC" />
                            <Text style={styles.emptyText}>No past deliveries yet.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },

    card: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 15, padding: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
    orderId: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    date: { fontSize: 12, color: '#888', marginTop: 2 },

    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    statusText: { fontSize: 12, fontWeight: 'bold' },

    divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },

    row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    address: { color: '#555', fontSize: 13, flex: 1 },

    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
    customer: { fontSize: 13, color: '#666', fontWeight: '500' },

    earningBox: { alignItems: 'flex-end' },
    earningLabel: { fontSize: 10, color: '#888', textTransform: 'uppercase' },
    earningValue: { fontSize: 16, fontWeight: 'bold', color: '#2ECC71' },

    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: '#888', marginTop: 10, fontSize: 16 }
});