// app/superadmin/users/index.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../lib/apiService";


export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  shop: string | null;
  status: string;
  joinDate: string;
  lastLogin: string;
  address?: string | null;
}
export interface IUsersResponse {
  success: boolean;
  users: IUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}


export default function ManageUsers() {
  const navigation = useNavigation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);
  const { user, token, isAuthenticated } = useAuth();

  // console.log(user);
  // console.log("tokrtehfdr", token);

  const fetchUsers = async () => {
    setLoading(true);
    const [token, user] = await Promise.all([
      AsyncStorage.getItem('authToken'),
      AsyncStorage.getItem('userData'),
    ]);

    try {
      const response: IUsersResponse = await api(
        `/superadmin/users`,
        "GET",
        undefined,
        token ?? undefined
      );

      console.log("API RAW RESPONSE:", response);

      if (response?.success) {
        setUsers(response.users);
      } else {
        console.log("Failed:", response?.message);
      }

    } catch (error) {
      console.log("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);


  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    if (!q) return users; // No search → return all users

    return users.filter((u) => {
      return (
        u?.name?.toLowerCase().includes(q) ||
        u?.email?.toLowerCase().includes(q) ||
        u?.phone?.toLowerCase().includes(q) ||
        u?.shop?.toLowerCase().includes(q) ||
        u?.status?.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery]);


  const getStatusColor = (status: string) => {
    return status === 'active' ? '#10B981' : '#EF4444';
  };

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
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>

        <View style={styles.headerTop}>

          {/* Title Section */}
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Manage Users</Text>
            <Text style={styles.subtitle}>Manage shopkeeper accounts and permissions</Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

        </View>

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
                <Text style={styles.userEmail}>{user.email || "No email provided"}</Text>
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
              <Text style={styles.userShop}>{user.shop || "No shop provided"}</Text>
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
      {/* PAGINATION */}
      {!loading && users.length > 0 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            style={styles.pageButton}
          >
            <Text style={styles.pageButtonText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPage((p) => p + 1)}
            style={styles.pageButton}
          >
            <Text style={styles.pageButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerLeft: {
    flexShrink: 1,   // <-- prevents title area from expanding too much
    marginRight: 10,
  },

  logoutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    flexShrink: 0,   // <-- ensures button never grows in width
    alignSelf: "flex-start",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },


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
    flexDirection: "column",
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
  pagination: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pageButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  pageButtonText: { color: "white", textAlign: "center", fontWeight: "600" },
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