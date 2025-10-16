import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ShippingAddressScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    zipCode: "",
    city: "",
    country: "",
  });
  const [saveAddress, setSaveAddress] = useState(true);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const proceedToPayment = () => {
    router.push('/payment-method');
  };

  return (
    <View style={styles.container}>

      {/* Progress Steps */}
      <View style={styles.progressContainer}>
        <View style={styles.steps}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>1</View>
            <Text style={styles.stepText}>DELIVERY</Text>
          </View>
          <View style={[styles.step, styles.stepActive]}>
            <View style={styles.stepNumberActive}>2</View>
            <Text style={styles.stepTextActive}>ADDRESS</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>3</View>
            <Text style={styles.stepText}>PAYMENT</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => updateFormData("name", value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(value) => updateFormData("email", value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(value) => updateFormData("phone", value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your full address"
              multiline
              numberOfLines={3}
              value={formData.address}
              onChangeText={(value) => updateFormData("address", value)}
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Zip code</Text>
              <TextInput
                style={styles.input}
                placeholder="Zip code"
                value={formData.zipCode}
                onChangeText={(value) => updateFormData("zipCode", value)}
              />
            </View>
            <View style={[styles.inputGroup, styles.flex2]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                value={formData.city}
                onChangeText={(value) => updateFormData("city", value)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              placeholder="Country"
              value={formData.country}
              onChangeText={(value) => updateFormData("country", value)}
            />
          </View>

          {/* Save Address Toggle */}
          <TouchableOpacity 
            style={styles.saveAddressOption}
            onPress={() => setSaveAddress(!saveAddress)}
          >
            <View style={[styles.checkbox, saveAddress && styles.checkboxChecked]}>
              {saveAddress && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={styles.saveAddressText}>Save this address</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={proceedToPayment}>
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
    backgroundColor: "#FF6B35",
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
    color: "#FF6B35",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
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
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  saveAddressOption: {
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
  saveAddressText: {
    fontSize: 16,
    color: "#333",
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