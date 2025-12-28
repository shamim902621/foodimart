import BackButton from '@/components/back-button';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from '../lib/apiService';
const { width } = Dimensions.get('window');

interface ApiShopItem {
  shop: {
    _id: string;
    name: string;
    category: string;
    foodCategory?: string | null;
    rating?: number;
    images?: string[];
  };
  user: {
    fullName: string;
    mobile: string;
  };
  address: {
    city: string;
    state: string;
  };
}

interface ShopUI {
  _id: string;
  name: string;
  category: string;
  foodCategory?: string | null;
  rating: number;
  image: string;
  city?: string;
}


export async function getShops(query?: {
  category?: string;
  filter?: string;
}) {
  const params = new URLSearchParams();

  if (query?.category) params.append("category", query.category);
  if (query?.filter) params.append("filter", query.filter);

  const res: any = await api(`/users/shops/category?${params.toString()}`);

  if (!res.success) throw new Error(res.message);

  return res.shops as ApiShopItem[];
}

export default function HomeScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category?: string }>();
  const [shops, setShops] = useState<ShopUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(
    category || null
  );


  const filters = [
    { id: 1, key: "rating", name: "Top Rated" },
    { id: 2, key: "popular", name: "Popular" },
    { id: 3, key: "food", name: "Food" },
    { id: 4, key: "grocery", name: "Grocery" },
  ];

  const handleFilterPress = (filterKey: string) => {
    setActiveFilter(filterKey);
  };

  useEffect(() => {
    loadShops();
  }, [activeCategory, activeFilter]);


  const loadShops = async () => {
    try {
      setLoading(true);

      const apiData = await getShops({
        category: activeCategory || undefined,
        filter: activeFilter || undefined,
      });

      const mapped: ShopUI[] = apiData.map((item) => ({
        _id: item.shop._id,
        name: item.shop.name,
        category: item.shop.category,
        foodCategory: item.shop.foodCategory,
        rating: item.shop.rating || 0,
        image:
          item.shop.images?.[0] ||
          "https://via.placeholder.com/400",
        city: item.address?.city,
      }));

      setShops(mapped);
    } catch (e) {
      console.log("❌ Failed to load shops", e);
    } finally {
      setLoading(false);
    }
  };




  // const restaurants = [
  //   {
  //     id: 1,
  //     name: "Burger King",
  //     cuisine: "Fast Food • American",
  //     rating: 4.2,
  //     time: "25-35 min",
  //     price: "₹300 for one",
  //     discount: "60% OFF",
  //     badge: "MAX Safety",
  //     image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop"
  //   },
  //   {
  //     id: 2,
  //     name: "Pizza Palace",
  //     cuisine: "Italian • Pizza",
  //     rating: 4.5,
  //     time: "30-40 min",
  //     price: "₹450 for one",
  //     discount: "50% OFF",
  //     badge: "PRO",
  //     image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop"
  //   },
  //   {
  //     id: 3,
  //     name: "Healthy Bites",
  //     cuisine: "Healthy • Salads",
  //     rating: 4.3,
  //     time: "20-30 min",
  //     price: "₹350 for one",
  //     discount: "40% OFF",
  //     badge: "MAX Safety",
  //     image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop"
  //   },
  //   {
  //     id: 4,
  //     name: "Biryani House",
  //     cuisine: "Indian • Biryani",
  //     rating: 4.6,
  //     time: "35-45 min",
  //     price: "₹280 for one",
  //     discount: "30% OFF",
  //     badge: "Popular",
  //     image: "https://images.unsplash.com/photo-1563379091339-03246963d96b?w=400&h=300&fit=crop"
  //   },
  //   {
  //     id: 5,
  //     name: "Sushi Master",
  //     cuisine: "Japanese • Sushi",
  //     rating: 4.7,
  //     time: "40-50 min",
  //     price: "₹600 for one",
  //     discount: "20% OFF",
  //     badge: "PRO",
  //     image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop"
  //   },
  //   {
  //     id: 6,
  //     name: "Taco Fiesta",
  //     cuisine: "Mexican • Tacos",
  //     rating: 4.4,
  //     time: "25-35 min",
  //     price: "₹250 for one",
  //     discount: "55% OFF",
  //     badge: "MAX Safety",
  //     image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop"
  //   },
  //   {
  //     id: 7,
  //     name: "Dragon Wok",
  //     cuisine: "Chinese • Asian",
  //     rating: 4.1,
  //     time: "30-40 min",
  //     price: "₹320 for one",
  //     discount: "45% OFF",
  //     badge: "Popular",
  //     image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop"
  //   },
  //   {
  //     id: 8,
  //     name: "Cafe Delight",
  //     cuisine: "Cafe • Bakery",
  //     rating: 4.8,
  //     time: "15-25 min",
  //     price: "₹180 for one",
  //     discount: "35% OFF",
  //     badge: "PRO",
  //     image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop"
  //   },
  //   {
  //     id: 9,
  //     name: "BBQ Nation",
  //     cuisine: "Barbecue • Grill",
  //     rating: 4.4,
  //     time: "45-55 min",
  //     price: "₹550 for one",
  //     discount: "25% OFF",
  //     badge: "MAX Safety",
  //     image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop"
  //   },
  //   {
  //     id: 10,
  //     name: "Ice Cream Paradise",
  //     cuisine: "Desserts • Ice Cream",
  //     rating: 4.9,
  //     time: "10-20 min",
  //     price: "₹150 for one",
  //     discount: "30% OFF",
  //     badge: "Popular",
  //     image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop"
  //   },
  //   {
  //     id: 11,
  //     name: "Spice Garden",
  //     cuisine: "North Indian • Curry",
  //     rating: 4.3,
  //     time: "35-45 min",
  //     price: "₹380 for one",
  //     discount: "40% OFF",
  //     badge: "MAX Safety",
  //     image: "https://images.unsplash.com/photo-1585937421612-70caa4c83c7e?w=400&h=300&fit=crop"
  //   },
  //   {
  //     id: 12,
  //     name: "Pasta Factory",
  //     cuisine: "Italian • Pasta",
  //     rating: 4.6,
  //     time: "25-35 min",
  //     price: "₹420 for one",
  //     discount: "50% OFF",
  //     badge: "PRO",
  //     image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop"
  //   },
  //   {
  //     id: 13,
  //     name: "Seafood Harbor",
  //     cuisine: "Seafood • Coastal",
  //     rating: 4.5,
  //     time: "40-50 min",
  //     price: "₹680 for one",
  //     discount: "20% OFF",
  //     badge: "Popular",
  //     image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop"
  //   },
  //   {
  //     id: 14,
  //     name: "Vegan Vibes",
  //     cuisine: "Vegan • Healthy",
  //     rating: 4.7,
  //     time: "20-30 min",
  //     price: "₹290 for one",
  //     discount: "35% OFF",
  //     badge: "MAX Safety",
  //     image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop"
  //   },
  //   {
  //     id: 15,
  //     name: "Street Food Hub",
  //     cuisine: "Street Food • Indian",
  //     rating: 4.2,
  //     time: "15-25 min",
  //     price: "₹200 for one",
  //     discount: "60% OFF",
  //     badge: "Popular",
  //     image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop"
  //   }
  // ];
  // const categories = [
  //   { id: 1, name: "Healthy", icon: "🥗", color: "#4CAF50" },
  //   { id: 2, name: "Biryani", icon: "🍛", color: "#FF9800" },
  //   { id: 3, name: "Pizza", icon: "🍕", color: "#F44336" },
  //   { id: 4, name: "Haleem", icon: "🍲", color: "#795548" },
  //   { id: 5, name: "Chicken", icon: "🍗", color: "#FF5722" },
  //   { id: 6, name: "Burger", icon: "🍔", color: "#8BC34A" },
  //   { id: 7, name: "Cake", icon: "🎂", color: "#E91E63" },
  //   { id: 8, name: "Shawarma", icon: "🌯", color: "#9C27B0" }
  // ];

  // const filters = [
  //   { id: 1, name: "MAX Safety", icon: "shield-checkmark", active: true },
  //   { id: 2, name: "PRO", icon: "star", active: false },
  //   { id: 3, name: "Cuisines", icon: "restaurant", active: false },
  //   { id: 4, name: "Rating", icon: "star", active: false },
  //   { id: 5, name: "Popular", icon: "trending-up", active: false }
  // ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <BackButton />
          <Ionicons name="location-sharp" size={20} color="#FF6B35" />
          Delhi
        </View>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/user/profile')}
          >
            <Ionicons name="person-circle-outline" size={28} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Restaurant name, cuisine, or a dish..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="sliders" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Filter Tags */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;

            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterTag,
                  isActive && styles.filterTagActive,
                ]}
                onPress={() => handleFilterPress(filter.key)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {filter.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>


        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>60% OFF</Text>
            <Text style={styles.promoSubtitle}>no cooking</Text>
            <Text style={styles.promoMonth}>JULY</Text>
          </View>
          <View style={styles.promoImage}>
            <Text style={styles.emoji}>🎉</Text>
          </View>
        </View>

        {/* Discount Banner */}
        <View style={styles.discountBanner}>
          <View style={styles.discountIcon}>
            <Ionicons name="flash" size={20} color="#FF6B35" />
          </View>
          <Text style={styles.discountText}>
            <Text style={styles.discountHighlight}>Billing discounts</Text>
            {"\n"}now on your favourite restaurants
          </Text>
        </View>


        {/* Categories Section */}
        {activeCategory && (
          <View style={styles.section}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
            >
              <TouchableOpacity style={styles.categoryCard}>
                <View
                  style={[
                    styles.categoryIconContainer,
                    { backgroundColor: "#FF6B35" },
                  ]}
                >
                  <Text style={styles.categoryIcon}>🍽️</Text>
                </View>
                <Text style={styles.categoryName}>
                  {activeCategory.toUpperCase()}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}


        {/* Restaurants Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {category
                ? `${category.toUpperCase()} Shops`
                : "All Shops"}
            </Text>
          </View>

          {loading && (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Loading shops...
            </Text>
          )}

          {/* {!loading && shops.length === 0 && (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No shops found
            </Text>
          )} */}

          {shops.map((shop) => (
            <TouchableOpacity
              key={shop._id}
              style={styles.restaurantCard}
              onPress={() => router.push(`/shop/${shop._id}`)}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: shop.image }}
                  style={styles.restaurantImage}
                />

                <View style={styles.deliveryTimeTag}>
                  <Text style={styles.deliveryTimeTagText}>30 mins</Text>
                </View>
              </View>

              <View style={styles.restaurantInfo}>
                <View style={styles.restaurantHeader}>
                  <Text style={styles.restaurantName}>{shop.name}</Text>

                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ratingText}>
                      {shop.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.restaurantCuisine}>
                  {shop.category === "food"
                    ? `Food • ${shop.foodCategory?.toUpperCase() || "ALL"}`
                    : shop.category.toUpperCase()}
                </Text>

                <View style={styles.restaurantFooter}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Popular</Text>
                  </View>

                  <Text style={styles.price}>₹200 for one</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

        </View>


        {/* Footer Note */}
        <View style={styles.footerNote}>
          <FontAwesome5 name="leaf" size={16} color="#4CAF50" />
          <Text style={styles.footerText}>
            Zanate funds environmental projects to offset delivery carbon footprint
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
    marginRight: 4,
    color: "#333",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    padding: 4,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#e8e8e8",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  filterTagActive: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
    color: "#333",
  },
  filterTextActive: {
    color: "#fff",
  },
  promoBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#6C63FF", // Fixed: Using solid color instead of gradient string
    margin: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 8,
    opacity: 0.9,
  },
  promoMonth: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
    fontWeight: "600",
  },
  promoImage: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 40,
  },
  emoji: {
    fontSize: 32,
  },
  discountBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#FFD700",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  discountIcon: {
    marginRight: 12,
  },
  discountText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    flex: 1,
  },
  discountHighlight: {
    fontWeight: "bold",
    color: "#FF6B35",
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    margin: 10,
    marginLeft: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  seeAllText: {
    fontSize: 14,
    color: "#FF6B35",
    fontWeight: "600",
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    alignItems: "center",
    marginRight: 16,
    width: 80,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  restaurantCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 180,
  },
  restaurantImage: {
    width: "100%",
    height: "100%",
  },
  discountTag: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  discountTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  deliveryTimeTag: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  deliveryTimeTagText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  restaurantFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  safetyBadge: {
    backgroundColor: "#E8F5E8",
  },
  proBadge: {
    backgroundColor: "#FFF3E0",
  },
  popularBadge: {
    backgroundColor: "#FFEBEE",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#333",
  },
  price: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  footerText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
    textAlign: "center",
    flex: 1,
  },
});