import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../lib/apiService";
export default function Profile() {
  const navigation = useNavigation();
  const router = useRouter();

  const { token, user } = useAuth();
  // const { id } = useLocalSearchParams();
  const userUUID = user?.userUUID;
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShop();
  }, [userUUID]);

  const fetchShop = async () => {
    try {
      // debugger;
      const response = await api(`/shops/useruuidshop?userUUID=${userUUID}`, "GET", undefined, token ?? undefined);

      console.log("API RAW RESPONSE:", response);

      if (response?.success) {
        setShop(response.data);   // <-- PURE shop object
      } else {
        console.log("Failed:", response?.message);
      }

    } catch (e) {
      console.log("Fetch data error:", e);
    } finally {
      setLoading(false);
    }
  };

  console.log("resposexx data", shop);

  const quickActions = [
    { icon: "🏪", title: "Shop Settings", description: "Update shop information" },
    { icon: "💰", title: "Payment Methods", description: "Manage payment options" },
    { icon: "📦", title: "Delivery Settings", description: "Set delivery areas" },
    { icon: "📊", title: "Business Reports", description: "View sales analytics" },
  ];


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'Login' }],
      // });
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };






  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>GC</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{shop?.shop.name || "shop name"}</Text>
          <Text style={styles.subtitle}>Managed by {shop?.shop.ownerName || "owner name"}</Text>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>⭐ {shop?.shop.rating}/5</Text>
            <Text style={styles.ordersText}> | {shop?.shop.totalOrders} orders</Text>
          </View>
        </View>
      </View>

      {/* Shop Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏪 Shop Information</Text>

        <View style={styles.infoCard}>
          <InfoRow icon="🏷️" label="Shop Name" value={shop?.shop.name} />
          <InfoRow icon="👤" label="Owner" value={shop?.shop.ownerName} />
          <InfoRow icon="📄" label="Description" value={shop?.shop.description || "N/A"} />

          <InfoRow icon="📍" label="Address"
            value={`${shop?.address.addressLine1}, ${shop?.address.city}`} />

          <InfoRow icon="📞" label="Phone" value={shop?.user.mobile} />
          <InfoRow icon="📧" label="Email" value={shop?.user.email} />

          <InfoRow icon="⏰" label="Opening Hours" value={shop?.shop.openingHours || "N/A"} />
          <InfoRow icon="🗓️" label="Weekly Off" value={shop?.shop.weeklyOff || "None"} />

          <InfoRow icon="🧾" label="GST Number" value={shop?.documents?.gst || "Not Uploaded"} />
          <InfoRow icon="🥘" label="FSSAI License" value={shop?.documents?.fssai || "Not Uploaded"} />
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

      {/* Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Shop Performance</Text>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>₹12.5K</Text>
            <Text style={styles.statLabel}>Today's Sales</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Order Completion</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.5⭐</Text>
            <Text style={styles.statLabel}>Customer Rating</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.primaryButton}>
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.primaryButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#E74C3C" />
          <Text style={styles.secondaryButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
type InfoRowProps = {
  icon: string;        // emoji hamesha string hota
  label: string;
  value: string | number;
};

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLabel}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={styles.infoLabelText}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: "#2ECC71",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 6,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#F39C12",
    fontWeight: "500",
  },
  ordersText: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoLabelText: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  infoValue: {
    fontSize: 14,
    color: "#2C3E50",
    fontWeight: "500",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: "#7F8C8D",
    textAlign: "center",
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2ECC71",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    textAlign: "center",
  },
  actionButtons: {
    gap: 12,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: "#2ECC71",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E74C3C",
  },
  secondaryButtonText: {
    color: "#E74C3C",
    fontWeight: "600",
    fontSize: 16,
  },
});