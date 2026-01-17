import AppHeader from "@/components/profileHeader";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image, Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../context/AuthContext"; // To get shopId
import { api } from "../lib/apiService";


// Interface
interface OrderItem {
  _id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  customerInfo: { name: string; phone: string; };
  billDetails: { grandTotal: number; };
  deliveryAddress: { fullAddress: string; };
  riderId?: string; // Optional
  items: any[];
}
export default function OrdersScreen() {
  const { user } = useAuth(); // Assuming user contains shopId
  const [orders, setOrders] = useState<OrderItem[]>([]);

  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // First load
  const [loadingMore, setLoadingMore] = useState(false); // Pagination load
  const [refreshing, setRefreshing] = useState(false); // Pull to refresh
  // 🆕 MODAL STATE
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [onlineRiders, setOnlineRiders] = useState<any[]>([]);
  const [ridersLoading, setRidersLoading] = useState(false);
  // Filter State
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // 1️⃣ Main Fetch Function
  // const pfetchOrders = async (pageNum: number, shouldRefresh = false, search = searchQuery) => {
  //   if (loadingMore) return;

  //   if (pageNum === 1) setLoading(true);
  //   else setLoadingMore(true);

  //   try {
  //     const currentShopId = user?.userId || "6950e2923bc053d9c99f3542";

  //     // ✅ CHANGE: Create Query String for GET Request
  //     // URL looks like: /getShopOrders?shopId=123&page=1&limit=10&status=All
  //     const queryString = `?shopId=${currentShopId}&status=${activeTab}&page=${pageNum}&limit=10&search=${search}`;

  //     // ✅ CHANGE: Call API with GET and append queryString to URL
  //     // No body object passed in GET
  //     const res: any = await api(`/admin/shop/order/getShopOrders${queryString}`, 'GET');

  //     if (res.success) {
  //       if (shouldRefresh || pageNum === 1) {
  //         setOrders(res.orders);
  //       } else {
  //         setOrders(prev => [...prev, ...res.orders]);
  //       }
  //       setHasMore(res.pagination.hasMore);
  //     }
  //   } catch (error) {
  //     console.error("Fetch error:", error);
  //   } finally {
  //     setLoading(false);
  //     setLoadingMore(false);
  //     setRefreshing(false);
  //   }
  // };

  // 1️⃣ Fetch Orders Logic (Production Optimized)
  const fetchOrders = async (pageNum: number, shouldRefresh = false) => {
    if (pageNum === 1) setLoading(true);

    try {
      // LOGIC: Use Admin's UserID. Backend should find the Shop linked to this Admin.
      // If you have a separate API to get ShopID, call that first. 
      // For now, sending userId as shopId (assuming mapped in backend) or just userId.
      const currentAdminId = user?.userUUID ;

      const queryString = `?userUUID=${currentAdminId}&status=${activeTab}&page=${pageNum}&limit=10&search=${searchQuery}`;

      const res: any = await api(`/admin/shop/order/getShopOrders${queryString}`, 'GET');

      if (res.success) {
        if (shouldRefresh || pageNum === 1) {
          setOrders(res.orders);
        } else {
          setOrders(prev => [...prev, ...res.orders]);
        }
        setHasMore(res.pagination.hasMore);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 2️⃣ Effects
  // Reset and fetch when Tab or Search changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchOrders(1, true); // true = reset list
  }, [activeTab, searchQuery]);
  // 3️⃣ Status Update Handler (Accept/Reject/Prepare)
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res: any = await api('/admin/shop/order/updateStatus', 'POST', {
        orderId,
        status: newStatus
      });

      if (res.success) {
        Alert.alert("Success", `Order ${newStatus}!`);
        // Refresh local state instantly for better UX
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      } else {
        Alert.alert("Error", res.message);
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  // 3️⃣ Handlers
  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchOrders(1, true);
  };

  const loadMore = () => {
    if (!hasMore || loadingMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchOrders(nextPage, false);
  };

  // Formatting Helpers
  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  // Helpers
  const getStatusColor = (s: string) => {
    switch (s) {
      case "Pending": return "#FFA500"; // Orange
      case "Confirmed": return "#3498DB"; // Blue
      case "Preparing": return "#9B59B6"; // Purple
      case "Ready": return "#F1C40F"; // Yellow
      case "Delivered": return "#2ECC71"; // Green
      case "Cancelled": return "#E74C3C"; // Red
      default: return "#95A5A6";
    }
  };

  // Render Function
  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator style={{ margin: 20 }} size="small" color="#2ECC71" />;
  };


  // 🆕 1. Fetch Online Riders (Jab Modal Open ho)
  const fetchOnlineRiders = async () => {
    setRidersLoading(true);
    try {
      const res: any = await api('/admin/delivery/get-online-riders', 'GET');
      if (res.success) setOnlineRiders(res.riders);
    } catch (e) {
      console.log(e);
    } finally {
      setRidersLoading(false);
    }
  };

  // 🆕 2. Open Modal Logic
  const openAssignModal = (order: any) => {
    setSelectedOrder(order);
    setModalVisible(true);
    fetchOnlineRiders();
  };

  const handleAssign = async (riderId: string) => {
    if (!selectedOrder) return;
    try {
      const res: any = await api('/admin/delivery/assign-order', 'POST', {
        orderId: selectedOrder._id,
        riderId: riderId
      });
      if (res.success) {
        Alert.alert("Success", "Rider Assigned!");
        setModalVisible(false);
        // Update list locally
        setOrders(prev => prev.map(o => o._id === selectedOrder._id ? { ...o, riderId: riderId, status: 'Ready' } : o));
      } else { Alert.alert("Error", res.message); }
    } catch (e: any) { Alert.alert("Error", e.message); }
  };

  return (
    <View style={styles.container}>
      <AppHeader showBack={true} title="Shop Orders" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Search Order ID, Name or Phone..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery} // Triggers useEffect
        />
      </View>
      <View style={styles.filterTabs}>
        {["All", "Pending", "Confirmed", "Ready", "Delivered"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={() => fetchOrders(1, true)}
        onEndReached={() => { if (hasMore && !loading) { setPage(p => p + 1); fetchOrders(page + 1); } }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.orderId}>{item.orderNumber}</Text>
                <Text style={styles.date}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            {/* Body */}
            <View style={styles.cardBody}>
              <Text style={styles.detailText}>👤 {item.customerInfo.name}</Text>
              <Text style={styles.detailText}>📍 {item.deliveryAddress.fullAddress}</Text>
              <Text style={styles.total}>Amount: ₹{item.billDetails.grandTotal}</Text>
            </View>

            {/* 🔥 ACTION BUTTONS (Logic based on Status) */}
            <View style={styles.cardFooter}>

              {/* CASE 1: Pending Order -> Accept or Reject */}
              {item.status === 'Pending' && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#E74C3C' }]}
                    onPress={() => handleStatusUpdate(item._id, 'Cancelled')}
                  >
                    <Text style={styles.btnText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#2ECC71' }]}
                    onPress={() => handleStatusUpdate(item._id, 'Confirmed')}
                  >
                    <Text style={styles.btnText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* CASE 2: Confirmed -> Mark Preparing */}
              {item.status === 'Confirmed' && (
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#9B59B6' }]}
                  onPress={() => handleStatusUpdate(item._id, 'Preparing')}
                >
                  <Text style={styles.btnText}>Start Preparing</Text>
                </TouchableOpacity>
              )}

              {/* CASE 3: Preparing -> Assign Rider (Move to Ready) */}
              {(item.status === 'Preparing' || item.status === 'Confirmed') && !item.riderId && (
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#333', marginTop: 10 }]}
                  onPress={() => openAssignModal(item)}
                >
                  <Text style={styles.btnText}>Assign Rider</Text>
                  <Ionicons name="bicycle" size={16} color="#FFF" style={{ marginLeft: 5 }} />
                </TouchableOpacity>
              )}

              {/* CASE 4: Rider Assigned */}
              {item.riderId && (
                <Text style={{ color: '#2ECC71', fontWeight: 'bold', fontSize: 12 }}>
                  ✓ Rider Assigned
                </Text>
              )}

            </View>
          </View>
        )}
      />

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.orderId}>{item.orderNumber}</Text>
                {/* Show if Assigned */}
                {item.riderId ? (
                  <View style={styles.assignedBadge}>
                    <Ionicons name="bicycle" size={12} color="#FFF" />
                    <Text style={styles.assignedText}>Assigned</Text>
                  </View>
                ) : (
                  <Text style={{ fontSize: 10, color: '#FF6B35' }}>● Pending Assignment</Text>
                )}
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            {/* Details */}
            <View style={styles.cardBody}>
              <Text style={styles.detailText}>📍 {item.deliveryAddress?.fullAddress}</Text>
              <Text style={styles.total}>₹{item.billDetails?.grandTotal}</Text>
            </View>

            {/* 🔥 ASSIGN BUTTON (Only if Pending/Confirmed & Not Assigned) */}
            <View style={styles.cardFooter}>
              {!item.riderId && (item.status === 'Pending' || item.status === 'Confirmed') ? (
                <TouchableOpacity
                  style={styles.assignBtn}
                  onPress={() => openAssignModal(item)}
                >
                  <Text style={styles.assignBtnText}>Assign Rider</Text>
                  <Ionicons name="bicycle-outline" size={16} color="#FFF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.viewBtn}>
                  <Text style={styles.viewText}>View Details</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />

      {/* 🚲 ASSIGN RIDER MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Delivery Partner</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subTitle}>Available Online Riders</Text>

            {ridersLoading ? (
              <ActivityIndicator size="large" color="#FF6B35" />
            ) : (
              <FlatList
                data={onlineRiders}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>No riders online right now.</Text>}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.riderCard}
                    onPress={() => handleAssign(item.id)}
                  >
                    <Image
                      source={{ uri: item.profilePicUrl || 'https://via.placeholder.com/50' }}
                      style={styles.avatar}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.riderName}>{item.fullName}</Text>
                      <Text style={styles.riderInfo}>{item.RiderProfile?.vehicleType} • {item.RiderProfile?.vehicleNumber}</Text>
                    </View>
                    <View style={styles.selectBtn}>
                      <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Assign</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Initial Loader Overlay */}
      {loading && !refreshing && page === 1 && (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color="#2ECC71" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },

  // Search Bar
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    margin: 10, paddingHorizontal: 15, borderRadius: 10, height: 50, elevation: 2
  },
  searchInput: { flex: 1, fontSize: 16 },

  // Tabs
  filterTabs: { flexDirection: "row", marginBottom: 5, backgroundColor: "#FFF", padding: 5, borderRadius: 10, marginHorizontal: 10 },
  filterTab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 8 },
  activeTab: { backgroundColor: "#2ECC71" },
  tabText: { fontSize: 13, color: "#666", fontWeight: "600" },
  activeTabText: { fontSize: 13, color: "#FFF", fontWeight: "600" },

  // Card
  card: { backgroundColor: "#FFF", padding: 15, borderRadius: 12, marginBottom: 10, marginHorizontal: 10, elevation: 2 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  orderId: { fontSize: 12, fontWeight: "bold", color: "#999" },
  customer: { fontSize: 16, fontWeight: "bold", color: "#333" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  statusText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
  date: { fontSize: 10, color: '#888' },
  cardBody: { gap: 8, marginBottom: 12 },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailText: { color: "#666", fontSize: 13 },

  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTopWidth: 1, borderColor: "#EEE" },
  total: { fontSize: 18, fontWeight: "bold", color: "#2ECC71" },
  viewBtn: { flexDirection: 'row', backgroundColor: '#333', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, alignItems: 'center', gap: 5 },
  viewText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#999' },
  centerLoader: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)' }
  ,
  // NEW STYLES
  assignedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2ECC71', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4, alignSelf: 'flex-start', gap: 4 },
  assignedText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  assignBtn: { flex: 1, backgroundColor: '#333', padding: 10, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  assignBtnText: { color: '#FFF', fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', height: '60%', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  subTitle: { fontSize: 12, color: '#666', marginBottom: 10, textTransform: 'uppercase' },

  riderCard: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#F9F9F9', borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#EEE' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#DDD' },
  riderName: { fontWeight: 'bold', fontSize: 16 },
  riderInfo: { fontSize: 12, color: '#666' },
  selectBtn: { backgroundColor: '#FF6B35', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  selectBtnText: { color: '#FFF', fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
});