// // app/superadmin/shops/create.tsx
// import AppHeader from "@/components/profileHeader";
// import { router } from "expo-router";
// import { useState } from "react";
// import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { useAuth } from "../../context/AuthContext";
// import { api } from "../../lib/apiService";

// type ShopForm = {
//   shopName: string;
//   ownerName: string;
//   ownerEmail: string;
//   phone: string;
//   street: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   lat: string;
//   lng: string;
//   categories: string;     // <--- IMPORTANT
//   foodCategory: string;
//   description: string;
// };


// export default function CreateShop() {
//   const { user } = useAuth();
//   const categoriess = [
//     "grocery",
//     "medicine",
//     "beauty & cosmetic",
//     "electronics",
//     "fashion",
//     "sports",
//     "food",
//     "others"
//   ];

//   const [form, setForm] = useState<ShopForm>({
//     shopName: "",
//     ownerName: "",
//     ownerEmail: "",
//     phone: "",
//     street: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     lat: "",
//     lng: "",
//     categories: "",
//     foodCategory: "",
//     description: ""
//   });

//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<Partial<ShopForm>>({});

//   const toggleCategory = (category: string) => {
//     setForm({
//       ...form,
//       categories: category,
//       foodCategory: category === "food" ? form.foodCategory : "", // reset if not food
//     });
//   };

//   //   // 3️⃣ Validation Logic
//   const validateForm = () => {
//     let newErrors: Partial<ShopForm> = {};
//     let isValid = true;

//     if (!form.shopName.trim()) {
//       newErrors.shopName = "Shop Name is required";
//       isValid = false;
//     }
//     else if (!form.ownerName.trim()) {
//       newErrors.ownerName = "Owner Name is required";
//       isValid = false;
//     }
//     // ✅ Check exact length of 10 digits
//     else if (!form.phone.trim() || form.phone.length !== 10) {
//       newErrors.phone = "Phone must be exactly 10 digits";
//       isValid = false;
//     }
//     else if (!form.ownerEmail.trim() || form.ownerEmail.length !== 10) {
//       newErrors.phone = "Phone must be exactly 10 digits";
//       isValid = false;
//     }
//     else if (!form.categories) {
//       newErrors.categories = "Please select a category";
//       isValid = false;
//     }
//     else if (form.categories === "food" && !form.foodCategory) {
//       newErrors.foodCategory = "Food type is required";
//       isValid = false;
//     }
//     else {
//       setErrors(newErrors);
//     }

//     return isValid;
//   };



