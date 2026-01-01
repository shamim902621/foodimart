// import BackButton from '@/components/back-button';
// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import { useEffect, useState } from "react";
// import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { api } from "../lib/apiService";


// // ✅ Get Cart
// export async function getCart() {
//   const res: any = await api("/users/cart/getcart");
//   if (!res.success) throw new Error(res.message);
//   return res.cart;
// }

// // ✅ Add to Cart
// export async function addToCart(payload: {
//   productId: string;
//   quantity: number;
//   customizations?: string;
// }) {
//   const res: any = await api("/users/cart/addcart", "POST", payload);
//   if (!res.success) throw new Error(res.message);
//   return res.cart;
// }

// // ✅ Update Quantity
// export async function updateCartItem(productId: string, quantity: number) {
//   const res: any = await api("/users/cart/item", "PATCH", {
//     productId,
//     quantity,
//   });
//   if (!res.success) throw new Error(res.message);
//   return res.cart;
// }

// // ✅ Remove Item
// export async function removeCartItem(productId: string) {
//   const res: any = await api(`/users/cart/remove/${productId}`, "DELETE");
//   if (!res.success) throw new Error(res.message);
//   return res.cart;
// }

// // ✅ Clear Cart
// export async function clearCart() {
//   const res: any = await api("/users/cart/clear", "DELETE");
//   if (!res.success) throw new Error(res.message);
// }


// export default function CartScreen() {
//   // const cartItems = [
//   //   {
//   //     id: 1,
//   //     name: "Chicken Burger Meal",
//   //     restaurant: "Burger King",
//   //     price: 300,
//   //     quantity: 2,
//   //     image: "🍔",
//   //     customization: "Extra cheese, No onions"
//   //   },
//   //   {
//   //     id: 2,
//   //     name: "Margherita Pizza",
//   //     restaurant: "Pizza Palace",
//   //     price: 450,
//   //     quantity: 1,
//   //     image: "🍕",
//   //     customization: "Thin crust"
//   //   },
//   //   {
//   //     id: 3,
//   //     name: "Fresh Fruit Smoothie",
//   //     restaurant: "Healthy Bites",
//   //     price: 180,
//   //     quantity: 1,
//   //     image: "🥤",
//   //     customization: ""
//   //   }
//   // ];

//   const [cart, setCart] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     loadCart();
//   }, []);

//   const loadCart = async () => {
//     try {
//       setLoading(true);
//       const data = await getCart();
//       setCart(data);
//     } catch (e) {
//       console.log("Failed to load cart", e);
//     } finally {
//       setLoading(false);
//     }
//   };


//   // const subtotal = cart.reduce((sum: any, item: any) => sum + (item.price * item.quantity), 0);
//   const subtotal = cart?.subtotal || 0;
//   const deliveryFee = cart?.deliveryFee || 0;
//   const tax = cart?.tax || 0;
//   const total = cart?.total || 0;


//   const updateQuantity = async (productId: string, change: number) => {
//     try {
//       const item = cart.items.find((i: any) => i.productId === productId);
//       const newQty = item.quantity + change;

//       const updatedCart = await updateCartItem(productId, newQty);
//       setCart(updatedCart);
//     } catch (e) {
//       console.log("Quantity update failed", e);
//     }
//   };
//   // const addItemToCart = async () => {
//   //   await addToCart({
//   //     productId,
//   //     quantity,
//   //   });
//   //   router.push("/cart");
//   // };



//   if (!loading && (!cart || cart.items.length === 0)) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text style={styles.emptyEmoji}>🛒</Text>
//         <Text style={styles.emptyTitle}>Your cart is empty</Text>
//         <Text style={styles.emptySubtitle}>Add some delicious items from restaurants</Text>
//         <TouchableOpacity style={styles.shopButton}>
//           <Text style={styles.shopButtonText}>Start Shopping</Text>
//         </TouchableOpacity>

//         {/* <TouchableOpacity onPress={addItemToCart}>
//           <Text>Add Item to Cart</Text>
//         </TouchableOpacity> */}
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>

//       <View style={styles.header}>
//         <BackButton />
//         <Text style={styles.headerTitle}>Your Cart</Text>
//         {/* <Text style={styles.itemCount}>{cart.item.length} items</Text> */}
//       </View>

