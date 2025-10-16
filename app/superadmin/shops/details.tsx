// app/superadmin/shops/details.tsx
import { StatBox } from "@/components/ui/stat-box";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ShopDetails() {
  const { id } = useLocalSearchParams();
  
  const shop = {
    id: id,
    name: "Food Mart Indiranagar",
    owner: "Shamim Ahmad",
    email: "shamim@foodmart.com",
    phone: "+91 9876543210",
    address: "123, 100 Feet Road, Indiranagar, Bangalore",
    category: "Grocery Store",
    status: "active",
    joinDate: "2024-01-15",
    rating: 4.5,
    totalOrders: 230,
    monthlyOrders: 120,
    weeklyOrders: 40,
    totalRevenue: 1250000,
    monthlyRevenue: 245000
  };

  const recentOrders = [
    { id: "ORD-001", customer: "John Doe", amount: 1250, status: "delivered", time: "2 hours ago" },
    { id: "ORD-002", customer: "Jane Smith", amount: 890, status: "preparing", time: "4 hours ago" },
    { id: "ORD-003", customer: "Bob Johnson", amount: 2100, status: "pending", time: "6 hours ago" },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      delivered: '#10B981',
      preparing: '#F59E0B',
      pending: '#EF4444'
    };
    return colors[status as keyof typeof colors] || '#6B7280';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.shopTitle}>{shop.name}</Text>
            <Text style={styles.shopCategory}>{shop.category}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.shopMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.metaText}>{shop.rating}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.metaText}>Joined {shop.joinDate}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            shop.status === 'active' ? styles.activeStatus : styles.inactiveStatus
          ]}>
            <Text style={[
              styles.statusText,
              shop.status === 'active' ? styles.activeStatusText : styles.inactiveStatusText
            ]}>
              {shop.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Performance Overview</Text>
        <View style={styles.statsGrid}>
          <StatBox title="Total Orders" value={shop.totalOrders.toString()} icon="📦" />
          <StatBox title="Monthly Orders" value={shop.monthlyOrders.toString()} icon="📊" />
          <StatBox title="Weekly Orders" value={shop.weeklyOrders.toString()} icon="🔄" />
          <StatBox title="Total Revenue" value={`₹${(shop.totalRevenue / 1000).toFixed(0)}K`} icon="💰" />
        </View>

        {/* Shop Information */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Shop Information</Text>
          <View style={styles.infoList}>
            <InfoRow icon="person-outline" label="Owner" value={shop.owner} />
            <InfoRow icon="mail-outline" label="Email" value={shop.email} />
            <InfoRow icon="call-outline" label="Phone" value={shop.phone} />
            <InfoRow icon="location-outline" label="Address" value={shop.address} />
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.ordersCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Orders</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.ordersList}>
            {recentOrders.map((order) => (
              <View key={order.id} style={styles.orderItem}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderCustomer}>{order.customer}</Text>
                </View>
                <View style={styles.orderDetails}>
                  <Text style={styles.orderAmount}>₹{order.amount}</Text>
                  <View style={styles.orderStatus}>
                    <View 
                      style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(order.status) }
                      ]}
                    />
                    <Text style={styles.orderStatusText}>{order.status}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLabel}>
      <Ionicons name={icon as any} size={20} color="#6B7280" />
      <Text style={styles.infoLabelText}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  shopTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  shopCategory: {
    fontSize: 16,
    color: "#6B7280",
  },
  editButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  shopMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: "#D1FAE5",
  },
  inactiveStatus: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  activeStatusText: {
    color: "#065F46",
  },
  inactiveStatusText: {
    color: "#991B1B",
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  ordersCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllText: {
    color: "#2563EB",
    fontWeight: "500",
  },
  infoList: {
    gap: 0,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoLabelText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  ordersList: {
    gap: 12,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  orderCustomer: {
    fontSize: 14,
    color: "#6B7280",
  },
  orderDetails: {
    alignItems: "flex-end",
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  orderStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  orderStatusText: {
    fontSize: 12,
    color: "#6B7280",
    textTransform: "capitalize",
  },
});