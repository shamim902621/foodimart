
import AppHeader from '@/components/profileHeader';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from "../context/AuthContext"; // Update path
import { api } from "../lib/apiService"; // Update path

export default function MyOrdersScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [pastOrders, setPastOrders] = useState<any[]>([]);

  // --- API CALL ---
  const fetchOrders = async () => {
    try {
      // Endpoint matches the backend code above
      const res: any = await api(`/users/orders/list/${user?.id}`);

      if (res.success) {
        const allOrders = res.orders;

        // Filter: Active vs Past
        const active = allOrders.filter((o: any) =>
          ['Pending', 'Confirmed', 'Preparing', 'Out_for_Delivery', 'Ready'].includes(o.status)
        );
        const past = allOrders.filter((o: any) =>
          ['Delivered', 'Cancelled', 'Refunded'].includes(o.status)
        );

        setActiveOrders(active);
        setPastOrders(past);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // --- HELPER FUNCTIONS ---
  const handleOrderClick = (orderId: string) => {
    // Navigate to the Tracking Screen we created earlier
    router.push({
      pathname: "/user/order-tracking",
      params: { orderId: orderId }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#FFA500';
      case 'Confirmed': return '#3498DB';
      case 'Preparing': return '#9B59B6';
      case 'Ready': return '#28a745';
      case 'Out_for_Delivery': return '#FF6B35';
      case 'Delivered': return '#4CAF50';
      case 'Cancelled': return '#E74C3C';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string): any => {
    switch (status) {
      case 'Pending': return 'time-outline';
      case 'Confirmed': return 'check-circle-outline';
      case 'Preparing': return 'restaurant-outline';
      case 'Ready': return 'check-circle-outline';
      case 'Out_for_Delivery': return 'bicycle-outline';
      case 'Delivered': return 'checkmark-done-circle-outline';
      case 'Cancelled': return 'close-circle-outline';
      default: return 'receipt-outline';
    }
  };

  // --- RENDER ---
  if (loading && !refreshing) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#FF6B35" /></View>;
  }

  return (
    <View style={styles.container}>
      <AppHeader title="My Orders" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >

        {/* --- SECTION 1: ACTIVE ORDERS --- */}
        {activeOrders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Orders</Text>

            {activeOrders.map((order) => (
              <TouchableOpacity
                key={order._id}
                style={styles.orderCard}
                onPress={() => handleOrderClick(order._id)} // Navigate on click
              >
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderId}>Order #{order.orderNumber.slice(-6)}</Text>
                    <Text style={styles.orderDate}>Placed on {new Date(order.createdAt).toDateString()}</Text>
                  </View>
                  <View style={styles.orderStatus}>
                    <Ionicons
                      name={getStatusIcon(order.status)}
                      size={24}
                      color={getStatusColor(order.status)}
                    />
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                      {order.status.replace(/_/g, ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderDetails}>
                  <Text style={styles.itemsText}>{order.items.length} Items</Text>
                  <Text style={styles.amountText}>₹{order.billDetails?.grandTotal}</Text>
                </View>

                {/* Tracking Preview Button */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => handleOrderClick(order._id)}
                  >
                    <Text style={styles.primaryButtonText}>Track Order</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* --- SECTION 2: PAST ORDERS --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order History</Text>
          </View>

          {pastOrders.length === 0 && activeOrders.length === 0 ? (
            <View style={styles.center}><Text>No orders found.</Text></View>
          ) : null}

          {pastOrders.map((order) => (
            <TouchableOpacity
              key={order._id}
              style={styles.orderCard}
              onPress={() => handleOrderClick(order._id)}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>Order #{order.orderNumber.slice(-6)}</Text>
                  <Text style={styles.orderDate}>{new Date(order.createdAt).toDateString()}</Text>
                </View>
                <View style={styles.orderStatus}>
                  <Ionicons
                    name={order.status === 'Cancelled' ? "close-circle" : "checkmark-done-circle"}
                    size={20}
                    color={order.status === 'Cancelled' ? "#E74C3C" : "#4CAF50"}
                  />
                  <Text style={[styles.statusText, { color: order.status === 'Cancelled' ? "#E74C3C" : "#4CAF50" }]}>
                    {order.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <Text style={styles.itemsText}>{order.items.length} Items</Text>
                <Text style={styles.amountText}>₹{order.billDetails?.grandTotal}</Text>
              </View>

              <View style={styles.pastOrderActions}>
                <TouchableOpacity style={styles.pastOrderButton}>
                  <Feather name="repeat" size={16} color="#FF6B35" />
                  <Text style={styles.pastOrderButtonText}>Reorder</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pastOrderButton}>
                  <MaterialIcons name="receipt-long" size={16} color="#FF6B35" />
                  <Text style={styles.pastOrderButtonText}>Details</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },

  section: { marginBottom: 8, paddingTop: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', paddingHorizontal: 20, marginBottom: 12 },

  orderCard: {
    backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 16, padding: 20, borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  orderId: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  orderDate: { fontSize: 14, color: '#666' },
  orderStatus: { alignItems: 'center' },
  statusText: { fontSize: 10, fontWeight: '700', marginTop: 4 },

  orderDetails: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: '#f0f0f0', borderBottomWidth: 1, borderBottomColor: '#f0f0f0', marginBottom: 16,
  },
  itemsText: { fontSize: 14, fontWeight: '600', color: '#333' },
  amountText: { fontSize: 16, fontWeight: 'bold', color: '#328a0dff' },

  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  primaryButton: {
    flex: 1, backgroundColor: '#328a0dff', paddingVertical: 12, borderRadius: 12, alignItems: 'center',
    shadowColor: '#328a0dff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  pastOrderActions: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  pastOrderButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12 },
  pastOrderButtonText: { color: '#328a0dff', fontSize: 14, fontWeight: '600', marginLeft: 6 },
});