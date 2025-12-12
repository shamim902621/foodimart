// import { useAuthChecker } from "@/components/AuthChecker";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { API_BASE_URL } from '../constants/constant';

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  // useAuthChecker()
  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile: phone }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert("OTP Sent", `An OTP has been sent to ${phone}`);
        router.push({
          pathname: "/otp-verification",
          params: { mobile: phone },
        });
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Network Error", "Unable to reach the server. Please try again later.");
      console.error("Error sending OTP:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>

      <TextInput
        style={styles.input}
        placeholder="Phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send OTP</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.bottomText}>
        Don’t have an account?{" "}
        <Text style={styles.link} onPress={() => router.push("/signup")}>
          Sign up
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffffff", justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", color: "#2ECC71", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    fontSize: 20,
    margin: 5,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#2ECC71',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  bottomText: { color: "#fff", textAlign: "center", marginTop: 16 },
  link: { fontWeight: "bold", textDecorationLine: "underline" }
});