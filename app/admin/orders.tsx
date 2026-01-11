// import AppHeader from "@/components/profileHeader";
// import { Ionicons } from "@expo/vector-icons";
// import React, { useState } from "react";
// import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// export default function Orders() {
//   const allOrders = [
//     { id: "1", customer: "Shamim Ahmad", total: 220, status: "Pending", items: 3, time: "10:30 AM", address: "123 Main St, Mumbai" },
//     { id: "2", customer: "Aman Kumar", total: 300, status: "Delivered", items: 2, time: "9:15 AM", address: "456 Oak Avenue" },
//     { id: "3", customer: "Priya Sharma", total: 450, status: "Preparing", items: 4, time: "11:45 AM", address: "789 Park Road" },
//     { id: "4", customer: "Rahul Verma", total: 180, status: "Pending", items: 1, time: "12:20 PM", address: "321 Garden St" },
//     { id: "5", customer: "Sneha Singh", total: 520, status: "Delivered", items: 5, time: "1:15 PM", address: "MG Road, Pune" },
//     { id: "6", customer: "Rohit Mehta", total: 250, status: "Preparing", items: 2, time: "2:10 PM", address: "Park Street, Delhi" },
//     { id: "7", customer: "Anjali Gupta", total: 150, status: "Pending", items: 1, time: "3:00 PM", address: "Lake View, Jaipur" },
//     { id: "8", customer: "Vikram Chauhan", total: 400, status: "Delivered", items: 3, time: "4:30 PM", address: "Sector 22, Chandigarh" },
//   ];

//   const [activeTab, setActiveTab] = useState("All");

//   const getStatusColor = (status: any) => {
//     switch (status) {
//       case "Pending":
//         return "#FFA500";
//       case "Preparing":
//         return "#3498DB";
//       case "Delivered":
//         return "#2ECC71";
//       case "Cancelled":
//         return "#E74C3C";
//       default:
//         return "#95A5A6";
//     }
//   };

//   const getStatusIcon = (status: any) => {
//     switch (status) {
//       case "Pending":
//         return "⏳";
//       case "Preparing":
//         return "👨‍🍳";
//       case "Delivered":
//         return "✅";
//       case "Cancelled":
//         return "❌";
//       default:
//         return "📦";
//     }
//   };

//   // 🧭 Filter orders based on selected tab
//   const filteredOrders =
//     activeTab === "All"
//       ? allOrders
//       : allOrders.filter((o) => o.status === activeTab);

//   return (
//     <View style={styles.container}>
//       <AppHeader
//         showBack={true}
//         title="Orders"
//       />

//       {/* Header with Stats */}
//       <View style={styles.header}>
//         <View style={styles.statsRow}>
//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>{allOrders.length}</Text>
//             <Text style={styles.statLabel}>Total</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>{allOrders.filter(o => o.status === 'Pending').length}</Text>
//             <Text style={styles.statLabel}>Pending</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>{allOrders.filter(o => o.status === 'Delivered').length}</Text>
//             <Text style={styles.statLabel}>Delivered</Text>
//           </View>
//         </View>
//       </View>

//       {/* Filter Tabs */}
//       <View style={styles.filterTabs}>
//         {["All", "Pending", "Preparing", "Delivered"].map((tab) => (
//           <TouchableOpacity
//             key={tab}
//             style={[
//               styles.filterTab,
//               activeTab === tab && styles.activeTab
//             ]}
//             onPress={() => setActiveTab(tab)}
//           >
//             <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>
//               {tab}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Orders List */}
//       <FlatList
//         data={filteredOrders}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.card}
//           // onPress={() => router.push(`/order-details/${item.id}`)}
//           >
//             <View style={styles.cardHeader}>
//               <View style={styles.orderInfo}>
//                 <Text style={styles.orderId}>Order #{item.id}</Text>
//                 <Text style={styles.customer}>{item.customer}</Text>
//               </View>
//               <View
//                 style={[
//                   styles.statusBadge,
//                   { backgroundColor: getStatusColor(item.status) },
//                 ]}
//               >
//                 <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
//                 <Text style={styles.statusText}>{item.status}</Text>
//               </View>
//             </View>

