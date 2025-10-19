import BackButton from '@/components/back-button';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ShopScreen() {

    const { id } = useLocalSearchParams();
    const categories = [
        { id: 1, name: "Vegetables", icon: "🥦" },
        { id: 2, name: "Fruits", icon: "🍎" },
        { id: 3, name: "Beverages", icon: "🥤" },
        { id: 4, name: "Grocery", icon: "🛒" },
        { id: 5, name: "Edible oil", icon: "🫒" },
        { id: 6, name: "Household", icon: "🏠" }
    ];

    const featuredProducts = [
        {
            id: 1,
            name: "Fresh Peach",
            price: 8.00,
            unit: "dioxon",
            image: "🍑"
        },
        {
            id: 2,
            name: "Avocado",
            price: 8.90,
            unit: "2.0 lbs",
            image: "🥑"
        },
        {
            id: 3,
            name: "Pineapple",
            price: 7.00,
            unit: "1.50 lbs",
            image: "🍍"
        },
        {
            id: 4,
            name: "Black Grapes",
            price: 7.05,
            unit: "5.0 lbs",
            image: "🍇"
        }
    ];

    return (
        <View style={styles.container}>
                          
            <View style={styles.header}>
                 <BackButton fallbackRoute="/home" />
                 <Text style={styles.time}>9:41</Text>
               
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

                {/* Promo Banner */}
                <View style={styles.promoBanner}>
                    <Text style={styles.promoText}>20% off on your first purchase</Text>
                </View>

                {/* Categories */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                        {categories.map((category) => (
                            <TouchableOpacity key={category.id} style={styles.categoryCard}>
                                <Text style={styles.categoryIcon}>{category.icon}</Text>
                                <Text style={styles.categoryName}>{category.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Featured Products */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Featured products</Text>
                    <View style={styles.productsGrid}>
                        {featuredProducts.map((product) => (
                            <TouchableOpacity
                                key={product.id}
                                style={styles.productCard}
                                onPress={() =>
                                    router.push({
                                        pathname: '/product/[id]',
                                        params: {
                                            id: product.id,
                                            name: product.name,
                                            price: product.price,
                                            unit: product.unit,
                                            image: product.image,
                                        },
                                    })
                                }
                            >
                                <View style={styles.productImage}>
                                    <Text style={styles.productEmoji}>{product.image}</Text>
                                </View>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productUnit}>{product.unit}</Text>
                                <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                                <TouchableOpacity style={styles.addButton}>
                                    <Text style={styles.addButtonText}>Add to cart</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>
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
    flexDirection: "row",        // 👈 places items in a row
    justifyContent: "space-between", // 👈 space between left and right
    alignItems: "center",        // 👈 vertically center items
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  time: {
    fontSize: 16,
    fontWeight: "bold",
  },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8f8f8",
        margin: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
     filterButton: {
    padding: 4,
  },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: "#333",
    },
      searchIcon: {
    marginRight: 12,
  },
    promoBanner: {
        backgroundColor: "#328a0dff",
        marginHorizontal: 16,
        marginBottom: 24,
        padding: 20,
        borderRadius: 12,
    },
    promoText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 16,
    },
    categoriesContainer: {
        marginHorizontal: -16,
        paddingHorizontal: 16,
    },
    categoryCard: {
        alignItems: "center",
        marginRight: 16,
        width: 80,
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
    productsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    productCard: {
        width: "48%",
        backgroundColor: "#f8f8f8",
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: "center",
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    productEmoji: {
        fontSize: 32,
    },
    productName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
        textAlign: "center",
    },
    productUnit: {
        fontSize: 12,
        color: "#666",
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#328a0dff",
        marginBottom: 8,
    },
    addButton: {
        backgroundColor: "#328a0dff",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
    },
    addButtonText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
});