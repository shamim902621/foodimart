import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
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

// Import your hooks/constants
import { API_BASE_URL } from "../../constants/constant";
import { useAuth } from "../../hooks/useAuth";

// --- INTERFACES FOR TYPE SAFETY ---
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

// Define what an Image looks like in our state
interface ImageAsset {
  uri: string;
  name?: string | null;
  mimeType?: string | null;
  type?: 'image' | 'video'; // Expo ImagePicker uses 'type' for media type
}

export default function AddProduct() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);

  // 1. Typed Form State
  const [form, setForm] = useState<ProductForm>({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '',
    description: '',
    ingredients: '',
    preparationTime: '',
    discount: '',
    weight: '',
    calories: '',
    nutritionalInfo: ''
  });

  // 2. Typed Images State (Array of ImageAsset)
  const [images, setImages] = useState<ImageAsset[]>([]);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
      // We push the asset to our state array
      const asset = result.assets[0];
      setImages(prev => [...prev, {
        uri: asset.uri,
        name: asset.fileName,
        mimeType: asset.mimeType,
        type: 'image'
      }]);
    }
  };

  // --- HANDLE SAVE (FormData Logic) ---
  const handleSave = async () => {
    // Validation
    if (!form.name || !form.price || !form.category || !form.stock) {
      Alert.alert("Missing Fields", "Please fill in Name, Price, Category, and Stock.");
      return;
    }

    setLoading(true);

    try {
      // 3. Create FormData
      const formData = new FormData();

      // Append Text Fields
      formData.append('name', form.name);
      formData.append('price', form.price); // Backend should convert to float
      formData.append('originalPrice', form.originalPrice || '0');
      formData.append('category', form.category);
      formData.append('stock', form.stock);
      formData.append('description', form.description);
      formData.append('ingredients', form.ingredients);
      formData.append('preparationTime', form.preparationTime);
      formData.append('discount', form.discount || '0');
      formData.append('weight', form.weight);
      formData.append('calories', form.calories);
      formData.append('nutritionalInfo', form.nutritionalInfo);

      // Append Tags (Stringified array is safest for FormData)
      formData.append('tags', JSON.stringify(selectedTags));

      // 4. Append Images (FIXED TYPE ERROR HERE)
      images.forEach((image, index) => {
        const fileType = image.mimeType ?? 'image/jpeg';
        const fileName = image.name ?? `photo_${Date.now()}_${index}.jpg`;

        // The object structure React Native expects for file uploads:
        const fileToUpload = {
          uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
          name: fileName,
          type: fileType,
        };

        // TypeScript Fix: cast to 'any' because standard FormData expects Blob, 
        // but RN expects this specific object.
        formData.append('files', fileToUpload as any);
      });

      console.log("Sending FormData to Backend...");

      const response = await fetch(`${API_BASE_URL}/admin/shop/product/addProduct/${user?.userUUID}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // IMPORTANT: Do NOT set 'Content-Type': 'multipart/form-data' manually.
          // The fetch engine sets the boundary automatically.
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Product uploaded successfully!");
        router.back();
      } else {
        Alert.alert("Error", data.message || "Failed to upload product");
      }

    } catch (error: any) {
      console.error("Upload Error:", error);
      Alert.alert("Error", error.message || "Network request failed");
    } finally {
      setLoading(false);
    }
  };

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

  // Helper to update form fields safely
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
        <Text style={styles.title}>Add New Product</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        {/* Product Images */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Images *</Text>
          <Text style={styles.subLabel}>Add up to 5 images</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                {/* 5. Fixed: image is now an object, so use image.uri */}
                <Image source={{ uri: image.uri }} style={styles.image} />
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
                <Text style={styles.addImageText}>Select Image</Text>
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

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Save Product</Text>
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
  image: { width: 80, height: 80, borderRadius: 8 },
  removeImageBtn: { position: "absolute", top: -6, right: -6, backgroundColor: "#FFFFFF", borderRadius: 10 },
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
  selectedCategory: { fontSize: 12, color: "#4CAF50", fontStyle: "italic" },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tagBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#E0E0E0" },
  tagBtnActive: { backgroundColor: "#FF9800", borderColor: "#FF9800" },
  tagText: { fontSize: 12, color: "#666" },
  tagTextActive: { color: "#FFFFFF", fontWeight: "500" },
  saveBtn: { backgroundColor: "#4CAF50", padding: 16, borderRadius: 8, alignItems: "center", marginTop: 20, marginBottom: 40 },
  saveBtnDisabled: { backgroundColor: "#A5D6A7" },
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
  confirmBtnDisabled: { backgroundColor: "#C8E6C9" },
  confirmBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "500" },
});