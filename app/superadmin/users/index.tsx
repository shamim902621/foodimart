import AppHeader from "@/components/AppHeader"; // ✅ Standardized Header
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/apiService";

// --- INTERFACES ---
export interface IUser {
    userUUID?: string;
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

// --- OPTIMIZED COMPONENT: User Card ---
const UserCard = React.memo(({ user, onToggleStatus, onViewDetails }: {
    user: IUser,
    onToggleStatus: (uuid: string, status: string) => void,
    onViewDetails: (uuid: string) => void
}) => {

    const getStatusColor = (status: string) => {
        return status === 'active' ? '#10B981' : '#EF4444';
    };

    return (
        <TouchableOpacity
            style={styles.userCard}
            activeOpacity={0.7}
            // onPress={() => onViewDetails(user.userUUID || "")} // 👈 Navigate to Tracking Page
        >
            <View style={styles.cardMainRow}>
                {/* User Icon */}
                <View style={styles.iconContainer}>
                    <Ionicons name="person" size={20} color="#6B7280" />
                </View>

                {/* Info */}
                <View style={styles.userInfo}>
                    <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
                    <Text style={styles.userEmail} numberOfLines={1}>{user.email || "No email"}</Text>
                    <Text style={styles.userRole}>{user.role}</Text>
                </View>

                {/* Toggle Switch */}
                <View style={styles.statusContainer}>
                    <Switch
                        trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                        thumbColor={user.status === 'active' ? "#2563EB" : "#F3F4F6"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => onToggleStatus(user?.userUUID || "", user.status)}
                        value={user.status === 'active'}
                    />
                    <Text style={[styles.statusText, { color: getStatusColor(user.status) }]}>
                        {user.status}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.userFooter}>
                <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                    <Text style={styles.metaText}>
                        Joined: {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
                    </Text>
                </View>

                {/* Action: View Analytics */}
                <TouchableOpacity
                    style={styles.analyticsBtn}
                    onPress={() => onViewDetails(user.userUUID || "")}
                >
                    <Text style={styles.analyticsText}>Track Activity</Text>
                    <Ionicons name="chevron-forward" size={14} color="#2563EB" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
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
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Animated.View style={[styles.skeletonBox, { width: 40, height: 40, borderRadius: 20, opacity }]} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                    <Animated.View style={[styles.skeletonBox, { width: '60%', height: 18, marginBottom: 6, opacity }]} />
                    <Animated.View style={[styles.skeletonBox, { width: '40%', height: 14, opacity }]} />
                </View>
                <Animated.View style={[styles.skeletonBox, { width: 40, height: 20, opacity }]} />
            </View>
            <Animated.View style={[styles.skeletonBox, { width: '100%', height: 1, marginVertical: 8, opacity }]} />
            <Animated.View style={[styles.skeletonBox, { width: 80, height: 14, opacity }]} />
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
    const [limit] = useState<number>(10);

    const { token, logout } = useAuth();

    // --- FETCH USERS ---
    const fetchUsers = useCallback(async (query = "", pageNum = 1) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: pageNum.toString(),
                limit: limit.toString(),
                search: query,
            }).toString();

            const response: any = await api(`/superadmin/getAllUsers?${queryParams}`);

            if (response) {
                setUsers(response.users);
                setTotalPages(response.pages);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.log("Fetch users error:", error);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    // --- DEBOUNCE SEARCH ---
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchUsers(searchQuery, 1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // --- ACTIONS ---
    const handleToggleStatus = useCallback(async (userUUID: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

        // Optimistic UI Update
        setUsers((prevUsers) =>
            prevUsers.map((u) => u.userUUID === userUUID ? { ...u, status: newStatus } : u)
        );

        try {
            const response: any = await api(
                `/superadmin/users/toggle-status/${userUUID}`,
                "PUT",
                { status: newStatus },
            );
            if (!response.success) throw new Error(response.message);
        } catch (error) {
            Alert.alert("Error", "Failed to update status");
            // Revert if failed
            setUsers((prevUsers) =>
                prevUsers.map((u) => u.userUUID === userUUID ? { ...u, status: currentStatus } : u)
            );
        }
    }, [token]);

    const handleViewDetails = useCallback((userUUID: string) => {
        // 👉 Redirects to folder: app/superadmin/users/[id]/index.tsx
        router.push(`/superadmin/users/${userUUID}`);
    }, []);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            fetchUsers(searchQuery, newPage);
        }
    }

    // --- FOOTER ---
    const renderFooter = () => {
        if (loading) return null;
        if (users.length === 0) return (
            <View style={styles.emptyState}>
                <View style={styles.emptyIconBg}>
                    <Ionicons name="people-outline" size={40} color="#9CA3AF" />
                </View>
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
                    <Ionicons name="chevron-back" size={18} color="#2563EB" />
                    <Text style={styles.pageButtonText}>Prev</Text>
                </TouchableOpacity>

                <Text style={styles.pageNumberText}>Page {page} of {totalPages}</Text>

                <TouchableOpacity
                    onPress={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    style={[styles.pageButton, page === totalPages && { opacity: 0.5 }]}
                >
                    <Text style={styles.pageButtonText}>Next</Text>
                    <Ionicons name="chevron-forward" size={18} color="#2563EB" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AppHeader title="Manage Users" showBack={true} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <View style={styles.container}>

                    {/* Sticky Search Bar */}
                    <View style={styles.headerContainer}>
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginLeft: 10 }} />
                            <TextInput
                                placeholder="Search users by name, email..."
                                placeholderTextColor="#9CA3AF"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                style={styles.searchInput}
                                autoCapitalize="none"
                                returnKeyType="search"
                                onSubmitEditing={Keyboard.dismiss}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery("")} style={{ padding: 8 }}>
                                    <Ionicons name="close-circle" size={18} color="#6B7280" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* List */}
                    <FlatList
                        data={loading ? Array.from({ length: 5 }) : users}
                        keyExtractor={(item: any, index: number) => loading ? `skeleton-${index}` : item?.userUUID || index.toString()}
                        renderItem={({ item }) => {
                            if (loading) return <UserSkeleton />;
                            return (
                                <UserCard
                                    user={item as IUser}
                                    onToggleStatus={handleToggleStatus}
                                    onViewDetails={handleViewDetails}
                                />
                            );
                        }}
                        contentContainerStyle={styles.listContent}
                        ListFooterComponent={renderFooter}
                        showsVerticalScrollIndicator={false}
                        onScrollBeginDrag={Keyboard.dismiss}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#fff" },
    container: { flex: 1, backgroundColor: "#F9FAFB" },

    // Header & Search
    headerContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        zIndex: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#F3F4F6",
        borderRadius: 10,
        height: 44,
        borderWidth: 1,
        borderColor: 'transparent'
    },
    searchInput: { flex: 1, height: '100%', paddingHorizontal: 10, fontSize: 15, color: "#374151" },

