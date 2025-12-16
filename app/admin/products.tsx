import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { API_BASE_URL } from "../../constants/constant";
import { useAuth } from "../../hooks/useAuth";

// --- 1. TYPE DEFINITIONS ---
interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  rating: number;
  totalOrders: number;
  availability: boolean;
  description?: string;
}

// --- 2. PRODUCT CARD COMPONENT ---
const ProductCard = ({ item, onDelete }: { item: Product, onDelete: (id: string) => void }) => {
  const getStatus = (stock: number, availability: boolean) => {
    if (!availability || stock === 0) return 'out-of-stock';
    if (stock < 10) return 'low-stock';
    return 'available';
  };

  const status = getStatus(item.stock, item.availability);

  const getStockColor = (currentStatus: string) => {
    switch (currentStatus) {
      case 'out-of-stock': return '#FF5252';
      case 'low-stock': return '#FF9800';
      default: return '#4CAF50';
    }
  };

  const imageUrl = item.images && item.images.length > 0
    ? item.images[0]
    : "https://via.placeholder.com/150";

  return (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode="cover" />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating?.toFixed(1) || "0.0"}</Text>
        </View>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>

        <View style={styles.productStats}>
          <View style={[styles.stockBadge, { backgroundColor: getStockColor(status) }]}>
            <Text style={styles.stockText}>{status === 'out-of-stock' ? 'Sold Out' : status}</Text>
          </View>
          <Text style={styles.stockCount}>{item.stock} left</Text>
        </View>
      </View>

      <View style={styles.actionBtns}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => {
            // Navigate to Edit Screen and pass current data
            router.push({
              pathname: "/product/edit/[id]", // Ensure this path matches your file structure
              params: {
                id: item._id,
                productData: JSON.stringify(item) // Pass the whole object to pre-fill form
              }
            });
          }}
        >
          <Ionicons name="create-outline" size={20} color="#666" />
        </TouchableOpacity>

        {/* DELETE BUTTON */}
        <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item._id)}>
          <Ionicons name="trash-outline" size={20} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
