import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function OrderTrackingScreen() {
  const orderDetails = {
    orderNumber: "#90897",
    placedDate: "October 31, 2023",
    discount: "Remix 10",
    cashback: "Remix 5% 30"
  };

  const trackingSteps = [
    {
      id: 1,
      status: "completed",
      title: "Order Placed",
      date: "October 21, 2021",
      description: "Your order has been placed successfully"
    },
    {
      id: 2,
      status: "completed",
      title: "Order Confirmed",
      date: "October 21, 2021",
      description: "Restaurant has confirmed your order"
    },
    {
      id: 3,
      status: "completed",
      title: "Order Shipped",
      date: "October 21, 2021",
      description: "Your order is on the way"
    },
    {
      id: 4,
      status: "current",
      title: "Out for Delivery",
      date: "Pending",
      description: "Delivery partner is heading to you"
    },
    {
      id: 5,
      status: "pending",
      title: "Order Delivered",
      date: "Pending",
      description: "Order will be delivered soon"
    }
  ];

  return (
    <View style={styles.container}>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.orderNumber}>Order {orderDetails.orderNumber}</Text>
          <Text style={styles.orderDate}>Placed on {orderDetails.placedDate}</Text>
          <View style={styles.discounts}>
            <Text style={styles.discountText}>{orderDetails.discount}</Text>
            <Text style={styles.discountText}>{orderDetails.cashback}</Text>
          </View>
        </View>

        {/* Tracking Timeline */}
        <View style={styles.timeline}>
          {trackingSteps.map((step, index) => (
            <View key={step.id} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[
                  styles.statusIcon,
                  step.status === "completed" && styles.statusCompleted,
                  step.status === "current" && styles.statusCurrent,
                  step.status === "pending" && styles.statusPending
                ]}>
                  {step.status === "completed" && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                  {step.status === "current" && (
                    <View style={styles.currentDot} />
                  )}
                </View>
                {index < trackingSteps.length - 1 && (
                  <View style={[
                    styles.timelineLine,
                    step.status === "completed" && styles.timelineLineCompleted
                  ]} />
                )}
              </View>
              
              <View style={styles.timelineContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDate}>{step.date}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
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
  orderSummary: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  discounts: {
    flexDirection: "row",
    gap: 12,
  },
  discountText: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "500",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timeline: {
    padding: 16,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: 16,
  },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statusCompleted: {
    backgroundColor: "#4CAF50",
  },
  statusCurrent: {
    backgroundColor: "#FF6B35",
    borderWidth: 4,
    borderColor: "#FFE0D6",
  },
  statusPending: {
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  currentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#f0f0f0",
    marginTop: 4,
  },
  timelineLineCompleted: {
    backgroundColor: "#4CAF50",
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  stepDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 12,
    color: "#999",
  },
});