    // List Content
    listContent: { padding: 16, paddingBottom: 80 },

    // User Card
    userCard: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6'
    },
    cardMainRow: { flexDirection: "row", alignItems: "flex-start" },
    iconContainer: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6',
        justifyContent: 'center', alignItems: 'center', marginRight: 12
    },
    userInfo: { flex: 1, marginRight: 8 },
    userName: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 2 },
    userEmail: { fontSize: 13, color: "#6B7280", marginBottom: 2 },
    userRole: { fontSize: 11, color: "#3B82F6", fontWeight: "600", textTransform: "uppercase" },

    statusContainer: { alignItems: 'flex-end' },
    statusText: { fontSize: 11, fontWeight: "600", textTransform: "capitalize", marginTop: 4 },

    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },

    userFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
    metaText: { fontSize: 12, color: "#6B7280" },

    analyticsBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    analyticsText: { fontSize: 13, color: "#2563EB", fontWeight: "600" },

    // Pagination
    pagination: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 20, marginTop: 10 },
    pageButton: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: "#FFFFFF",
        paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8,
        borderWidth: 1, borderColor: '#E5E7EB', gap: 4
    },
    pageButtonText: { color: "#374151", fontWeight: "600", fontSize: 13 },
    pageNumberText: { color: "#6B7280", fontWeight: "500", fontSize: 13 },

    // Empty State
    emptyState: { alignItems: "center", paddingVertical: 40 },
    emptyIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    emptyStateTitle: { fontSize: 16, fontWeight: "700", color: "#374151", marginBottom: 6 },
    emptyStateText: { fontSize: 14, color: "#9CA3AF" },

    skeletonBox: { backgroundColor: '#E5E7EB', borderRadius: 4 },
});