// --- 3. MAIN COMPONENT ---
export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Metrics State (Calculated from fetched data)
  const [metrics, setMetrics] = useState({ revenue: 0, rating: "0.0", sales: 0 });

  const { token, user } = useAuth();
  const categories = ["All", "Fast Food", "Italian", "Beverages", "Snacks", "Healthy", "Desserts"];

  // --- NEW: HANDLE DELETE FUNCTION ---
  const handleDelete = async (id: string) => {
    if (!user?.userUUID) return;
    debugger
    console.log("Deleting product with ID:", id);
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // 1. Optimistic Update (Remove from UI immediately)
              const previousProducts = [...products];
              setProducts(products.filter(p => p._id !== id));

              // 2. Call API
              const response = await fetch(`${API_BASE_URL}/admin/shop/product/deleteProduct/${id}?userUUID=${user?.userUUID}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              const data = await response.json();

              if (!response.ok) {
                // If failed, revert UI
                setProducts(previousProducts);
                Alert.alert("Error", data.message || "Failed to delete product");
              } else {
                // Success - Recalculate metrics
                calculateMetrics(products.filter(p => p._id !== id));
              }
            } catch (error) {
              console.error("Delete Error:", error);
              Alert.alert("Error", "Network error while deleting");
            }
          }
        }
      ]
    );
  };

  // --- SERVER SIDE FETCH FUNCTION ---
  // Accepts arguments to ensure we fetch with the LATEST values, not stale state
  const fetchProducts = useCallback(async (query = "", category = "All") => {
    if (!user?.userUUID) return;

    setLoading(true);
    try {
      // Build Query Parameters
      const queryParams = new URLSearchParams();

      // Only append search if it's not empty
      if (query.trim()) {
        queryParams.append("search", query.trim());
      }

      // Only append category if it's not "All"
      if (category !== "All") {
        queryParams.append("category", category);
      }

      // Append default params
      queryParams.append("limit", "10"); // Fetch reasonable amount
      queryParams.append("sortBy", "createdAt");

      const url = `${API_BASE_URL}/admin/shop/product/getProduct/${user.userUUID}?${queryParams.toString()}`;

      console.log("Fetching URL:", url); // Debugging

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const productList = data.products || [];
        setProducts(productList);
        calculateMetrics(productList);
      } else {
        setProducts([]); // Clear list if error/empty
      }
    } catch (error: any) {
      console.error("Network Error:", error);
      Alert.alert("Error", "Failed to load products.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, user?.userUUID]);

  // --- METRICS CALCULATION (Client Side on Filtered Data) ---
  const calculateMetrics = (items: Product[]) => {
    const totalRev = items.reduce((sum, p) => sum + (p.price * (p.totalOrders || 0)), 0);
    const totalSale = items.reduce((sum, p) => sum + (p.totalOrders || 0), 0);
    const avgRating = items.length > 0
      ? (items.reduce((sum, p) => sum + (p.rating || 0), 0) / items.length).toFixed(1)
      : "0.0";

    setMetrics({ revenue: totalRev, sales: totalSale, rating: avgRating });
  }

  // Initial Load
  useEffect(() => {
    fetchProducts(searchQuery, selectedCategory);
  }, []); // Run once on mount

  // --- HANDLERS ---

  // 1. Handle "Enter" Key or Search Button Click
  const handleSearchSubmit = () => {
    fetchProducts(searchQuery, selectedCategory);
  };

  // 2. Handle Category Click (Instant Fetch)
  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    // Pass 'cat' directly to ensure we fetch with the new category immediately
    // Pass 'searchQuery' to keep the current search term active while changing category
    fetchProducts(searchQuery, cat);
  };

  // 3. Pull to Refresh (Refreshes with current filters)
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts(searchQuery, selectedCategory);
  }, [fetchProducts, searchQuery, selectedCategory]);



  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Products</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => router.push("/add-product")}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4CAF50"]} />}
      >
        {/* SEARCH & CATEGORY TABS (Same as before) */}
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={handleSearchSubmit}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryTab, selectedCategory === cat && styles.categoryTabActive]}
                onPress={() => handleCategorySelect(cat)}
              >
                <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* LOADING & GRID */}
        {loading ? (
          <View style={{ padding: 40 }}><ActivityIndicator size="large" color="#4CAF50" /></View>
        ) : (
          <View style={styles.productsGrid}>
            {products.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No products found</Text>
              </View>
            ) : (
              products.map((item) => (
                <ProductCard
                  key={item._id}
                  item={item}
                  onDelete={handleDelete} // Pass the function here
                />
              ))
            )}
          </View>
        )}

        {/* METRICS & BOTTOM PADDING */}
        {products.length > 0 && !loading && (
          <View style={styles.metricsSection}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}><Text style={styles.metricValue}>{metrics.sales}</Text><Text style={styles.metricLabel}>Orders</Text></View>
              <View style={styles.metricCard}><Text style={styles.metricValue}>{metrics.rating}</Text><Text style={styles.metricLabel}>Rating</Text></View>
              <View style={styles.metricCard}><Text style={styles.metricValue}>₹{metrics.revenue}</Text><Text style={styles.metricLabel}>Revenue</Text></View>
            </View>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  center: { justifyContent: 'center', alignItems: 'center' },

  // Header
  header: { backgroundColor: "#FFFFFF", paddingTop: 40, paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#E0E0E0", elevation: 2 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700", color: "#333" },
  addBtn: { backgroundColor: "#4CAF50", width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },

  content: { flex: 1 },

  // Search
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", margin: 16, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: "#E0E0E0", height: 48 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: "#333", paddingVertical: 12, },

  // Categories
  categoryTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#E0E0E0", marginRight: 0 },
  categoryTabActive: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  categoryText: { fontSize: 13, color: "#666", fontWeight: "500" },
  categoryTextActive: { color: "#FFF", fontWeight: "600" },

  // Stats
  quickStats: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: "#FFFFFF", paddingVertical: 12, borderRadius: 12, marginHorizontal: 4, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 1 },
  statNumber: { fontSize: 18, fontWeight: "bold", marginBottom: 2 },
  statLabel: { fontSize: 11, color: "#888" },

  // Section Header
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#333" },

  // Grid
  productsGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 10, justifyContent: "space-between" },
  productCard: { width: "48%", backgroundColor: "#FFFFFF", borderRadius: 12, marginBottom: 16, padding: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, borderWidth: 1, borderColor: "#F0F0F0" },

  // Card Content
  productImageContainer: { position: "relative", width: "100%", height: 110, borderRadius: 8, marginBottom: 8, overflow: "hidden", backgroundColor: '#f0f0f0' },
  productImage: { width: "100%", height: "100%" },
  ratingBadge: { position: "absolute", top: 6, right: 6, flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)", paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  ratingText: { color: "#FFFFFF", fontSize: 10, fontWeight: "600", marginLeft: 3 },

  productInfo: { flex: 1 },
  productName: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 2, height: 36 },
  productCategory: { fontSize: 11, color: "#888", marginBottom: 6 },
  productPrice: { fontSize: 15, fontWeight: "700", color: "#4CAF50", marginBottom: 6 },

  productStats: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  statItem: { flexDirection: "row", alignItems: "center" },
  statText: { fontSize: 10, color: "#666", marginLeft: 2 },

  stockBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  stockText: { fontSize: 9, color: "#FFFFFF", fontWeight: "700" },
  stockCount: { fontSize: 10, color: "#999", marginTop: 2 },

  // Actions
  actionBtns: { flexDirection: "row", justifyContent: "space-around", marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#F5F5F5" },
  editBtn: { padding: 4 },
  deleteBtn: { padding: 4 },

  // Metrics
  metricsSection: { backgroundColor: "#FFFFFF", margin: 16, padding: 16, borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  metricsGrid: { flexDirection: "row", justifyContent: "space-between" },
  metricCard: { alignItems: "center", flex: 1 },
  metricValue: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 4 },
  metricLabel: { fontSize: 12, color: "#666" },

  // Empty State
  emptyState: { alignItems: "center", paddingVertical: 40, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 18, fontWeight: "600", color: "#666", marginTop: 12, marginBottom: 8 },
  emptyText: { fontSize: 14, color: "#999", textAlign: "center" },
});