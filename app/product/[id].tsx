import BackButton from '@/components/back-button';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { api } from "../lib/apiService";

export async function getProductById(id: string) {
  const res: any = await api(`/users/shops/products/product/${id}`);
  if (!res.success) throw new Error(res.message);
  return res.data; // { product, shop, owner, address }
}
// ✅ Add to Cart
export async function addToCart(payload: {
  productId: string;
  quantity: number;
  customizations?: string;
}) {
  const res: any = await api("/users/cart/addcart/add", "POST", payload);
  if (!res.success) throw new Error(res.message);
  return res.cart;
}
export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data.product);
    } catch (err) {
      console.log("❌ Failed to load product", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  if (loading) {
    return <Text style={{ marginTop: 50, textAlign: "center" }}>Loading...</Text>;
  }

  if (!product) {
    return <Text>No product found</Text>;
  }
  const addItemToCart = async () => {
    const carts = await addToCart({
      productId: product.productId,
      quantity,
    });

    router.push("/cart");
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton />

        <View style={styles.imageContainer}>
          <Text style={styles.productEmoji}>🛒</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.price}>₹{product.price}</Text>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.unit}>{product.weight}</Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons
                key={i}
                name={i <= Math.floor(product.rating) ? "star" : "star-outline"}
                size={16}
                color="#FFD700"
              />
            ))}
            <Text style={styles.ratingText}>
              {product.rating || 4.0}
            </Text>
          </View>

          <Text style={styles.description}>
            {product.description}
          </Text>

          {/* Quantity */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(-1)}
              >
                <Ionicons name="remove" size={20} />
              </TouchableOpacity>

              <Text style={styles.quantity}>{quantity}</Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(1)}
              >
                <Ionicons name="add" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={addItemToCart}>
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  cartButton: {
    padding: 4,
  },
  imageContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  productEmoji: {
    fontSize: 120,
  },
  infoContainer: {
    padding: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#328a0dff",
    marginBottom: 8,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  unit: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stars: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 24,
  },
  quantitySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
  },
  quantityButton: {
    padding: 12,
  },
  quantity: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  addToCartButton: {
    backgroundColor: "#328a0dff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});