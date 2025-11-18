// app/superadmin/shops/create.tsx
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "./apiService";


export default function CreateShop() {
  const { user, token } = useAuth();

  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    ownerEmail: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    lat: "",
    lng: "",
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

  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (
      !form.shopName ||
      !form.ownerName ||
      !form.ownerEmail ||
      !form.phone ||
      !form.category
    ) {
      Alert.alert("Missing Fields", "Please fill all required fields (*)");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.shopName,
        description: form.description,
        adminId: user?.id,

        cuisineType: [form.category],

        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          coordinates: {
            lat: Number(form.lat) || 0,
            lng: Number(form.lng) || 0
          }
        },

        contact: {
          phone: form.phone,
          email: form.ownerEmail
        },

        ownerName: form.ownerName
      };

      console.log(payload);

      const response = await api("/shops", "POST", payload, token ?? undefined);

      const data = await response.json();  // <-- IMPORTANT

      if (response.ok) {
        Alert.alert("Success", data.message || "Shop created successfully!");
        router.back();
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }

    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
      router.back();
    }
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
              onChangeText={(text) => setForm({ ...form, shopName: text })}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Owner Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Shamim Ahmad"
                value={form.ownerName}
                onChangeText={(text) => setForm({ ...form, ownerName: text })}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Phone *</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 9876543210"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(text) => setForm({ ...form, phone: text })}
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
              onChangeText={(text) => setForm({ ...form, ownerEmail: text })}
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
                  onPress={() => setForm({ ...form, category })}
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
            <Text style={styles.label}>Street Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 243 Indira Nagar Main Road"
              value={form.street}
              onChangeText={(text) => setForm({ ...form, street: text })}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Bangalore"
                value={form.city}
                onChangeText={(text) => setForm({ ...form, city: text })}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Karnataka"
                value={form.state}
                onChangeText={(text) => setForm({ ...form, state: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Zip Code</Text>
            <TextInput
              style={styles.input}
              placeholder="560038"
              keyboardType="number-pad"
              value={form.zipCode}
              onChangeText={(text) => setForm({ ...form, zipCode: text })}
            />
          </View>

          {/* <Text style={[styles.label, { marginTop: 10 }]}>Location Coordinates (Optional)</Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Latitude</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 12.9716"
                keyboardType="numeric"
                value={form.lat}
                onChangeText={(text) => setForm({ ...form, lat: text })}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Longitude</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 77.5946"
                keyboardType="numeric"
                value={form.lng}
                onChangeText={(text) => setForm({ ...form, lng: text })}
              />
            </View>
          </View> */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Brief description about the shop"
              multiline
              numberOfLines={3}
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
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