//   const handleSubmit = async () => {
//     if (
//       !form.shopName ||
//       !form.ownerName ||
//       !form.ownerEmail ||
//       !form.phone ||
//       !form.categories
//     ) {
//       Alert.alert("Missing Fields", "Please fill all required fields (*)");
//       return;
//     }
//     // 🔥 food category validation
//     if (form.categories === "food" && !form.foodCategory) {
//       Alert.alert("Missing Food Type", "Please select Veg / Non-Veg / Mix");
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = {
//         name: form.shopName,
//         description: form.description,
//         adminId: user?.id,

//         category: form.categories,          // ✅ single category
//         foodCategory: form.categories === "food" ? form.foodCategory : null,

//         address: {
//           street: form.street,
//           city: form.city,
//           state: form.state,
//           zipCode: form.zipCode,
//           coordinates: {
//             lat: Number(form.lat) || 0,
//             lng: Number(form.lng) || 0,
//           },
//         },

//         contact: {
//           phone: form.phone,
//           email: form.ownerEmail,
//         },

//         ownerName: form.ownerName,
//       };

//       console.log(payload);

//       const response: any = await api("/superadmin/shops/createShop", "POST", payload,);

//       const data = await response.json();  // <-- IMPORTANT

//       if (response.ok) {
//         Alert.alert("Success", data.message || "Shop created successfully!");
//         router.back();
//       } else {
//         Alert.alert("Error", data.message || "Something went wrong");
//       }

//     } catch (err: any) {
//       Alert.alert("Error", err.message);
//     } finally {
//       setLoading(false);
//       router.back();
//     }
//   };

//   const formatCategory = (text: string) => {
//     if (!text) return "";
//     return text
//       .split(" ")
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <AppHeader title="Create Shop" showBack={true} />

//       {/* Form */}
//       <View style={styles.formCard}>
//         <Text style={styles.formTitle}>Shop Information</Text>

//         <View style={styles.form}>
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Shop Name *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g. Food Mart Indiranagar"
//               placeholderTextColor="rgba(63, 69, 78, 0.4)"
//               value={form.shopName}
//               onChangeText={(text) => setForm({ ...form, shopName: text })}
//             />
//           </View>

//           <View style={styles.row}>
//             <View style={[styles.inputGroup, { flex: 1 }]}>
//               <Text style={styles.label}>Owner Name *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g. Shamim Ahmad"
//                 placeholderTextColor="rgba(63, 69, 78, 0.4)"
//                 value={form.ownerName}
//                 onChangeText={(text) => setForm({ ...form, ownerName: text })}
//               />
//             </View>
//             <View style={[styles.inputGroup, { flex: 1 }]}>
//               <Text style={styles.label}>Phone *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="9876543210"
//                 keyboardType="number-pad"
//                 placeholderTextColor="rgba(63, 69, 78, 0.4)"
//                 maxLength={10}                 // ✅ hard limit
//                 value={form.phone}
//                 onChangeText={(text) => {
//                   // ✅ allow only digits
//                   const digitsOnly = text.replace(/[^0-9]/g, "");

//                   // ✅ limit to 10 digits
//                   if (digitsOnly.length <= 10) {
//                     setForm({ ...form, phone: digitsOnly });
//                   }
//                 }}
//               />
//             </View>

//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Owner Email *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="owner@shop.com"
//               keyboardType="email-address"
//               placeholderTextColor="rgba(63, 69, 78, 0.4)"
//               value={form.ownerEmail}
//               onChangeText={(text) => setForm({ ...form, ownerEmail: text })}
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Category *</Text>

//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               style={styles.categoriesContainer}
//             >
//               {categoriess.map((category) => {
//                 const isSelected = form.categories === category; // ✅ string compare

//                 return (
//                   <TouchableOpacity
//                     key={category}
//                     style={[
//                       styles.categoryButton,
//                       isSelected && styles.activeCategoryButton,
//                     ]}
//                     onPress={() => toggleCategory(category)}
//                   >
//                     <Text
//                       style={[
//                         styles.categoryText,
//                         isSelected && styles.activeCategoryText,
//                       ]}
//                     >
//                       {formatCategory(category)} {/* ✅ display only */}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </ScrollView>
//           </View>

//           {/* Show food type only if category is food */}
//           {form.categories === "food" && (
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Food Type *</Text>

//               <View style={styles.row}>
//                 {["veg", "non-veg", "mix"].map((type) => {
//                   const isSelected = form.foodCategory === type;

//                   return (
//                     <TouchableOpacity
//                       key={type}
//                       style={[
//                         styles.categoryButton,
//                         isSelected && styles.activeCategoryButton,
//                       ]}
//                       onPress={() =>
//                         setForm({ ...form, foodCategory: type })
//                       }
//                     >
//                       <Text
//                         style={[
//                           styles.categoryText,
//                           isSelected && styles.activeCategoryText,
//                         ]}
//                       >
//                         {formatCategory(type)}{/* ✅ display only */}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </View>
//             </View>
//           )}


//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Street Address *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g. 243 Indira Nagar Main Road"
//               placeholderTextColor="rgba(63, 69, 78, 0.4)"
//               value={form.street}
//               onChangeText={(text) => setForm({ ...form, street: text })}
//             />
//           </View>

//           <View style={styles.row}>
//             <View style={[styles.inputGroup, { flex: 1 }]}>
//               <Text style={styles.label}>City</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g. Bangalore"
//                 placeholderTextColor="rgba(63, 69, 78, 0.4)"
//                 value={form.city}
//                 onChangeText={(text) => setForm({ ...form, city: text })}
//               />
//             </View>

//             <View style={[styles.inputGroup, { flex: 1 }]}>
//               <Text style={styles.label}>State</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g. Karnataka"
//                 placeholderTextColor="rgba(63, 69, 78, 0.4)"
//                 value={form.state}
//                 onChangeText={(text) => setForm({ ...form, state: text })}
//               />
//             </View>
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Zip Code</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="560038"
//               keyboardType="number-pad"
//               placeholderTextColor="rgba(63, 69, 78, 0.4)"
//               maxLength={6}
//               value={form.zipCode}
//               onChangeText={(text) => setForm({ ...form, zipCode: text })}
//             />
//           </View>

//           {/* <Text style={[styles.label, { marginTop: 10 }]}>Location Coordinates (Optional)</Text>

//           <View style={styles.row}>
//             <View style={[styles.inputGroup, { flex: 1 }]}>
//               <Text style={styles.label}>Latitude</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g. 12.9716"
//                 keyboardType="numeric"
//                 value={form.lat}
//                 onChangeText={(text) => setForm({ ...form, lat: text })}
//               />
//             </View>

//             <View style={[styles.inputGroup, { flex: 1 }]}>
//               <Text style={styles.label}>Longitude</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g. 77.5946"
//                 keyboardType="numeric"
//                 value={form.lng}
//                 onChangeText={(text) => setForm({ ...form, lng: text })}
//               />
//             </View>
//           </View> */}

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Description</Text>
//             <TextInput
//               style={[styles.input, styles.textArea]}
//               placeholder="Brief description about the shop"
//               placeholderTextColor="rgba(63, 69, 78, 0.4)"
//               multiline
//               numberOfLines={3}
//               value={form.description}
//               onChangeText={(text) => setForm({ ...form, description: text })}
//             />
//           </View>
//         </View>
//       </View>

//       {/* Action Buttons */}
//       <View style={styles.actionButtons}>
//         <TouchableOpacity
//           style={styles.cancelButton}
//           onPress={() => router.back()}
//         >
//           <Text style={styles.cancelButtonText}>Cancel</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.submitButton}
//           onPress={handleSubmit}
//         >
//           <Text style={styles.submitButtonText}>Create Shop</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//     // padding: 16,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     // marginBottom: 24,
//   },
//   // backButton: {
//   //   padding: 8,
//   //   marginRight: 12,
//   // },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#111827",
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#6B7280",
//   },
//   formCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   formTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 16,
//   },
//   form: {
//     gap: 20,
//   },
//   inputGroup: {
//     gap: 8,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#374151",
//   },
//   input: {
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 12,
//     padding: 16,
//     fontSize: 16,
//     color: "#374151",
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   row: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   categoriesContainer: {
//     flexDirection: "row",
//   },
//   categoryButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     marginRight: 8,
//   },
//   activeCategoryButton: {
//     backgroundColor: "#2563EB",
//     borderColor: "#2563EB",
//   },
//   categoryText: {
//     fontSize: 14,
//     color: "#6B7280",
//   },
//   activeCategoryText: {
//     color: "#FFFFFF",
//     fontWeight: "500",
//   },
//   actionButtons: {
//     flexDirection: "row",
//     gap: 12,
//     marginBottom: 22
//   },
//   cancelButton: {
//     flex: 1,
//     backgroundColor: "#E5E7EB",
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   cancelButtonText: {
//     color: "#374151",
//     fontWeight: "600",
//     fontSize: 16,
//   },
//   submitButton: {
//     flex: 1,
//     backgroundColor: "#2563EB",
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   submitButtonText: {
//     color: "#FFFFFF",
//     fontWeight: "600",
//     fontSize: 16,
//   },
// });



import AppHeader from "@/components/profileHeader";
import { router } from "expo-router";
import { useState } from "react";
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
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/apiService";

// Types matching your Form
type ShopForm = {
  shopName: string;
  ownerName: string;
  ownerEmail: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  categories: string;
  foodCategory: string;
  description: string;
};

export default function CreateShop() {
  const { user } = useAuth();

  const categoriess = [
    "grocery", "medicine", "beauty & cosmetic", "electronics",
    "fashion", "sports", "food", "others"
  ];

  // 1️⃣ State for Form Data
  const [form, setForm] = useState<ShopForm>({
    shopName: "",
    ownerName: "",
    ownerEmail: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    categories: "",
    foodCategory: "",
    description: ""
  });

  // 2️⃣ State for Validation Errors
  const [errors, setErrors] = useState<Partial<ShopForm>>({});
  const [loading, setLoading] = useState(false);

  // Helper: Updates field & CLEARS validation error for that field
  const handleChange = (field: keyof ShopForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleCategory = (category: string) => {
    setForm({
      ...form,
      categories: category,
      foodCategory: category === "food" ? "mix" : "",
    });
    if (errors.categories) setErrors(prev => ({ ...prev, categories: undefined }));
  };

  // 3️⃣ Validation Logic (Checks ALL fields at once)
  const validateForm = () => {
    let newErrors: Partial<ShopForm> = {};
    let isValid = true;

    if (!form.shopName.trim()) {
      newErrors.shopName = "Shop Name is required";
      isValid = false;
    }
    if (!form.ownerName.trim()) {
      newErrors.ownerName = "Owner Name is required";
      isValid = false;
    }
    // Check Email (NotEmpty)
    if (!form.ownerEmail.trim()) {
      newErrors.ownerEmail = "Owner Email is required";
      isValid = false;
    }
    // Check Phone (Exact 10 digits)
    if (!form.phone.trim() || form.phone.length !== 10) {
      newErrors.phone = "Phone must be exactly 10 digits";
      isValid = false;
    }
    if (!form.categories) {
      newErrors.categories = "Please select a category";
      isValid = false;
    }
    if (form.categories === "food" && !form.foodCategory) {
      newErrors.foodCategory = "Food type is required";
      isValid = false;
    }

    setErrors(newErrors); // Update UI with red borders
    return isValid;
  };

  //   const handleSubmit = async () => {
  //  if (!validateForm()) {
  //     Alert.alert("Missing Details", "Please fix the red highlighted fields.");
  //     return;
  //   }


  //     try {
  //       setLoading(true);

  //       const payload = {
  //         name: form.shopName,
  //         description: form.description,
  //         adminId: user?.id,

  //         category: form.categories,          // ✅ single category
  //         foodCategory: form.categories === "food" ? form.foodCategory : null,

  //         address: {
  //           street: form.street,
  //           city: form.city,
  //           state: form.state,
  //           zipCode: form.zipCode,
  //           coordinates: {
  //             lat: Number(form.lat) || 0,
  //             lng: Number(form.lng) || 0,
  //           },
  //         },

  //         contact: {
  //           phone: form.phone,
  //           email: form.ownerEmail,
  //         },

  //         ownerName: form.ownerName,
  //       };

  //       console.log(payload);

  //       const response: any = await api("/superadmin/shops/createShop", "POST", payload,);

  //       const data = await response.json();  // <-- IMPORTANT

  //       if (response.ok) {
  //         Alert.alert("Success", data.message || "Shop created successfully!");
  //         router.back();
  //       } else {
  //         Alert.alert("Error", data.message || "Something went wrong");
  //       }

  //     } catch (err: any) {
  //       Alert.alert("Error", err.message);
  //     } finally {
  //       setLoading(false);
  //       router.back();
  //     }
  //   };

  const handleSubmit = async () => {
    // 1. Run Validation
    if (!validateForm()) {
      Alert.alert("Missing Details", "Please fix the red highlighted fields.");
      return;
    }

    try {
      setLoading(true);

      // 🔥 FIX: Restructuring payload to match API Error Requirements
      const payload = {
        name: form.shopName,
        description: form.description,
        adminId: user?.id,

        category: form.categories,          // ✅ single category
        foodCategory: form.categories === "food" ? form.foodCategory : null,

        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          // coordinates: {
          //   lat: Number(form.lat) || 0,
          //   lng: Number(form.lng) || 0,
          // },
        },

        contact: {
          phone: form.phone,
          email: form.ownerEmail,
        },

        ownerName: form.ownerName,
      };

      console.log(payload);

      console.log("Sending Payload:", JSON.stringify(payload, null, 2));

      const response: any = await api("/superadmin/shops/createShop", "POST", payload);
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Shop created successfully!", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        // Show specific error from backend if available
        Alert.alert("Error", data.message || "Something went wrong");
      }

    } catch (err: any) {
      console.error("API Error:", err);
      Alert.alert("Network Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCategory = (text: string) => {
    if (!text) return "";
    return text.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <AppHeader title="Create Shop" showBack={true} />

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Shop Information</Text>

          <View style={styles.form}>

            {/* SHOP NAME */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Shop Name <Text style={styles.req}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.shopName && styles.inputError]}
                placeholder="e.g. Food Mart Indiranagar"
                placeholderTextColor="#9CA3AF"
                value={form.shopName}
                onChangeText={(text) => handleChange("shopName", text)}
              />
              {errors.shopName && <Text style={styles.errorText}>{errors.shopName}</Text>}
            </View>

            {/* OWNER & PHONE ROW */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Owner Name <Text style={styles.req}>*</Text></Text>
                <TextInput
                  style={[styles.input, errors.ownerName && styles.inputError]}
                  placeholder="e.g. Shamim"
                  placeholderTextColor="#9CA3AF"
                  value={form.ownerName}
                  onChangeText={(text) => handleChange("ownerName", text)}
                />
                {errors.ownerName && <Text style={styles.errorText}>{errors.ownerName}</Text>}
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Phone <Text style={styles.req}>*</Text></Text>
                <TextInput
                  style={[styles.input, errors.phone && styles.inputError]}
                  placeholder="9876543210"
                  keyboardType="number-pad"
                  placeholderTextColor="#9CA3AF"
                  maxLength={10}
                  value={form.phone}
                  onChangeText={(text) => {
                    const digits = text.replace(/[^0-9]/g, "");
                    handleChange("phone", digits);
                  }}
                />
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>
            </View>

            {/* EMAIL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Owner Email <Text style={styles.req}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.ownerEmail && styles.inputError]}
                placeholder="owner@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
                value={form.ownerEmail}
                onChangeText={(text) => handleChange("ownerEmail", text)}
              />
              {errors.ownerEmail && <Text style={styles.errorText}>{errors.ownerEmail}</Text>}
            </View>

            {/* CATEGORIES */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category <Text style={styles.req}>*</Text></Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                {categoriess.map((category) => {
                  const isSelected = form.categories === category;
                  return (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryButton,
                        isSelected && styles.activeCategoryButton,
                        errors.categories && !isSelected && { borderColor: '#EF4444' }
                      ]}
                      onPress={() => toggleCategory(category)}
                    >
                      <Text style={[styles.categoryText, isSelected && styles.activeCategoryText]}>
                        {formatCategory(category)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {errors.categories && <Text style={styles.errorText}>{errors.categories}</Text>}
            </View>

            {/* FOOD TYPE (Conditional) */}
            {form.categories === "food" && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Food Type <Text style={styles.req}>*</Text></Text>
                <View style={styles.row}>
                  {["veg", "non-veg", "mix"].map((type) => {
                    const isSelected = form.foodCategory === type;
                    return (
                      <TouchableOpacity
                        key={type}
                        style={[styles.categoryButton, isSelected && styles.activeCategoryButton]}
                        onPress={() => handleChange("foodCategory", type)}
                      >
                        <Text style={[styles.categoryText, isSelected && styles.activeCategoryText]}>
                          {formatCategory(type)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {errors.foodCategory && <Text style={styles.errorText}>{errors.foodCategory}</Text>}
              </View>
            )}

            {/* ADDRESS */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Street Address</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 243 Main Road"
                placeholderTextColor="#9CA3AF"
                value={form.street}
                onChangeText={(text) => handleChange("street", text)}
              />
            </View>

           
            <View style={styles.inputGroup}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g.himachal"
                placeholderTextColor="#9CA3AF"
                value={form.state}
                onChangeText={(text) => handleChange("state", text)}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Bangalore"
                  placeholderTextColor="#9CA3AF"
                  value={form.city}
                  onChangeText={(text) => handleChange("city", text)}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Zip Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="560001"
                  keyboardType="number-pad"
                  placeholderTextColor="#9CA3AF"
                  maxLength={6}
                  value={form.zipCode}
                  onChangeText={(text) => handleChange("zipCode", text)}
                />
              </View>
            </View>

            {/* DESCRIPTION */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="About the shop..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                value={form.description}
                onChangeText={(text) => handleChange("description", text)}
              />
            </View>

          </View>
        </View>

        {/* BUTTONS */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Create Shop</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  formTitle: { fontSize: 18, fontWeight: "700", color: "#1F2937", marginBottom: 20 },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  row: { flexDirection: "row", gap: 12 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151" },
  req: { color: "#EF4444" },

  // Input Styles
  input: {
    backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB",
    borderRadius: 10, padding: 14, fontSize: 15, color: "#1F2937",
  },
  // 🔥 RED BORDER STYLE
  inputError: { borderColor: "#EF4444", backgroundColor: "#FEF2F2" },

  // 🔥 ERROR TEXT STYLE
  errorText: { fontSize: 12, color: "#EF4444", marginTop: 2, marginLeft: 2, fontWeight: '500' },

  textArea: { minHeight: 80, textAlignVertical: 'top' },
  categoriesContainer: { flexDirection: "row", paddingVertical: 4 },
  categoryButton: {
    paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#FFF",
    borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB", marginRight: 8,
  },
  activeCategoryButton: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  categoryText: { fontSize: 14, color: "#6B7280" },
  activeCategoryText: { color: "#FFFFFF", fontWeight: "600" },
  actionButtons: { flexDirection: "row", gap: 12, paddingHorizontal: 16, marginBottom: 10 },
  cancelButton: { flex: 1, backgroundColor: "#F3F4F6", padding: 16, borderRadius: 12, alignItems: "center" },
  cancelButtonText: { color: "#4B5563", fontWeight: "600", fontSize: 16 },
  submitButton: { flex: 1, backgroundColor: "#2563EB", padding: 16, borderRadius: 12, alignItems: "center" },
  submitButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 16 },
});
