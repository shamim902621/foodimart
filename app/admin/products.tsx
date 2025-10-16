import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Products() {
  const products = [
    { 
      id: "1", 
      name: "Veg Burger", 
      price: 120,
      category: "Fast Food",
      stock: 15,
      image: "🍔",
      status: "available"
    },
    { 
      id: "2", 
      name: "Cheese Pizza", 
      price: 240,
      category: "Italian",
      stock: 8,
      image: "🍕",
      status: "available"
    },
    { 
      id: "3", 
      name: "Chocolate Shake", 
      price: 90,
      category: "Beverages",
      stock: 0,
      image: "🥤",
      status: "out-of-stock"
    },
    { 
      id: "4", 
      name: "French Fries", 
      price: 60,
      category: "Snacks",
      stock: 22,
      image: "🍟",
      status: "available"
    },
  ];

  const getStockColor = (stock, status) => {
    if (status === 'out-of-stock') return '#E74C3C';
    if (stock < 10) return '#F39C12';
    return '#2ECC71';
  };

  const getStockText = (stock, status) => {
    if (status === 'out-of-stock') return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🛍 Products Management</Text>
          <Text style={styles.subtitle}>{products.length} products in store</Text>
        </View>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => router.push("/add-product")}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatNumber}>{products.filter(p => p.status === 'available').length}</Text>
          <Text style={styles.quickStatLabel}>Available</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatNumber}>{products.filter(p => p.stock < 10 && p.status !== 'out-of-stock').length}</Text>
          <Text style={styles.quickStatLabel}>Low Stock</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatNumber}>{products.filter(p => p.status === 'out-of-stock').length}</Text>
          <Text style={styles.quickStatLabel}>Out of Stock</Text>
        </View>
      </View>

      {/* Products List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={styles.productImage}>
              <Text style={styles.productEmoji}>{item.image}</Text>
            </View>
            
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productCategory}>{item.category}</Text>
              <Text style={styles.productPrice}>₹{item.price}</Text>
              
              <View style={styles.productMeta}>
                <View style={[styles.stockBadge, { backgroundColor: getStockColor(item.stock, item.status) }]}>
                  <Text style={styles.stockText}>
                    {getStockText(item.stock, item.status)}
                  </Text>
                </View>
                <Text style={styles.stockCount}>{item.stock} units</Text>
              </View>
            </View>

            <View style={styles.actionBtns}>
              <TouchableOpacity 
                style={styles.editBtn}
                onPress={() => router.push(`/edit-product/${item.id}`)}
              >
                <Ionicons name="create-outline" size={18} color="#2ECC71" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={18} color="#E74C3C" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8F9FA", 
    padding: 16 
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "flex-start",
    marginBottom: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#2ECC71",
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  addBtn: { 
    backgroundColor: "#2ECC71", 
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10, 
    borderRadius: 8,
    gap: 6,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickStat: {
    alignItems: "center",
  },
  quickStatNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  quickStatLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 4,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 50,
    height: 50,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  productEmoji: {
    fontSize: 24,
  },
  productInfo: {
    flex: 1,
  },
  productName: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#2C3E50",
    marginBottom: 2,
  },
  productCategory: { 
    fontSize: 14, 
    color: "#7F8C8D",
    marginBottom: 4,
  },
  productPrice: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#2ECC71",
    marginBottom: 6,
  },
  productMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stockText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  stockCount: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  actionBtns: { 
    flexDirection: "row", 
    gap: 8, 
    alignItems: "center" 
  },
  editBtn: {
    padding: 8,
    backgroundColor: "#F0F8F0",
    borderRadius: 6,
  },
  deleteBtn: {
    padding: 8,
    backgroundColor: "#FEF0F0",
    borderRadius: 6,
  },
});