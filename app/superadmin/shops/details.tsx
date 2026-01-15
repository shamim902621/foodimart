import AppHeader from "@/components/AppHeader"; // ✅ Reusable Header
import { StatBox } from "@/components/ui/stat-box";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { api } from "../../lib/apiService";

export default function ShopDetails() {
  const { token } = useAuth();
  const { id } = useLocalSearchParams();
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShop();
  }, [id]);

  const fetchShop = async () => {
    try {
      const response: any = await api(`/superadmin/shops/getShopById/${id}`, "GET");
      if (response?.success) {
        setShop(response.data);
      } else {
        console.log("Failed:", response?.message);
      }
    } catch (e) {
      console.log("Fetch data error:", e);
    } finally {
      setLoading(false);
    }
  };

  // --- Helper Functions ---
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

  const recentOrders = [
    { id: "ORD-001", customer: "John Doe", amount: 1250, status: "delivered", time: "2h ago" },
    { id: "ORD-002", customer: "Jane Smith", amount: 890, status: "preparing", time: "4h ago" },
    { id: "ORD-003", customer: "Bob Johnson", amount: 2100, status: "pending", time: "6h ago" },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading shop details...</Text>
      </View>
    );
  }

  if (!shop) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Shop not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ✅ Reusable Header with Edit Button */}
      <AppHeader
        title="Shop Details"
        showBack={true}
        rightIcon="create-outline"
        onRightPress={() => router.push(`/superadmin/shops/edit?id=${id}`)}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* --- HERO SECTION (Identity) --- */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.shopTitle}>{shop.shop.name}</Text>
              <Text style={styles.shopCategory}>
                {shop.shop.category} • {shop.shop.foodCategory || "General"}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(shop.shop.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(shop.shop.status) }]}>
                {shop.shop.status}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.heroStats}>
            <View style={styles.heroStatItem}>
              <Ionicons name="star" size={18} color="#F59E0B" />
              <Text style={styles.heroStatValue}>{shop.shop.rating || "New"}</Text>
              <Text style={styles.heroStatLabel}>Rating</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.heroStatItem}>
              <Ionicons name="calendar-outline" size={18} color="#6B7280" />
              <Text style={styles.heroStatValue}>{shop.shop.createdAt?.slice(0, 10)}</Text>
              <Text style={styles.heroStatLabel}>Joined</Text>
            </View>
          </View>
        </View>

        {/* --- PERFORMANCE GRID --- */}
        <Text style={styles.sectionTitle}>Performance Overview</Text>
        <View style={styles.statsGrid}>
          {/* Note: Ensure StatBox component supports style prop or wraps content */}
          <View style={styles.statWrapper}>
            <StatBox title="Total Orders" value={shop.shop.totalOrders?.toString() || "0"} icon="📦" color="#3B82F6" />
          </View>
          <View style={styles.statWrapper}>
            <StatBox title="Revenue" value={`₹${(shop.shop.totalRevenue / 1000).toFixed(1)}K`} icon="💰" color="#10B981" />
          </View>
          <View style={styles.statWrapper}>
            <StatBox title="This Month" value={shop.shop.monthlyOrders?.toString() || "0"} icon="📊" color="#8B5CF6" />
          </View>
          <View style={styles.statWrapper}>
            <StatBox title="This Week" value={shop.shop.weeklyOrders?.toString() || "0"} icon="🔄" color="#F59E0B" />
          </View>
        </View>

        {/* --- INFORMATION CARD --- */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Contact & Location</Text>
          <View style={styles.infoList}>
            <InfoRow icon="person-outline" label="Owner" value={shop.shop.ownerName || shop.user.fullName} />
            <InfoRow icon="mail-outline" label="Email" value={shop.user.email} />
            <InfoRow icon="call-outline" label="Phone" value={shop.user.mobile} />
            <InfoRow
              icon="location-outline"
              label="Address"
              value={`${shop.address.street}, ${shop.address.city}, ${shop.address.zipCode}`}
            />
          </View>
        </View>

        {/* --- RECENT ORDERS --- */}
        <View style={styles.ordersCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Orders</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentOrders.map((order, index) => (
            <View key={order.id} style={[styles.orderItem, index === recentOrders.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.orderIconBg}>
                <Ionicons name="receipt-outline" size={20} color="#6B7280" />
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderCustomer}>{order.customer} • {order.time}</Text>
              </View>
              <View style={styles.orderDetails}>
                <Text style={styles.orderAmount}>₹{order.amount}</Text>
                <Text style={[styles.orderStatusText, { color: getStatusColor(order.status) }]}>
                  {order.status}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// --- Sub Component for Info Rows ---
const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconBg}>
      <Ionicons name={icon as any} size={18} color="#4B5563" />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabelText}>{label}</Text>
      <Text style={styles.infoValue}>{value || "N/A"}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#F3F4F6' },
  loadingText: { marginTop: 10, color: '#6B7280' },
  scrollContent: { padding: 16 },

  // --- HERO CARD ---
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  heroHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  shopTitle: { fontSize: 22, fontWeight: "800", color: "#111827", marginBottom: 4 },
  shopCategory: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: "700", textTransform: "capitalize" },

  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 16 },

  heroStats: { flexDirection: "row", justifyContent: "space-around" },
  heroStatItem: { alignItems: "center", gap: 4 },
  heroStatValue: { fontSize: 16, fontWeight: "700", color: "#111827" },
  heroStatLabel: { fontSize: 12, color: "#6B7280" },
  verticalDivider: { width: 1, height: '100%', backgroundColor: '#F3F4F6' },

  // --- STATS GRID ---
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 16 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24
  },
  statWrapper: { width: '48%' }, // Ensures 2 items per row

  // --- INFO CARD ---
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 16 },
  infoList: { gap: 16 },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoIconBg: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12
  },
  infoContent: { flex: 1 },
  infoLabelText: { fontSize: 12, color: "#6B7280", marginBottom: 2 },
  infoValue: { fontSize: 15, color: "#111827", fontWeight: "500" },

  // --- ORDERS CARD ---
  ordersCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  viewAllText: { color: "#2563EB", fontWeight: "600", fontSize: 14 },

  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6"
  },
  orderIconBg: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 12
  },
  orderInfo: { flex: 1 },
  orderId: { fontSize: 14, fontWeight: "600", color: "#111827" },
  orderCustomer: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  orderDetails: { alignItems: "flex-end" },
  orderAmount: { fontSize: 14, fontWeight: "700", color: "#111827" },
  orderStatusText: { fontSize: 11, fontWeight: "600", textTransform: "capitalize", marginTop: 2 },
});