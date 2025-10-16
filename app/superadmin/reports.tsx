// app/superadmin/reports.tsx
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Reports() {
  const reports = [
    {
      title: "Monthly Revenue Report",
      value: "₹4,58,900",
      change: "+12%",
      trend: "up",
      description: "Total revenue for this month"
    },
    {
      title: "Order Completion Rate",
      value: "94%",
      change: "+3%",
      trend: "up",
      description: "Successful order rate"
    },
    {
      title: "Customer Growth",
      value: "3,247",
      change: "+8%",
      trend: "up",
      description: "Total active customers"
    },
    {
      title: "Average Order Value",
      value: "₹368",
      change: "-2%",
      trend: "down",
      description: "Average spend per order"
    }
  ];

  const topShops = [
    { name: "Food Mart Indiranagar", revenue: "₹1,25,000", orders: 230 },
    { name: "Burger Hub Koramangala", revenue: "₹89,000", orders: 145 },
    { name: "Pizza Palace", revenue: "₹67,000", orders: 89 },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics & Reports</Text>
        <Text style={styles.subtitle}>Comprehensive business insights</Text>
      </View>

      {/* Date Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.dateButton}>
          <Text style={styles.dateText}>From: Jan 1, 2024</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateButton}>
          <Text style={styles.dateText}>To: Jan 31, 2024</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton}>
          <Ionicons name="download-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Key Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.reportsGrid}>
          {reports.map((report, index) => (
            <View key={index} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <View style={[
                  styles.trendBadge,
                  report.trend === 'up' ? styles.trendUp : styles.trendDown
                ]}>
                  <Ionicons 
                    name={report.trend === 'up' ? 'trending-up' : 'trending-down'} 
                    size={12} 
                    color={report.trend === 'up' ? '#10B981' : '#EF4444'} 
                  />
                  <Text style={[
                    styles.trendText,
                    report.trend === 'up' ? styles.trendTextUp : styles.trendTextDown
                  ]}>
                    {report.change}
                  </Text>
                </View>
              </View>
              <Text style={styles.reportValue}>{report.value}</Text>
              <Text style={styles.reportDescription}>{report.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Top Performing Shops */}
      <View style={styles.topShopsCard}>
        <Text style={styles.cardTitle}>Top Performing Shops</Text>
        <View style={styles.shopsList}>
          {topShops.map((shop, index) => (
            <View key={index} style={styles.shopItem}>
              <View style={styles.shopInfo}>
                <Text style={styles.shopName}>{shop.name}</Text>
                <Text style={styles.shopOrders}>{shop.orders} orders</Text>
              </View>
              <Text style={styles.shopRevenue}>{shop.revenue}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Additional Reports */}
      <View style={styles.quickReportsCard}>
        <Text style={styles.cardTitle}>Quick Reports</Text>
        <View style={styles.quickReportsList}>
          <ReportItem icon="📊" title="Sales Report" description="Detailed sales analytics" />
          <ReportItem icon="👥" title="Customer Report" description="Customer demographics" />
          <ReportItem icon="📦" title="Order Report" description="Order performance metrics" />
          <ReportItem icon="💰" title="Revenue Report" description="Revenue breakdown" />
        </View>
      </View>
    </ScrollView>
  );
}

const ReportItem = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <TouchableOpacity style={styles.reportItem}>
    <Text style={styles.reportItemIcon}>{icon}</Text>
    <View style={styles.reportItemInfo}>
      <Text style={styles.reportItemTitle}>{title}</Text>
      <Text style={styles.reportItemDescription}>{description}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  filterContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  dateButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dateText: {
    fontSize: 14,
    color: "#6B7280",
  },
  downloadButton: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  reportsGrid: {
    gap: 12,
  },
  reportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendUp: {
    backgroundColor: "#D1FAE5",
  },
  trendDown: {
    backgroundColor: "#FEE2E2",
  },
  trendText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  trendTextUp: {
    color: "#065F46",
  },
  trendTextDown: {
    color: "#991B1B",
  },
  reportValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  topShopsCard: {
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
  quickReportsCard: {
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
  shopsList: {
    gap: 12,
  },
  shopItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  shopOrders: {
    fontSize: 12,
    color: "#6B7280",
  },
  shopRevenue: {
    color: "#10B981",
    fontWeight: "600",
    fontSize: 14,
  },
  quickReportsList: {
    gap: 12,
  },
  reportItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  reportItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  reportItemInfo: {
    flex: 1,
  },
  reportItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  reportItemDescription: {
    fontSize: 12,
    color: "#6B7280",
  },
});