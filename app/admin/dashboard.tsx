import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    todaySales: 12500,
    totalOrders: 120,
    deliveredOrders: 85,
    pendingOrders: 35,
    lowStockProducts: 8,
    totalProducts: 45,
    monthlyRevenue: 185000,
    activeCustomers: 320
  });

  const [recentOrders, setRecentOrders] = useState([
    { id: "#ORD001", customer: "John D.", amount: 1250, status: "pending", time: "10:30 AM" },
    { id: "#ORD002", customer: "Sarah M.", amount: 890, status: "completed", time: "9:15 AM" },
    { id: "#ORD003", customer: "Mike R.", amount: 2100, status: "delivered", time: "Yesterday" },
    { id: "#ORD004", customer: "Emma L.", amount: 450, status: "pending", time: "Yesterday" }
  ]);

  const getStatusColor = (status:any) => {
    switch(status) {
      case 'pending': return '#FFA500';
      case 'completed': return '#2ECC71';
      case 'delivered': return '#3498DB';
      default: return '#95A5A6';
    }
  };

  const getStatusText = (status:any) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      case 'delivered': 'Delivered';
      default: return status;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📊 Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back, Shop Owner!</Text>
      </View>

      {/* Main Stats Grid */}
      <View style={styles.statsGrid}>
        {/* Today's Sales */}
        <View style={[styles.statCard, styles.primaryCard]}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>💰</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Today's Sales</Text>
            <Text style={styles.statValue}>₹{dashboardData.todaySales.toLocaleString()}</Text>
          </View>
        </View>

        {/* Total Orders */}
        <View style={[styles.statCard, styles.secondaryCard]}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>📦</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Total Orders</Text>
            <Text style={styles.statValue}>{dashboardData.totalOrders}</Text>
          </View>
        </View>

        {/* Delivered Orders */}
        <View style={[styles.statCard, styles.successCard]}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>✅</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Delivered</Text>
            <Text style={styles.statValue}>{dashboardData.deliveredOrders}</Text>
          </View>
        </View>

        {/* Pending Orders */}
        <View style={[styles.statCard, styles.warningCard]}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>⏳</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Pending</Text>
            <Text style={styles.statValue}>{dashboardData.pendingOrders}</Text>
          </View>
        </View>
      </View>

      {/* Additional Stats Row */}
      <View style={styles.additionalStats}>
        <View style={styles.smallStat}>
          <Text style={styles.smallStatValue}>{dashboardData.lowStockProducts}</Text>
          <Text style={styles.smallStatLabel}>Low Stock</Text>
        </View>
        <View style={styles.smallStat}>
          <Text style={styles.smallStatValue}>{dashboardData.totalProducts}</Text>
          <Text style={styles.smallStatLabel}>Products</Text>
        </View>
        <View style={styles.smallStat}>
          <Text style={styles.smallStatValue}>{dashboardData.activeCustomers}</Text>
          <Text style={styles.smallStatLabel}>Customers</Text>
        </View>
      </View>

      {/* Recent Orders Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🆕 Recent Orders</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.ordersList}>
          {recentOrders.map((order, index) => (
            <View key={order.id} style={styles.orderItem}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderCustomer}>{order.customer}</Text>
              </View>
              <View style={styles.orderDetails}>
                <Text style={styles.orderAmount}>₹{order.amount}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
                </View>
                <Text style={styles.orderTime}>{order.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>View Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💰</Text>
            <Text style={styles.actionText}>Sales Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Monthly Revenue */}
      <View style={[styles.section, styles.revenueCard]}>
        <Text style={styles.sectionTitle}>📈 Monthly Revenue</Text>
        <Text style={styles.revenueAmount}>₹{dashboardData.monthlyRevenue.toLocaleString()}</Text>
        <Text style={styles.revenueTrend}>↑ 12% from last month</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8F9FA", 
    padding: 16 
  },
  header: {
    marginBottom: 24,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#2ECC71", 
    marginBottom: 4 
  },
  subtitle: {
    fontSize: 16,
    color: "#7F8C8D",
  },
  statsGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#2ECC71",
  },
  secondaryCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3498DB",
  },
  successCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#27AE60",
  },
  warningCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#F39C12",
  },
  statIconContainer: {
    marginRight: 12,
  },
  statIcon: {
    fontSize: 24,
  },
  statContent: {
    flex: 1,
  },
  statLabel: { 
    fontSize: 14, 
    color: "#7F8C8D",
    fontWeight: "500",
  },
  statValue: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#2C3E50",
    marginTop: 4,
  },
  additionalStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  smallStat: {
    alignItems: "center",
  },
  smallStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  smallStatLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  seeAllText: {
    color: "#2ECC71",
    fontWeight: "500",
  },
  ordersList: {
    gap: 12,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  orderCustomer: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 2,
  },
  orderDetails: {
    alignItems: "flex-end",
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  orderTime: {
    fontSize: 10,
    color: "#7F8C8D",
    marginTop: 2,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECF0F1",
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2C3E50",
    textAlign: "center",
  },
  revenueCard: {
    alignItems: "center",
    backgroundColor: "#2ECC71",
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginVertical: 8,
  },
  revenueTrend: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
});