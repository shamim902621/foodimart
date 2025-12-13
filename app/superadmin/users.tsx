import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../lib/apiService";

// --- INTERFACES ---
export interface IUser {
  userUUID?: string | null;
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

// --- OPTIMIZED COMPONENT: User Card (Prevents re-renders) ---
// Isko alag component banaya taaki ek user update hone pe sab re-render na ho
const UserCard = React.memo(({ user, onToggleStatus }: { user: IUser, onToggleStatus: (uuid: string, status: string) => void }) => {

  const getStatusColor = (status: string) => {
    return status === 'active' ? '#10B981' : '#EF4444';
  };

  return (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email || "No email provided"}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 8 }}>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={user.status === 'active' ? "#2563EB" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => onToggleStatus(user?.userUUID || "", user.status)}
            value={user.status === 'active'}
          />
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(user.status) }]}>
              {user.status}
            </Text>
          </View>
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
            <Text style={styles.metaText}>Joined {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</Text>
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
  );
});

// --- SKELETON COMPONENT ---
const UserSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={{ flex: 1 }}>
          <Animated.View style={[styles.skeletonBox, { width: '50%', height: 20, marginBottom: 8, opacity }]} />
          <Animated.View style={[styles.skeletonBox, { width: '70%', height: 14, opacity }]} />
        </View>
        <Animated.View style={[styles.skeletonBox, { width: 60, height: 24, borderRadius: 12, opacity }]} />
      </View>
      <View style={styles.userDetails}>
        <Animated.View style={[styles.skeletonBox, { width: '40%', height: 16, marginBottom: 6, opacity }]} />
        <Animated.View style={[styles.skeletonBox, { width: '30%', height: 14, opacity }]} />
      </View>
      <View style={styles.userFooter}>
        <View style={styles.userMeta}>
          <Animated.View style={[styles.skeletonBox, { width: 100, height: 12, opacity }]} />
        </View>
      </View>
    </View>
  );
};

