import AppHeader from "@/components/AppHeader"; // ✅ Reusable Header
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { api } from "../../lib/apiService";

// --- 1. INTERFACES ---

interface Shop {
  _id: string;
  name: string;
  status: 'active' | 'inactive' | 'onboarding' | 'maintenance' | 'banned';
  cuisineType?: string[];
  categories?: string;
  foodCategory?: string;
  rating?: number;
  totalRevenue?: number;
}

interface ShopCardProps {
  shop: Shop;
  onEditStatus: (shop: Shop) => void;
}

interface StatusModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (status: string) => void;
  currentStatus?: string;
}

const STATUS_OPTIONS = ['active', 'inactive', 'onboarding', 'maintenance', 'banned'];
const { width } = Dimensions.get('window');

// --- SHOP CARD COMPONENT ---
const ShopCard = React.memo<ShopCardProps>(({ shop, onEditStatus }) => {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#9CA3AF';
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
      <View style={styles.cardMainRow}>
        {/* Icon & Name */}
        <View style={styles.iconContainer}>
          <Text style={{ fontSize: 20 }}>🏪</Text>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.shopCardName} numberOfLines={1}>{shop.name}</Text>
          <Text style={styles.shopCategory} numberOfLines={1}>
            {shop.categories || "General Store"}
            {shop.foodCategory ? ` • ${shop.foodCategory}` : ""}
          </Text>
        </View>

        {/* Status Badge */}
        <TouchableOpacity
          style={[styles.statusBadge, { borderColor: getStatusColor(shop.status) }]}
          onPress={() => onEditStatus(shop)}
        >
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(shop.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(shop.status) }]}>
            {shop.status}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardStatsRow}>
        <View style={styles.statItem}>
          <Ionicons name="star" size={14} color="#F59E0B" />
          <Text style={styles.statValue}>{shop.rating?.toFixed(1) || "N/A"}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Revenue:</Text>
          <Text style={styles.statValueGreen}>₹{(shop.totalRevenue || 0).toLocaleString()}</Text>
        </View>
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
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Animated.View style={[styles.skeletonBox, { width: 40, height: 40, borderRadius: 20, opacity }]} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Animated.View style={[styles.skeletonBox, { width: '60%', height: 18, marginBottom: 6, opacity }]} />
          <Animated.View style={[styles.skeletonBox, { width: '40%', height: 14, opacity }]} />
        </View>
      </View>
      <Animated.View style={[styles.skeletonBox, { width: '100%', height: 1, marginVertical: 8, opacity }]} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Animated.View style={[styles.skeletonBox, { width: 60, height: 16, opacity }]} />
        <Animated.View style={[styles.skeletonBox, { width: 80, height: 16, opacity }]} />
      </View>
    </View>
  );
};

