
import { StatBox } from "@/components/ui/stat-box";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SuperAdminDashboard() {
  const stats = {
    totalShops: 12,
    monthlyOrders: 1245,
    pendingOrders: 87,
    deliveredOrders: 1158,
    totalRevenue: 458900,
    activeUsers: 3247
  };

  const recentShops = [
    { id: 1, name: "Food Mart Indiranagar", orders: 130, status: "active", revenue: 125000 },
    { id: 2, name: "Burger Point Koramangala", orders: 245, status: "active", revenue: 189000 },
    { id: 3, name: "Pizza Hub", orders: 89, status: "inactive", revenue: 67000 },
  ];

  const quickActions = [
    { icon: "🏪", title: "Manage Shops", route: "/superadmin/shops" },
    { icon: "👥", title: "Manage Users", route: "/superadmin/users" },
    { icon: "📊", title: "View Reports", route: "/superadmin/reports" },
    { icon: "➕", title: "Add New Shop", route: "/superadmin/shops/create" },
  ];

  const getStatusColor = (status: string) => {
    return status === 'active' ? '#10B981' : '#EF4444';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Super Admin Dashboard</Text>
        <Text style={styles.subtitle}>Manage your entire network of shops</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionCard}
              onPress={() => router.push(action.route as any)}
            >
              <Text style={styles.quickActionIcon}>{action.icon}</Text>
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Statistics Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <StatBox 
            title="Total Shops" 
            value={stats.totalShops.toString()} 
            icon="🏪"
            color="#3B82F6"
          />
          <StatBox 
            title="Monthly Orders" 
            value={stats.monthlyOrders.toLocaleString()} 
            icon="📦"
            color="#10B981"
          />
          <StatBox 
            title="Pending Orders" 
            value={stats.pendingOrders.toString()} 
            icon="⏳"
            color="#F59E0B"
          />
          <StatBox 
            title="Total Revenue" 
            value={`₹${(stats.totalRevenue / 1000).toFixed(0)}K`} 
            icon="💰"
            color="#8B5CF6"
          />
        </View>
      </View>

      {/* Recent Shops */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Shops</Text>
          <TouchableOpacity onPress={() => router.push("/superadmin/shops")}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.shopsList}>
          {recentShops.map((shop) => (
            <TouchableOpacity
              key={shop.id}
              style={styles.shopCard}
              onPress={() => router.push(`/superadmin/shops/details?id=${shop.id}`)}
            >
              <View style={styles.shopCardHeader}>
                <View style={styles.shopInfo}>
                  <Text style={styles.shopName}>{shop.name}</Text>
                  <View style={styles.shopMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="cart-outline" size={16} color="#6B7280" />
                      <Text style={styles.metaText}>{shop.orders} orders</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="cash-outline" size={16} color="#6B7280" />
                      <Text style={styles.metaText}>₹{(shop.revenue / 1000).toFixed(0)}K</Text>
                    </View>
                  </View>
                </View>
                <View 
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(shop.status) + '20' }
                  ]}
                >
                  <Text 
                    style={[
                      styles.statusText,
                      { color: getStatusColor(shop.status) }
                    ]}
                  >
                    {shop.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Performance Metrics */}
      <View style={styles.performanceCard}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={[styles.metricValue, { color: '#10B981' }]}>94%</Text>
            <Text style={styles.metricLabel}>Order Completion Rate</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={[styles.metricValue, { color: '#3B82F6' }]}>4.7</Text>
            <Text style={styles.metricLabel}>Avg. Rating</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={[styles.metricValue, { color: '#8B5CF6' }]}>12%</Text>
            <Text style={styles.metricLabel}>Growth Rate</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom:10,
    fontWeight: "600",
    color: "#374151",
  },
  viewAllText: {
    color: "#3B82F6",
    fontWeight: "500",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    minWidth: '45%',
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  shopsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  shopCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  shopCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  shopMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  performanceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricItem: {
    alignItems: "center",
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
});