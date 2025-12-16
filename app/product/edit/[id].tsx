import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

// --- Adjust these paths to match your folder structure ---
import { API_BASE_URL } from "../../../constants/constant";
import { useAuth } from "../../../hooks/useAuth";

// --- INTERFACES ---
interface ProductForm {
    name: string;
    price: string;
    originalPrice: string;
    category: string;
    stock: string;
    description: string;
    ingredients: string;
    preparationTime: string;
    discount: string;
    weight: string;
    calories: string;
    nutritionalInfo: string;
}

interface ImageAsset {
    uri: string;
    name?: string | null;
    mimeType?: string | null;
    type?: 'image' | 'video';
    isExisting?: boolean; // Vital flag to distinguish old vs new images
}

export default function EditProduct() {
    const { id, productData } = useLocalSearchParams();
    const { token, user } = useAuth();
    const [loading, setLoading] = useState(false);

    // --- INITIALIZATION LOGIC ---
    // Parse the product data passed from the previous screen
    const initialData = productData ? JSON.parse(productData as string) : {};

    // 1. Form State (Pre-filled)
    const [form, setForm] = useState<ProductForm>({
        name: initialData.name || '',
        price: String(initialData.price || ''),
        originalPrice: String(initialData.originalPrice || ''),
        category: initialData.category || '',
        stock: String(initialData.stock || ''),
        description: initialData.description || '',
        ingredients: initialData.ingredients || '',
        preparationTime: String(initialData.preparationTime || ''),
        discount: String(initialData.discount || ''),
        weight: initialData.weight || '',
        calories: String(initialData.calories || ''),
        nutritionalInfo: initialData.nutritionalInfo || ''
    });

    // 2. Images State (Pre-filled with existing URLs)
    const [images, setImages] = useState<ImageAsset[]>(
        initialData.images?.map((url: string) => ({
            uri: url,
            name: 'existing_image',
            type: 'image',
            isExisting: true // Mark these as existing
        })) || []
    );

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>(initialData.tags || []);

    const categories = ["Fast Food", "Italian", "Beverages", "Snacks", "Desserts", "Healthy", "Indian", "Chinese", "Mexican"];
    const popularTags = ["Spicy", "Vegetarian", "Vegan", "Gluten-Free", "Best Seller", "New", "Seasonal", "Low Calorie"];

    // --- IMAGE PICKER ---
    const pickImage = async () => {
        if (images.length >= 5) {
            Alert.alert("Limit Reached", "Maximum 5 images allowed");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            setImages(prev => [...prev, {
                uri: asset.uri,
                name: asset.fileName,
                mimeType: asset.mimeType,
                type: 'image',
                isExisting: false // Mark as NEW
            }]);
        }
    };

    // --- HANDLE UPDATE (PUT REQUEST) ---
    const handleUpdate = async () => {
        // Basic Validation
        if (!form.name || !form.price || !form.category || !form.stock) {
            Alert.alert("Missing Fields", "Please fill in Name, Price, Category, and Stock.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            // 1. Append Text Fields
            Object.keys(form).forEach(key => {
                formData.append(key, form[key as keyof ProductForm]);
            });

            // 2. Append Tags
            formData.append('tags', JSON.stringify(selectedTags));

            // 3. Separate Images (Crucial Step)
            const existingImages = images.filter(img => img.isExisting).map(img => img.uri);
            const newImages = images.filter(img => !img.isExisting);

            // 4. Send Existing URLs list
            formData.append('existingImages', JSON.stringify(existingImages));

            // 5. Append NEW Files
            newImages.forEach((image, index) => {
                const fileType = image.mimeType ?? 'image/jpeg';
                const fileName = image.name ?? `photo_${Date.now()}_${index}.jpg`;

                const fileToUpload = {
                    uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
                    name: fileName,
                    type: fileType,
                };

                formData.append('files', fileToUpload as any);
            });

            console.log("Sending Update Request...");

            // NOTE: Using PUT method here
            const response = await fetch(`${API_BASE_URL}/admin/shop/product/updateProduct/${id}?userUUID=${user?.userUUID}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Content-Type is set automatically by fetch for FormData
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Product updated successfully!");
                router.back(); // Go back to list
            } else {
                Alert.alert("Error", data.message || "Failed to update product");
            }

        } catch (error: any) {
            console.error("Update Error:", error);
            Alert.alert("Error", error.message || "Network request failed");
        } finally {
            setLoading(false);
        }
    };

    // --- HELPER FUNCTIONS ---
    const handleImageRemove = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleAddCategory = () => {
        if (newCategory.trim() && !categories.includes(newCategory.trim())) {
            categories.unshift(newCategory.trim());
            setForm({ ...form, category: newCategory.trim() });
            setNewCategory('');
            setShowCategoryModal(false);
        }
    };

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const updateForm = (key: keyof ProductForm, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Edit Product</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.form}>
                {/* Product Images */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Product Images</Text>
                    <Text style={styles.subLabel}>Manage existing or add new images (Max 5)</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
                        {images.map((image, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image source={{ uri: image.uri }} style={styles.image} />

                                {/* Visual Indicator for New Images (Optional) */}
                                {!image.isExisting && (
                                    <View style={styles.newBadge}>
                                        <Text style={styles.newBadgeText}>NEW</Text>
                                    </View>
                                )}

                                <TouchableOpacity
                                    style={styles.removeImageBtn}
                                    onPress={() => handleImageRemove(index)}
                                >
                                    <Ionicons name="close-circle" size={20} color="#FF6B6B" />
                                </TouchableOpacity>
                            </View>
                        ))}

                        {images.length < 5 && (
                            <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
                                <Ionicons name="camera" size={24} color="#666" />
                                <Text style={styles.addImageText}>Add Image</Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </View>

                {/* Basic Information */}
                <Text style={styles.sectionTitle}>Basic Information</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Product Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter product name"
                        value={form.name}
                        onChangeText={(text) => updateForm('name', text)}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Selling Price (₹) *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            keyboardType="numeric"
                            value={form.price}
                            onChangeText={(text) => updateForm('price', text)}
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Original Price (₹)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            keyboardType="numeric"
                            value={form.originalPrice}
                            onChangeText={(text) => updateForm('originalPrice', text)}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Stock Quantity *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0"
                            keyboardType="numeric"
                            value={form.stock}
                            onChangeText={(text) => updateForm('stock', text)}
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Discount (%)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0"
                            keyboardType="numeric"
                            value={form.discount}
                            onChangeText={(text) => updateForm('discount', text)}
                        />
                    </View>
                </View>

                {/* Category Selection */}
                <View style={styles.inputGroup}>
                    <View style={styles.categoryHeader}>
                        <Text style={styles.label}>Category *</Text>
                        <TouchableOpacity
                            style={styles.addCategoryBtn}
                            onPress={() => setShowCategoryModal(true)}
                        >
                            <Text style={styles.addCategoryText}>+ Add New</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryBtn,
                                    form.category === category && styles.categoryBtnActive
                                ]}
                                onPress={() => updateForm('category', category)}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    form.category === category && styles.categoryTextActive
                                ]}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Product Details */}
                <Text style={styles.sectionTitle}>Product Details</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Enter product description..."
                        multiline
                        numberOfLines={4}
                        value={form.description}
                        onChangeText={(text) => updateForm('description', text)}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Ingredients</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="List ingredients separated by commas..."
                        multiline
                        numberOfLines={3}
                        value={form.ingredients}
                        onChangeText={(text) => updateForm('ingredients', text)}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Preparation Time</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="15 mins"
                            value={form.preparationTime}
                            onChangeText={(text) => updateForm('preparationTime', text)}
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Weight</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="200g"
                            value={form.weight}
                            onChangeText={(text) => updateForm('weight', text)}
                        />
                    </View>
                </View>

                {/* Nutritional Information */}
                <Text style={styles.sectionTitle}>Nutritional Information</Text>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Calories</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0"
                            keyboardType="numeric"
                            value={form.calories}
                            onChangeText={(text) => updateForm('calories', text)}
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 2 }]}>
                        <Text style={styles.label}>Nutritional Info</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Protein: 0g..."
                            value={form.nutritionalInfo}
                            onChangeText={(text) => updateForm('nutritionalInfo', text)}
                        />
                    </View>
                </View>

                {/* Tags */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Product Tags</Text>
                    <View style={styles.tagsContainer}>
                        {popularTags.map((tag) => (
                            <TouchableOpacity
                                key={tag}
                                style={[
                                    styles.tagBtn,
                                    selectedTags.includes(tag) && styles.tagBtnActive
                                ]}
                                onPress={() => toggleTag(tag)}
                            >
                                <Text style={[
                                    styles.tagText,
                                    selectedTags.includes(tag) && styles.tagTextActive
                                ]}>
                                    {tag}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Update Button */}
                <TouchableOpacity
                    style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
                    onPress={handleUpdate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveBtnText}>Update Product</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Add Category Modal */}
            <Modal
                visible={showCategoryModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCategoryModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add New Category</Text>
                            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Enter category name"
                            value={newCategory}
                            onChangeText={setNewCategory}
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCategoryModal(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmBtn} onPress={handleAddCategory}>
                                <Text style={styles.confirmBtnText}>Add Category</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F9FA" },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#E0E0E0" },
    backBtn: { padding: 4 },
    title: { fontSize: 18, fontWeight: "600", color: "#333" },
    form: { padding: 16, gap: 20 },
    sectionTitle: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 8, borderLeftWidth: 3, borderLeftColor: "#4CAF50", paddingLeft: 12 },
    inputGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: "600", color: "#333" },
    subLabel: { fontSize: 12, color: "#666", marginBottom: 8 },
    input: { backgroundColor: "#FFFFFF", padding: 12, borderRadius: 8, fontSize: 14, borderWidth: 1, borderColor: "#E0E0E0" },
    textArea: { height: 80, textAlignVertical: 'top' },
    row: { flexDirection: "row", gap: 12 },
    imagesContainer: { flexDirection: "row", gap: 12 },
    imageWrapper: { position: "relative", marginRight: 12 },
    image: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#eee' },
    removeImageBtn: { position: "absolute", top: -6, right: -6, backgroundColor: "#FFFFFF", borderRadius: 10 },
    newBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#4CAF50', paddingHorizontal: 4, borderTopLeftRadius: 4, borderBottomRightRadius: 8 },
    newBadgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },
    addImageBtn: { width: 80, height: 80, backgroundColor: "#F5F5F5", borderRadius: 8, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E0E0E0", borderStyle: "dashed" },
    addImageText: { fontSize: 12, color: "#666", marginTop: 4 },
    categoryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    addCategoryBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#E3F2FD", borderRadius: 6 },
    addCategoryText: { fontSize: 12, color: "#2196F3", fontWeight: "500" },
    categoriesScroll: { flexDirection: "row", marginVertical: 8 },
    categoryBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: "#E0E0E0", marginRight: 8 },
    categoryBtnActive: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
    categoryText: { fontSize: 12, color: "#666" },
    categoryTextActive: { color: "#FFFFFF", fontWeight: "500" },
    tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    tagBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#E0E0E0" },
    tagBtnActive: { backgroundColor: "#FF9800", borderColor: "#FF9800" },
    tagText: { fontSize: 12, color: "#666" },
    tagTextActive: { color: "#FFFFFF", fontWeight: "500" },
    saveBtn: { backgroundColor: "#2563EB", padding: 16, borderRadius: 8, alignItems: "center", marginTop: 20, marginBottom: 40 }, // Changed color to Blue for Update
    saveBtnDisabled: { backgroundColor: "#93C5FD" },
    saveBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20 },
    modalContent: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 20, width: "100%", maxWidth: 400 },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    modalTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
    modalInput: { backgroundColor: "#F5F5F5", padding: 12, borderRadius: 8, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: "#E0E0E0" },
    modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
    cancelBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
    cancelBtnText: { color: "#666", fontSize: 14, fontWeight: "500" },
    confirmBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: "#4CAF50", borderRadius: 6 },
    confirmBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "500" },
});