import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserOrdersScreen() {
  const orders = {
    upcoming: [
      {
        id: 1,
        restaurant: "Xero Degree",
        items: "1× Narello Caramel, 1× Virgin Mojito Cooler",
        date: "30 May 2025, 10:00 PM",
        status: "preparing",
        amount: 149
      }
    ],
    past: [
      {
        id: 2,
        restaurant: "Xero Degree",
        items: "1× Narello Caramel, 1× Virgin Mojito Cooler",
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Active</Text>
            <Text style={styles.statValue}>₹ {stats.active}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Delivered</Text>
            <Text style={styles.statValue}>₹ {stats.delivered}</Text>
          </View>
        </View>

        {/* Upcoming Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Orders</Text>
          {orders.upcoming.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.restaurantName}>{order.restaurant}</Text>
                <View style={[styles.statusBadge, styles.statusPreparing]}>
                  <Text style={styles.statusText}>Preparing</Text>
                </View>
              </View>
              <Text style={styles.orderItems}>{order.items}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
              <View style={styles.orderFooter}>
                <Text style={styles.orderAmount}>₹ {order.amount}</Text>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Track Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Past Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Orders</Text>
          {orders.past.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.restaurantName}>{order.restaurant}</Text>
                <View style={[styles.statusBadge, styles.statusDelivered]}>
                  <Text style={styles.statusText}>Delivered</Text>
                </View>
              </View>
              <Text style={styles.orderItems}>{order.items}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
              <View style={styles.orderFooter}>
                <Text style={styles.orderAmount}>₹ {order.amount}</Text>
                <TouchableOpacity style={styles.outlineButton}>
                  <Text style={styles.outlineButtonText}>Reorder</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2ECC71",
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
    backgroundColor: "#F9F9F9",
    padding: 16,
        marginTop:10,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2ECC71",
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
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
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
    borderRadius: 6,
  },
  statusPreparing: {
    backgroundColor: "#E9F8F0",
  },
  statusDelivered: {
    backgroundColor: "#E9F8E0",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2ECC71",
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
  primaryButton: {
    backgroundColor: "#2ECC71",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  outlineButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#2ECC71",
  },
  outlineButtonText: {
    color: "#2ECC71",
    fontSize: 13,
    fontWeight: "600",
  },
});
