import AppHeader from '@/components/profileHeader';
import { Ionicons } from '@expo/vector-icons';
// app/user/order-tracking.tsx
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../../lib/apiService"; // Your API wrapper
export default function OrderTrackingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 1️⃣ Fetch Order Details API
  const fetchOrderDetails = async () => {
    try {
      const res: any = await api(`/users/order/${orderId}`); // You need to create this GET API endpoint
      if (res.success) {
        setOrder(res.order);
      }
    } catch (error) {
      console.log("Error fetching order:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrderDetails();

    // Optional: Auto-refresh every 30 seconds to update status
    const interval = setInterval(fetchOrderDetails, 30000);
    return () => clearInterval(interval);
  }, [orderId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrderDetails();
  };

  // 2️⃣ Helper to determine Step Status (completed, current, pending)
  const getStepStatus = (stepStatus: string, currentStatus: string) => {
    const statusOrder = ['Pending', 'Confirmed', 'Preparing', 'Out_for_Delivery', 'Delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  // 3️⃣ Define Timeline Steps dynamically
  const trackingSteps = [
    { key: 'Pending', title: 'Order Placed', desc: 'We have received your order' },
    { key: 'Confirmed', title: 'Order Confirmed', desc: 'Restaurant has accepted your order' },
    { key: 'Preparing', title: 'Preparing', desc: 'Chef is preparing your food' },
    { key: 'Out_for_Delivery', title: 'Out for Delivery', desc: 'Rider is on the way' },
    { key: 'Delivered', title: 'Delivered', desc: 'Enjoy your meal!' },
  ];

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#FF6B35" /></View>;
  if (!order) return <View style={styles.center}><Text>Order not found</Text></View>;
  return (
    <View style={styles.container}>
      <AppHeader title="Track Order" showBack={true} />

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
          <Text style={styles.orderDate}>Placed on {new Date(order.createdAt).toDateString()}</Text>
          <Text style={styles.totalText}>Total: ₹{order.totalAmount}</Text>
          <Text style={styles.addressText}>Deliver to: {order.address}</Text>
        </View>

        {/* Dynamic Timeline */}
        <View style={styles.timeline}>
          {trackingSteps.map((step, index) => {
            const status = getStepStatus(step.key, order.status);

            // Handle Cancelled Case
            if (order.status === 'Cancelled') {
              return index === 0 ? (
                <View key="cancelled" style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.statusIcon, { backgroundColor: '#FF4444' }]}>
                      <Ionicons name="close" size={16} color="#fff" />
                    </View>
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.stepTitle}>Order Cancelled</Text>
                    <Text style={styles.stepDescription}>This order was cancelled.</Text>
                  </View>
                </View>
              ) : null;
            }

            return (
              <View key={step.key} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.statusIcon,
                    status === "completed" && styles.statusCompleted,
                    status === "current" && styles.statusCurrent,
                    status === "pending" && styles.statusPending
                  ]}>
                    {status === "completed" && <Ionicons name="checkmark" size={16} color="#fff" />}
                    {status === "current" && <View style={styles.currentDot} />}
                  </View>

                  {index < trackingSteps.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      status === "completed" && styles.timelineLineCompleted
                    ]} />
                  )}
                </View>

                <View style={styles.timelineContent}>
                  <Text style={[styles.stepTitle, status === 'pending' && { color: '#999' }]}>{step.title}</Text>

                  {/* Show timestamp only for completed steps (You'd need trackingHistory for accurate times) */}
                  {status !== 'pending' && (
                    <Text style={styles.stepDescription}>{step.desc}</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  totalText: { fontSize: 16, fontWeight: '700', color: '#FF6B35', marginTop: 5 },
  addressText: { color: '#666', marginTop: 5, fontSize: 12 },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  orderSummary: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  discounts: {
    flexDirection: "row",
    gap: 12,
  },
  discountText: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "500",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timeline: {
    padding: 16,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: 16,
  },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statusCompleted: {
    backgroundColor: "#4CAF50",
  },
  statusCurrent: {
    backgroundColor: "#FF6B35",
    borderWidth: 4,
    borderColor: "#FFE0D6",
  },
  statusPending: {
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  currentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#f0f0f0",
    marginTop: 4,
  },
  timelineLineCompleted: {
    backgroundColor: "#4CAF50",
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  stepDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 12,
    color: "#999",
  },
});