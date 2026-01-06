import BackButton from '@/components/back-button';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { api } from "../lib/apiService";

// --- API HELPER FUNCTIONS ---

export async function getProductById(_id: string) {
  const res: any = await api(`/users/shops/products/product/${_id}`);
  if (!res.success) throw new Error(res.message);
  return res.data;
}

export async function getCart() {
  const res: any = await api("/users/cart/getcart");
  // Backend might return null if no cart, handle gracefully
  return res.success ? res.cart : null;
}

export async function clearCart() {
  const userData = await AsyncStorage.getItem('userData');
  const user = JSON.parse(userData || '{}');
  await api(`/users/cart/clear/${user.userUUID}`, "DELETE");
}

export async function addToCartAPI(payload: any) {
  const userData = await AsyncStorage.getItem('userData');
  const user = JSON.parse(userData || '{}');
  const res: any = await api(`/users/cart/addcart/${user.userUUID}`, "POST", payload);

  // Catch 409 Conflict (Different Shop)
  if (!res.success) {
    throw { message: res.message, status: res.status || 400, errorType: res.errorType };
  }
  return res.cart;
}

// --- MAIN COMPONENT ---

export default function ProductDetailScreen() {
  const { _id } = useLocalSearchParams<{ _id: string }>();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [isInCart, setIsInCart] = useState(false); // Track if item exists

  useEffect(() => {
    if (_id) loadData();
  }, [_id]);

  const loadData = async () => {
    try {
      setLoading(true);

      // 1. Load Product
      const productData = await getProductById(_id);
      setProduct(productData.product);

      // 2. Load Cart to check if this item is already there
      const cartData = await getCart();
      if (cartData && cartData.items) {
        // Check if ANY item in cart matches this product ID
        const exists = cartData.items.find((item: any) => item.productId === _id);
        if (exists) {
          setIsInCart(true);
          setQuantity(exists.quantity); // Sync quantity
        }
      }
    } catch (err) {
      console.log("❌ Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantityLocal = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  // --- HANDLE ADD TO CART ---
  const phandleAddToCart = async () => {
    try {
      await addToCartAPI({
        product_Id: _id,
        quantity: quantity,
        customizations: "",
      });

      // Success! Go to cart
      router.push("/cart");

    } catch (error: any) {
      // ✅ Handle Different Shop Warning
      if (error.errorType === "DIFFERENT_SHOP" || error.message?.includes("another shop")) {
        Alert.alert(
          "Start New Order?",
          "Your cart contains items from another shop. Do you want to clear it and add this item?",
          [
            { text: "No", style: "cancel" },
            {
              text: "Yes, Start New",
              style: "destructive",
              onPress: async () => {
                try {
                  await clearCart(); // Clear old cart
                  await handleAddToCart(); // Retry adding current item
                } catch (e) {
                  Alert.alert("Error", "Failed to clear cart");
                }
              }
            }
          ]
        );
      } else {
        Alert.alert("Error", error.message || "Something went wrong");
      }
    }
  };

  // --- Add to Cart Logic (Simplified) ---
  const handleAddToCart = async () => {
    try {
      // Sirf Add API call karo. Backend khud nayi cart bana lega.
      await addToCartAPI({
        product_Id: _id,
        quantity: quantity,
        customizations: "",
      });

      // Success Toast/Alert
      Alert.alert("Success", "Added to your cart!");
      router.push("/cart"); // User ko force mat karo cart pe jane ke liye, let them shop more
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No product found</Text>
      </View>
    );
  }

  // Safe Image Logic
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Header & Image Section */}
        <View style={styles.headerContainer}>
          <View style={styles.backButtonWrapper}>
            <BackButton />
          </View>

          <View style={styles.imageContainer}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode="contain" />
            ) : (
              <Text style={styles.productEmoji}>🛒</Text>
            )}
          </View>
        </View>

        {/* Product Details Section */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.price}>₹{product.price}</Text>
          </View>

          <Text style={styles.unit}>{product.weight || "Standard Unit"}</Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons
                  key={i}
                  name={i <= Math.floor(product.rating || 0) ? "star" : "star-outline"}
                  size={16}
                  color="#FFD700"
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {product.rating || "New"}
            </Text>
          </View>

          <Text style={styles.sectionHeader}>Description</Text>
          <Text style={styles.description}>
            {product.description || "No description available."}
          </Text>

          {/* Quantity Selector - Show only if NOT in cart yet */}
          {!isInCart && (
            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Quantity</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantityLocal(-1)}>
                  <Ionicons name="remove" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantityLocal(1)}>
                  <Ionicons name="add" size={24} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer Action */}
      <View style={styles.footer}>
        {isInCart ? (
          // Option A: Already in Cart -> Green Button -> View Cart
          <TouchableOpacity
            style={[styles.addToCartButton, styles.viewCartButton]}
            onPress={() => router.push("/cart")}
          >
            <Text style={styles.addToCartText}>View in Cart</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        ) : (
          // Option B: New -> Orange Button -> Add to Cart
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Add to Cart — ₹{product.price * quantity}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header & Image
  headerContainer: {
    backgroundColor: '#F5F5F5',
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  backButtonWrapper: {
    paddingTop: 50, // Safe Area
    paddingHorizontal: 20,
    zIndex: 10,
  },
  imageContainer: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productEmoji: {
    fontSize: 100,
  },

  // Info Section
  infoContainer: {
    padding: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  productName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4CAF50",
  },
  unit: {
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
  },

  // Rating
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: '#FFF9C4',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  // Description
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 24,
    marginBottom: 30,
  },

  // Quantity
  quantitySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: '#FAFAFA',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  quantityButton: {
    padding: 10,
  },
  quantity: {
    fontSize: 18,
    fontWeight: "600",
    width: 40,
    textAlign: "center",
    color: "#333",
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingBottom: 30, // Safe Area padding
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  addToCartButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: 'center',
    flexDirection: 'row',
  },
  viewCartButton: {
    backgroundColor: "#2E7D32", // Dark Green for View Cart
  },
  addToCartText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingTop: 30,
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//   },
//   backButton: {
//     padding: 4,
//   },
//   cartButton: {
//     padding: 4,
//   },
//   imageContainer: {
//     height: 300,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f8f8f8",
//   },
//   productEmoji: {
//     fontSize: 120,
//   },
//   infoContainer: {
//     padding: 16,
//   },
//   price: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#328a0dff",
//     marginBottom: 8,
//   },
//   productName: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 4,
//   },
//   unit: {
//     fontSize: 16,
//     color: "#666",
//     marginBottom: 16,
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   stars: {
//     flexDirection: "row",
//     marginRight: 8,
//   },
//   ratingText: {
//     fontSize: 14,
//     color: "#666",
//   },
//   description: {
//     fontSize: 14,
//     color: "#666",
//     lineHeight: 20,
//     marginBottom: 24,
//   },
//   quantitySection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   quantityLabel: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//   },
//   quantitySelector: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//     borderRadius: 8,
//   },
//   quantityButton: {
//     padding: 12,
//   },
//   quantity: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//     paddingHorizontal: 20,
//   },
//   footer: {
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: "#f0f0f0",
//   },
//   addToCartButton: {
//     backgroundColor: "#328a0dff",
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   addToCartText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });