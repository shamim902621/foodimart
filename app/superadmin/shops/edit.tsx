import { useAuth } from "@/hooks/useAuth";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "./apiService";

type ShopForm = {
    shopName: string;
    ownerName: string;
    ownerEmail: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    lat: string;
    lng: string;
    categories: string[];
    description: string;
};

export default function EditShop() {
    const { token } = useAuth();
    const { id } = useLocalSearchParams();

    const [form, setForm] = useState<ShopForm>({
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
        categories: [],
        description: ""
    });

    const categoriesList = [
        "Restaurant & Cafe",
        "Grocery Store",
        "Bakery",
        "Food Truck",
        "Dessert Shop",
        "Beverage Shop"
    ];

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadShop();
    }, [id]);

    // -----------------------------
    // 1️⃣ LOAD SHOP DETAILS
    // -----------------------------
    const loadShop = async () => {
        try {
            const response = await api(`/shops/${id}`, "PUT", token ?? undefined);

            if (response?.success) {
                const s = response.data;

                setForm({
                    shopName: s.name,
                    ownerName: s.ownerName,
                    ownerEmail: s.contact.email,
                    phone: s.contact.phone,
                    street: s.address.street,
                    city: s.address.city,
                    state: s.address.state,
                    zipCode: s.address.zipCode,
                    lat: s.address.coordinates.lat?.toString() || "",
                    lng: s.address.coordinates.lng?.toString() || "",
                    categories: s.cuisineType || [],
                    description: s.description,
                });
            }
        } catch (err) {
            console.log("ERROR:", err);
        }
    };

    // -----------------------------
    // 2️⃣ TOGGLE CATEGORIES OUTSIDE UI
    // -----------------------------
    const toggleCategory = (category: string) => {
        const isSelected = form.categories.includes(category);

        setForm({
            ...form,
            categories: isSelected
                ? form.categories.filter((c) => c !== category)
                : [...form.categories, category],
        });
    };

    // -----------------------------
    // 3️⃣ UPDATE API CALL
    // -----------------------------
    const handleUpdate = async () => {
        try {
            setLoading(true);

            const payload = {
                name: form.shopName,
                ownerName: form.ownerName,
                description: form.description,
                cuisineType: form.categories,

                address: {
                    street: form.street,
                    city: form.city,
                    state: form.state,
                    zipCode: form.zipCode,
                    coordinates: {
                        lat: Number(form.lat) || 0,
                        lng: Number(form.lng) || 0,
                    },
                },

                contact: {
                    phone: form.phone,
                    email: form.ownerEmail,
                },
            };

            const response = await api(`/shops/${id}`, "PUT", payload, token ?? undefined);

            if (response.success) {
                Alert.alert("Success", "Shop updated successfully!");
                router.back();
            } else {
                Alert.alert("Error", response.message || "Update failed!");
            }
        } catch (err: any) {
            Alert.alert("Error", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Edit Shop</Text>

            {/* SHOP NAME */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Shop Name *</Text>
                <TextInput
                    style={styles.input}
                    value={form.shopName}
                    onChangeText={(text) => setForm({ ...form, shopName: text })}
                />
            </View>

            {/* OWNER / PHONE */}
            <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Owner Name *</Text>
                    <TextInput
                        style={styles.input}
                        value={form.ownerName}
                        onChangeText={(text) => setForm({ ...form, ownerName: text })}
                    />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Phone *</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="phone-pad"
                        value={form.phone}
                        onChangeText={(text) => setForm({ ...form, phone: text })}
                    />
                </View>
            </View>

            {/* EMAIL */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Owner Email *</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="email-address"
                    value={form.ownerEmail}
                    onChangeText={(text) => setForm({ ...form, ownerEmail: text })}
                />
            </View>

            {/* CATEGORY MULTI SELECT */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Category *</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                    {categoriesList.map((cat) => {
                        const isSelected = form.categories.includes(cat);
                        return (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.categoryButton,
                                    isSelected && styles.activeCategoryButton
                                ]}
                                onPress={() => toggleCategory(cat)}
                            >
                                <Text
                                    style={[
                                        styles.categoryText,
                                        isSelected && styles.activeCategoryText
                                    ]}
                                >
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* ADDRESS */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Street</Text>
                <TextInput
                    style={styles.input}
                    value={form.street}
                    onChangeText={(text) => setForm({ ...form, street: text })}
                />
            </View>

            {/* CITY / STATE */}
            <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>City</Text>
                    <TextInput
                        style={styles.input}
                        value={form.city}
                        onChangeText={(text) => setForm({ ...form, city: text })}
                    />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>State</Text>
                    <TextInput
                        style={styles.input}
                        value={form.state}
                        onChangeText={(text) => setForm({ ...form, state: text })}
                    />
                </View>
            </View>

            {/* ZIP */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Zip Code</Text>
                <TextInput
                    style={styles.input}
                    value={form.zipCode}
                    onChangeText={(text) => setForm({ ...form, zipCode: text })}
                />
            </View>

            {/* DESCRIPTION */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    multiline
                    value={form.description}
                    onChangeText={(text) => setForm({ ...form, description: text })}
                />
            </View>

            {/* BUTTONS */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                    <Text style={styles.saveText}>Update</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },
    title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },

    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: "500", marginBottom: 6 },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
    },

    textArea: { height: 100, textAlignVertical: "top" },

    row: { flexDirection: "row", gap: 12 },

    categoriesContainer: { flexDirection: "row", paddingVertical: 4 },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#D1D5DB",
        marginRight: 10,
    },
    activeCategoryButton: {
        backgroundColor: "#2563EB",
        borderColor: "#2563EB"
    },
    categoryText: { color: "#6B7280" },
    activeCategoryText: { color: "#fff", fontWeight: "500" },

    actions: { flexDirection: "row", gap: 12, marginTop: 20 },
    cancelButton: {
        flex: 1,
        padding: 16,
        backgroundColor: "#E5E7EB",
        borderRadius: 12,
        alignItems: "center",
    },
    saveButton: {
        flex: 1,
        padding: 16,
        backgroundColor: "#2563EB",
        borderRadius: 12,
        alignItems: "center",
    },
    saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    cancelText: { color: "#374151", fontSize: 16, fontWeight: "600" },
});
