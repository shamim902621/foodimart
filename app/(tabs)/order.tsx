import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserOrdersScreen() {
  const orders = {
    upcoming: [
      {
        id: 1,
        restaurant: "Xero Degree",
        items: "1X Narello Caramel, 1X Virgin Mojito Cooler",
        date: "30 May 2025, 10:00 PM",
        status: "preparing",
        amount: 149
      }
    ],
    past: [
      {
        id: 2,
        restaurant: "Xero Degree",
        items: "1X Narello Caramel, 1X Virgin Mojito Cooler",
        date: "28 May 2025, 08:30 PM",
        status: "delivered",
        amount: 149
      }
    ]
  };

  const stats = {
    active: 149,
    delivered: 149
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Active</Text>
            <Text style={styles.statValue}>¥ {stats.active}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Delivered</Text>
            <Text style={styles.statValue}>¥ {stats.delivered}</Text>
          </View>
        </View>

        {/* Upcoming Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          {orders.upcoming.map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.restaurantName}>{order.restaurant}</Text>
                <View style={[styles.statusBadge, styles.statusPreparing]}>
                  <Text style={styles.statusText}>Preparing</Text>
                </View>
              </View>
              <Text style={styles.orderItems}>{order.items}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
              <View style={styles.orderFooter}>
                <Text style={styles.orderAmount}>¥ {order.amount}</Text>
                <TouchableOpacity style={styles.trackButton}>
                  <Text style={styles.trackButtonText}>Track</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Past Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past</Text>
          {orders.past.map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.restaurantName}>{order.restaurant}</Text>
                <View style={[styles.statusBadge, styles.statusDelivered]}>
                  <Text style={styles.statusText}>Delivered</Text>
                </View>
              </View>
              <Text style={styles.orderItems}>{order.items}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
              <View style={styles.orderFooter}>
                <Text style={styles.orderAmount}>¥ {order.amount}</Text>
                <TouchableOpacity style={styles.reorderButton}>
                  <Text style={styles.reorderButtonText}>Reorder</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusPreparing: {
    backgroundColor: "#FFF3E0",
  },
  statusDelivered: {
    backgroundColor: "#E8F5E8",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  orderItems: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  trackButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  trackButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  reorderButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FF6B35",
  },
  reorderButtonText: {
    color: "#FF6B35",
    fontSize: 12,
    fontWeight: "500",
  },
});