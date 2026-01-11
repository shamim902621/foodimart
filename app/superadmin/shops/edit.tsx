import AppHeader from "@/components/AppHeader"; // ✅ Reusable Header
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
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
    const { id } = useLocalSearchParams();

    // UI States
    const [initialLoading, setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    const [form, setForm] = useState<ShopForm>({
        shopName: "", ownerName: "", ownerEmail: "", phone: "",
        street: "", city: "", state: "", zipCode: "",
        lat: "", lng: "", category: "", foodCategory: "", description: ""
    });

    const categoriesList = [
        "grocery", "medicine", "beauty & cosmetic",
        "electronics", "fashion", "sports",
        "food", "others"
    ];

    useEffect(() => {
        if (id) loadShop();
    }, [id]);

    // 1️⃣ LOAD SHOP DETAILS
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
            Alert.alert("Error", "Failed to load shop details", [
                { text: "Go Back", onPress: () => router.back() }
            ]);
        } finally {
            setInitialLoading(false);
        }
    };

    // 2️⃣ UPDATE API CALL
    const handleUpdate = async () => {
        if (!form.shopName || !form.ownerName || !form.category) {
            Alert.alert("Missing Fields", "Please fill required fields (*)");
            return;
        }

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
                Alert.alert("Success", "Shop updated successfully!", [
                    { text: "OK", onPress: () => router.back() }
                ]);
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
        return text.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    };

    // Helper Component for Labels
    const Label = ({ text }: { text: string }) => (
        <Text style={styles.label}>
            {text.replace("*", "")}
            {text.includes("*") && <Text style={{ color: '#EF4444' }}> *</Text>}
        </Text>
    );

    if (initialLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading shop details...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <AppHeader title="Edit Shop" showBack={true} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.formCard}>

                        {/* Section: Basic Info */}
                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>Basic Information</Text>

                            <View style={styles.inputGroup}>
                                <Label text="Shop Name *" />
                                <TextInput
                                    style={[styles.input, focusedInput === 'name' && styles.inputFocused]}
                                    value={form.shopName}
                                    placeholderTextColor="#9CA3AF"
                                    onChangeText={(text) => setForm({ ...form, shopName: text })}
                                    onFocus={() => setFocusedInput('name')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Label text="Description" />
                                <TextInput
                                    style={[styles.input, styles.textArea, focusedInput === 'desc' && styles.inputFocused]}
                                    multiline
                                    numberOfLines={3}
                                    value={form.description}
                                    placeholderTextColor="#9CA3AF"
                                    onChangeText={(text) => setForm({ ...form, description: text })}
                                    onFocus={() => setFocusedInput('desc')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                            </View>
                        </View>

                        {/* Section: Owner Info */}
                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>Owner Details</Text>

                            <View style={styles.inputGroup}>
                                <Label text="Owner Name *" />
                                <View style={styles.iconInputContainer}>
                                    <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.iconInput, focusedInput === 'owner' && styles.inputFocused]}
                                        placeholderTextColor="#9CA3AF"
                                        value={form.ownerName}
                                        onChangeText={(text) => setForm({ ...form, ownerName: text })}
                                        onFocus={() => setFocusedInput('owner')}
                                        onBlur={() => setFocusedInput(null)}
                                    />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Label text="Phone *" />
                                    <TextInput
                                        style={[styles.input, focusedInput === 'phone' && styles.inputFocused]}
                                        keyboardType="number-pad"
                                        placeholderTextColor="#9CA3AF"
                                        maxLength={10}
                                        value={form.phone}
                                        onFocus={() => setFocusedInput('phone')}
                                        onBlur={() => setFocusedInput(null)}
                                        onChangeText={(text) => {
                                            const digits = text.replace(/[^0-9]/g, "");
                                            if (digits.length <= 10) setForm({ ...form, phone: digits });
                                        }}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1.2 }]}>
                                    <Label text="Email *" />
                                    <TextInput
                                        style={[styles.input, focusedInput === 'email' && styles.inputFocused]}
                                        keyboardType="email-address"
                                        placeholderTextColor="#9CA3AF"
                                        value={form.ownerEmail}
                                        onChangeText={(text) => setForm({ ...form, ownerEmail: text })}
                                        onFocus={() => setFocusedInput('email')}
                                        onBlur={() => setFocusedInput(null)}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Section: Category */}
                        <View style={styles.section}>
                            <Label text="Business Category *" />
                            <View style={styles.categoryGrid}>
                                {categoriesList.map((cat) => {
                                    const isSelected = form.category === cat; // strict check
                                    return (
                                        <TouchableOpacity
                                            key={cat}
                                            style={[styles.categoryBadge, isSelected && styles.activeCategoryBadge]}
                                            onPress={() => setForm({
                                                ...form,
                                                category: cat,
                                                foodCategory: cat === "food" ? form.foodCategory : ""
                                            })}
                                        >
                                            <Text style={[styles.categoryText, isSelected && styles.activeCategoryText]}>
                                                {formatCategory(cat)}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Food Type Sub-selection */}
                            {form.category === "food" && (
                                <View style={styles.subCategoryBox}>
                                    <Label text="Food Type *" />
                                    <View style={styles.row}>
                                        {["veg", "non-veg", "mix"].map((type) => {
                                            const isSelected = form.foodCategory === type;
                                            return (
                                                <TouchableOpacity
                                                    key={type}
                                                    style={[styles.subCategoryBadge, isSelected && styles.activeSubCategoryBadge]}
                                                    onPress={() => setForm({ ...form, foodCategory: type })}
                                                >
                                                    <Text style={[styles.subCategoryText, isSelected && styles.activeSubCategoryText]}>
                                                        {formatCategory(type)}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Section: Address */}
                        <View style={[styles.section, { borderBottomWidth: 0 }]}>
                            <Text style={styles.sectionHeader}>Address</Text>

                            <View style={styles.inputGroup}>
                                <Label text="Street Address" />
                                <TextInput
                                    style={[styles.input, focusedInput === 'street' && styles.inputFocused]}
                                    placeholderTextColor="#9CA3AF"
                                    value={form.street}
                                    onChangeText={(text) => setForm({ ...form, street: text })}
                                    onFocus={() => setFocusedInput('street')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Label text="City" />
                                    <TextInput
                                        style={[styles.input, focusedInput === 'city' && styles.inputFocused]}
                                        placeholderTextColor="#9CA3AF"
                                        value={form.city}
                                        onChangeText={(text) => setForm({ ...form, city: text })}
                                        onFocus={() => setFocusedInput('city')}
                                        onBlur={() => setFocusedInput(null)}
                                    />
                                </View>

                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Label text="State" />
                                    <TextInput
                                        style={[styles.input, focusedInput === 'state' && styles.inputFocused]}
                                        placeholderTextColor="#9CA3AF"
                                        value={form.state}
                                        onChangeText={(text) => setForm({ ...form, state: text })}
                                        onFocus={() => setFocusedInput('state')}
                                        onBlur={() => setFocusedInput(null)}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Label text="Zip Code" />
                                <TextInput
                                    style={[styles.input, focusedInput === 'zip' && styles.inputFocused]}
                                    placeholderTextColor="#9CA3AF"
                                    value={form.zipCode}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    onChangeText={(text) => setForm({ ...form, zipCode: text })}
                                    onFocus={() => setFocusedInput('zip')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Spacer for bottom buttons */}
                    <View style={{ height: 120 }} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Sticky Footer Buttons */}
            <View style={styles.footerButtons}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                    disabled={loading}
                >
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.saveButton,
                        (!form.shopName || !form.ownerName || !form.category) && { opacity: 0.6 }
                    ]}
                    disabled={loading || !form.shopName || !form.ownerName || !form.category}
                    onPress={handleUpdate}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveText}>Update Shop</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F3F4F6" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#F3F4F6' },
    loadingText: { marginTop: 10, color: '#6B7280' },

    scrollContent: { padding: 16 },

    formCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    section: {
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 20,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 16,
    },

    // Inputs
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
    input: {
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: "#1F2937",
    },
    inputFocused: {
        borderColor: "#2563EB",
        backgroundColor: "#FFFFFF"
    },
    textArea: { height: 100, textAlignVertical: "top" },
    row: { flexDirection: "row", gap: 12 },

    // Icon Inputs
    iconInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
    },
    inputIcon: { marginLeft: 12 },
    iconInput: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 15,
        color: "#1F2937",
    },

    // Category Grid
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryBadge: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: "#F3F4F6",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "transparent",
    },
    activeCategoryBadge: {
        backgroundColor: "#EFF6FF",
        borderColor: "#2563EB",
    },
    categoryText: { fontSize: 13, color: "#4B5563", fontWeight: "500" },
    activeCategoryText: { color: "#2563EB", fontWeight: "700" },

    // Food Sub-Category
    subCategoryBox: {
        marginTop: 16,
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    subCategoryBadge: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    activeSubCategoryBadge: {
        borderColor: '#10B981',
        backgroundColor: '#ECFDF5',
    },
    subCategoryText: { fontSize: 13, color: '#6B7280' },
    activeSubCategoryText: { color: '#059669', fontWeight: '700' },

    // Footer Buttons
    footerButtons: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        flexDirection: "row",
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        // 🔥 Added padding to avoid conflict with Dashboard Tabs/Home Indicator
        paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    },
    cancelButton: {
        flex: 1,
        padding: 14,
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        alignItems: "center",
    },
    saveButton: {
        flex: 2,
        padding: 14,
        backgroundColor: "#2563EB",
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#2563EB",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    cancelText: { color: "#374151", fontSize: 16, fontWeight: "600" },
});