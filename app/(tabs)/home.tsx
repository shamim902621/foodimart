// import AppHeader from "@/components/app-header";
import AppHeader from "@/components/profileHeader";
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from '../lib/apiService';
// const { width } = Dimensions.get('window');

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





  return (
    <View style={styles.container}>
      {/* Header */}
      {/* ✅ 1. Top Navigation Bar (Custom Header) */}
      <AppHeader
        showBack={false}
        // locationText="New Delhi, India"
        rightIcon="person-circle-outline"
        onRightPress={() => router.push('/user/profile')}
      />

      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
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
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontWeight: '700',
    color: '#333',
    marginLeft: 6,
    marginRight: 4
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