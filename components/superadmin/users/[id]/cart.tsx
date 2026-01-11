import AppHeader from "@/components/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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
            <Text style={styles.summaryLabel}>Cart Value</Text>
            <Text style={styles.summaryValue}>₹{totalValue}</Text>
        </View>
        <TouchableOpacity style={styles.offerButton}>
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
            <Image source={{ uri: item.image }} style={styles.itemImg} />
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>Qty: {item.qty}  •  Unit: ₹{item.price}</Text>
            </View>
            <Text style={styles.itemTotal}>₹{item.price * item.qty}</Text>
          </View>
        )}
        ListEmptyComponent={
            <View style={styles.empty}>
                <Ionicons name="cart-outline" size={48} color="#D1D5DB" />
                <Text style={{color: "#9CA3AF", marginTop: 10}}>Cart is empty</Text>
            </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  summaryCard: {
    margin: 16, padding: 20, backgroundColor: "#2563EB", borderRadius: 16,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center"
  },
  summaryLabel: { color: "#BFDBFE", fontSize: 12, fontWeight: "600" },
  summaryValue: { color: "#fff", fontSize: 24, fontWeight: "700" },
  offerButton: { 
    backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 16, paddingVertical: 10, 
    borderRadius: 8, flexDirection: "row", gap: 6, alignItems: "center" 
  },
  offerText: { color: "#fff", fontWeight: "600" },

  itemCard: {
    backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 12,
    flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3
  },
  itemImg: { width: 50, height: 50, borderRadius: 8, backgroundColor: "#F3F4F6" },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 14, fontWeight: "600", color: "#111827" },
  itemMeta: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  itemTotal: { fontSize: 15, fontWeight: "700", color: "#10B981" },
  empty: { alignItems: "center", marginTop: 50 },
});