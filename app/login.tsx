import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { API_BASE_URL } from '../constants/constant';

// Best Practice: Define roles as constants to avoid typos
const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN'
};

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Best Practice: Empty dependency array [] ensures this runs ONLY once on mount
  const checkUserLogin = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData");

      if (jsonValue != null) {
        const userData = JSON.parse(jsonValue);
        const userRole = userData?.role;

        console.log("Auto-login check:", userRole);

        switch (userRole) {
          case "USER":
            router.replace('/category');
            return; // Stop execution so we don't toggle checkingAuth unnecessarily
          case "ADMIN":
            router.replace('/admin/dashboard');
            return;
          case "SUPERADMIN":
            router.replace('/superadmin/dashboard');
            return;
          default:
            router.replace('/login');

            // If role is unknown, just stay here and show the login form
            console.warn("Unknown role found in storage");
            break;
        }
      }
    } catch (e) {
      // If JSON parse fails or storage error, ignore and let user login
      console.error("Error reading user data", e);
      // Optional: Clear corrupted data
      await AsyncStorage.removeItem("userData");
    } finally {
      // Only stop loading if we haven't redirected
      setCheckingAuth(false);
    }
  };
  useEffect(() => {
    checkUserLogin();
  }, []); // Empty dependency array ensures this runs only once on mount
  
  const handleSendOtp = async () => {
    // Basic validation
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
      Alert.alert("Network Error", "Unable to reach the server. Please try again later.");
      console.error("Error sending OTP:", error);
    } finally {
      // Best Practice: Ensure loading stops regardless of success or failure
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <View style={[styles.container, { alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>

      <TextInput
        style={styles.input}
        placeholder="Phone number"
        keyboardType="phone-pad"
        value={phone}
        maxLength={10}
        editable={!loading} // Disable input while loading
        onChangeText={(text) => {
          const cleaned = text.replace(/[^0-9]/g, "");
          setPhone(cleaned);
        }}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSendOtp}
        disabled={loading}
      >
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
  container: {
    flex: 1,
    backgroundColor: "#fff", // Fixed color hex
    justifyContent: "center",
    padding: 24
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2ECC71",
    marginBottom: 24
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8, // Slightly more modern radius
    padding: 12,     // More breathing room
    fontSize: 18,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2ECC71',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#95e6b7', // Visual feedback for disabled state
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  bottomText: {
    color: "gray",
    textAlign: "center",
    marginTop: 24
  },
  link: {
    color: "#2ECC71", // Colored link looks better
    fontWeight: "bold",
    textDecorationLine: "underline"
  }
});