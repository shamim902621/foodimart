import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const ProductCard = ({ item }) => {
  const getStockColor = (stock, status) => {
    if (status === 'out-of-stock') return '#FF6B6B';
    if (stock < 10) return '#FFA500';
    return '#4CAF50';
  };

  const getStockText = (stock, status) => {
    if (status === 'out-of-stock') return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'Available';
  };

  return (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
        
        <View style={styles.productStats}>
          <View style={styles.statItem}>
            <Ionicons name="trending-up" size={12} color="#666" />
            <Text style={styles.statText}>{item.sales} sold</Text>
          </View>
          <View style={[styles.stockBadge, { backgroundColor: getStockColor(item.stock, item.status) }]}>
            <Text style={styles.stockText}>
              {getStockText(item.stock, item.status)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.stockCount}>{item.stock} units</Text>
      </View>

      <View style={styles.actionBtns}>
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="create-outline" size={18} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([
    { 
      id: "1", 
      name: "Veg Supreme Burger", 
      price: 120,
      category: "Fast Food",
      stock: 15,
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=300&fit=crop",
      status: "available",
      rating: 4.5,
      sales: 124
    },
    { 
      id: "2", 
      name: "Margherita Pizza", 
      price: 240,
      category: "Italian",
      stock: 8,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop",
      status: "available",
      rating: 4.8,
      sales: 89
    },
    { 
      id: "3", 
      name: "Chocolate Milkshake", 
      price: 90,
      category: "Beverages",
      stock: 0,
      image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=300&fit=crop",
      status: "out-of-stock",
      rating: 4.3,
      sales: 67
    },
    { 
      id: "4", 
      name: "Crispy French Fries", 
      price: 60,
      category: "Snacks",
      stock: 22,
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=300&fit=crop",
      status: "available",
      rating: 4.2,
      sales: 156
    },
    { 
      id: "5", 
      name: "Grilled Chicken Sandwich", 
      price: 180,
      category: "Fast Food",
      stock: 5,
      image: "https://images.unsplash.com/photo-1606755962773-d324e74534a2?w=300&h=300&fit=crop",
      status: "available",
      rating: 4.6,
      sales: 92
    },
    { 
      id: "6", 
      name: "Fresh Fruit Salad", 
      price: 110,
      category: "Healthy",
      stock: 12,
      image: "https://images.unsplash.com/photo-1564093497595-593b96d80180?w=300&h=300&fit=crop",
      status: "available",
      rating: 4.4,
      sales: 78
    },
  ]);

  const categories = ["All", "Fast Food", "Italian", "Beverages", "Snacks", "Healthy"];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalRevenue = products.reduce((sum, product) => sum + (product.price * product.sales), 0);
  const averageRating = (products.reduce((sum, product) => sum + product.rating, 0) / products.length).toFixed(1);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Products Management</Text>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => router.push("/add-product")}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{products.filter(p => p.status === 'available').length}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{products.filter(p => p.stock < 10 && p.status !== 'out-of-stock').length}</Text>
            <Text style={styles.statLabel}>Low Stock</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{products.filter(p => p.status === 'out-of-stock').length}</Text>
            <Text style={styles.statLabel}>Out of Stock</Text>
          </View>
        </View>

        {/* Products Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Products ({filteredProducts.length})</Text>
          <TouchableOpacity style={styles.sortBtn}>
            <Text style={styles.sortText}>Sort</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="inventory-2" size={60} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Try adjusting your search terms' : 'No products match the selected category'}
            </Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {filteredProducts.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </View>
        )}

        {/* Performance Metrics */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>₹{totalRevenue.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>Total Revenue</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{averageRating}</Text>
              <Text style={styles.metricLabel}>Avg Rating</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>
                {products.reduce((sum, product) => sum + product.sales, 0)}
              </Text>
              <Text style={styles.metricLabel}>Total Sales</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F5F5F5", 
  },
  header: { 
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { 
    fontSize: 24, 
    fontWeight: "600", 
    color: "#333333",
  },
  addBtn: { 
    backgroundColor: "#4CAF50", 
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  quickStats: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sortText: {
    fontSize: 14,
    color: "#666666",
    marginRight: 4,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  productImageContainer: {
    position: "relative",
    width: "100%",
    height: 100,
    borderRadius: 6,
    marginBottom: 8,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  ratingBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 2,
  },
  productInfo: {
    flex: 1,
  },
  productName: { 
    fontSize: 14, 
    fontWeight: "500", 
    color: "#333333",
    marginBottom: 2,
  },
  productCategory: { 
    fontSize: 11, 
    color: "#666666",
    marginBottom: 4,
  },
  productPrice: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#4CAF50",
    marginBottom: 6,
  },
  productStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 10,
    color: "#666666",
    marginLeft: 2,
  },
  stockBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 9,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  stockCount: {
    fontSize: 10,
    color: "#666666",
  },
  actionBtns: { 
    flexDirection: "row", 
    justifyContent: "space-around",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  editBtn: {
    padding: 6,
  },
  deleteBtn: {
    padding: 6,
  },
  metricsSection: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricCard: {
    alignItems: "center",
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666666",
    marginTop: 12,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
  },
});