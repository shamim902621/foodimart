import AppHeader from "@/components/AppHeader"; // ✅ Use the correct path
import { StatBox } from "@/components/ui/stat-box"; // Assuming you have this component
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { logout, user } = useAuth();

  // ✅ 1. Menu Visible State
  const [menuVisible, setMenuVisible] = useState(false);

  // ✅ 2. Logout Logic
  const handleLogout = async () => {
    setMenuVisible(false); // Close menu
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          // Router replace is handled by _layout listener usually, 
          // but for safety:
          setTimeout(() => router.replace("/login"), 100);
        },
      },
    ]);
  };

  // ✅ 3. Menu Options List
  const menuOptions = [
    {
      label: "Profile",
      icon: "person-circle-outline",
      action: () => {
        setMenuVisible(false);
        // router.push("/superadmin/profile");
      },
    },
    {
      label: "Manage Users",
      icon: "people-outline",
      action: () => {
        setMenuVisible(false);
        // router.push("/admin/manage-users");
      },
    },
    {
      label: "Shop Requests",
      icon: "storefront-outline",
      action: () => {
        setMenuVisible(false);
        // router.push("/superadmin/requests");
      },
    },
    {
      label: "App Settings",
      icon: "settings-outline",
      action: () => {
        setMenuVisible(false);
        console.log("Settings Clicked");
      },
    },
  ];

  const stats = {
    totalShops: 12,
    monthlyOrders: 1245,
    pendingOrders: 87,
    totalRevenue: 458900,
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
    <View style={styles.container}>
      {/* ✅ HEADER */}
      <AppHeader
        title="Super Admin"
        subtitle="Overview Dashboard"
        alignTitle="left"  // 👈 Puts text on Left side
        showBack={false}   // ❌ No Back button
        // No leftIcon passed, so left side is blank
        rightIcon="ellipsis-vertical"
        onRightPress={() => setMenuVisible(true)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Section: Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionCard}
                onPress={() => router.push(action.route as any)}
              >
                <Text style={styles.quickActionEmoji}>{action.icon}</Text>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section: Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatBox title="Total Shops" value={stats.totalShops.toString()} icon="🏪" color="#3B82F6" />
            <StatBox title="Monthly Orders" value={stats.monthlyOrders.toLocaleString()} icon="📦" color="#10B981" />
            <StatBox title="Pending" value={stats.pendingOrders.toString()} icon="⏳" color="#F59E0B" />
            <StatBox title="Revenue" value={`₹${(stats.totalRevenue / 1000).toFixed(0)}K`} icon="💰" color="#8B5CF6" />
          </View>
        </View>

        {/* Section: Recent Shops */}
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
                <View style={styles.shopCardRow}>
                  <View style={styles.shopInfo}>
                    <Text style={styles.shopName}>{shop.name}</Text>
                    <View style={styles.shopMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="cart-outline" size={14} color="#6B7280" />
                        <Text style={styles.metaText}>{shop.orders} orders</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="cash-outline" size={14} color="#6B7280" />
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

        {/* Section: Performance Metrics */}
        <View style={styles.performanceCard}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: '#10B981' }]}>94%</Text>
              <Text style={styles.metricLabel}>Completion</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: '#3B82F6' }]}>4.7</Text>
              <Text style={styles.metricLabel}>Rating</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: '#8B5CF6' }]}>12%</Text>
              <Text style={styles.metricLabel}>Growth</Text>
            </View>
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>


      {/* ✅ POPUP MENU MODAL */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuContainer}>
                <Text style={styles.menuHeaderTitle}>Quick Actions</Text>
                <View style={styles.divider} />
                {menuOptions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    onPress={item.action}
                  >
                    <Ionicons name={item.icon as any} size={20} color="#333" />
                    <Text style={styles.menuText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
                <View style={styles.divider} />
                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                  <Text style={[styles.menuText, { color: "#FF3B30" }]}>Logout</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  viewAllText: {
    color: "#3B82F6",
    fontWeight: "600",
    fontSize: 14,
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    width: '48%', // Responsive 2 column
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 8,
  },
  quickActionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },

  // Stats
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'space-between',
    gap: 12,
  },

  // Shops List
  shopsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  shopCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  shopCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  shopInfo: {
    flex: 1,
    marginRight: 10,
  },
  shopName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  shopMeta: {
    flexDirection: "row",
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  // Performance
  performanceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
  },
  metricItem: {
    alignItems: "center",
    flex: 1,
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: '500',
  },

  // Menu Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuContainer: {
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: Platform.OS === 'android' ? 50 : 90,
    marginRight: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  menuHeaderTitle: {
    fontSize: 11,
    color: "#999",
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 4,
    textTransform: 'uppercase'
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 4,
  },
});