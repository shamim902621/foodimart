// import AppHeader from '@/components/profileHeader';
// import { Ionicons } from '@expo/vector-icons';
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useEffect, useState } from 'react';
// import {
//     ActivityIndicator,
//     RefreshControl,
//     ScrollView,
//     StyleSheet,
//     Text,
//     View
// } from "react-native";
// import { api } from "../lib/apiService"; // Your API wrapper

// export default function OrderTrackingScreen() {
//     const { orderId } = useLocalSearchParams<{ orderId: string }>();
//     const router = useRouter();

//     const [order, setOrder] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);

//     // 1️⃣ Fetch Order Details
//     const fetchOrderDetails = async () => {
//         try {
//             // Ensure you have this API endpoint: router.get('/order/:id')
//             const res: any = await api(`/users/orders/${orderId}`);
//             if (res.success) {
//                 setOrder(res.order);
//             }
//         } catch (error) {
//             console.log("Error fetching order:", error);
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     // Auto-Refresh every 10 seconds to check status
//     useEffect(() => {
//         if (orderId) {
//             fetchOrderDetails();
//             const interval = setInterval(fetchOrderDetails, 10000);
//             return () => clearInterval(interval);
//         }
//     }, [orderId]);

//     const onRefresh = () => {
//         setRefreshing(true);
//         fetchOrderDetails();
//     };

//     // 2️⃣ Timeline Logic
//     const getStepStatus = (stepStatus: string, currentStatus: string) => {
//         const statusOrder = ['Pending', 'Confirmed', 'Preparing', 'Out_for_Delivery', 'Delivered'];
//         const currentIndex = statusOrder.indexOf(currentStatus);
//         const stepIndex = statusOrder.indexOf(stepStatus);

//         if (stepIndex < currentIndex) return 'completed';
//         if (stepIndex === currentIndex) return 'current';
//         return 'pending';
//     };

//     const trackingSteps = [
//         { key: 'Pending', title: 'Order Placed', desc: 'We have received your order' },
//         { key: 'Confirmed', title: 'Confirmed', desc: 'Restaurant has accepted your order' },
//         { key: 'Preparing', title: 'Preparing', desc: 'Chef is cooking your food' },
//         { key: 'Out_for_Delivery', title: 'Out for Delivery', desc: 'Rider is on the way' },
//         { key: 'Delivered', title: 'Delivered', desc: 'Enjoy your meal!' },
//     ];

//     if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#FF6B35" /></View>;
//     if (!order) return <View style={styles.center}><Text>Order not found</Text></View>;

//     return (
//         <View style={styles.container}>
//             <AppHeader title="Track Order" showBack={true} />

//             <ScrollView
//                 style={styles.scrollView}
//                 refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//             >
//                 {/* Order Summary */}
//                 <View style={styles.orderSummary}>
//                     <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
//                     <View style={styles.amountRow}>
//                         <Text style={styles.totalLabel}>Total Amount</Text>
//                         <Text style={styles.totalText}>₹{order.totalAmount}</Text>
//                     </View>
//                     <Text style={styles.addressText}>Deliver to: {order.address}</Text>
//                     <Text style={styles.paymentBadge}>{order.paymentMethod} - {order.paymentStatus}</Text>
//                 </View>

//                 {/* Timeline */}
//                 <View style={styles.timeline}>
//                     <Text style={styles.timelineHeader}>Order Status</Text>
//                     {trackingSteps.map((step, index) => {
//                         const status = getStepStatus(step.key, order.status);

//                         return (
//                             <View key={step.key} style={styles.timelineItem}>
//                                 <View style={styles.timelineLeft}>
//                                     <View style={[
//                                         styles.statusIcon,
//                                         status === "completed" && styles.statusCompleted,
//                                         status === "current" && styles.statusCurrent,
//                                         status === "pending" && styles.statusPending
//                                     ]}>
//                                         {status === "completed" && <Ionicons name="checkmark" size={14} color="#fff" />}
//                                         {status === "current" && <View style={styles.currentDot} />}
//                                     </View>
//                                     {index < trackingSteps.length - 1 && (
//                                         <View style={[
//                                             styles.timelineLine,
//                                             status === "completed" && styles.timelineLineCompleted
//                                         ]} />
//                                     )}
//                                 </View>
//                                 <View style={styles.timelineContent}>
//                                     <Text style={[styles.stepTitle, status === 'pending' && { color: '#999' }]}>{step.title}</Text>
//                                     {status !== 'pending' && <Text style={styles.stepDescription}>{step.desc}</Text>}
//                                 </View>
//                             </View>
//                         );
//                     })}
//                 </View>
//             </ScrollView>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#F9FAFB" },
//     center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     scrollView: { padding: 16 },
//     orderSummary: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 20, elevation: 2 },
//     orderNumber: { fontSize: 18, fontWeight: '700', color: '#111' },
//     amountRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 5 },
//     totalLabel: { color: '#666' },
//     totalText: { fontSize: 18, fontWeight: '700', color: '#FF6B35' },
//     addressText: { color: '#666', fontSize: 13, marginBottom: 10 },
//     paymentBadge: { alignSelf: 'flex-start', backgroundColor: '#E0F2F1', color: '#00695C', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 12, fontWeight: '600' },

