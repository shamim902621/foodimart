import BackButton from '@/components/back-button';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function ShopScreen() {
    const { id } = useLocalSearchParams();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        rating: 0,
        discount: false,
        freeShipping: false,
        fastDelivery: false
    });

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

    const handleApplyFilters = () => {
        console.log('Applied filters:', filters);
        setShowFilterModal(false);
        // Here you would typically filter your products based on the selected filters
    };

    const handleResetFilters = () => {
        setFilters({
            minPrice: '',
            maxPrice: '',
            rating: 0,
            discount: false,
            freeShipping: false,
            fastDelivery: false
        });
    };

    const toggleStarRating = (rating: number) => {
        setFilters({...filters, rating});
    };

    const renderStars = (rating: number) => {
        return Array(5).fill(0).map((_, index) => (
            <TouchableOpacity 
                key={index} 
                onPress={() => toggleStarRating(index + 1)}
                style={styles.starButton}
            >
                <Ionicons 
                    name={index < rating ? "star" : "star-outline"} 
                    size={24} 
                    color={index < rating ? "#FFD700" : "#666"} 
                />
            </TouchableOpacity>
        ));
    };

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
                    <TouchableOpacity 
                        style={styles.filterButton}
                        onPress={() => setShowFilterModal(true)}
                    >
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

            {/* Filter Modal */}
            <Modal
                visible={showFilterModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowFilterModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <TouchableOpacity 
                                onPress={() => setShowFilterModal(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Apply Filters</Text>
                            <TouchableOpacity onPress={handleResetFilters}>
                                <Text style={styles.resetText}>Reset</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
                            {/* Price Range */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Price Range</Text>
                                <View style={styles.priceInputs}>
                                    <View style={styles.priceInput}>
                                        <Text style={styles.priceLabel}>Min.</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="0"
                                            keyboardType="numeric"
                                            value={filters.minPrice}
                                            onChangeText={(text) => setFilters({...filters, minPrice: text})}
                                        />
                                    </View>
                                    <View style={styles.priceInput}>
                                        <Text style={styles.priceLabel}>Max.</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="100"
                                            keyboardType="numeric"
                                            value={filters.maxPrice}
                                            onChangeText={(text) => setFilters({...filters, maxPrice: text})}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Star Rating */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Star Rating</Text>
                                <View style={styles.ratingSection}>
                                    <View style={styles.starsContainer}>
                                        {renderStars(filters.rating)}
                                    </View>
                                    <Text style={styles.ratingText}>
                                        {filters.rating > 0 ? `${filters.rating}+ stars` : 'Select rating'}
                                    </Text>
                                </View>
                            </View>

                            {/* Others */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Others</Text>
                                
                                <TouchableOpacity 
                                    style={styles.checkboxItem}
                                    onPress={() => setFilters({...filters, discount: !filters.discount})}
                                >
                                    <View style={styles.checkbox}>
                                        {filters.discount && (
                                            <Ionicons name="checkmark" size={16} color="#fff" />
                                        )}
                                    </View>
                                    <Text style={styles.checkboxLabel}>Discount</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={styles.checkboxItem}
                                    onPress={() => setFilters({...filters, freeShipping: !filters.freeShipping})}
                                >
                                    <View style={styles.checkbox}>
                                        {filters.freeShipping && (
                                            <Ionicons name="checkmark" size={16} color="#fff" />
                                        )}
                                    </View>
                                    <Text style={styles.checkboxLabel}>Free shipping</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={styles.checkboxItem}
                                    onPress={() => setFilters({...filters, fastDelivery: !filters.fastDelivery})}
                                >
                                    <View style={styles.checkbox}>
                                        {filters.fastDelivery && (
                                            <Ionicons name="checkmark" size={16} color="#fff" />
                                        )}
                                    </View>
                                    <Text style={styles.checkboxLabel}>3 days delivery</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        {/* Apply Button */}
                        <TouchableOpacity 
                            style={styles.applyButton}
                            onPress={handleApplyFilters}
                        >
                            <Text style={styles.applyButtonText}>Apply filter</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    // Filter Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "80%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    closeButton: {
        padding: 4,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    resetText: {
        fontSize: 16,
        color: "#328a0dff",
        fontWeight: "500",
    },
    filterContent: {
        padding: 20,
    },
    filterSection: {
        marginBottom: 30,
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    priceInputs: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 15,
    },
    priceInput: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
    },
    ratingSection: {
        alignItems: "center",
    },
    starsContainer: {
        flexDirection: "row",
        marginBottom: 10,
    },
    starButton: {
        padding: 4,
    },
    ratingText: {
        fontSize: 14,
        color: "#666",
    },
    checkboxItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#328a0dff",
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#328a0dff",
    },
    checkboxLabel: {
        fontSize: 16,
        color: "#333",
    },
    applyButton: {
        backgroundColor: "#328a0dff",
        margin: 20,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    applyButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});