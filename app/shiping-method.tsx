import BackButton from "@/components/back-button";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ShippingMethodScreen() {
  const [selectedMethod, setSelectedMethod] = useState("standard");

  const shippingMethods = [
    {
      id: "standard",
      name: "Standard Delivery",
      description: "Order will be delivered between 3 - 4 business days straight to your doorstep.",
      price: 3
    },
    {
      id: "next-day",
      name: "Next Day Delivery",
      description: "Order will be delivered between 3 - 4 business days straight to your doorstep.",
      price: 5
    },
    {
      id: "nominated",
      name: "Nominated Delivery",
      description: "Order will be delivered between 3 - 4 business days straight to your doorstep.",
      price: 3
    }
  ];

  const proceedToAddress = () => {
    router.push('/shiping-address');
  };

  return (
    <View style={styles.container}>
      {/* Progress Steps */}
    

      <View style={styles.progressContainer}>
            <BackButton fallbackRoute="/cart" />
        <View style={styles.steps}>
          <View style={[styles.step, styles.stepActive]}>
            <View style={styles.stepNumberActive}>1</View>
            <Text style={styles.stepTextActive}>DELIVERY</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>2</View>
            <Text style={styles.stepText}>ADDRESS</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>3</View>
            <Text style={styles.stepText}>PAYMENT</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {shippingMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selectedMethod === method.id && styles.methodCardSelected
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <View style={styles.radioContainer}>
              <View style={[
                styles.radio,
                selectedMethod === method.id && styles.radioSelected
              ]}>
                {selectedMethod === method.id && <View style={styles.radioInner} />}
              </View>
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>{method.name}</Text>
              <Text style={styles.methodDescription}>{method.description}</Text>
            </View>
            <Text style={styles.methodPrice}>${method.price}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={proceedToAddress}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
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
  progressContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  steps: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  step: {
    alignItems: "center",
    flex: 1,
  },
  stepActive: {
    // Active step styles
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stepNumberActive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#328a0dff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stepText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  stepTextActive: {
    fontSize: 12,
    color: "#328a0dff",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  methodCardSelected: {
    borderColor: "#FF6B35",
    backgroundColor: "#FFF9E6",
  },
  radioContainer: {
    marginRight: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: "#FF6B35",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF6B35",
  },
  methodInfo: {
    flex: 1,
    marginRight: 12,
  },
  methodName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  methodPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  nextButton: {
    backgroundColor: "#FF6B35",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});