//     timeline: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, elevation: 2 },
//     timelineHeader: { fontSize: 16, fontWeight: '700', marginBottom: 20 },
//     timelineItem: { flexDirection: "row", marginBottom: 0, minHeight: 70 },
//     timelineLeft: { alignItems: "center", marginRight: 16, width: 24 },
//     statusIcon: { width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center" },
//     statusCompleted: { backgroundColor: "#2ECC71" },
//     statusCurrent: { backgroundColor: "#FFFFFF", borderWidth: 4, borderColor: "#FF6B35" },
//     statusPending: { backgroundColor: "#F0F0F0" },
//     currentDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FF6B35" },
//     timelineLine: { width: 2, flex: 1, backgroundColor: "#F0F0F0", marginVertical: 4 },
//     timelineLineCompleted: { backgroundColor: "#2ECC71" },
//     timelineContent: { flex: 1, paddingBottom: 20 },
//     stepTitle: { fontSize: 15, fontWeight: "600", color: "#333" },
//     stepDescription: { fontSize: 12, color: "#888", marginTop: 2 },
// });



import AppHeader from '@/components/profileHeader';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../lib/apiService";

export default function OrderTrackingScreen() {
    const { orderId } = useLocalSearchParams<{ orderId: string }>();

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // 1️⃣ Fetch Order Details API
    const fetchOrderDetails = async () => {
        try {
            // ✅ Corrected API Endpoint (Make sure backend route matches)
            const res: any = await api(`/users/orders/${orderId}`);

            if (res.success) {
                setOrder(res.order);
            } else {
                console.log("Order fetch failed:", res.message);
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

        // Auto-refresh every 15 seconds
        const interval = setInterval(fetchOrderDetails, 15000);
        return () => clearInterval(interval);
    }, [orderId]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrderDetails();
    };

    // 2️⃣ Helper: Determine Status Step
    const getStepStatus = (stepStatus: string, currentStatus: string) => {
        const statusOrder = ['Pending', 'Confirmed', 'Preparing', 'Out_for_Delivery', 'Delivered'];

        // Normalize strings (API might return "Out_for_Delivery", UI steps match that)
        const currentIndex = statusOrder.indexOf(currentStatus);
        const stepIndex = statusOrder.indexOf(stepStatus);

        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'pending';
    };

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
            <AppHeader title="Track Order"  showBack={true} />

            <ScrollView
                style={styles.scrollView}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Order Summary */}
                <View style={styles.orderSummary}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
                        <Text style={styles.statusBadge}>{order.status}</Text>
                    </View>

                    <Text style={styles.orderDate}>Placed on {new Date(order.createdAt).toDateString()}</Text>

                    <View style={styles.divider} />

                    {/* ✅ UPDATED FIELDS FOR NEW SCHEMA */}
                    <Text style={styles.totalText}>
                        Total Amount: <Text style={{ color: '#2ECC71' }}>₹{order.billDetails?.grandTotal}</Text>
                    </Text>

                    <Text style={styles.addressLabel}>Deliver to:</Text>
                    <Text style={styles.addressText}>
                        {order.deliveryAddress?.fullAddress} - {order.deliveryAddress?.pincode}
                    </Text>
                </View>

                {/* Dynamic Timeline */}
                <View style={styles.timeline}>
                    <Text style={styles.sectionTitle}>Order Status</Text>

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
                                    {/* Vertical Line Top (Connect to previous) */}
                                    {index > 0 && <View style={[styles.lineTop, status !== 'pending' && styles.lineActive]} />}

                                    <View style={[
                                        styles.statusIcon,
                                        status === "completed" && styles.statusCompleted,
                                        status === "current" && styles.statusCurrent,
                                        status === "pending" && styles.statusPending
                                    ]}>
                                        {status === "completed" && <Ionicons name="checkmark" size={14} color="#fff" />}
                                        {status === "current" && <View style={styles.currentDot} />}
                                    </View>

                                    {/* Vertical Line Bottom (Connect to next) */}
                                    {index < trackingSteps.length - 1 && (
                                        <View style={[styles.lineBottom, status === 'completed' && styles.lineActive]} />
                                    )}
                                </View>

                                <View style={styles.timelineContent}>
                                    <Text style={[styles.stepTitle, status === 'pending' && { color: '#AAA' }]}>{step.title}</Text>
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
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1 },

    // Order Summary Card
    orderSummary: {
        backgroundColor: '#FFF',
        margin: 16,
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
    },
    orderNumber: { fontSize: 18, fontWeight: "bold", color: "#333" },
    statusBadge: { fontSize: 12, fontWeight: '700', color: '#FF6B35', backgroundColor: '#FFF0E6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    orderDate: { fontSize: 13, color: "#888", marginTop: 4 },
    divider: { height: 1, backgroundColor: '#EEE', marginVertical: 12 },
    totalText: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 8 },
    addressLabel: { fontSize: 12, fontWeight: '600', color: '#666' },
    addressText: { color: '#444', fontSize: 13, lineHeight: 18 },

    // Timeline Section
    timeline: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginBottom: 30,
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
    },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 20, color: '#333' },
    timelineItem: { flexDirection: "row", marginBottom: 0, minHeight: 70 }, // Fixed height for lines

    timelineLeft: { alignItems: "center", marginRight: 16, width: 24 },

    // Icons & Dots
    statusIcon: { width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center", zIndex: 2 },
    statusCompleted: { backgroundColor: "#2ECC71" },
    statusCurrent: { backgroundColor: "#FFF", borderWidth: 4, borderColor: "#FF6B35", width: 24, height: 24 },
    statusPending: { backgroundColor: "#F0F0F0" },
    currentDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FF6B35" },

    // Connecting Lines
    lineTop: { position: 'absolute', top: -35, width: 2, height: 35, backgroundColor: '#F0F0F0', zIndex: 1 },
    lineBottom: { position: 'absolute', top: 24, width: 2, height: 46, backgroundColor: '#F0F0F0', zIndex: 1 },
    lineActive: { backgroundColor: '#2ECC71' },

    timelineContent: { flex: 1, paddingBottom: 20, justifyContent: 'center' },
    stepTitle: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 2 },
    stepDescription: { fontSize: 12, color: "#888" },
});