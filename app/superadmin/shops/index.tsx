import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { api } from "../../lib/apiService";

// --- 1. INTERFACES DEFINED (Type Safety ke liye) ---

// Shop ka structure define kiya
interface Shop {
  _id: string;
  name: string;
  status: 'active' | 'inactive' | 'onboarding' | 'maintenance' | 'banned'; // Specific strings
  cuisineType?: string[];
  rating?: number;
  totalRevenue?: number;
}

// ShopCard ke props ka type
interface ShopCardProps {
  shop: Shop;
  onEditStatus: (shop: Shop) => void;
}

// Status Modal ke props ka type
interface StatusModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (status: string) => void;
  currentStatus?: string;
}

// --- CONSTANTS ---
const STATUS_OPTIONS = ['active', 'inactive', 'onboarding', 'maintenance', 'banned'];

// --- SHOP CARD COMPONENT ---
const ShopCard = React.memo<ShopCardProps>(({ shop, onEditStatus }) => {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      case 'onboarding': return '#3B82F6';
      case 'maintenance': return '#F59E0B';
      case 'banned': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <TouchableOpacity
      style={styles.shopCard}
      onPress={() => router.push({ pathname: "/superadmin/shops/details", params: { id: shop._id } })}
      activeOpacity={0.7}
    >
      <View style={styles.shopHeader}>
        <Text style={styles.shopCardName} numberOfLines={1}>
          {shop.name}
        </Text>

        {/* Status Badge - Clickable */}
        <TouchableOpacity
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(shop.status) + '20', flexDirection: 'row', alignItems: 'center', gap: 4 }
          ]}
          onPress={() => onEditStatus(shop)}
        >
          <Text style={[
            styles.statusText,
            { color: getStatusColor(shop.status) }
          ]}>
            {shop.status}
          </Text>
          <Ionicons name="create-outline" size={12} color={getStatusColor(shop.status)} />
        </TouchableOpacity>
      </View>

      <View style={styles.ownerContainer}>
        <Ionicons name="restaurant-outline" size={14} color="#6B7280" />
        <Text style={styles.ownerText} numberOfLines={1}>
          {shop.cuisineType && shop.cuisineType.length > 0 ? shop.cuisineType.join(", ") : "Multi-cuisine"}
        </Text>
      </View>

      <View style={styles.shopFooter}>
        <View style={styles.shopStats}>
          <Ionicons name="star" size={16} color="#F59E0B" />
          <Text style={styles.statText}>{shop.rating || 0}</Text>
        </View>
        <Text style={styles.revenueText}>₹{shop.totalRevenue || 0}</Text>
      </View>
    </TouchableOpacity>
  );
});

// --- SKELETON COMPONENT ---
const ShopSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.shopCard}>
      <View style={styles.shopHeader}>
        <Animated.View style={[styles.skeletonBox, { width: '50%', height: 20, opacity }]} />
        <Animated.View style={[styles.skeletonBox, { width: 60, height: 24, borderRadius: 12, opacity }]} />
      </View>
      <View style={[styles.ownerContainer, { marginTop: 10 }]}>
        <Animated.View style={[styles.skeletonBox, { width: '40%', height: 14, opacity }]} />
      </View>
      <View style={[styles.shopFooter, { marginTop: 10 }]}>
        <Animated.View style={[styles.skeletonBox, { width: 50, height: 16, opacity }]} />
      </View>
    </View>
  );
};

