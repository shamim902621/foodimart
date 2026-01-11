import AppHeader from "@/components/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserCart() {
  const { id } = useLocalSearchParams();
  
  // Dummy Data (Replace with API fetch: /superadmin/users/[id]/cart)
  const cartItems = [
    { id: "1", name: "Premium Basmati Rice", price: 1200, qty: 2, image: "https://via.placeholder.com/100" },
    { id: "2", name: "Sunflower Oil 5L", price: 850, qty: 1, image: "https://via.placeholder.com/100" },
    { id: "3", name: "Spicy Chips Pack", price: 40, qty: 5, image: "https://via.placeholder.com/100" },
  ];

  const totalValue = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <View style={styles.container}>
      <AppHeader title="Live Cart" showBack={false} />
      
      {/* Cart Summary */}
      <View style={styles.summaryCard}>
        <View>
            <Text style={styles.summaryLabel}>Current Cart Value</Text>
            <Text style={styles.summaryValue}>₹{totalValue.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.offerButton} onPress={() => alert("Offer sent to user!")}>
            <Ionicons name="gift-outline" size={18} color="#fff" />
            <Text style={styles.offerText}>Send Offer</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={cartItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            {/* Image Placeholder */}
            <View style={styles.itemImg}>
                <Ionicons name="image-outline" size={24} color="#ccc" />
            </View>
            
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>Qty: {item.qty}  •  Unit: ₹{item.price}</Text>
            </View>
            <Text style={styles.itemTotal}>₹{item.price * item.qty}</Text>
          </View>
        )}
        ListEmptyComponent={
            <View style={styles.empty}>
                <View style={styles.emptyIconBg}>
                    <Ionicons name="cart-outline" size={48} color="#9CA3AF" />
                </View>
                <Text style={styles.emptyText}>User's cart is empty</Text>
            </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  
  // Summary Blue Card
  summaryCard: {
    margin: 16, padding: 20, backgroundColor: "#2563EB", borderRadius: 16,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    shadowColor: "#2563EB", shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, elevation: 5
  },
  summaryLabel: { color: "#BFDBFE", fontSize: 12, fontWeight: "600", textTransform: 'uppercase' },
  summaryValue: { color: "#fff", fontSize: 24, fontWeight: "700" },
  offerButton: { 
    backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 16, paddingVertical: 10, 
    borderRadius: 10, flexDirection: "row", gap: 6, alignItems: "center" 
  },
  offerText: { color: "#fff", fontWeight: "600" },

  // Cart Item
  itemCard: {
    backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 12,
    flexDirection: "row", alignItems: "center", 
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
    borderWidth: 1, borderColor: '#F3F4F6'
  },
  itemImg: { 
    width: 50, height: 50, borderRadius: 8, backgroundColor: "#F3F4F6", 
    justifyContent: 'center', alignItems: 'center' 
  },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 14, fontWeight: "600", color: "#111827" },
  itemMeta: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  itemTotal: { fontSize: 15, fontWeight: "700", color: "#10B981" },

  // Empty State
  empty: { alignItems: "center", marginTop: 80 },
  emptyIconBg: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyText: { color: "#6B7280", fontSize: 16, fontWeight: '500' },
});