//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         {/* Cart Items */}
//         <View style={styles.itemsContainer}>
//           {cart?.items.map((item: any) => (
//             <View key={item.productId} style={styles.cartItem}>
//               <View style={styles.itemImage}>
//                 <Text style={styles.itemEmoji}>{item.image}</Text>
//               </View>

//               <View style={styles.itemDetails}>
//                 <Text style={styles.itemName}>{item.name}</Text>
//                 <Text style={styles.restaurantName}>{item.restaurant}</Text>

//                 {item.customization ? (
//                   <Text style={styles.customization}>{item.customization}</Text>
//                 ) : null}

//                 <View style={styles.itemActions}>
//                   <View style={styles.quantityContainer}>
//                     <TouchableOpacity
//                       style={styles.quantityButton}
//                       onPress={() => updateQuantity(item.id, -1)}
//                     >
//                       <Ionicons name="remove" size={16} color="#FF6B35" />
//                     </TouchableOpacity>

//                     <Text style={styles.quantityText}>{item.quantity}</Text>

//                     <TouchableOpacity
//                       style={styles.quantityButton}
//                       onPress={() => updateQuantity(item.id, 1)}
//                     >
//                       <Ionicons name="add" size={16} color="#FF6B35" />
//                     </TouchableOpacity>
//                   </View>

//                   <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
//                 </View>
//               </View>

//               <TouchableOpacity
//                 style={styles.removeButton}
//                 onPress={() => removeCartItem(item.id)}
//               >
//                 <Ionicons name="trash-outline" size={20} color="#FF3B30" />
//               </TouchableOpacity>
//             </View>
//           ))}
//         </View>

//         {/* Delivery Address */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Ionicons name="location-outline" size={20} color="#FF6B35" />
//             <Text style={styles.sectionTitle}>Delivery Address</Text>
//           </View>
//           <View style={styles.addressCard}>
//             <Text style={styles.addressType}>Home</Text>
//             <Text style={styles.addressText}>
//               123 Main Street, Apartment 4B{"\n"}
//               Bangalore, Karnataka 560001
//             </Text>
//             <TouchableOpacity style={styles.changeAddressButton}>
//               <Text style={styles.changeAddressText}>Change</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Payment Summary */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Ionicons name="receipt-outline" size={20} color="#FF6B35" />
//             <Text style={styles.sectionTitle}>Bill Details</Text>
//           </View>

//           <View style={styles.billDetails}>
//             <View style={styles.billRow}>
//               <Text style={styles.billLabel}>Item Total</Text>
//               <Text style={styles.billValue}>₹{subtotal}</Text>
//             </View>

//             <View style={styles.billRow}>
//               <Text style={styles.billLabel}>Delivery Fee</Text>
//               <Text style={styles.billValue}>₹{deliveryFee}</Text>
//             </View>

//             <View style={styles.billRow}>
//               <Text style={styles.billLabel}>Taxes & Charges</Text>
//               <Text style={styles.billValue}>₹{tax.toFixed(2)}</Text>
//             </View>

//             <View style={styles.billRow}>
//               <Text style={styles.billLabel}>Platform Fee</Text>
//               <Text style={styles.billValue}>₹5</Text>
//             </View>

//             <View style={[styles.billRow, styles.totalRow]}>
//               <Text style={styles.totalLabel}>Total Amount</Text>
//               <Text style={styles.totalValue}>₹{(total + 5).toFixed(2)}</Text>
//             </View>
//           </View>
//         </View>
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Ionicons name="pricetag-outline" size={20} color="#FF6B35" />
//             <Text style={styles.sectionTitle}>Offers & Coupons</Text>
//           </View>

//           <TouchableOpacity style={styles.couponCard}>
//             <View style={styles.couponInfo}>
//               <View style={styles.couponBadge}>
//                 <Text style={styles.couponBadgeText}>60% OFF</Text>
//               </View>
//               <Text style={styles.couponText}>Get 60% off up to ₹100</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={20} color="#666" />
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Checkout Footer */}
//       <View style={styles.footer}>
//         <View style={styles.totalContainer}>
//           <Text style={styles.footerTotalLabel}>Total</Text>
//           <Text style={styles.footerTotalAmount}>₹{(total + 5).toFixed(2)}</Text>
//         </View>

//         <TouchableOpacity
//           disabled={!cart || cart.items.length === 0}
//           style={styles.checkoutButton}
//           onPress={() => router.push("/shiping-method")}
//         >

//           <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f8f8",
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 24,
//   },

