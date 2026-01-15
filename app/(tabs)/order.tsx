// import AppHeader from '@/components/profileHeader';
// import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import React from 'react';
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';

// const MyOrdersScreen = () => {
//   const activeOrder = {
//     id: '#90897',
//     date: 'October 19 2021',
//     itemsCount: '3 Items',
//     totalAmount: '$89.99',
//     status: 'shipped', // placed, confirmed, shipped, out_for_delivery, delivered
//     tracking: [
//       { stage: 'Order placed', time: '10:30 AM', completed: true },
//       { stage: 'Order confirmed', time: '10:45 AM', completed: true },
//       { stage: 'Order shipped', time: '11:30 AM', completed: true },
//       { stage: 'Out for delivery', time: '2:15 PM', completed: false },
//       { stage: 'Order delivered', time: '', completed: false },
//     ]
//   };

//   const pastOrders = [
//     {
//       id: '#90896',
//       date: 'October 18 2021',
//       itemsCount: '2 Items',
//       totalAmount: '$45.50',
//       status: 'delivered',
//     },
//     {
//       id: '#90895',
//       date: 'October 17 2021',
//       itemsCount: '5 Items',
//       totalAmount: '$120.75',
//       status: 'delivered',
//     },
//     {
//       id: '#90894',
//       date: 'October 15 2021',
//       itemsCount: '1 Item',
//       totalAmount: '$24.99',
//       status: 'delivered',
//     },
//     {
//       id: '#90893',
//       date: 'October 12 2021',
//       itemsCount: '4 Items',
//       totalAmount: '$67.25',
//       status: 'delivered',
//     },
//   ];

//   const getStatusIcon = (status: any) => {
//     switch (status) {
//       case 'placed':
//         return 'receipt-outline';
//       case 'confirmed':
//         return 'checkmark-circle-outline';
//       case 'shipped':
//         return 'cube-outline';
//       case 'out_for_delivery':
//         return 'bicycle-outline';
//       case 'delivered':
//         return 'checkmark-done-circle-outline';
//       default:
//         return 'receipt-outline';
//     }
//   };

//   const getStatusColor = (status: any) => {
//     switch (status) {
//       case 'placed':
//         return '#FFA500';
//       case 'confirmed':
//         return '#4CAF50';
//       case 'shipped':
//         return '#2196F3';
//       case 'out_for_delivery':
//         return '#FF6B35';
//       case 'delivered':
//         return '#4CAF50';
//       default:
//         return '#666';
//     }
//   };
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <AppHeader
//         title="My Orders"
//         showBack={true}
//       />

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Current Order Tracking */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Current Order</Text>
//           <View style={styles.orderCard}>
//             <View style={styles.orderHeader}>
//               <View>
//                 <Text style={styles.orderId}>Order {activeOrder.id}</Text>
//                 <Text style={styles.orderDate}>Placed on {activeOrder.date}</Text>
//               </View>
//               <View style={styles.orderStatus}>
//                 <Ionicons
//                   name={getStatusIcon(activeOrder.status)}
//                   size={20}
//                   color={getStatusColor(activeOrder.status)}
//                 />
//                 <Text style={[styles.statusText, { color: getStatusColor(activeOrder.status) }]}>
//                   {activeOrder.status.replace('_', ' ').toUpperCase()}
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.orderDetails}>
//               <Text style={styles.itemsText}>{activeOrder.itemsCount}</Text>
//               <Text style={styles.amountText}>{activeOrder.totalAmount}</Text>
//             </View>

//             {/* Tracking Timeline */}
//             <View style={styles.timeline}>
//               {activeOrder.tracking.map((step, index) => (
//                 <View key={index} style={styles.timelineStep}>
//                   <View style={styles.timelineLineContainer}>
//                     <View
//                       style={[
//                         styles.timelineDot,
//                         step.completed ? styles.completedDot : styles.pendingDot
//                       ]}
//                     />
//                     {index < activeOrder.tracking.length - 1 && (
//                       <View
//                         style={[
//                           styles.timelineLine,
//                           step.completed ? styles.completedLine : styles.pendingLine
//                         ]}
//                       />
//                     )}
//                   </View>
//                   <View style={styles.timelineContent}>
//                     <Text
//                       style={[
//                         styles.timelineStage,
//                         step.completed ? styles.completedText : styles.pendingText
//                       ]}
//                     >
//                       {step.stage}
//                     </Text>
//                     {step.time && (
//                       <Text style={styles.timelineTime}>{step.time}</Text>
//                     )}
//                   </View>
//                 </View>
//               ))}
//             </View>

//             {/* Action Buttons */}
//             <View style={styles.actionButtons}>
//               <TouchableOpacity style={styles.secondaryButton}>
//                 <Text style={styles.secondaryButtonText}>Cancel Order</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.primaryButton} >
//                 <Text style={styles.primaryButtonText}>Track Order</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         {/* Past Orders */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Order History</Text>
//             <TouchableOpacity>
//               <Text style={styles.seeAllText}>See all</Text>
//             </TouchableOpacity>
//           </View>

