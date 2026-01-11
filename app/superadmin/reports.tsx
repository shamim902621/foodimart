import AppHeader from "@/components/AppHeader"; // ✅ Use correct AppHeader
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

// --- Types ---
type TimeRange = "7d" | "30d" | "1y";

export default function Reports() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [exportModalVisible, setExportModalVisible] = useState(false);

  // --- Dummy Data ---
  const metrics = [
    { title: "Total Revenue", value: "₹4.5L", change: "+12%", trend: "up", icon: "cash-outline", color: "#10B981" },
    { title: "Active Orders", value: "1,245", change: "+3%", trend: "up", icon: "cart-outline", color: "#3B82F6" },
    { title: "New Customers", value: "324", change: "+8%", trend: "up", icon: "people-outline", color: "#8B5CF6" },
    { title: "Avg Order Val", value: "₹368", change: "-2%", trend: "down", icon: "pricetag-outline", color: "#F59E0B" }
  ];

  const topShops = [
    { name: "Food Mart Indiranagar", revenue: "₹1,25,000", orders: 230, percent: 90 },
    { name: "Burger Hub Koramangala", revenue: "₹89,000", orders: 145, percent: 65 },
    { name: "Pizza Palace", revenue: "₹67,000", orders: 89, percent: 45 },
    { name: "Spicy Treats", revenue: "₹45,000", orders: 54, percent: 30 },
  ];

  const chartData = [40, 65, 50, 80, 55, 90, 70]; // Dummy heights for bar chart

  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader title="Analytics & Reports" showBack={true} rightIcon="calendar-outline" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* --- 1. CONTROLS SECTION --- */}
        <View style={styles.controlsRow}>
          {/* Time Range Tabs */}
          <View style={styles.tabsContainer}>
            {(["7d", "30d", "1y"] as TimeRange[]).map((range) => (
              <TouchableOpacity
                key={range}
                style={[styles.tab, timeRange === range && styles.activeTab]}
                onPress={() => setTimeRange(range)}
              >
                <Text style={[styles.tabText, timeRange === range && styles.activeTabText]}>
                  {range === "7d" ? "Week" : range === "30d" ? "Month" : "Year"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Export Button */}
          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => setExportModalVisible(true)}
          >
            <Ionicons name="download-outline" size={18} color="#fff" />
            <Text style={styles.exportText}>Export</Text>
          </TouchableOpacity>
        </View>

        {/* --- 2. REVENUE TREND CHART (CSS Only) --- */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Revenue Trend</Text>
            <Text style={styles.cardSubtitle}>Last 7 Days</Text>
          </View>

          <View style={styles.chartContainer}>
            {chartData.map((height, index) => (
              <View key={index} style={styles.barWrapper}>
                <View style={[styles.chartBar, { height: `${height}%` }]} />
                <Text style={styles.barLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* --- 3. KEY METRICS GRID (Responsive 2-Col) --- */}
        <Text style={styles.sectionHeader}>Key Performance</Text>
        <View style={styles.metricsGrid}>
          {metrics.map((item, index) => (
            <View key={index} style={styles.metricCard}>
              <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <Text style={styles.metricValue}>{item.value}</Text>
              <Text style={styles.metricTitle}>{item.title}</Text>

              <View style={styles.trendRow}>
                <Ionicons
                  name={item.trend === 'up' ? "arrow-up" : "arrow-down"}
                  size={12}
                  color={item.trend === 'up' ? "#10B981" : "#EF4444"}
                />
                <Text style={[styles.trendText, { color: item.trend === 'up' ? "#10B981" : "#EF4444" }]}>
                  {item.change}
                </Text>
                <Text style={styles.trendLabel}>vs last {timeRange}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* --- 4. TOP SHOPS (With Visual Bars) --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Performing Shops</Text>
          <View style={styles.listContainer}>
            {topShops.map((shop, index) => (
              <View key={index} style={styles.shopRow}>
                <View style={styles.shopInfo}>
                  <Text style={styles.shopName}>{index + 1}. {shop.name}</Text>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${shop.percent}%` }]} />
                  </View>
                </View>
                <View style={styles.shopStats}>
                  <Text style={styles.shopRevenue}>{shop.revenue}</Text>
                  <Text style={styles.shopOrders}>{shop.orders} orders</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* --- 5. QUICK LINKS --- */}
        <Text style={styles.sectionHeader}>Detailed Reports</Text>
        <View style={styles.quickLinks}>
          <ReportLink icon="people-outline" title="Customer Demographics" color="#8B5CF6" />
          <ReportLink icon="receipt-outline" title="Order Analysis" color="#F59E0B" />
          <ReportLink icon="location-outline" title="Regional Sales" color="#3B82F6" />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* --- EXPORT MODAL --- */}
      <Modal visible={exportModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setExportModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Export Report</Text>
              <Text style={styles.modalSubtitle}>Choose format to download</Text>

              <TouchableOpacity style={styles.exportOption} onPress={() => setExportModalVisible(false)}>
                <Ionicons name="document-text-outline" size={24} color="#EF4444" />
                <Text style={styles.exportOptionText}>Export as PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.exportOption} onPress={() => setExportModalVisible(false)}>
                <Ionicons name="grid-outline" size={24} color="#10B981" />
                <Text style={styles.exportOptionText}>Export as CSV / Excel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={() => setExportModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
}

// Helper Component for Quick Links
const ReportLink = ({ icon, title, color }: { icon: string, title: string, color: string }) => (
  <TouchableOpacity style={styles.linkCard}>
    <View style={[styles.linkIcon, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon as any} size={20} color={color} />
    </View>
    <Text style={styles.linkText}>{title}</Text>
    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContent: { padding: 16 },

  // --- CONTROLS ---
  controlsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  tabsContainer: { flexDirection: "row", backgroundColor: "#E5E7EB", borderRadius: 10, padding: 4 },
  tab: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  activeTab: { backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  tabText: { fontSize: 13, color: "#6B7280", fontWeight: "600" },
  activeTabText: { color: "#111827" },

  exportButton: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#2563EB",
    paddingHorizontal: 16, borderRadius: 10, gap: 6
  },
  exportText: { color: "#fff", fontWeight: "600", fontSize: 13 },

  // --- CHART CARD ---
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 24, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  cardSubtitle: { fontSize: 12, color: "#6B7280" },

  chartContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", height: 120, paddingTop: 20 },
  barWrapper: { alignItems: 'center', width: '12%', height: '100%', justifyContent: 'flex-end' },
  chartBar: { width: 12, backgroundColor: "#3B82F6", borderRadius: 6, marginBottom: 6 },
  barLabel: { fontSize: 11, color: "#9CA3AF" },

  // --- METRICS GRID ---
  sectionHeader: { fontSize: 16, fontWeight: "700", color: "#374151", marginBottom: 12 },
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12, marginBottom: 24 },
  metricCard: {
    backgroundColor: "#fff", width: "48%", padding: 16, borderRadius: 16,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3, elevation: 2
  },
  iconBox: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  metricValue: { fontSize: 20, fontWeight: "800", color: "#111827", marginBottom: 2 },
  metricTitle: { fontSize: 13, color: "#6B7280", marginBottom: 8 },
  trendRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  trendText: { fontSize: 12, fontWeight: "700" },
  trendLabel: { fontSize: 10, color: "#9CA3AF" },

  // --- SHOP LIST ---
  listContainer: { marginTop: 10 },
  shopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  shopInfo: { flex: 1, marginRight: 16 },
  shopName: { fontSize: 14, fontWeight: "600", color: "#111827", marginBottom: 6 },
  progressBarBg: { height: 6, backgroundColor: "#F3F4F6", borderRadius: 3, width: '100%' },
  progressBarFill: { height: '100%', backgroundColor: "#10B981", borderRadius: 3 },
  shopStats: { alignItems: "flex-end" },
  shopRevenue: { fontSize: 14, fontWeight: "700", color: "#111827" },
  shopOrders: { fontSize: 11, color: "#6B7280" },

  // --- QUICK LINKS ---
  quickLinks: { gap: 12 },
  linkCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 16,
    borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 2, elevation: 1
  },
  linkIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 12 },
  linkText: { flex: 1, fontSize: 14, fontWeight: "600", color: "#374151" },

  // --- MODAL ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', width: '100%', borderRadius: 20, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: "800", textAlign: "center", marginBottom: 4 },
  modalSubtitle: { fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 24 },
  exportOption: {
    flexDirection: "row", alignItems: "center", padding: 16, backgroundColor: "#F9FAFB",
    borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB"
  },
  exportOptionText: { marginLeft: 12, fontSize: 16, fontWeight: "600", color: "#374151" },
  cancelBtn: { marginTop: 8, padding: 12, alignItems: "center" },
  cancelText: { color: "#6B7280", fontWeight: "600" }
});