//   emptyEmoji: {
//     fontSize: 80,
//     marginBottom: 16,
//   },
//   emptyTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 8,
//   },
//   emptySubtitle: {
//     fontSize: 16,
//     color: "#666",
//     textAlign: "center",
//     marginBottom: 32,
//   },
//   shopButton: {
//     backgroundColor: "#328a0dff",
//     paddingHorizontal: 32,
//     paddingVertical: 16,
//     borderRadius: 12,
//   },
//   shopButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   header: {
//     backgroundColor: "#fff",
//     paddingTop: 10,
//     paddingHorizontal: 16,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   itemCount: {
//     fontSize: 14,
//     color: "#666",
//     marginTop: 4,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   itemsContainer: {
//     backgroundColor: "#fff",
//     marginBottom: 8,
//   },
//   cartItem: {
//     flexDirection: "row",
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//     alignItems: "flex-start",
//   },
//   itemImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     backgroundColor: "#f8f8f8",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   itemEmoji: {
//     fontSize: 24,
//   },
//   itemDetails: {
//     flex: 1,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//     marginBottom: 2,
//   },
//   restaurantName: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 4,
//   },
//   customization: {
//     fontSize: 12,
//     color: "#FF6B35",
//     fontStyle: "italic",
//     marginBottom: 8,
//   },
//   itemActions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   quantityContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//     borderRadius: 8,
//   },
//   quantityButton: {
//     padding: 8,
//   },
//   quantityText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#333",
//     paddingHorizontal: 12,
//   },
//   itemPrice: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   removeButton: {
//     padding: 4,
//     marginLeft: 8,
//   },
//   section: {
//     backgroundColor: "#fff",
//     marginBottom: 8,
//     padding: 16,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//     marginLeft: 8,
//   },
//   addressCard: {
//     backgroundColor: "#f8f8f8",
//     padding: 12,
//     borderRadius: 8,
//   },
//   addressType: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#333",
//     marginBottom: 4,
//   },
//   addressText: {
//     fontSize: 14,
//     color: "#666",
//     lineHeight: 20,
//     marginBottom: 8,
//   },
//   changeAddressButton: {
//     alignSelf: "flex-start",
//   },
//   changeAddressText: {
//     color: "#57ff35ff",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   billDetails: {
//     gap: 8,
//   },
//   billRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   billLabel: {
//     fontSize: 14,
//     color: "#666",
//   },
//   billValue: {
//     fontSize: 14,
//     color: "#333",
//     fontWeight: "500",
//   },
//   totalRow: {
//     borderTopWidth: 1,
//     borderTopColor: "#e0e0e0",
//     paddingTop: 12,
//     marginTop: 4,
//   },
//   totalLabel: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   totalValue: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   couponCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#FFF9E6",
//     padding: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#b97003ff",
//   },
//   couponInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   couponBadge: {
//     backgroundColor: "#FF6B35",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//     marginRight: 8,
//   },
//   couponBadgeText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   couponText: {
//     fontSize: 14,
//     color: "#333",
//     fontWeight: "500",
//   },
//   footer: {
//     backgroundColor: "#fff",
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: "#f0f0f0",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   totalContainer: {
//     flex: 1,
//   },
//   footerTotalLabel: {
//     fontSize: 14,
//     color: "#666",
//   },
//   footerTotalAmount: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   checkoutButton: {
//     backgroundColor: "#328a0dff",
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 12,
//     minWidth: 160,
//     alignItems: "center",
//   },
//   checkoutButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });


import BackButton from '@/components/back-button';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image, // Added Image import
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { api } from "../lib/apiService";

// --- API FUNCTIONS ---

// ✅ Get Cart
export async function getCart() {
  const res: any = await api("/users/cart/getcart");
  if (!res.success) throw new Error(res.message);
  return res.cart;
}

// ✅ Update Quantity
export async function updateCartItem(productId: string, quantity: number) {
  const res: any = await api("/users/cart/item", "PATCH", {
    productId,
    quantity,
  });
  if (!res.success) throw new Error(res.message);
  return res.cart;
}

// ✅ Remove Item
export async function removeCartItem(productId: string) {
  const res: any = await api(`/users/cart/remove/${productId}`, "DELETE");
  if (!res.success) throw new Error(res.message);
  return res.cart;
}

// --- MAIN COMPONENT ---

export default function CartScreen() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data);
    } catch (e) {
      console.log("Failed to load cart", e);
      // Optional: Handle empty cart error specifically if backend throws 404 for empty
      setCart(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCart();
  }, []);

  // Handler for Quantity Change
  const handleUpdateQuantity = async (productId: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;

    // If quantity goes to 0, ask to remove or just return (logic depends on your preference)
    if (newQty < 1) return;

    try {
      // Optimistic update (optional) or just wait for loader
      const updatedCart = await updateCartItem(productId, newQty);
      setCart(updatedCart);
    } catch (e) {
      console.log("Quantity update failed", e);
      alert("Failed to update quantity");
    }
  };

  // Handler for Remove Item
  const handleRemoveItem = async (productId: string) => {
    try {
      const updatedCart = await removeCartItem(productId);
      setCart(updatedCart);
    } catch (e) {
      console.log("Remove failed", e);
      alert("Failed to remove item");
    }
  };

  // --- RENDERING ---

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  // Check if cart is empty or items array is empty
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Add some delicious items from restaurants</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => router.replace("/home")} // Navigate back to home/shop
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Extract totals with fallbacks
  const subtotal = cart?.subtotal || 0;
  const deliveryFee = cart?.deliveryFee || 0;
  const tax = cart?.tax || 0;
  const platformFee = cart?.platformFee || 0;
  const total = cart?.total || 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Your Cart</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Cart Items List */}
        <View style={styles.itemsContainer}>
          {cart.items.map((item: any) => (
            <View key={item.productId} style={styles.cartItem}>

              {/* Image Handling */}
              <View style={styles.itemImageContainer}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={{ fontSize: 24 }}>🍽️</Text>
                  </View>
                )}
              </View>

              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>

                {/* API doesn't return restaurant name in items array usually, removing or using hardcoded/shopId logic */}
                {/* <Text style={styles.restaurantName}>Restaurant Name</Text> */}

                {item.customizations ? (
                  <Text style={styles.customization} numberOfLines={1}>
                    {item.customizations}
                  </Text>
                ) : null}

                <View style={styles.itemActions}>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleUpdateQuantity(item.productId, item.quantity, -1)}
                    >
                      <Ionicons name="remove" size={16} color="#FF6B35" />
                    </TouchableOpacity>

                    <Text style={styles.quantityText}>{item.quantity}</Text>

                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleUpdateQuantity(item.productId, item.quantity, 1)}
                    >
                      <Ionicons name="add" size={16} color="#FF6B35" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.productId)}
              >
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Delivery Address (Hardcoded for now) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={20} color="#FF6B35" />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <View style={styles.addressCard}>
            <Text style={styles.addressType}>Home</Text>
            <Text style={styles.addressText}>
              123 Main Street, Apartment 4B{"\n"}
              Bangalore, Karnataka 560001
            </Text>
            <TouchableOpacity style={styles.changeAddressButton}>
              <Text style={styles.changeAddressText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bill Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt-outline" size={20} color="#FF6B35" />
            <Text style={styles.sectionTitle}>Bill Details</Text>
          </View>

          <View style={styles.billDetails}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item Total</Text>
              <Text style={styles.billValue}>₹{subtotal}</Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={styles.billValue}>₹{deliveryFee}</Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Taxes</Text>
              <Text style={styles.billValue}>₹{tax}</Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Platform Fee</Text>
              <Text style={styles.billValue}>₹{platformFee}</Text>
            </View>

            <View style={[styles.billRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{total}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.footerTotalLabel}>Total</Text>
          <Text style={styles.footerTotalAmount}>₹{total}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => router.push("/shiping-method")}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  itemsContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  customization: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0E6",
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    padding: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 12,
    color: "#FF6B35",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: "#1A1A1A",
  },
  addressCard: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
  },
  addressType: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  changeAddressButton: {
    alignSelf: "flex-start",
  },
  changeAddressText: {
    fontSize: 14,
    color: "#FF6B35",
    fontWeight: "500",
  },
  billDetails: {
    gap: 12,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  billLabel: {
    fontSize: 14,
    color: "#666",
  },
  billValue: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF6B35",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingBottom: 30, // Safe area
  },
  totalContainer: {
    flex: 1,
  },
  footerTotalLabel: {
    fontSize: 12,
    color: "#666",
  },
  footerTotalAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  checkoutButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1.5,
    marginLeft: 16,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});