// --- MAIN COMPONENT ---
export default function ManageUsers() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<IUser[]>([]);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(5); // Limit thoda badha diya for better UX

  const { token, logout } = useAuth();

  // --- FETCH USERS (Optimized) ---
  const fetchUsers = useCallback(async (query = "", pageNum = 1) => {
    setLoading(true);
    const apiToken = await AsyncStorage.getItem('authToken');

    try {
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
        search: query,
      }).toString();

      const response = await api(
        `/superadmin/getAllUsers?${queryParams}`,
        "GET",
        undefined,
        apiToken ?? undefined
      );

      if (response?.success) {
        setUsers(response.users);
        setTotalPages(response.pagination.pages);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.log("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  }, [limit]); // Added limit dependency

  // --- DEBOUNCE EFFECT ---
  useEffect(() => {
    const timer = setTimeout(() => {
      // Jab search change ho, hamesha page 1 se start karo
      setPage(1);
      fetchUsers(searchQuery, 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]); // Removed fetchUsers dependency to avoid loop

  // --- PAGINATION HANDLERS ---
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      fetchUsers(searchQuery, newPage);
    }
  }

  // --- STATUS TOGGLE (Optimized) ---
  const handleToggleStatus = useCallback(async (userUUID: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    // Optimistic Update
    setUsers((prevUsers) =>
      prevUsers.map((u) => u.userUUID === userUUID ? { ...u, status: newStatus } : u)
    );

    try {
      const response = await api(
        `/superadmin/users/toggle-status/${userUUID}`,
        "PUT",
        { status: newStatus },
        token ?? undefined
      );

      if (!response.success) throw new Error(response.message);
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
      // Revert
      setUsers((prevUsers) =>
        prevUsers.map((u) => u.userUUID === userUUID ? { ...u, status: currentStatus } : u)
      );
    }
  }, [token]);

  const handleLogout = async () => {
    try {
      await logout();
      if (router.canDismiss()) router.dismissAll();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // --- RENDER FOOTER (Pagination) ---
  const renderFooter = () => {
    if (loading) return null;
    if (users.length === 0) return (
      <View style={styles.emptyState}>
        <Ionicons name="people-outline" size={64} color="#D1D5DB" />
        <Text style={styles.emptyStateTitle}>No users found</Text>
        <Text style={styles.emptyStateText}>Try adjusting your search query</Text>
      </View>
    );

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => handlePageChange(page - 1)}
          disabled={page === 1}
          style={[styles.pageButton, page === 1 && { opacity: 0.5 }]}
        >
          <Text style={styles.pageButtonText}>Previous</Text>
        </TouchableOpacity>

        <Text style={styles.pageNumberText}>Page {page} of {totalPages}</Text>

        <TouchableOpacity
          onPress={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          style={[styles.pageButton, page === totalPages && { opacity: 0.5 }]}
        >
          <Text style={styles.pageButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 🔥 PERFORMANCE KING: FlatList 
        Ye sirf visible items render karega, ScrollView sab kuch render kar deta hai
      */}
      <View style={styles.headerContainer}>
        <View style={styles.topBar}>
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>Manage Users</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search users..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

      </View>
      <FlatList
        data={loading ? Array.from({ length: 5 }) : users} // Loading ke time dummy array
        // keyExtractor={(item, index) => loading ? `skeleton-${index}` : item?.id || index.toString()}
        keyExtractor={(item: any, index: number) => loading ? `skeleton-${index}` : item?.userUUID || index.toString()}
        renderItem={({ item }) => {
          if (loading) return <UserSkeleton />;
          return <UserCard user={item as IUser} onToggleStatus={handleToggleStatus} />;
        }}
        // ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" }, // Removed padding from here, moved to contentContainer

  // Header Styles
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
    marginBottom: 16,
  },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  titleContainer: { flex: 1 },
  mainTitle: { fontSize: 28, fontWeight: '800', color: '#111827', letterSpacing: -0.5 },
  logoutBtn: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: "#FEF2F2", borderRadius: 8, borderWidth: 1, borderColor: '#FECACA' },
  logoutText: { color: "#EF4444", fontWeight: "600", fontSize: 13 },

  // Search Styles
  searchWrapper: { marginTop: 10, paddingHorizontal: 4, paddingBottom: 4 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: "#FFFFFF",
    borderRadius: 12, height: 50, paddingHorizontal: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
    borderWidth: 1, borderColor: '#F3F4F6'
  },
  searchInput: { flex: 1, height: '100%', paddingHorizontal: 10, fontSize: 16, color: "#374151", fontWeight: "500" },

  // List Styles
  userCard: { backgroundColor: "#FFFFFF", padding: 16, borderRadius: 16, marginHorizontal: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  userHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 4 },
  userEmail: { fontSize: 14, color: "#6B7280" },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: "500", textTransform: "capitalize" },
  userDetails: { marginBottom: 12 },
  userShop: { fontSize: 16, fontWeight: "500", color: "#374151", marginBottom: 2 },
  userPhone: { fontSize: 14, color: "#6B7280" },
  userFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  userMeta: { flexDirection: "column", gap: 16 },
  metaItem: { flexDirection: "row", alignItems: "center" },
  metaText: { fontSize: 12, color: "#6B7280", marginLeft: 4 },
  actionButtons: { flexDirection: "row", gap: 8 },
  editButton: { padding: 8, backgroundColor: "#EFF6FF", borderRadius: 8 },
  deleteButton: { padding: 8, backgroundColor: "#FEF2F2", borderRadius: 8 },

  // Pagination & Empty States
  pagination: { marginTop: 10, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, alignItems: "center", marginBottom: 30 },
  pageButton: { backgroundColor: "#3B82F6", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  pageButtonText: { color: "white", fontWeight: "600" },
  pageNumberText: { color: "#6B7280", fontWeight: "500" },
  emptyState: { alignItems: "center", paddingVertical: 48 },
  emptyStateTitle: { fontSize: 18, fontWeight: "500", color: "#6B7280", marginTop: 16, marginBottom: 8 },
  emptyStateText: { fontSize: 14, color: "#9CA3AF", textAlign: "center" },
  skeletonBox: { backgroundColor: '#E5E7EB', borderRadius: 4 },
});