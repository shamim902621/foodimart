// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import { useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { useAuth } from "../../hooks/useAuth";
// import { api } from "../lib/apiService";
// export default function Profile() {
//   const navigation = useNavigation();
//   const router = useRouter();

//   const { token, user } = useAuth();
//   // const { id } = useLocalSearchParams();
//   const userUUID = user?.userUUID;
//   const [shop, setShop] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchShop();
//   }, [userUUID]);

//   const fetchShop = async () => {
//     try {
//       const response = await api(`/admin/shop/getProfile/${userUUID}`, "GET", undefined, token ?? undefined);

//       console.log("API RAW RESPONSE:", response);

//       if (response?.success) {
//         setShop(response.data);   // <-- PURE shop object
//       } else {
//         console.log("Failed:", response?.message);
//       }

//     } catch (e) {
//       console.log("Fetch data error:", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log("resposexx data", shop);

//   const quickActions = [
//     { icon: "🏪", title: "Shop Settings", description: "Update shop information" },
//     { icon: "💰", title: "Payment Methods", description: "Manage payment options" },
//     { icon: "📦", title: "Delivery Settings", description: "Set delivery areas" },
//     { icon: "📊", title: "Business Reports", description: "View sales analytics" },
//   ];


//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem('authToken');
//       await AsyncStorage.removeItem('userData');
//       // navigation.reset({
//       //   index: 0,
//       //   routes: [{ name: 'Login' }],
//       // });
//       router.replace('/login');
//     } catch (error) {
//       console.error('Error during logout:', error);
//     }
//   };






//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.avatar}>
//           <Text style={styles.avatarText}>GC</Text>
//         </View>
//         <View style={styles.headerInfo}>
//           <Text style={styles.title}>{shop?.shop.name || "shop name"}</Text>
//           <Text style={styles.subtitle}>Managed by {shop?.shop.ownerName || "owner name"}</Text>
//           <View style={styles.rating}>
//             <Text style={styles.ratingText}>⭐ {shop?.shop.rating}/5</Text>
//             <Text style={styles.ordersText}> | {shop?.shop.totalOrders} orders</Text>
//           </View>
//         </View>
//       </View>

//       {/* Shop Information */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>🏪 Shop Information</Text>

//         <View style={styles.infoCard}>
//           {/* <InfoRow icon="🏷️" label="Shop Name" value={shop?.shop.name} /> */}
//           <InfoRow icon="👤" label="Owner" value={shop?.shop.ownerName} />
//           <InfoRow icon="📄" label="Description" value={shop?.shop.description || "N/A"} />

//           <InfoRow icon="📍" label="Address"
//             value={`${shop?.address.addressLine1}, ${shop?.address.city}`} />

//           <InfoRow icon="📞" label="Phone" value={shop?.user.mobile} />
//           <InfoRow icon="📧" label="Email" value={shop?.user.email} />

//           <InfoRow icon="⏰" label="Opening Hours" value={shop?.shop.openingHours || "N/A"} />
//           <InfoRow icon="🗓️" label="Weekly Off" value={shop?.shop.weeklyOff || "None"} />

//           <InfoRow icon="🧾" label="GST Number" value={shop?.documents?.gst || "Not Uploaded"} />
//           <InfoRow icon="🥘" label="FSSAI License" value={shop?.documents?.fssai || "Not Uploaded"} />
//         </View>
//       </View>


//       {/* Quick Actions */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
//         <View style={styles.actionsGrid}>
//           {quickActions.map((action, index) => (
//             <TouchableOpacity key={index} style={styles.actionCard}>
//               <Text style={styles.actionIcon}>{action.icon}</Text>
//               <Text style={styles.actionTitle}>{action.title}</Text>
//               <Text style={styles.actionDescription}>{action.description}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Statistics */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>📊 Shop Performance</Text>
//         <View style={styles.statsCard}>
//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>₹12.5K</Text>
//             <Text style={styles.statLabel}>Today's Sales</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>85%</Text>
//             <Text style={styles.statLabel}>Order Completion</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>4.5⭐</Text>
//             <Text style={styles.statLabel}>Customer Rating</Text>
//           </View>
//         </View>
//       </View>

//       {/* Action Buttons */}
//       <View style={styles.actionButtons}>
//         <TouchableOpacity style={styles.primaryButton}>
//           <Ionicons name="create-outline" size={18} color="#fff" />
//           <Text style={styles.primaryButtonText}>Edit Profile</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
//           <Ionicons name="log-out-outline" size={18} color="#E74C3C" />
//           <Text style={styles.secondaryButtonText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }
// type InfoRowProps = {
//   icon: string;        // emoji hamesha string hota
//   label: string;
//   value: string | number;
// };