//             <View style={styles.cardBody}>
//               <View style={styles.orderDetails}>
//                 <View style={styles.detailItem}>
//                   <Ionicons name="time-outline" size={16} color="#7F8C8D" />
//                   <Text style={styles.detailText}>{item.time}</Text>
//                 </View>
//                 <View style={styles.detailItem}>
//                   <Ionicons name="cube-outline" size={16} color="#7F8C8D" />
//                   <Text style={styles.detailText}>{item.items} items</Text>
//                 </View>
//                 <View style={styles.detailItem}>
//                   <Ionicons name="location-outline" size={16} color="#7F8C8D" />
//                   <Text style={styles.detailText} numberOfLines={1}>
//                     {item.address}
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.cardFooter}>
//                 <Text style={styles.total}>₹{item.total}</Text>
//                 <TouchableOpacity
//                   style={styles.viewBtn}
//                 // onPress={() => router.push(`/order-details/${item.id}`)}
//                 >
//                   <Text style={styles.viewText}>View Details</Text>
//                   <Ionicons name="chevron-forward" size={16} color="#fff" />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F8F9FA" },
//   header: { marginBottom: 4 ,padding:8},
//   title: { fontSize: 24, fontWeight: "bold", color: "#2ECC71", marginBottom: 4 },
//   statsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     backgroundColor: "#FFFFFF",
//     padding: 8,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   statItem: { alignItems: "center" },
//   statNumber: { fontSize: 20, fontWeight: "bold", color: "#2C3E50" },
//   statLabel: { fontSize: 12, color: "#7F8C8D", marginTop: 2 },
//   filterTabs: {
//     flexDirection: "row",
//     marginBottom: 4,
//     backgroundColor: "#FFFFFF",
//     padding: 4,
//     borderRadius: 12,
//   },
//   filterTab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 8 },
//   activeTab: { backgroundColor: "#2ECC71" },
//   tabText: { fontSize: 14, color: "#7F8C8D", fontWeight: "500" },
//   activeTabText: { fontSize: 14, color: "#FFFFFF", fontWeight: "500" },
//   card: {
//     backgroundColor: "#FFFFFF",
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 12,
//   },
//   orderInfo: { flex: 1 },
//   orderId: { fontSize: 14, fontWeight: "bold", color: "#2C3E50", marginBottom: 4 },
//   customer: { fontSize: 16, fontWeight: "600", color: "#2C3E50" },
//   statusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     gap: 4,
//   },
//   statusIcon: { fontSize: 12 },
//   statusText: { fontSize: 12, color: "#FFFFFF", fontWeight: "500" },
//   cardBody: { gap: 12 },
//   orderDetails: { gap: 8 },
//   detailItem: { flexDirection: "row", alignItems: "center", gap: 8 },
//   detailText: { fontSize: 14, color: "#7F8C8D" },
//   cardFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: "#ECF0F1",
//   },
//   total: { fontSize: 18, fontWeight: "bold", color: "#2C3E50" },
//   viewBtn: {
//     backgroundColor: "#2ECC71",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//     gap: 4,
//   },
//   viewText: { color: "#FFFFFF", fontWeight: "500", fontSize: 14 },
// });


import AppHeader from "@/components/profileHeader";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useCallback } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, Alert } from "react-native";
// import axios from 'axios'; // Ensure axios is installed
// import { useAuth } from "@/context/AuthContext"; // Use your actual auth context
import { router } from "expo-router";

// Define Type based on Schema
interface OrderItem {
  _id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string; // ISO date string
  address: string;
  items: any[];
}

