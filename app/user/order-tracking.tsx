// import AppHeader from '@/components/profileHeader';
// import { Ionicons } from '@expo/vector-icons';
// import { useLocalSearchParams } from "expo-router";
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
// import { api } from "../lib/apiService";

// export default function OrderTrackingScreen() {
//     const { orderId } = useLocalSearchParams<{ orderId: string }>();

//     const [order, setOrder] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);

//     // 1️⃣ Fetch Order Details API
//     const fetchOrderDetails = async () => {
//         try {
//             // ✅ Corrected API Endpoint (Make sure backend route matches)
//             const res: any = await api(`/users/orders/${orderId}`);

//             if (res.success) {
//                 setOrder(res.order);
//             } else {
//                 console.log("Order fetch failed:", res.message);
//             }
//         } catch (error) {
//             console.log("Error fetching order:", error);
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     useEffect(() => {
//         if (orderId) fetchOrderDetails();

//         // Auto-refresh every 15 seconds
//         const interval = setInterval(fetchOrderDetails, 15000);
//         return () => clearInterval(interval);
//     }, [orderId]);

//     const onRefresh = () => {
//         setRefreshing(true);
//         fetchOrderDetails();
//     };

//     // 2️⃣ Helper: Determine Status Step
//     const getStepStatus = (stepStatus: string, currentStatus: string) => {
//         const statusOrder = ['Pending', 'Confirmed', 'Preparing', 'Out_for_Delivery', 'Delivered'];

//         // Normalize strings (API might return "Out_for_Delivery", UI steps match that)
//         const currentIndex = statusOrder.indexOf(currentStatus);
//         const stepIndex = statusOrder.indexOf(stepStatus);

//         if (stepIndex < currentIndex) return 'completed';
//         if (stepIndex === currentIndex) return 'current';
//         return 'pending';
//     };

//     const trackingSteps = [
//         { key: 'Pending', title: 'Order Placed', desc: 'We have received your order' },
//         { key: 'Confirmed', title: 'Order Confirmed', desc: 'Restaurant has accepted your order' },
//         { key: 'Preparing', title: 'Preparing', desc: 'Chef is preparing your food' },
//         { key: 'Ready', title: 'Rider is on the way', desc: 'Rider is on the way' },
//         { key: 'Out_for_Delivery', title: 'Out for Delivery', desc: 'Rider is on the way' },
//         { key: 'Delivered', title: 'Delivered', desc: 'Enjoy your meal!' },
//         // { key: 'Cancelled', title: 'Order Cancelled', desc: 'This order was cancelled.' }, // Added for clarity

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
//                     <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                         <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
//                         <Text style={styles.statusBadge}>{order.status}</Text>
//                     </View>

//                     <Text style={styles.orderDate}>Placed on {new Date(order.createdAt).toDateString()}</Text>

//                     <View style={styles.divider} />

//                     {/* ✅ UPDATED FIELDS FOR NEW SCHEMA */}
//                     <Text style={styles.totalText}>
//                         Total Amount: <Text style={{ color: '#2ECC71' }}>₹{order.billDetails?.grandTotal}</Text>
//                     </Text>

//                     <Text style={styles.addressLabel}>Deliver to:</Text>
//                     <Text style={styles.addressText}>
//                         {order.deliveryAddress?.fullAddress} - {order.deliveryAddress?.pincode}
//                     </Text>
//                 </View>

//                 {/* Dynamic Timeline */}
//                 <View style={styles.timeline}>
//                     <Text style={styles.sectionTitle}>Order Status</Text>

//                     {trackingSteps.map((step, index) => {
//                         const status = getStepStatus(step.key, order.status);

//                         // Handle Cancelled Case
//                         if (order.status === 'Cancelled') {
//                             return index === 0 ? (
//                                 <View key="cancelled" style={styles.timelineItem}>
//                                     <View style={styles.timelineLeft}>
//                                         <View style={[styles.statusIcon, { backgroundColor: '#FF4444' }]}>
//                                             <Ionicons name="close" size={16} color="#fff" />
//                                         </View>
//                                     </View>
//                                     <View style={styles.timelineContent}>
//                                         <Text style={styles.stepTitle}>Order Cancelled</Text>
//                                         <Text style={styles.stepDescription}>This order was cancelled.</Text>
//                                     </View>
//                                 </View>
//                             ) : null;
//                         }

//                         return (
//                             <View key={step.key} style={styles.timelineItem}>
//                                 <View style={styles.timelineLeft}>
//                                     {/* Vertical Line Top (Connect to previous) */}
//                                     {index > 0 && <View style={[styles.lineTop, status !== 'pending' && styles.lineActive]} />}

//                                     <View style={[
//                                         styles.statusIcon,
//                                         status === "completed" && styles.statusCompleted,
//                                         status === "current" && styles.statusCurrent,
//                                         status === "pending" && styles.statusPending
//                                     ]}>
//                                         {status === "completed" && <Ionicons name="checkmark" size={14} color="#fff" />}
//                                         {status === "current" && <View style={styles.currentDot} />}
//                                     </View>

//                                     {/* Vertical Line Bottom (Connect to next) */}
//                                     {index < trackingSteps.length - 1 && (
//                                         <View style={[styles.lineBottom, status === 'completed' && styles.lineActive]} />
//                                     )}
//                                 </View>

//                                 <View style={styles.timelineContent}>
//                                     <Text style={[styles.stepTitle, status === 'pending' && { color: '#AAA' }]}>{step.title}</Text>
//                                     {status !== 'pending' && (
//                                         <Text style={styles.stepDescription}>{step.desc}</Text>
//                                     )}
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
//     scrollView: { flex: 1 },

//     // Order Summary Card
//     orderSummary: {
//         backgroundColor: '#FFF',
//         margin: 16,
//         padding: 20,
//         borderRadius: 16,
//         shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
//     },
//     orderNumber: { fontSize: 18, fontWeight: "bold", color: "#333" },
//     statusBadge: { fontSize: 12, fontWeight: '700', color: '#FF6B35', backgroundColor: '#FFF0E6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
//     orderDate: { fontSize: 13, color: "#888", marginTop: 4 },
//     divider: { height: 1, backgroundColor: '#EEE', marginVertical: 12 },
//     totalText: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 8 },
//     addressLabel: { fontSize: 12, fontWeight: '600', color: '#666' },
//     addressText: { color: '#444', fontSize: 13, lineHeight: 18 },

//     // Timeline Section
//     timeline: {
//         backgroundColor: '#FFF',
//         marginHorizontal: 16,
//         marginBottom: 30,
//         padding: 20,
//         borderRadius: 16,
//         shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
//     },
//     sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 20, color: '#333' },
//     timelineItem: { flexDirection: "row", marginBottom: 0, minHeight: 70 }, // Fixed height for lines

//     timelineLeft: { alignItems: "center", marginRight: 16, width: 24 },

//     // Icons & Dots
//     statusIcon: { width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center", zIndex: 2 },
//     statusCompleted: { backgroundColor: "#2ECC71" },
//     statusCurrent: { backgroundColor: "#FFF", borderWidth: 4, borderColor: "#FF6B35", width: 24, height: 24 },
//     statusPending: { backgroundColor: "#F0F0F0" },
//     currentDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FF6B35" },

//     // Connecting Lines
//     lineTop: { position: 'absolute', top: -35, width: 2, height: 35, backgroundColor: '#F0F0F0', zIndex: 1 },
//     lineBottom: { position: 'absolute', top: 24, width: 2, height: 46, backgroundColor: '#F0F0F0', zIndex: 1 },
//     lineActive: { backgroundColor: '#2ECC71' },

//     timelineContent: { flex: 1, paddingBottom: 20, justifyContent: 'center' },
//     stepTitle: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 2 },
//     stepDescription: { fontSize: 12, color: "#888" },
// });



import AppHeader from '@/components/profileHeader';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../lib/apiService";

// 🎨 COLORS
const COLORS = {
    primary: '#FF6B35', // Your Brand Orange
    success: '#26A541', // Flipkart Green
    pending: '#D1D5DB', // Light Grey
    textMain: '#212121',
    textSub: '#757575',
    bg: '#F1F3F6'      // Light Gray Background
};

// ✨ ANIMATED PULSE COMPONENT (The Ripple Effect)
const PulseIndicator = () => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 1500, // Seamless loop
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const scale = anim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.4, 1],
    });

    const opacity = anim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.6, 0.2, 0],
    });

    return (
        <View style={styles.pulseContainer}>
            <Animated.View style={[styles.pulseRing, { transform: [{ scale }], opacity }]} />
            <View style={styles.pulseDot} />
        </View>
    );
};

