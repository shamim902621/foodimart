import BackButton from '@/components/back-button';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      inStock: true,
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Smart Watch Series 5',
      price: 299.99,
      originalPrice: 349.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      inStock: true,
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Premium Coffee Maker',
      price: 149.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
      inStock: false,
      rating: 4.3,
    },
    {
      id: 4,
      name: 'Designer Backpack',
      price: 89.99,
      originalPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
      inStock: true,
      rating: 4.6,
    },
  ]);

  const removeFromWishlist = (id) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setWishlistItems(wishlistItems.filter(item => item.id !== id)),
        },
      ]
    );
  };

  const moveToCart = (item) => {
    Alert.alert('Success', `${item.name} moved to cart!`);
    // Implement cart logic here
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <BackButton/>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <View style={styles.headerRight} />
      </View>

      {wishlistItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={80} color="#e0e0e0" />
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>
            Save items you love for later
          </Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.wishlistGrid}>
            {wishlistItems.map((item) => (
              <View key={item.id} style={styles.wishlistCard}>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeFromWishlist(item.id)}
                >
                  <Ionicons name="heart" size={20} color="#FF6B6B" />
                </TouchableOpacity>

                <Image source={{ uri: item.image }} style={styles.productImage} />
                
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.rating}>{item.rating}</Text>
                  </View>

                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>${item.price}</Text>
                    <Text style={styles.originalPrice}>${item.originalPrice}</Text>
                  </View>

                  {!item.inStock && (
                    <Text style={styles.outOfStock}>Out of Stock</Text>
                  )}
                </View>

                <TouchableOpacity 
                  style={[
                    styles.cartButton,
                    !item.inStock && styles.disabledButton
                  ]}
                  onPress={() => moveToCart(item)}
                  disabled={!item.inStock}
                >
                  <Ionicons name="cart-outline" size={18} color="#fff" />
                  <Text style={styles.cartButtonText}>
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Wishlist Stats */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Wishlist Summary</Text>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Total Items:</Text>
              <Text style={styles.statsValue}>{wishlistItems.length}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Total Value:</Text>
              <Text style={styles.statsValue}>
                ${wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={18} color="#FF6B35" />
              <Text style={styles.shareButtonText}>Share Wishlist</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 32,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  wishlistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  wishlistCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    padding: 4,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    height: 36,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  outOfStock: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statsCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsLabel: {
    fontSize: 14,
    color: '#666',
  },
  statsValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FF6B35',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  shareButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});