// const InfoRow = ({ icon, label, value }: InfoRowProps) => (
//   <View style={styles.infoRow}>
//     <View style={styles.infoLabel}>
//       <Text style={styles.infoIcon}>{icon}</Text>
//       <Text style={styles.infoLabelText}>{label}</Text>
//     </View>
//     <Text style={styles.infoValue}>{value}</Text>
//   </View>
// );
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8F9FA",
//     padding: 16
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     padding: 20,
//     borderRadius: 16,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   avatar: {
//     width: 60,
//     height: 60,
//     backgroundColor: "#2ECC71",
//     borderRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 16,
//   },
//   avatarText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//   },
//   headerInfo: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#2C3E50",
//     marginBottom: 2,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#7F8C8D",
//     marginBottom: 6,
//   },
//   rating: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   ratingText: {
//     fontSize: 14,
//     color: "#F39C12",
//     fontWeight: "500",
//   },
//   ordersText: {
//     fontSize: 14,
//     color: "#7F8C8D",
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#2C3E50",
//     marginBottom: 12,
//   },
//   infoCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   infoRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ECF0F1",
//   },
//   infoLabel: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   infoIcon: {
//     fontSize: 16,
//   },
//   infoLabelText: {
//     fontSize: 14,
//     color: "#7F8C8D",
//   },
//   infoValue: {
//     fontSize: 14,
//     color: "#2C3E50",
//     fontWeight: "500",
//   },
//   actionsGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 12,
//   },
//   actionCard: {
//     flex: 1,
//     minWidth: '45%',
//     backgroundColor: "#FFFFFF",
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   actionIcon: {
//     fontSize: 24,
//     marginBottom: 8,
//   },
//   actionTitle: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#2C3E50",
//     textAlign: "center",
//     marginBottom: 4,
//   },
//   actionDescription: {
//     fontSize: 12,
//     color: "#7F8C8D",
//     textAlign: "center",
//   },
//   statsCard: {
//     flexDirection: "row",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   statItem: {
//     flex: 1,
//     alignItems: "center",
//   },
//   statNumber: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#2ECC71",
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: "#7F8C8D",
//     textAlign: "center",
//   },
//   actionButtons: {
//     gap: 12,
//     marginBottom: 30,
//   },
//   primaryButton: {
//     backgroundColor: "#2ECC71",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//     borderRadius: 12,
//     gap: 8,
//   },
//   primaryButtonText: {
//     color: "#FFFFFF",
//     fontWeight: "600",
//     fontSize: 16,
//   },
//   secondaryButton: {
//     backgroundColor: "#FFFFFF",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//     borderRadius: 12,
//     gap: 8,
//     borderWidth: 1,
//     borderColor: "#E74C3C",
//   },
//   secondaryButtonText: {
//     color: "#E74C3C",
//     fontWeight: "600",
//     fontSize: 16,
//   },
// });


import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../lib/apiService";

export default function Profile() {
  const router = useRouter();
  const { token, user } = useAuth();
  const userUUID = user?.userUUID;

  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit Mode States
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    description: "",
    mobile: "",
    email: "",
    addressLine1: "",
    city: ""
  });

  useEffect(() => {
    fetchShop();
  }, [userUUID]);

  const fetchShop = async () => {
    try {
      const response = await api(`/admin/shop/getProfile/${userUUID}`, "GET", undefined, token ?? undefined);
      if (response?.success) {
        setShop(response.data);
      }
    } catch (e) {
      console.log("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Populate form when opening modal
  const handleOpenEdit = () => {
    setFormData({
      shopName: shop?.shop?.name || "",
      ownerName: shop?.shop?.ownerName || "",
      description: shop?.shop?.description || "",
      mobile: shop?.user?.mobile || "",
      email: shop?.user?.email || "",
      addressLine1: shop?.address?.addressLine1 || "",
      city: shop?.address?.city || ""
    });
    setEditModalVisible(true);
  };

  // Save Function
  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const response = await api(
        `/admin/shop/updateProfile/${userUUID}`,
        "PUT",
        formData,
        token ?? undefined
      );

      if (response?.success) {
        Alert.alert("Success", "Profile updated successfully!");
        setEditModalVisible(false);
        fetchShop(); // Refresh data
      } else {
        Alert.alert("Error", response?.message || "Failed to update");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const quickActions = [
    { icon: "🏪", title: "Shop Settings", description: "Update shop information" },
    { icon: "💰", title: "Payment Methods", description: "Manage payment options" },
    { icon: "📦", title: "Delivery Settings", description: "Set delivery areas" },
    { icon: "📊", title: "Business Reports", description: "View sales analytics" },
  ];

  if (loading) {
    return <View style={[styles.container, { justifyContent: 'center' }]}><ActivityIndicator size="large" color="#2ECC71" /></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{shop?.shop?.name?.substring(0, 2).toUpperCase() || "SH"}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{shop?.shop?.name || "Shop Name"}</Text>
            <Text style={styles.subtitle}>Managed by {shop?.shop?.ownerName || "Owner"}</Text>
            <View style={styles.rating}>
              <Text style={styles.ratingText}>⭐ {shop?.shop?.rating || 0}/5</Text>
              <Text style={styles.ordersText}> | {shop?.shop?.totalOrders || 0} orders</Text>
            </View>
          </View>
        </View>

        {/* Shop Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏪 Shop Information</Text>
          <View style={styles.infoCard}>
            <InfoRow icon="👤" label="Owner" value={shop?.shop?.ownerName} />
            <InfoRow icon="📄" label="Description" value={shop?.shop?.description || "N/A"} />
            <InfoRow icon="📍" label="Address" value={`${shop?.address?.addressLine1 || ""}, ${shop?.address?.city || ""}`} />
            <InfoRow icon="📞" label="Phone" value={shop?.user?.mobile} />
            <InfoRow icon="📧" label="Email" value={shop?.user?.email} />
            <InfoRow icon="🧾" label="GST Number" value={shop?.documents?.gst || "Not Uploaded"} />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.actionCard}>
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleOpenEdit}>
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#E74C3C" />
            <Text style={styles.secondaryButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ========================== */}
      {/* EDIT PROFILE MODAL     */}
      {/* ========================== */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <InputLabel label="Shop Name" />
              <TextInput
                style={styles.input}
                value={formData.shopName}
                onChangeText={(t) => setFormData({ ...formData, shopName: t })}
              />

              <InputLabel label="Owner Name" />
              <TextInput
                style={styles.input}
                value={formData.ownerName}
                onChangeText={(t) => setFormData({ ...formData, ownerName: t })}
              />

              <InputLabel label="Description" />
              <TextInput
                style={[styles.input, { height: 80 }]}
                multiline
                value={formData.description}
                onChangeText={(t) => setFormData({ ...formData, description: t })}
              />

              <InputLabel label="Mobile Number" />
              <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                value={formData.mobile}
                onChangeText={(t) => setFormData({ ...formData, mobile: t })}
              />

              <InputLabel label="City" />
              <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={(t) => setFormData({ ...formData, city: t })}
              />

              <InputLabel label="Address Line 1" />
              <TextInput
                style={[styles.input, { height: 60 }]}
                multiline
                value={formData.addressLine1}
                onChangeText={(t) => setFormData({ ...formData, addressLine1: t })}
              />
            </ScrollView>

            <TouchableOpacity
              style={[styles.saveButton, saving && { opacity: 0.7 }]}
              onPress={handleSaveChanges}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

// Helper Components
const InputLabel = ({ label }: { label: string }) => (
  <Text style={styles.inputLabel}>{label}</Text>
);

type InfoRowProps = {
  icon: string;
  label: string;
  value: string | number;
};

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLabel}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={styles.infoLabelText}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value || "N/A"}</Text>
  </View>
);

const styles = StyleSheet.create({
  // ... Existing Styles ...
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF",
    padding: 20, borderRadius: 16, marginBottom: 20, elevation: 3,
  },
  avatar: {
    width: 60, height: 60, backgroundColor: "#2ECC71", borderRadius: 30,
    justifyContent: "center", alignItems: "center", marginRight: 16,
  },
  avatarText: { fontSize: 20, fontWeight: "bold", color: "#FFFFFF" },
  headerInfo: { flex: 1 },
  title: { fontSize: 20, fontWeight: "bold", color: "#2C3E50", marginBottom: 2 },
  subtitle: { fontSize: 14, color: "#7F8C8D", marginBottom: 6 },
  rating: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 14, color: "#F39C12", fontWeight: "500" },
  ordersText: { fontSize: 14, color: "#7F8C8D" },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#2C3E50", marginBottom: 12 },
  infoCard: {
    backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, elevation: 3,
  },
  infoRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#ECF0F1",
  },
  infoLabel: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoIcon: { fontSize: 16 },
  infoLabelText: { fontSize: 14, color: "#7F8C8D" },
  infoValue: { fontSize: 14, color: "#2C3E50", fontWeight: "500", maxWidth: '60%', textAlign: 'right' },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  actionCard: {
    flex: 1, minWidth: '45%', backgroundColor: "#FFFFFF", padding: 16,
    borderRadius: 12, alignItems: "center", elevation: 2,
  },
  actionIcon: { fontSize: 24, marginBottom: 8 },
  actionTitle: { fontSize: 14, fontWeight: "600", color: "#2C3E50", textAlign: "center", marginBottom: 4 },
  actionDescription: { fontSize: 12, color: "#7F8C8D", textAlign: "center" },
  actionButtons: { gap: 12, marginBottom: 30 },
  primaryButton: {
    backgroundColor: "#2ECC71", flexDirection: "row", alignItems: "center",
    justifyContent: "center", padding: 16, borderRadius: 12, gap: 8,
  },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 16 },
  secondaryButton: {
    backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center",
    justifyContent: "center", padding: 16, borderRadius: 12, gap: 8,
    borderWidth: 1, borderColor: "#E74C3C",
  },
  secondaryButtonText: { color: "#E74C3C", fontWeight: "600", fontSize: 16 },

  // 🔥 MODAL STYLES
  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end"
  },
  modalContent: {
    backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, maxHeight: "80%"
  },
  modalHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#2C3E50" },
  inputLabel: { fontSize: 14, color: "#7F8C8D", marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: "#F8F9FA", padding: 12, borderRadius: 10, borderWidth: 1,
    borderColor: "#E0E0E0", fontSize: 16, color: "#333"
  },
  saveButton: {
    backgroundColor: "#2ECC71", padding: 16, borderRadius: 12, alignItems: "center",
    marginTop: 20, marginBottom: 20
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});