//           {pastOrders.map((order, index) => (
//             <TouchableOpacity key={index} style={styles.orderCard}>
//               <View style={styles.orderHeader}>
//                 <View>
//                   <Text style={styles.orderId}>Order {order.id}</Text>
//                   <Text style={styles.orderDate}>Placed on {order.date}</Text>
//                 </View>
//                 <View style={styles.orderStatus}>
//                   <Ionicons
//                     name="checkmark-done-circle-outline"
//                     size={20}
//                     color="#4CAF50"
//                   />
//                   <Text style={[styles.statusText, { color: '#4CAF50' }]}>
//                     DELIVERED
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.orderDetails}>
//                 <Text style={styles.itemsText}>{order.itemsCount}</Text>
//                 <Text style={styles.amountText}>{order.totalAmount}</Text>
//               </View>

//               <View style={styles.pastOrderActions}>
//                 <TouchableOpacity style={styles.pastOrderButton}>
//                   <Feather name="repeat" size={16} color="#FF6B35" />
//                   <Text style={styles.pastOrderButtonText}>Reorder</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.pastOrderButton}>
//                   <Ionicons name="star-outline" size={16} color="#FF6B35" />
//                   <Text style={styles.pastOrderButtonText}>Rate</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.pastOrderButton}>
//                   <MaterialIcons name="receipt-long" size={16} color="#FF6B35" />
//                   <Text style={styles.pastOrderButtonText}>Invoice</Text>
//                 </TouchableOpacity>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Support Section */}
//         <View style={styles.supportSection}>
//           <View style={styles.supportCard}>
//             <Ionicons name="help-circle-outline" size={24} color="#FF6B35" />
//             <View style={styles.supportContent}>
//               <Text style={styles.supportTitle}>Need help with your order?</Text>
//               <Text style={styles.supportSubtitle}>Contact our support team</Text>
//             </View>
//             <TouchableOpacity style={styles.supportButton}>
//               <Text style={styles.supportButtonText}>Get Help</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     textAlign: 'center',
//   },
//   section: {
//     marginBottom: 8,
//     paddingTop: 10,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     paddingHorizontal: 20,
//     marginBottom: 12,
//   },
//   seeAllText: {
//     fontSize: 14,
//     color: '#328a0dff',
//     fontWeight: '600',
//   },
//   orderCard: {
//     backgroundColor: '#fff',
//     marginHorizontal: 20,
//     marginBottom: 16,
//     padding: 20,
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   orderHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   orderId: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   orderDate: {
//     fontSize: 14,
//     color: '#666',
//   },
//   orderStatus: {
//     alignItems: 'center',
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '600',
//     marginTop: 4,
//   },
//   orderDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//     marginBottom: 16,
//   },
//   itemsText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//   },
//   amountText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#328a0dff',
//   },
//   timeline: {
//     marginBottom: 20,
//   },
//   timelineStep: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   timelineLineContainer: {
//     alignItems: 'center',
//     marginRight: 16,
//     width: 24,
//   },
//   timelineDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     zIndex: 2,
//   },
//   completedDot: {
//     backgroundColor: '#4CAF50',
//   },
//   pendingDot: {
//     backgroundColor: '#e0e0e0',
//     borderWidth: 2,
//     borderColor: '#bdbdbd',
//   },
//   timelineLine: {
//     width: 2,
//     flex: 1,
//     marginTop: 4,
//     marginBottom: 4,
//   },
//   completedLine: {
//     backgroundColor: '#4CAF50',
//   },
//   pendingLine: {
//     backgroundColor: '#e0e0e0',
//   },
//   timelineContent: {
//     flex: 1,
//     paddingBottom: 16,
//   },
//   timelineStage: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   completedText: {
//     color: '#333',
//   },
//   pendingText: {
//     color: '#999',
//   },
//   timelineTime: {
//     fontSize: 12,
//     color: '#666',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 12,
//   },
//   primaryButton: {
//     flex: 1,
//     backgroundColor: '#328a0dff',
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: 'center',
//     shadowColor: '#328a0dff',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   primaryButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   secondaryButton: {
//     flex: 1,
//     backgroundColor: '#f8f8f8',
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   secondaryButtonText: {
//     color: '#666',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   pastOrderActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//   },
//   pastOrderButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   pastOrderButtonText: {
//     color: '#328a0dff',
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 6,
//   },
//   supportSection: {
//     paddingHorizontal: 20,
//     marginBottom: 30,
//   },
//   supportCard: {
//     backgroundColor: '#fff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   supportContent: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   supportTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 2,
//   },
//   supportSubtitle: {
//     fontSize: 14,
//     color: '#666',
//   },
//   supportButton: {
//     backgroundColor: '#328a0dff',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   supportButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });

// export default MyOrdersScreen;


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
      case 'Out_for_Delivery': return '#FF6B35';
      case 'Delivered': return '#4CAF50';
      case 'Cancelled': return '#E74C3C';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string): any => {
    switch (status) {
      case 'Pending': return 'time-outline';
      case 'Preparing': return 'restaurant-outline';
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