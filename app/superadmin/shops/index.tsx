// app/superadmin/shops/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ShopsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const shops = [
    { 
      id: 1, 
      name: "Food Mart Indiranagar", 
      owner: "Shamim Ahmad", 
      orders: 230, 
      revenue: 125000,
      status: "active",
      joinDate: "2024-01-15",
      rating: 4.5
    },
    { 
      id: 2, 
      name: "Burger Hub Koramangala", 
      owner: "Amit Kumar", 
      orders: 145, 
      revenue: 89000,
      status: "active",
      joinDate: "2024-02-01",
      rating: 4.2
    },
    { 
      id: 3, 
      name: "Pizza Palace", 
      owner: "Priya Sharma", 
      orders: 89, 
      revenue: 67000,
      status: "inactive",
      joinDate: "2024-01-20",
      rating: 4.7
    },
  ];

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shop.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || shop.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    return status === 'active' ? '#10B981' : '#EF4444';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <TextInput
              placeholder="Search shops..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.input}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {["all", "active", "inactive"].map((tab) => (
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
        </View>
      </View>

      {/* Shops List */}
      <View style={styles.shopsContainer}>
        {filteredShops.map((shop) => (
          <TouchableOpacity
            key={shop.id}
            style={styles.shopCard}
            onPress={() => router.push(`/superadmin/shops/details?id=${shop.id}`)}
          >
            <View style={styles.shopHeader}>
              <Text style={styles.shopCardName}>{shop.name}</Text>
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

            <View style={styles.ownerContainer}>
              <Ionicons name="person-outline" size={16} color="#6B7280" />
              <Text style={styles.ownerText}>{shop.owner}</Text>
            </View>

            <View style={styles.shopFooter}>
              <View style={styles.shopStats}>
                <View style={styles.statItem}>
                  <Ionicons name="cart-outline" size={16} color="#6B7280" />
                  <Text style={styles.statText}>{shop.orders} orders</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="star" size={16} color="#F59E0B" />
                  <Text style={styles.statText}>{shop.rating}</Text>
                </View>
              </View>
              
              <Text style={styles.revenueText}>₹{(shop.revenue / 1000).toFixed(0)}K</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Empty State */}
      {filteredShops.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="storefront-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyStateTitle}>No shops found</Text>
          <Text style={styles.emptyStateText}>
            {searchQuery ? "Try adjusting your search query" : "Get started by adding your first shop"}
          </Text>
        </View>
      )}
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
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  addButton: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    padding: 12,
    fontSize: 16,
    color: "#374151",
  },
  filterButton: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterTabs: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  activeFilterTab: {
    backgroundColor: "#2563EB",
  },
  filterTabText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  activeFilterTabText: {
    color: "#FFFFFF",
  },
  shopsContainer: {
    gap: 12,
  },
  shopCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  shopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  shopCardName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
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
  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ownerText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
  },
  shopFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shopStats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  revenueText: {
    color: "#10B981",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});