// --- STATUS MODAL ---
const StatusModal: React.FC<StatusModalProps> = ({ visible, onClose, onSelect, currentStatus }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Update Status</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeModalBtn}>
                  <Ionicons name="close" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
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
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// --- MAIN SCREEN ---
export default function ShopsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [shops, setShops] = useState<Shop[]>([]);
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // --- FETCH LOGIC ---
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

      const response: any = await api(`/superadmin/getAllShops?${queryParams}`, "GET");

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

  // --- STATUS UPDATE ---
  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedShop) return;
    setModalVisible(false);

    // Optimistic Update
    const previousShops = [...shops];
    setShops(currentShops =>
      currentShops.map(shop =>
        shop._id === selectedShop._id ? { ...shop, status: newStatus as Shop['status'] } : shop
      )
    );

    try {
      const response: any = await api(`/superadmin/shops/updateShopStatus/${selectedShop._id}`, 'PUT', {
        status: newStatus
      });
      if (!response.success) throw new Error(response.message || "Failed");
    } catch (error: any) {
      setShops(previousShops);
      Alert.alert("Error", error.message);
    } finally {
      setSelectedShop(null);
    }
  };

  const openStatusModal = useCallback((shop: Shop) => {
    setSelectedShop(shop);
    setModalVisible(true);
  }, []);

  // --- SEARCH DEBOUNCE ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchShops(searchQuery, filter, 1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filter]);

  // --- PAGINATION ---
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
        <Ionicons name="storefront-outline" size={50} color="#D1D5DB" />
        <Text style={styles.emptyStateTitle}>No shops found</Text>
        <Text style={styles.emptyStateText}>Try adjusting your filters</Text>
      </View>
    );

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => handlePageChange(page - 1)}
          disabled={page === 1}
          style={[styles.pageButton, page === 1 && { opacity: 0.5 }]}
        >
          <Ionicons name="chevron-back" size={18} color="#2563EB" />
        </TouchableOpacity>

        <Text style={styles.pageNumberText}>Page {page} of {totalPages}</Text>

        <TouchableOpacity
          onPress={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          style={[styles.pageButton, page === totalPages && { opacity: 0.5 }]}
        >
          <Ionicons name="chevron-forward" size={18} color="#2563EB" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* ✅ Standardized Header */}
      <AppHeader
        title="Manage Shops"
        showBack={true}
        rightIcon="add"
        onRightPress={() => router.push("/superadmin/shops/create")}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* FIXED SEARCH & FILTER SECTION */}
        <View style={styles.stickyHeader}>
          {/* Search Bar */}
          <View style={styles.searchWrapper}>
            <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              placeholder="Search shops..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              returnKeyType="search"
              onSubmitEditing={Keyboard.dismiss}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Tabs */}
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContainer}
            >
              {['all', ...STATUS_OPTIONS].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.filterTab,
                    filter === tab && styles.activeFilterTab
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

        {/* SCROLLABLE LIST */}
        <FlatList
          data={loading ? Array.from({ length: 5 }) : shops}
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
          // Added padding bottom to avoid navigation bar overlap
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={Keyboard.dismiss}
        />
      </KeyboardAvoidingView>

      {/* MODAL */}
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

  // --- STICKY CONTROL HEADER ---
  stickyHeader: {
    backgroundColor: '#fff',
    paddingBottom: 12,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    zIndex: 10,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    height: 40,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  searchIcon: { marginLeft: 12 },
  input: { flex: 1, fontSize: 14, color: "#1F2937", paddingHorizontal: 10, height: '100%' },
  clearButton: { padding: 8 },

  filterContainer: { gap: 8, paddingHorizontal: 16 },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  activeFilterTab: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6",
  },
  filterTabText: { fontSize: 13, color: "#6B7280", fontWeight: "600", textTransform: "capitalize" },
  activeFilterTabText: { color: "#2563EB" },

  // --- SHOP CARD ---
  shopCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    padding: 16
  },
  cardMainRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  iconContainer: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center', marginRight: 12
  },
  cardInfo: { flex: 1 },
  shopCardName: { fontSize: 16, fontWeight: "700", color: "#111827" },
  shopCategory: { fontSize: 13, color: "#6B7280", marginTop: 2 },

  // Status Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  statusText: { fontSize: 11, fontWeight: "600", textTransform: "capitalize" },

  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 12 },

  cardStatsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  statValue: { fontSize: 13, color: '#374151', fontWeight: '600' },
  statValueGreen: { fontSize: 14, color: '#10B981', fontWeight: '700' },

  // --- FOOTER & EMPTY ---
  pagination: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 20, marginTop: 10 },
  pageButton: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center'
  },
  pageNumberText: { color: "#6B7280", fontWeight: "500", fontSize: 13 },
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyStateTitle: { fontSize: 16, fontWeight: "700", color: "#374151", marginTop: 12 },
  emptyStateText: { fontSize: 13, color: "#9CA3AF" },

  skeletonBox: { backgroundColor: '#F3F4F6', borderRadius: 4 },

  // --- MODAL ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  closeModalBtn: { padding: 4 },
  statusOption: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F9FAFB'
  },
  statusOptionActive: { backgroundColor: '#F9FAFB', marginHorizontal: -10, paddingHorizontal: 10, borderRadius: 8, borderBottomWidth: 0 },
  statusOptionText: { fontSize: 16, color: '#374151', fontWeight: '500' },
  statusOptionTextActive: { color: '#2563EB', fontWeight: '700' },
});