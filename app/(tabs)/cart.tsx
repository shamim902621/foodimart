import BackButton from '@/components/back-button';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../lib/apiService";

// ==========================================
// 1. API FUNCTIONS (Keep inside this file for simplicity)
// ==========================================

// ✅ Get All Carts (Returns Array of Carts)
export async function getCarts(userUUID: string) {
  if (!userUUID) throw new Error("User ID is missing");

  const res: any = await api(`/users/cart/getcart/${userUUID}`);
  if (!res.success) throw new Error(res.message);

  // Ensure we always return an array
  return res.carts || [];
}

// ✅ Update Quantity (PATCH)
export async function updateCartItem(userUUID: string, productId: string, quantity: number) {
  const res: any = await api(`/users/cart/patch/${userUUID}`, "PATCH", {
    productId,
    quantity
  });
  return res; // Expected: { success: true, cart: {...}, isEmpty: boolean }
}

// ✅ Remove Item (DELETE)
export async function removeCartItem(userUUID: string, productId: string) {
  const res: any = await api(`/users/cart/remove/${userUUID}/${productId}`, "DELETE");
  return res; // Expected: { success: true, cart: {...}, isEmpty: boolean }
}

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

export default function CartScreen() {
  const [carts, setCarts] = useState<any[]>([]); // Array to store multiple carts
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth(); // Get logged-in user

  // --- Initial Load ---
  useEffect(() => {
    if (user?.userUUID) {
      loadCarts();
    }
  }, [user?.userUUID]);

  const loadCarts = async () => {
    try {
      // 2. Strict Check (Recommended)
      if (user?.userUUID) {
        setLoading(true);
        const data = await getCarts(user!.userUUID);
        setCarts(data);
      }
    } catch (e) {
      console.log("Failed to load carts", e);
      setCarts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (user?.userUUID) loadCarts();
  }, [user]);

  // --- HANDLER: Update Quantity ---
  const handleUpdateQuantity = async (cartId: string, productId: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty < 1) return; // Prevent going below 1 (Use trash icon for removal)
    // 2. Strict Check (Recommended)

    try {
      if (user?.userUUID) {

        // 1. Call API
        const res = await updateCartItem(user!.userUUID, productId, newQty);

        if (res.success) {
          // 2. Update Local State (No full reload to prevent flicker)
          setCarts(prevCarts => {
            // If the cart became empty/deleted, remove it from list
            if (res.isEmpty) {
              return prevCarts.filter(c => c._id !== cartId);
            }
            // Otherwise, update the specific cart
            return prevCarts.map(c => c._id === cartId ? res.cart : c);
          });
        }
      }
    } catch (e) {
      Alert.alert("Error", "Failed to update quantity");
    }
  };

  // --- HANDLER: Remove Item ---
  const handleRemoveItem = async (cartId: string, productId: string) => {
    try {
      // 1. Call API
      if (user?.userUUID) {
        const res = await removeCartItem(user!.userUUID, productId);
        if (res.success) {
          // 2. Update Local State
          setCarts(prevCarts => {
            if (res.isEmpty) {
              return prevCarts.filter(c => c._id !== cartId);
            }
            return prevCarts.map(c => c._id === cartId ? res.cart : c);
          });
        }
      }


    } catch (e) {
      Alert.alert("Error", "Failed to remove item");
    }
  };

  // --- RENDER LOADING ---
  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  // --- RENDER EMPTY STATE ---
  if (!carts || carts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Add items from different shops to get started!</Text>
        <TouchableOpacity style={styles.shopButton} onPress={() => router.replace("/home")}>
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- RENDER MAIN UI ---
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>My Carts ({carts.length})</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >

        {/* Loop through ALL Carts (One Card per Shop) */}
        {carts.map((cart, index) => (
          <View key={cart._id} style={styles.cartCard}>

            {/* 1. Shop Header */}
            <View style={styles.shopHeader}>
              <View style={styles.shopInfo}>
                <View style={styles.shopIcon}>
                  <Ionicons name="storefront" size={20} color="#FFF" />
                </View>
                <View>
                  {/* You can populate actual Shop Name from backend later */}
                  <Text style={styles.shopName}>Order #{index + 1}</Text>
                  <Text style={styles.shopSubtext}>{cart.items.length} Items • ₹{cart.total}</Text>
                </View>
              </View>
            </View>

            {/* 2. Items List inside this Cart */}
            {cart.items.map((item: any) => (
              <View key={item.productId} style={styles.itemRow}>
                {/* Image */}
                <Image
                  source={{ uri: item.image || "https://via.placeholder.com/60" }}
                  style={styles.itemImage}
                />

                {/* Name & Price */}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemPriceSingle}>₹{item.price} x {item.quantity}</Text>
                  {item.customizations ? <Text style={styles.customText}>{item.customizations}</Text> : null}
                </View>

                {/* Controls (Qty & Delete) */}
                <View style={styles.controlsRight}>
                  {/* Quantity */}
                  <View style={styles.qtyContainer}>
                    <TouchableOpacity onPress={() => handleUpdateQuantity(cart._id, item.productId, item.quantity, -1)}>
                      <Ionicons name="remove-circle-outline" size={24} color="#FF6B35" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => handleUpdateQuantity(cart._id, item.productId, item.quantity, 1)}>
                      <Ionicons name="add-circle" size={24} color="#FF6B35" />
                    </TouchableOpacity>
                  </View>

                  {/* Delete */}
                  <TouchableOpacity onPress={() => handleRemoveItem(cart._id, item.productId)} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* 3. Bill & Checkout Action */}
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.totalLabel}>Total to Pay</Text>
                <Text style={styles.totalValue}>₹{cart.total}</Text>
              </View>

              <TouchableOpacity
                style={styles.checkoutBtn}
                // ✅ Proceed to Checkout with SPECIFIC Cart ID
                onPress={() => router.push({ pathname: "/user/dashboard/checkout", params: { cartId: cart._id } })}
              >
                <Text style={styles.checkoutText}>Proceed</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>

          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

// ==========================================
// 3. STYLES
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Header
  header: {
    flexDirection: "row", alignItems: "center", paddingTop: 50, paddingBottom: 15,
    paddingHorizontal: 20, backgroundColor: "#FFF", elevation: 2, borderBottomWidth: 1, borderBottomColor: '#EEE'
  },
  headerTitle: { fontSize: 20, fontWeight: "700", marginLeft: 16, color: "#333" },

  scrollView: { flex: 1, padding: 16 },

  // Empty State
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#FFF" },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: "700", marginBottom: 8, color: "#333" },
  emptySubtitle: { fontSize: 14, color: "#666", marginBottom: 24, textAlign: 'center' },
  shopButton: { backgroundColor: "#FF6B35", paddingVertical: 12, paddingHorizontal: 32, borderRadius: 12 },
  shopButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },

  // --- CART CARD ---
  cartCard: {
    backgroundColor: "#FFF", borderRadius: 16, padding: 16, marginBottom: 20,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 3
  },

  // Shop Header inside Card
  shopHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0'
  },
  shopInfo: { flexDirection: 'row', alignItems: 'center' },
  shopIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF6B35',
    justifyContent: 'center', alignItems: 'center', marginRight: 12
  },
  shopName: { fontSize: 16, fontWeight: '700', color: '#333' },
  shopSubtext: { fontSize: 12, color: '#888', marginTop: 2 },

  // Item Row
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  itemImage: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#eee' },
  itemInfo: { flex: 1, paddingHorizontal: 12 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#333' },
  itemPriceSingle: { fontSize: 12, color: '#666', marginTop: 2 },
  customText: { fontSize: 10, color: '#999', marginTop: 2, fontStyle: 'italic' },

  controlsRight: { alignItems: 'flex-end' },

  // Qty Control
  qtyContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0E6', borderRadius: 20, paddingHorizontal: 4, paddingVertical: 2 },
  qtyText: { fontSize: 14, fontWeight: '600', marginHorizontal: 8, color: '#333' },

  deleteBtn: { marginTop: 8, padding: 4 },

  // Card Footer (Checkout)
  cardFooter: {
    marginTop: 10, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F9F9F9',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  totalLabel: { fontSize: 12, color: '#666' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#333' },

  checkoutBtn: {
    backgroundColor: '#2E7D32', flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 20, borderRadius: 24
  },
  checkoutText: { color: '#FFF', fontWeight: '700', fontSize: 14, marginRight: 6 }
});