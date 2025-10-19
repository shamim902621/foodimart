import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function OrderSuccessScreen() {
  const trackOrder = () => {
    router.push('/order-tracking');
  };

  const continueShopping = () => {
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#328a0dff" />
        </View>
        
        <Text style={styles.title}>Order Success</Text>
        <Text style={styles.subtitle}>
          Your order was successful!
        </Text>
        <Text style={styles.description}>
          You will get a response within{"\n"}
          a few minutes.
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.trackButton} onPress={trackOrder}>
            <Text style={styles.trackButtonText}>Track order</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.continueButton} onPress={continueShopping}>
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  successIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },
  buttons: {
    width: "100%",
    gap: 12,
  },
  trackButton: {
    backgroundColor: "#328a0dff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  trackButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  continueButton: {
    backgroundColor: "transparent",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  continueButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});