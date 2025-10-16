// app/superadmin/shops/create.tsx
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CreateShop() {
  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    ownerEmail: "",
    phone: "",
    address: "",
    city: "",
    category: "",
    description: ""
  });

  const categories = [
    "Restaurant & Cafe",
    "Grocery Store",
    "Bakery",
    "Food Truck",
    "Dessert Shop",
    "Beverage Shop"
  ];

  const handleSubmit = () => {
    // TODO: API call to create shop
    console.log(form);
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
     

      {/* Form */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Shop Information</Text>
        
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Shop Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Food Mart Indiranagar"
              value={form.shopName}
              onChangeText={(text) => setForm({...form, shopName: text})}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Owner Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Shamim Ahmad"
                value={form.ownerName}
                onChangeText={(text) => setForm({...form, ownerName: text})}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Phone *</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 9876543210"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(text) => setForm({...form, phone: text})}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Owner Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="owner@shop.com"
              keyboardType="email-address"
              value={form.ownerEmail}
              onChangeText={(text) => setForm({...form, ownerEmail: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    form.category === category && styles.activeCategoryButton
                  ]}
                  onPress={() => setForm({...form, category})}
                >
                  <Text style={[
                    styles.categoryText,
                    form.category === category && styles.activeCategoryText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Full shop address"
              multiline
              numberOfLines={3}
              value={form.address}
              onChangeText={(text) => setForm({...form, address: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Brief description about the shop"
              multiline
              numberOfLines={3}
              value={form.description}
              onChangeText={(text) => setForm({...form, description: text})}
            />
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Create Shop</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#374151",
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  categoriesContainer: {
    flexDirection: "row",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  categoryText: {
    fontSize: 14,
    color: "#6B7280",
  },
  activeCategoryText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});