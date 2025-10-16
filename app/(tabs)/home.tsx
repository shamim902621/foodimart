import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function HomeScreen() {
  
  const restaurants = [
    {
      id: 1,
      name: "Burger King",
      cuisine: "Fast Food • American",
      rating: 4.2,
      time: "25-35 min",
      price: "₹300 for one",
      discount: "60% OFF",
      badge: "MAX Safety",
      image: "🍔"
    },
    {
      id: 2,
      name: "Pizza Palace",
      cuisine: "Italian • Pizza",
      rating: 4.5,
      time: "30-40 min",
      price: "₹450 for one",
      discount: "50% OFF",
      badge: "PRO",
      image: "🍕"
    },
    {
      id: 3,
      name: "Healthy Bites",
      cuisine: "Healthy • Salads",
      rating: 4.3,
      time: "20-30 min",
      price: "₹350 for one",
      discount: "40% OFF",
      badge: "MAX Safety",
      image: "🥗"
    },
    {
      id: 4,
      name: "Biryani House",
      cuisine: "Indian • Biryani",
      rating: 4.6,
      time: "35-45 min",
      price: "₹280 for one",
      discount: "30% OFF",
      badge: "Popular",
      image: "🍛"
    }
  ];

  const categories = [
    { id: 1, name: "Healthy", icon: "🥗" },
    { id: 2, name: "Biryani", icon: "🍛" },
    { id: 3, name: "Pizza", icon: "🍕" },
    { id: 4, name: "Haleem", icon: "🍲" },
    { id: 5, name: "Chicken", icon: "🍗" },
    { id: 6, name: "Burger", icon: "🍔" },
    { id: 7, name: "Cake", icon: "🎂" },
    { id: 8, name: "Shawarma", icon: "🌯" }
  ];

  // Filter tags
  const filters = [
    { id: 1, name: "MAX Safety", icon: "shield-checkmark" },
    { id: 2, name: "PRO", icon: "star" },
    { id: 3, name: "Cuisines", icon: "restaurant" },
    { id: 4, name: "Rating", icon: "star" },
    { id: 5, name: "Popular", icon: "trending-up" }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={20} color="#FF6B35" />
          <Text style={styles.locationText}>Your Location</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#333" />
        </View>
        <View style={styles.profileContainer}>
          <TouchableOpacity style={styles.profileButton}>
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
        </View>

        {/* Filter Tags */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity key={filter.id} style={styles.filterTag}>
              <Ionicons name={filter.icon} size={16} color="#FF6B35" />
              <Text style={styles.filterText}>{filter.name}</Text>
            </TouchableOpacity>
          ))}
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
          <Text style={styles.discountText}>
            <Text style={styles.discountHighlight}>Billing discounts</Text>
            {"\n"}now on your favourite restaurants
          </Text>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eat what makes you happy</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Restaurants Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>396 restaurants around you</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
{restaurants.map((restaurant) => (
  <TouchableOpacity
    key={restaurant.id}
    style={styles.restaurantCard}
    onPress={() => router.push(`/shop/${restaurant.id}`)}  // 👈 Navigate to shop page
  >
              <View style={styles.restaurantHeader}>
                <View style={styles.restaurantImage}>
                  <Text style={styles.emojiLarge}>{restaurant.image}</Text>
                </View>
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
                  <View style={styles.restaurantMeta}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>{restaurant.rating}</Text>
                    </View>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.deliveryTime}>{restaurant.time}</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.price}>{restaurant.price}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.restaurantFooter}>
                <View style={styles.badgeContainer}>
                  <View style={[
                    styles.badge,
                    restaurant.badge === "MAX Safety" && styles.safetyBadge,
                    restaurant.badge === "PRO" && styles.proBadge,
                    restaurant.badge === "Popular" && styles.popularBadge
                  ]}>
                    <Text style={styles.badgeText}>{restaurant.badge}</Text>
                  </View>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>{restaurant.discount}</Text>
                  </View>
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
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
    marginRight: 2,
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
    backgroundColor: "#f8f8f8",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
    color: "#333",
  },
  promoBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2ECC71",
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 4,
  },
  promoMonth: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  promoImage: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  discountBanner: {
    backgroundColor: "#FFF9E6",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
  },
  discountText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  discountHighlight: {
    fontWeight: "bold",
    color: "#FF6B35",
  },
  section: {
    marginBottom: 24,
    paddingTop:10
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft:14,
    marginTop:10,
    color: "#333",
  },
  seeAllText: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "600",
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingTop:10
  },
  categoryCard: {
    alignItems: "center",
    marginRight: 16,
    width: 70,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  restaurantCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  restaurantHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  emoji: {
    fontSize: 24,
  },
  emojiLarge: {
    fontSize: 28,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  restaurantMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 2,
  },
  metaDot: {
    fontSize: 12,
    color: "#999",
    marginHorizontal: 6,
  },
  deliveryTime: {
    fontSize: 12,
    color: "#666",
  },
  price: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  restaurantFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
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
    fontSize: 10,
    fontWeight: "bold",
  },
  discountBadge: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 8,
  },
  footerText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
    textAlign: "center",
    flex: 1,
  },
});