// --- STATUS EDIT MODAL ---
const StatusModal: React.FC<StatusModalProps> = ({ visible, onClose, onSelect, currentStatus }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Status</Text>
            {STATUS_OPTIONS.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusOption,
                  currentStatus === status && styles.statusOptionActive
                ]}
                onPress={() => onSelect(status)}
              >
                <Text style={[
                  styles.statusOptionText,
                  currentStatus === status && styles.statusOptionTextActive
                ]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
                {currentStatus === status && (
                  <Ionicons name="checkmark-circle" size={20} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// --- MAIN COMPONENT ---
export default function ShopsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // Type change: any[] se Shop[] kar diya
  const [shops, setShops] = useState<Shop[]>([]);
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  // Status Modal State (Type Safe)
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // --- FETCH SHOPS FUNCTION ---
  const fetchShops = useCallback(async (query = "", statusFilter = "all", pageNum = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
        search: query,
        status: statusFilter,
        sortBy: 'newest'
      }).toString();

      const response = await api(`/superadmin/getAllShops?${queryParams}`, "GET", null, token ?? undefined);

      if (response.success) {
        setShops(response.shops);
        setTotalPages(response.pagination.pages);
      } else {
        setShops([]);
      }
    } catch (err) {
      console.log("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // --- API LOGIC: UPDATE STATUS ---
  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedShop) return;

    setModalVisible(false);

    // Optimistic Update
    const previousShops = [...shops];

    // Type checking ke liye 'as Shop[]' use kiya hai taaki TS error na de
    setShops(currentShops =>
      currentShops.map(shop =>
        shop._id === selectedShop._id ? { ...shop, status: newStatus as Shop['status'] } : shop
      )
    );
    const id = selectedShop._id;
    try {
      const response = await api(`/superadmin/shops/updateShopStatus/${id}`, 'PUT', {
        // shopId: selectedShop._id,
        status: newStatus
      }, token ?? undefined);

      if (!response.success) {
        throw new Error(response.message || "Failed to update");
      }
    } catch (error: any) {
      setShops(previousShops);
      Alert.alert("Error", error.message || "Could not update status");
    } finally {
      setSelectedShop(null);
    }
  };

  const openStatusModal = useCallback((shop: Shop) => {
    setSelectedShop(shop);
    setModalVisible(true);
  }, []);

  // --- DEBOUNCE SEARCH ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchShops(searchQuery, filter, 1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filter]);

  // --- PAGINATION HANDLERS ---
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      fetchShops(searchQuery, filter, newPage);
    }
  };

  const renderFooter = () => {
    if (loading) return null;
    if (shops.length === 0) return (
      <View style={styles.emptyState}>
        <Ionicons name="storefront-outline" size={64} color="#D1D5DB" />
        <Text style={styles.emptyStateTitle}>No shops found</Text>
        <Text style={styles.emptyStateText}>
          {searchQuery ? "Try adjusting your search query" : "No shops available"}
        </Text>
      </View>
    );

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => handlePageChange(page - 1)}
          disabled={page === 1}
          style={[styles.pageButton, page === 1 && { opacity: 0.5 }]}
        >
          <Text style={styles.pageButtonText}>Prev</Text>
        </TouchableOpacity>
        <Text style={styles.pageNumberText}>Page {page} of {totalPages}</Text>
        <TouchableOpacity
          onPress={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          style={[styles.pageButton, page === totalPages && { opacity: 0.5 }]}
        >
          <Text style={styles.pageButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>All Shops</Text>
          <TouchableOpacity
            onPress={() => router.push("/superadmin/shops/create")}
            style={styles.addButton}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.addButtonText}>Add Shop</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrapper}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search shops or cuisine..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.input}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
          >
            {['all', ...STATUS_OPTIONS].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.filterTab,
                  filter === tab && styles.activeFilterTab,
                  { minWidth: 80, paddingHorizontal: 16 }
                ]}
                onPress={() => setFilter(tab)}
              >
                <Text style={[
                  styles.filterTabText,
                  filter === tab && styles.activeFilterTabText
                ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* LIST */}
      <FlatList
        data={loading ? Array.from({ length: 5 }) : shops}
        // keyExtractor mein type check fix kiya
        keyExtractor={(item: any, index) => loading ? `skeleton-${index}` : item._id}
        renderItem={({ item }: { item: Shop | any }) => {
          if (loading) return <ShopSkeleton />;
          return (
            <ShopCard
              shop={item}
              onEditStatus={openStatusModal}
            />
          );
        }}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />

      {/* STATUS CHANGE MODAL */}
      <StatusModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleStatusUpdate}
        currentStatus={selectedShop?.status}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  // Header Styles
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 28, fontWeight: "800", color: "#111827" },
  addButton: { backgroundColor: "#2563EB", flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  addButtonText: { color: "white", fontWeight: "600", marginLeft: 4, fontSize: 14 },

  // Search
  searchWrapper: { marginBottom: 16 },
  searchInputContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#F3F4F6",
    borderRadius: 12, paddingHorizontal: 12, height: 48, borderWidth: 1, borderColor: '#E5E7EB'
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: "#374151", paddingVertical: 12, paddingHorizontal: 12 },

  // Filter Tabs
  filterTab: {
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "transparent"
  },
  activeFilterTab: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterTabText: { fontSize: 13, color: "#6B7280", fontWeight: "600", textTransform: "capitalize" },
  activeFilterTabText: { color: "#2563EB" },

  // Card
  shopCard: { backgroundColor: "#FFFFFF", padding: 16, borderRadius: 16, marginHorizontal: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  shopHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  shopCardName: { fontSize: 17, fontWeight: "700", color: "#111827", flex: 1, marginRight: 8 },

  // Badge Updated
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: "600", textTransform: "capitalize" },

  ownerContainer: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  ownerText: { fontSize: 13, color: "#6B7280", marginLeft: 6 },
  shopFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 },
  shopStats: { flexDirection: "row", alignItems: 'center', gap: 4 },
  statText: { fontSize: 14, color: "#4B5563", fontWeight: '600' },
  revenueText: { color: "#10B981", fontWeight: "700", fontSize: 15 },

  // Pagination & Empty State
  pagination: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, alignItems: "center", paddingBottom: 20, paddingTop: 10 },
  pageButton: { backgroundColor: "#EFF6FF", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  pageButtonText: { color: "#2563EB", fontWeight: "600" },
  pageNumberText: { color: "#6B7280", fontWeight: "500" },
  emptyState: { alignItems: "center", paddingVertical: 48 },
  emptyStateTitle: { fontSize: 18, fontWeight: "600", color: "#374151", marginTop: 16, marginBottom: 8 },
  emptyStateText: { fontSize: 14, color: "#9CA3AF", textAlign: "center" },
  skeletonBox: { backgroundColor: '#E5E7EB', borderRadius: 4 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', width: '100%', borderRadius: 20, padding: 20, alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, color: '#111827' },
  statusOption: { width: '100%', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginBottom: 8, backgroundColor: '#F9FAFB', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusOptionActive: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE' },
  statusOptionText: { fontSize: 16, color: '#374151', fontWeight: '500' },
  statusOptionTextActive: { color: '#2563EB', fontWeight: '700' },
  cancelButton: { marginTop: 10, paddingVertical: 10 },
  cancelButtonText: { color: '#6B7280', fontSize: 16, fontWeight: '600' },
});