import { useAuth } from "@/hooks/useAuth";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "../../lib/apiService";

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
    category: string;
    foodCategory: string;
    description: string;
};

export default function EditShop() {
    const { token } = useAuth();
    const { id } = useLocalSearchParams();
    const [initialLoading, setInitialLoading] = useState(true);

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
        category: "",
        foodCategory: "",
        description: ""
    });

    const categoriesList = [
        "grocery",
        "medicine",
        "beauty & cosmetic",
        "electronics",
        "fashion",
        "sports",
        "food",
        "others"
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
            setInitialLoading(true);

            const response: any = await api(`/superadmin/shops/getShopById/${id}`);

            if (response?.success) {
                const s = response.data;

                setForm({
                    shopName: s.shop.name ?? "",
                    ownerName: s.shop.ownerName ?? "",
                    ownerEmail: s.user?.email ?? "",
                    phone: s.user?.mobile ?? "",
                    street: s.address?.street ?? "",
                    city: s.address?.city ?? "",
                    state: s.address?.state ?? "",
                    zipCode: s.address?.zipCode ?? "",
                    lat: s.address?.coordinates?.lat?.toString() ?? "",
                    lng: s.address?.coordinates?.lng?.toString() ?? "",
                    category: s.shop.category ?? "",
                    foodCategory: s.shop.foodCategory ?? "",
                    description: s.shop.description ?? "",
                });
            }
        } catch (err) {
            console.log("ERROR:", err);
            Alert.alert("Error", "Failed to load shop details");
        } finally {
            setInitialLoading(false);
        }
    };


    // -----------------------------
    // 2️⃣ TOGGLE CATEGORIES OUTSIDE UI
    // -----------------------------
    const toggleCategory = (category: string) => {
        setForm({
            ...form,
            category,
            foodCategory: category === "food" ? form.foodCategory : "",
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

                category: form.category,
                foodCategory: form.category === "food" ? form.foodCategory : null,

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


            const response: any = await api(`/superadmin/shops/editShop/${id}`, "PUT", payload);

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

    const formatCategory = (text: string) => {
        if (!text) return "";
        return text
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };
    if (initialLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Loading shop details...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Edit Shop</Text>
            {/* value={form.zipCode}
            onChangeText={(text) => setForm({ ...form, zipCode: text })} */}
            {/* SHOP NAME */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Shop Name *</Text>
                <TextInput
                    style={styles.input}
                    value={form.shopName}
                    placeholderTextColor="rgba(63, 69, 78, 0.4)"
                    onChangeText={(text) => setForm({ ...form, shopName: text })}
                />
            </View>

            {/* OWNER / PHONE */}
            <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Owner Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="rgba(63, 69, 78, 0.4)"
                        value={form.ownerName}
                        onChangeText={(text) => setForm({ ...form, ownerName: text })}
                    />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Phone *</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="phone-pad"
                        placeholderTextColor="rgba(63, 69, 78, 0.4)"
                        maxLength={10}
                        value={form.phone}
                        // onChangeText={(text) => setForm({ ...form, phone: text })}
                        onChangeText={(text) => {
                            const digits = text.replace(/[^0-9]/g, "");
                            if (digits.length <= 10) {
                                setForm({ ...form, phone: digits });
                            }
                        }}

                    />
                </View>
            </View>

            {/* EMAIL */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Owner Email *</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="email-address"
                    placeholderTextColor="rgba(63, 69, 78, 0.4)"
                    value={form.ownerEmail}
                    onChangeText={(text) => setForm({ ...form, ownerEmail: text })}
                />
            </View>

            {/* CATEGORY MULTI SELECT */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Category *</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                    {categoriesList.map((cat) => {
                        const isSelected = form.category === cat.toLowerCase();

                        return (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.categoryButton,
                                    isSelected && styles.activeCategoryButton
                                ]}
                                // onPress={() => toggleCategory(cat)}
                                onPress={() => toggleCategory(cat.toLowerCase())}

                            >
                                <Text
                                    style={[
                                        styles.categoryText,
                                        isSelected && styles.activeCategoryText
                                    ]}
                                >
                                    {formatCategory(cat)}
                                    {/* {cat} */}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
            {form.category === "food" && (
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Food Type *</Text>

                    <View style={styles.row}>
                        {["veg", "non-veg", "mix"].map((type) => {
                            const isSelected = form.foodCategory === type;

                            return (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.categoryButton,
                                        isSelected && styles.activeCategoryButton,
                                    ]}
                                    onPress={() =>
                                        setForm({ ...form, foodCategory: type })
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            isSelected && styles.activeCategoryText,
                                        ]}
                                    >
                                        {/* {type.toUpperCase()} */}
                                        {formatCategory(type)}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            )}

            {/* ADDRESS */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Street</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="rgba(63, 69, 78, 0.4)"
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
                        placeholderTextColor="rgba(63, 69, 78, 0.4)"
                        value={form.city}
                        onChangeText={(text) => setForm({ ...form, city: text })}
                    />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>State</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="rgba(63, 69, 78, 0.4)"
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
                    placeholderTextColor="rgba(63, 69, 78, 0.4)"
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
                    placeholderTextColor="rgba(63, 69, 78, 0.4)"
                    onChangeText={(text) => setForm({ ...form, description: text })}
                />
            </View>

            {/* BUTTONS */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.saveButton,
                        (!form.shopName || !form.ownerName || !form.category) && { opacity: 0.6 }
                    ]}
                    disabled={!form.shopName || !form.ownerName || !form.category}
                    onPress={handleUpdate}
                >
                    <Text style={styles.saveText}>
                        {loading ? "Updating..." : "Update"}
                    </Text>
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