export default function Orders() {
  // const { user, token } = useAuth(); // Get token for API
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  // Mock Shop ID (In production, get this from user context)
  const SHOP_ID = "YOUR_SHOP_ID_HERE"; 
  const API_URL = "http://your-ip-address:5000/api/orders"; // Replace with your API

  // 1️⃣ Fetch Orders API
  const fetchOrders = useCallback(async () => {
    try {
      // Logic: If Admin, fetch Shop orders. If User, fetch My orders.
      // Here we simulate Shop Admin flow:
      
      // const response = await axios.get(`${API_URL}/shop/${SHOP_ID}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // MOCK DATA (Remove this block when connecting real API) -------
      // simulating network delay
      await new Promise(r => setTimeout(r, 1000)); 
      const mockResponse = [
        { _id: "1", customerName: "Shamim Ahmad", totalAmount: 220, status: "Pending", items: [1,2,3], createdAt: new Date().toISOString(), address: "123 Main St, Mumbai", orderNumber: "ORD-123" },
        { _id: "2", customerName: "Aman Kumar", totalAmount: 300, status: "Delivered", items: [1,2], createdAt: new Date().toISOString(), address: "456 Oak Avenue", orderNumber: "ORD-124" },
      ];
      setOrders(mockResponse);
      // -------------------------------------------------------------

      // Uncomment for real API
      // if(response.data.success) {
      //   setOrders(response.data.orders);
      // }

    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // 2️⃣ Formatting Helpers
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "#FFA500";
      case "Preparing": return "#3498DB";
      case "Delivered": return "#2ECC71";
      case "Cancelled": return "#E74C3C";
      default: return "#95A5A6";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending": return "⏳";
      case "Preparing": return "👨‍🍳";
      case "Delivered": return "✅";
      case "Cancelled": return "❌";
      default: return "📦";
    }
  };

  // 🧭 Client-side Filter
  const filteredOrders = activeTab === "All"
    ? orders
    : orders.filter((o) => o.status === activeTab);

  // 3️⃣ Calculate Stats dynamically
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    delivered: orders.filter(o => o.status === 'Delivered').length
  };

  return (
    <View style={styles.container}>
      <AppHeader showBack={true} title="Orders Management" />

      {/* Header with Stats */}
      <View style={styles.header}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.delivered}</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {["All", "Pending", "Preparing", "Delivered"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2ECC71" />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#2ECC71"]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No orders found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => {
              // Navigate to details page (Create this file: app/order-details/[id].tsx)
              // router.push(`/order-details/${item._id}`);
            }}>
              <View style={styles.cardHeader}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderId}>{item.orderNumber}</Text>
                  <Text style={styles.customer}>{item.customerName}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.orderDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color="#7F8C8D" />
                    <Text style={styles.detailText}>{formatTime(item.createdAt)}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="cube-outline" size={16} color="#7F8C8D" />
                    <Text style={styles.detailText}>{item.items.length} items</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="location-outline" size={16} color="#7F8C8D" />
                    <Text style={styles.detailText} numberOfLines={1}>{item.address}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.total}>₹{item.totalAmount}</Text>
                  <TouchableOpacity style={styles.viewBtn}>
                    <Text style={styles.viewText}>View Details</Text>
                    <Ionicons name="chevron-forward" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { marginBottom: 4, padding: 8 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 20, fontWeight: "bold", color: "#2C3E50" },
  statLabel: { fontSize: 12, color: "#7F8C8D", marginTop: 2 },
  filterTabs: {
    flexDirection: "row",
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
    padding: 4,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  filterTab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 8 },
  activeTab: { backgroundColor: "#2ECC71" },
  tabText: { fontSize: 14, color: "#7F8C8D", fontWeight: "500" },
  activeTabText: { fontSize: 14, color: "#FFFFFF", fontWeight: "500" },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderInfo: { flex: 1 },
  orderId: { fontSize: 13, fontWeight: "bold", color: "#95A5A6", marginBottom: 2 },
  customer: { fontSize: 16, fontWeight: "700", color: "#2C3E50" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusIcon: { fontSize: 10 },
  statusText: { fontSize: 11, color: "#FFFFFF", fontWeight: "600" },
  cardBody: { gap: 12 },
  orderDetails: { gap: 6 },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailText: { fontSize: 14, color: "#7F8C8D" },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F2F5",
  },
  total: { fontSize: 18, fontWeight: "bold", color: "#2C3E50" },
  viewBtn: {
    backgroundColor: "#2ECC71",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  viewText: { color: "#FFFFFF", fontWeight: "500", fontSize: 13 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#95A5A6', fontSize: 16 }
});