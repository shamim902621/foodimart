import BackButton from '@/components/back-button';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CartScreen() {
  const cartItems = [
    {
      id: 1,
      name: "Chicken Burger Meal",
      restaurant: "Burger King",
      price: 300,
      quantity: 2,
      image: "🍔",
      customization: "Extra cheese, No onions"
    },
    {
      id: 2,
      name: "Margherita Pizza",
      restaurant: "Pizza Palace",
      price: 450,
      quantity: 1,
      image: "🍕",
      customization: "Thin crust"
    },
    {
      id: 3,
      name: "Fresh Fruit Smoothie",
      restaurant: "Healthy Bites",
      price: 180,
      quantity: 1,
      image: "🥤",
      customization: ""
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 40;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + tax;

  const updateQuantity = (id: number, change: number) => {
    console.log(`Update item ${id} quantity by ${change}`);
  };

  const removeItem = (id: number) => {
    console.log(`Remove item ${id}`);
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Add some delicious items from restaurants</Text>
        <TouchableOpacity style={styles.shopButton}>
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
 
      <View style={styles.header}>
       <BackButton/>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <Text style={styles.itemCount}>{cartItems.length} items</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.itemImage}>
                <Text style={styles.itemEmoji}>{item.image}</Text>
              </View>
              
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.restaurantName}>{item.restaurant}</Text>
                
                {item.customization ? (
                  <Text style={styles.customization}>{item.customization}</Text>
                ) : null}
                
                <View style={styles.itemActions}>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, -1)}
                    >
                      <Ionicons name="remove" size={16} color="#FF6B35" />
                    </TouchableOpacity>
                    
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, 1)}
                    >
                      <Ionicons name="add" size={16} color="#FF6B35" />
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeItem(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Delivery Address */}
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

        {/* Payment Summary */}
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
              <Text style={styles.billLabel}>Taxes & Charges</Text>
              <Text style={styles.billValue}>₹{tax.toFixed(2)}</Text>
            </View>
            
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Platform Fee</Text>
              <Text style={styles.billValue}>₹5</Text>
            </View>
            
            <View style={[styles.billRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{(total + 5).toFixed(2)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pricetag-outline" size={20} color="#FF6B35" />
            <Text style={styles.sectionTitle}>Offers & Coupons</Text>
          </View>
          
          <TouchableOpacity style={styles.couponCard}>
            <View style={styles.couponInfo}>
              <View style={styles.couponBadge}>
                <Text style={styles.couponBadgeText}>60% OFF</Text>
              </View>
              <Text style={styles.couponText}>Get 60% off up to ₹100</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Checkout Footer */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.footerTotalLabel}>Total</Text>
          <Text style={styles.footerTotalAmount}>₹{(total + 5).toFixed(2)}</Text>
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
    backgroundColor: "#f8f8f8",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  shopButton: {
    backgroundColor: "#328a0dff",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  itemCount: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  itemsContainer: {
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  cartItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "flex-start",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  restaurantName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  customization: {
    fontSize: 12,
    color: "#FF6B35",
    fontStyle: "italic",
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
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 12,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  section: {
    backgroundColor: "#fff",
    marginBottom: 8,
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
    color: "#333",
    marginLeft: 8,
  },
  addressCard: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
  },
  addressType: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
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
    color: "#57ff35ff",
    fontSize: 14,
    fontWeight: "600",
  },
  billDetails: {
    gap: 8,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  billLabel: {
    fontSize: 14,
    color: "#666",
  },
  billValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  couponCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF9E6",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#b97003ff",
  },
  couponInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  couponBadge: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  couponBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  couponText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  footer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalContainer: {
    flex: 1,
  },
  footerTotalLabel: {
    fontSize: 14,
    color: "#666",
  },
  footerTotalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  checkoutButton: {
    backgroundColor: "#328a0dff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 160,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});