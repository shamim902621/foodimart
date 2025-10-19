import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '',
    description: '',
    ingredients: '',
    preparationTime: '',
    tags: '',
    discount: '',
    weight: '',
    calories: '',
    nutritionalInfo: ''
  });

  const [images, setImages] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const categories = ["Fast Food", "Italian", "Beverages", "Snacks", "Desserts", "Healthy", "Indian", "Chinese", "Mexican"];
  const popularTags = ["Spicy", "Vegetarian", "Vegan", "Gluten-Free", "Best Seller", "New", "Seasonal", "Low Calorie"];

  const handleSave = () => {
    // Validation
    if (!form.name || !form.price || !form.category || !form.stock) {
      Alert.alert("Missing Fields", "Please fill in all required fields");
      return;
    }

    // Save product logic here
    console.log('Product Data:', { ...form, images, tags: selectedTags });
    Alert.alert("Success", "Product added successfully!");
    router.back();
  };

  const handleImageAdd = () => {
    // In real app, this would open image picker
    // For demo, we'll add placeholder images
    if (images.length < 5) {
      const newImage = `https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=300&fit=crop&${Date.now()}`;
      setImages([...images, newImage]);
    } else {
      Alert.alert("Limit Reached", "Maximum 5 images allowed");
    }
  };

  const handleImageRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      categories.unshift(newCategory.trim());
      setForm({...form, category: newCategory.trim()});
      setNewCategory('');
      setShowCategoryModal(false);
    }
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
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
                <Image source={{ uri: image }} style={styles.image} />
                <TouchableOpacity 
                  style={styles.removeImageBtn}
                  onPress={() => handleImageRemove(index)}
                >
                  <Ionicons name="close-circle" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
            
            {images.length < 5 && (
              <TouchableOpacity style={styles.addImageBtn} onPress={handleImageAdd}>
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
            onChangeText={(text) => setForm({...form, name: text})}
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
              onChangeText={(text) => setForm({...form, price: text})}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Original Price (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={form.originalPrice}
              onChangeText={(text) => setForm({...form, originalPrice: text})}
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
              onChangeText={(text) => setForm({...form, stock: text})}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Discount (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={form.discount}
              onChangeText={(text) => setForm({...form, discount: text})}
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
                onPress={() => setForm({...form, category})}
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
          
          {form.category ? (
            <Text style={styles.selectedCategory}>Selected: {form.category}</Text>
          ) : null}
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
            onChangeText={(text) => setForm({...form, description: text})}
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
            onChangeText={(text) => setForm({...form, ingredients: text})}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Preparation Time (mins)</Text>
            <TextInput
              style={styles.input}
              placeholder="15"
              keyboardType="numeric"
              value={form.preparationTime}
              onChangeText={(text) => setForm({...form, preparationTime: text})}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Weight (grams)</Text>
            <TextInput
              style={styles.input}
              placeholder="200"
              keyboardType="numeric"
              value={form.weight}
              onChangeText={(text) => setForm({...form, weight: text})}
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
              onChangeText={(text) => setForm({...form, calories: text})}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 2 }]}>
            <Text style={styles.label}>Nutritional Info</Text>
            <TextInput
              style={styles.input}
              placeholder="Protein: 0g, Carbs: 0g, Fat: 0g"
              value={form.nutritionalInfo}
              onChangeText={(text) => setForm({...form, nutritionalInfo: text})}
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
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Product</Text>
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
              autoFocus
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelBtn}
                onPress={() => setShowCategoryModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmBtn, !newCategory.trim() && styles.confirmBtnDisabled]}
                onPress={handleAddCategory}
                disabled={!newCategory.trim()}
              >
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
  container: { 
    flex: 1, 
    backgroundColor: "#F8F9FA", 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  form: {
    padding: 16,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#4CAF50",
    paddingLeft: 12,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  subLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  // Images Styles
  imagesContainer: {
    flexDirection: "row",
    gap: 12,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  addImageBtn: {
    width: 80,
    height: 80,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  addImageText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  // Category Styles
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addCategoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#E3F2FD",
    borderRadius: 6,
  },
  addCategoryText: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "500",
  },
  categoriesScroll: {
    flexDirection: "row",
    marginVertical: 8,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: 8,
  },
  categoryBtnActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  categoryText: {
    fontSize: 12,
    color: "#666",
  },
  categoryTextActive: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  selectedCategory: {
    fontSize: 12,
    color: "#4CAF50",
    fontStyle: "italic",
  },
  // Tags Styles
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  tagBtnActive: {
    backgroundColor: "#FF9800",
    borderColor: "#FF9800",
  },
  tagText: {
    fontSize: 12,
    color: "#666",
  },
  tagTextActive: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  // Save Button
  saveBtn: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalInput: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelBtnText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  confirmBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 6,
  },
  confirmBtnDisabled: {
    backgroundColor: "#C8E6C9",
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});