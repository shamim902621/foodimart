import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function FiltersScreen() {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [discount, setDiscount] = useState(false);
  const [freeShipping, setFreeShipping] = useState(true);
  const [sameDayDelivery, setSameDayDelivery] = useState(true);

  const applyFilters = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply Filters</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Price Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <View style={styles.priceInputs}>
            <View style={styles.priceInputContainer}>
              <Text style={styles.priceLabel}>Min.</Text>
              <View style={styles.priceInput}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  value={minPrice}
                  onChangeText={setMinPrice}
                />
              </View>
            </View>
            <View style={styles.priceInputContainer}>
              <Text style={styles.priceLabel}>Max.</Text>
              <View style={styles.priceInput}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.input}
                  placeholder="100"
                  keyboardType="numeric"
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Star Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Star Rating</Text>
          <TouchableOpacity style={styles.ratingOption}>
            <View style={styles.stars}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Ionicons name="star" size={20} color="#FFD700" />
              <Ionicons name="star" size={20} color="#FFD700" />
              <Ionicons name="star" size={20} color="#FFD700" />
              <Ionicons name="star-outline" size={20} color="#ccc" />
            </View>
            <Text style={styles.ratingText}>4 stars & above</Text>
          </TouchableOpacity>
        </View>

        {/* Others */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Others</Text>
          
          <View style={styles.filterOption}>
            <View style={styles.filterOptionLeft}>
              <View style={[styles.checkbox, discount && styles.checkboxChecked]}>
                {discount && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text style={styles.filterOptionText}>Discount</Text>
            </View>
            <Switch
              value={discount}
              onValueChange={setDiscount}
              trackColor={{ false: "#f0f0f0", true: "#FF6B35" }}
            />
          </View>

          <View style={styles.filterOption}>
            <View style={styles.filterOptionLeft}>
              <View style={[styles.checkbox, freeShipping && styles.checkboxChecked]}>
                {freeShipping && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text style={styles.filterOptionText}>Free shipping</Text>
            </View>
            <Switch
              value={freeShipping}
              onValueChange={setFreeShipping}
              trackColor={{ false: "#f0f0f0", true: "#FF6B35" }}
            />
          </View>

          <View style={styles.filterOption}>
            <View style={styles.filterOptionLeft}>
              <View style={[styles.checkbox, sameDayDelivery && styles.checkboxChecked]}>
                {sameDayDelivery && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text style={styles.filterOptionText}>Same day delivery</Text>
            </View>
            <Switch
              value={sameDayDelivery}
              onValueChange={setSameDayDelivery}
              trackColor={{ false: "#f0f0f0", true: "#FF6B35" }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Apply filter</Text>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  priceInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  priceInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    color: "#333",
    marginRight: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  ratingOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  stars: {
    flexDirection: "row",
    marginRight: 12,
  },
  ratingText: {
    fontSize: 16,
    color: "#333",
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  filterOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  filterOptionText: {
    fontSize: 16,
    color: "#333",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  applyButton: {
    backgroundColor: "#FF6B35",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});