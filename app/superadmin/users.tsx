// app/superadmin/users/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ManageUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const users = [
    { 
      id: 1, 
      name: "Shamim Ahmad", 
      email: "shamim@foodmart.com", 
      shop: "Food Mart Indiranagar",
      phone: "+91 9876543210",
      status: "active",
      joinDate: "2024-01-15",
      lastLogin: "2 hours ago"
    },
    { 
      id: 2, 
      name: "Amit Kumar", 
      email: "amit@burgerhub.com", 
      shop: "Burger Hub Koramangala",
      phone: "+91 9876543211",
      status: "active",
      joinDate: "2024-02-01",
      lastLogin: "1 day ago"
    },
    { 
      id: 3, 
      name: "Priya Sharma", 
      email: "priya@pizzapalace.com", 
      shop: "Pizza Palace",
      phone: "+91 9876543212",
      status: "inactive",
      joinDate: "2024-01-20",
      lastLogin: "1 week ago"
    },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.shop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'active' ? '#10B981' : '#EF4444';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Manage Users</Text>
        <Text style={styles.subtitle}>Manage shopkeeper accounts and permissions</Text>
        
        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Users List */}
      <View style={styles.usersList}>
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
              <View 
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(user.status) + '20' }
                ]}
              >
                <Text 
                  style={[
                    styles.statusText,
                    { color: getStatusColor(user.status) }
                  ]}
                >
                  {user.status}
                </Text>
              </View>
            </View>

            <View style={styles.userDetails}>
              <Text style={styles.userShop}>{user.shop}</Text>
              <Text style={styles.userPhone}>{user.phone}</Text>
            </View>

            <View style={styles.userFooter}>
              <View style={styles.userMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                  <Text style={styles.metaText}>Joined {user.joinDate}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#6B7280" />
                  <Text style={styles.metaText}>Last login: {user.lastLogin}</Text>
                </View>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.editButton}>
                  <Ionicons name="create-outline" size={16} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyStateTitle}>No users found</Text>
          <Text style={styles.emptyStateText}>
            {searchQuery ? "Try adjusting your search query" : "No shopkeeper users yet"}
          </Text>
        </View>
      )}
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 16,
  },
  searchContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    padding: 16,
    fontSize: 16,
    color: "#374151",
  },
  usersList: {
    gap: 12,
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  userDetails: {
    marginBottom: 12,
  },
  userShop: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: "#6B7280",
  },
  userFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});