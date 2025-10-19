import BackButton from '@/components/back-button';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function PaymentMethodScreen() {
  const [selectedMethod, setSelectedMethod] = useState("credit-card");
  const [saveCard, setSaveCard] = useState(true);
  const [cardData, setCardData] = useState({
    name: "RUSSELL AUSTIN",
    number: "XXXX XXXX XXXX 8790",
    expiry: "01/22",
    cvv: ""
  });

  const updateCardData = (field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const makePayment = () => {
    router.push('/order-success');
  };

  const paymentMethods = [
    { id: "paypal", name: "Paypal", icon: "logo-paypal" },
    { id: "credit-card", name: "Credit Card", icon: "card-outline" },
    { id: "apple-pay", name: "Apple pay", icon: "logo-apple" }
  ];

  return (
    <View style={styles.container}>


      {/* Progress Steps */}
      <View style={styles.progressContainer}>
                <BackButton fallbackRoute="/cart" />

        <View style={styles.steps}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>1</View>
            <Text style={styles.stepText}>DELIVERY</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>2</View>
            <Text style={styles.stepText}>ADDRESS</Text>
          </View>
          <View style={[styles.step, styles.stepActive]}>
            <View style={styles.stepNumberActive}>3</View>
            <Text style={styles.stepTextActive}>PAYMENT</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Payment Methods */}
        <View style={styles.paymentMethods}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodButton,
                selectedMethod === method.id && styles.methodButtonSelected
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <Ionicons 
                name={method.icon} 
                size={24} 
                color={selectedMethod === method.id ? "#FF6B35" : "#666"} 
              />
              <Text style={[
                styles.methodText,
                selectedMethod === method.id && styles.methodTextSelected
              ]}>
                {method.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Credit Card Form */}
        {selectedMethod === "credit-card" && (
          <View style={styles.cardForm}>
            <View style={styles.cardPreview}>
              <Text style={styles.cardNumber}>{cardData.number}</Text>
              <View style={styles.cardDetails}>
                <Text style={styles.cardName}>{cardData.name}</Text>
                <Text style={styles.cardExpiry}>{cardData.expiry}</Text>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name on the card</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter name on card"
                  value={cardData.name}
                  onChangeText={(value) => updateCardData("name", value)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Card number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter card number"
                  keyboardType="numeric"
                  value={cardData.number}
                  onChangeText={(value) => updateCardData("number", value)}
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={styles.label}>Month/Year</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChangeText={(value) => updateCardData("expiry", value)}
                  />
                </View>
                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="CVV"
                    keyboardType="numeric"
                    secureTextEntry
                    value={cardData.cvv}
                    onChangeText={(value) => updateCardData("cvv", value)}
                  />
                </View>
              </View>

              {/* Save Card Toggle */}
              <TouchableOpacity 
                style={styles.saveCardOption}
                onPress={() => setSaveCard(!saveCard)}
              >
                <View style={[styles.checkbox, saveCard && styles.checkboxChecked]}>
                  {saveCard && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
                <Text style={styles.saveCardText}>Save this card</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Payment Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.paymentButton} onPress={makePayment}>
          <Text style={styles.paymentButtonText}>Make a payment</Text>
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
  },
  paymentMethods: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  methodButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    gap: 8,
  },
  methodButtonSelected: {
    borderColor: "#328a0dff",
    backgroundColor: "#FFF9E6",
  },
  methodText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  methodTextSelected: {
    color: "#328a0dff",
  },
  cardForm: {
    padding: 16,
  },
  cardPreview: {
    backgroundColor: "#328a0dff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
    marginBottom: 20,
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardName: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  cardExpiry: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  form: {
    // Form styles same as previous screens
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  saveCardOption: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  saveCardText: {
    fontSize: 16,
    color: "#333",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  paymentButton: {
    backgroundColor: "#328a0dff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  paymentButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});