export default function OrderTrackingScreen() {
    const { orderId } = useLocalSearchParams<{ orderId: string }>();

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // 1️⃣ Fetch Order Details API
    const fetchOrderDetails = async () => {
        try {
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
        const interval = setInterval(fetchOrderDetails, 15000);
        return () => clearInterval(interval);
    }, [orderId]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrderDetails();
    };

    // 2️⃣ Helper: Determine Status Step
    // Returns: 'completed' | 'current' | 'pending'
    const getStepStatus = (stepKey: string, currentStatus: string) => {
        // ⚠️ CRITICAL: This array must match the logical progression of your backend Enum
        const statusOrder = [
            'Pending',
            'Confirmed',
            'Preparing',
            'Ready',
            'Out_for_Delivery',
            'Delivered'
        ];

        // If order is Cancelled, everything is 'pending' (grey) except the first one or handle separately
        if (currentStatus === 'Cancelled') return 'pending';

        const currentIndex = statusOrder.indexOf(currentStatus);
        const stepIndex = statusOrder.indexOf(stepKey);

        if (currentIndex === -1) return 'pending'; // Safety check
        if (stepIndex < currentIndex) return 'completed'; // Past steps (Green)
        if (stepIndex === currentIndex) return 'current'; // Active step (Orange Pulse)
        return 'pending'; // Future steps (Grey)
    };

    const trackingSteps = [
        {
            key: 'Pending',
            title: 'Order Placed',
            desc: 'We have received your order.'
        },
        {
            key: 'Confirmed',
            title: 'Order Confirmed',
            desc: 'Restaurant has accepted your order.'
        },
        {
            key: 'Preparing',
            title: 'Preparing',
            desc: 'Your food is being prepared.'
        },
        {
            key: 'Ready',
            title: 'Ready for Pickup',
            desc: 'Order is packed, waiting for rider.'
        },
        {
            key: 'Out_for_Delivery',
            title: 'Out for Delivery',
            desc: 'Rider has picked up your order.'
        },
        {
            key: 'Delivered',
            title: 'Delivered',
            desc: 'Enjoy your meal!'
        },
    ];

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    if (!order) return <View style={styles.center}><Text>Order not found</Text></View>;

    return (
        <View style={styles.container}>
            <AppHeader title="Track Order" showBack={true} />

            <ScrollView
                style={styles.scrollView}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            >
                {/* 📦 Order Summary Card */}
                <View style={styles.card}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.orderIdLabel}>Order ID</Text>
                            <Text style={styles.orderIdText}>#{order.orderNumber}</Text>
                        </View>
                        <Text style={styles.totalAmount}>₹{order.billDetails?.grandTotal}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.addressRow}>
                        <Ionicons name="location-sharp" size={18} color={COLORS.textSub} style={{ marginTop: 2 }} />
                        <View style={{ marginLeft: 8, flex: 1 }}>
                            <Text style={styles.addressTitle}>Delivery Address</Text>
                            <Text style={styles.addressText} numberOfLines={2}>
                                {order.deliveryAddress?.fullAddress}, {order.deliveryAddress?.pincode}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* 📍 Timeline Section */}
                <View style={[styles.card, { paddingVertical: 24 }]}>
                    <Text style={styles.sectionTitle}>Order Status</Text>

                    {/* Cancelled State Handling */}
                    {order.status === 'Cancelled' ? (
                        <View style={styles.cancelledContainer}>
                            <Ionicons name="close-circle" size={48} color="#FF4444" />
                            <Text style={styles.cancelledText}>Order Cancelled</Text>
                            <Text style={styles.cancelledDesc}>
                                This order was cancelled. If you have questions, please contact support.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.timelineContainer}>
                            {trackingSteps.map((step, index) => {
                                const status = getStepStatus(step.key, order.status);
                                const isLast = index === trackingSteps.length - 1;

                                // Logic for the Line connecting to the NEXT step
                                // The line is green ONLY if the *next* step is also completed/current
                                const nextStatus = isLast ? null : getStepStatus(trackingSteps[index + 1].key, order.status);
                                const isLineActive = status === 'completed';

                                return (
                                    <View key={step.key} style={styles.stepItem}>
                                        {/* Left Side: Line & Icon */}
                                        <View style={styles.leftColumn}>
                                            {/* The Icon/Dot */}
                                            <View style={styles.iconContainer}>
                                                {status === 'completed' && (
                                                    <View style={styles.completedDot}>
                                                        <Ionicons name="checkmark" size={12} color="#FFF" />
                                                    </View>
                                                )}
                                                {status === 'current' && <PulseIndicator />}
                                                {status === 'pending' && <View style={styles.pendingDot} />}
                                            </View>

                                            {/* The Vertical Line (Draw only if not last item) */}
                                            {!isLast && (
                                                <View style={[
                                                    styles.verticalLine,
                                                    isLineActive ? styles.lineActive : styles.lineInactive
                                                ]} />
                                            )}
                                        </View>

                                        {/* Right Side: Text Content */}
                                        <View style={[styles.rightContent, { paddingBottom: isLast ? 0 : 32 }]}>
                                            <Text style={[
                                                styles.stepTitle,
                                                status === 'pending' && styles.textMuted,
                                                status === 'current' && styles.textHighlight
                                            ]}>
                                                {step.title}
                                            </Text>

                                            {(status === 'completed' || status === 'current') && (
                                                <Text style={styles.stepDesc}>{step.desc}</Text>
                                            )}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1, padding: 12 },

    // Cards
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        // Shadow for depth
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },

    // Header/Summary
    orderIdLabel: { fontSize: 12, color: COLORS.textSub, textTransform: 'uppercase', letterSpacing: 0.5 },
    orderIdText: { fontSize: 16, fontWeight: '700', color: COLORS.textMain, marginTop: 2 },
    totalAmount: { fontSize: 18, fontWeight: '700', color: COLORS.success },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
    addressRow: { flexDirection: 'row' },
    addressTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textMain },
    addressText: { fontSize: 13, color: COLORS.textSub, marginTop: 2, lineHeight: 18 },

    // Timeline
    sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMain, marginBottom: 20 },
    timelineContainer: { paddingLeft: 8 },
    stepItem: { flexDirection: 'row' },

    // Left Column (Icons + Lines)
    leftColumn: { alignItems: 'center', width: 30, marginRight: 12 },
    iconContainer: {
        width: 24, height: 24, justifyContent: 'center', alignItems: 'center', zIndex: 10, backgroundColor: '#FFF'
    },
    verticalLine: {
        width: 2,
        flex: 1,
        backgroundColor: COLORS.pending,
        marginVertical: -2 // Pull line up to connect smoothly behind dots
    },
    lineActive: { backgroundColor: COLORS.success },
    lineInactive: { backgroundColor: '#E0E0E0' },

    // Dots Styles
    completedDot: {
        width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.success,
        justifyContent: 'center', alignItems: 'center'
    },
    pendingDot: {
        width: 10, height: 10, borderRadius: 5, backgroundColor: '#E0E0E0'
    },

    // Pulse Animation Styles
    pulseContainer: { justifyContent: 'center', alignItems: 'center' },
    pulseRing: {
        position: 'absolute',
        width: 34, height: 34, borderRadius: 17,
        backgroundColor: 'rgba(255, 107, 53, 0.3)', // Semi-transparent brand color
    },
    pulseDot: {
        width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.primary,
        borderWidth: 2, borderColor: '#FFF'
    },

    // Right Content
    rightContent: { flex: 1, justifyContent: 'flex-start' },
    stepTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textMain, marginBottom: 2 },
    stepDesc: { fontSize: 12, color: COLORS.textSub },

    // Text Variants
    textMuted: { color: COLORS.pending },
    textHighlight: { color: COLORS.primary }, // Highlight current step title

    // Cancelled
    cancelledContainer: { alignItems: 'center', padding: 20 },
    cancelledText: { marginTop: 10, fontSize: 16, color: '#FF4444', fontWeight: '600' },
    cancelledDesc: { marginTop: 5, fontSize: 14, color: COLORS.textSub, fontWeight: '500' }
});