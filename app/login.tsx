// // import { useAuthChecker } from "@/components/AuthChecker";
// import { router } from "expo-router";
// import { useState } from "react";
// import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { API_BASE_URL } from '../constants/constant';

// export default function LoginScreen() {
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);
//   // useAuthChecker()
//   const handleSendOtp = async () => {
//     if (!phone || phone.length < 10) {
//       Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit phone number.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ mobile: phone }),
//       });

//       const data = await response.json();
//       setLoading(false);

//       if (response.ok) {
//         Alert.alert("OTP Sent", `An OTP has been sent to ${phone}`);
//         router.push({
//           pathname: "/otp-verification",
//           params: { mobile: phone },
//         });
//       } else {
//         Alert.alert("Error", data.message || "Failed to send OTP");
//       }
//     } catch (error) {
//       setLoading(false);
//       Alert.alert("Network Error", "Unable to reach the server. Please try again later.");
//       console.error("Error sending OTP:", error);
//     }
//   };
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome Back 👋</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Phone number"
//         keyboardType="phone-pad"
//         placeholderTextColor="rgba(63, 69, 78, 0.4)"
//         maxLength={10}
//         value={phone}
//         onChangeText={setPhone}
//       />

//       <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Send OTP</Text>
//         )}
//       </TouchableOpacity>

//       <Text style={styles.bottomText}>
//         Don’t have an account?{" "}
//         <Text style={styles.link} onPress={() => router.push("/signup")}>
//           Sign up
//         </Text>
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#ffffffff", justifyContent: "center", padding: 24 },
//   title: { fontSize: 28, fontWeight: "bold", color: "#2ECC71", marginBottom: 24 },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     padding: 8,
//     fontSize: 20,
//     margin: 5,
//     backgroundColor: '#f9f9f9',
//   },
//   button: {
//     backgroundColor: '#2ECC71',
//     padding: 12,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   buttonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
//   bottomText: { color: "#030303ff", textAlign: "center", marginTop: 16 },
//   link: { fontWeight: "bold", textDecorationLine: "underline" }
// });


import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { API_BASE_URL } from '../constants/constant';

export default function LoginScreen() {
  // --- STATE MANAGEMENT ---
  const [loginMode, setLoginMode] = useState<'otp' | 'password'>('otp');

  // Inputs
  const [identifier, setIdentifier] = useState(''); // Mobile (for OTP) OR Email/Mobile (for Password)
  const [password, setPassword] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  // --- HANDLER: SEND OTP ---
  const handleSendOtp = async () => {
    Keyboard.dismiss();

    // Clean input (remove non-digits)
    const cleanPhone = identifier.replace(/[^0-9]/g, '');

    if (cleanPhone.length < 10) {
      Alert.alert("Invalid Phone", "Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: cleanPhone }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        // ✅ Success: Go to Verify Screen
        router.push({
          pathname: "/otp-verification",
          params: { mobile: cleanPhone }, // Pass mobile number
        });
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Network Error", "Unable to connect to server. Check internet.");
    }
  };

  // --- HANDLER: PASSWORD LOGIN ---
  const handlePasswordLogin = async () => {
    Keyboard.dismiss();

    if (!identifier || !password) {
      Alert.alert("Missing Fields", "Please enter your ID and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier,
          password: password
        }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok && result.success) {
        // ✅ Login Success: Save Token & User
        await login(result.token, result.user);

        Alert.alert("Success", `Welcome back, ${result.user.firstName}!`);

        // 🔀 Redirect based on Role
        setTimeout(() => {
          switch (result.user.role) {
            case 'SUPERADMIN': router.replace('/superadmin/dashboard'); break;
            case 'ADMIN': router.replace('/admin/dashboard'); break;
            default: router.replace('/(tabs)/home');
          }
        }, 500);

      } else {
        Alert.alert("Login Failed", result.message || "Invalid credentials.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* --- HEADER --- */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>
            {loginMode === 'otp' ? 'Login with your mobile number' : 'Login using password'}
          </Text>
        </View>

        {/* --- TABS SWITCHER --- */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, loginMode === 'otp' && styles.activeTab]}
            onPress={() => setLoginMode('otp')}
          >
            <Text style={[styles.tabText, loginMode === 'otp' && styles.activeTabText]}>Mobile + OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, loginMode === 'password' && styles.activeTab]}
            onPress={() => setLoginMode('password')}
          >
            <Text style={[styles.tabText, loginMode === 'password' && styles.activeTabText]}>Password</Text>
          </TouchableOpacity>
        </View>

        {/* --- FORM SECTION --- */}
        <View style={styles.form}>

          {/* Input 1: Mobile / Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {loginMode === 'otp' ? 'Mobile Number' : 'Email or Mobile'}
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name={loginMode === 'otp' ? "call-outline" : "mail-outline"}
                size={20} color="#9CA3AF" style={{ marginRight: 10 }}
              />
              <TextInput
                style={styles.input}
                placeholder={loginMode === 'otp' ? "9876543210" : "john@example.com"}
                keyboardType={loginMode === 'otp' ? "phone-pad" : "email-address"}
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
                maxLength={loginMode === 'otp' ? 10 : undefined}
                value={identifier}
                onChangeText={setIdentifier}
              />
            </View>
          </View>

          {/* Input 2: Password (Only in Password Mode) */}
          {loginMode === 'password' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 8 }}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={loginMode === 'otp' ? handleSendOtp : handlePasswordLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {loginMode === 'otp' ? "Get OTP" : "Login"}
              </Text>
            )}
          </TouchableOpacity>

        </View>

        {/* --- FOOTER --- */}
        <View style={styles.footer}>
          <Text style={styles.bottomText}>Don’t have an account? </Text>
          <Link href="/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Layout
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    maxWidth: 500, // Tablet constraint
    alignSelf: 'center',
    width: '100%'
  },

  // Header
  header: { marginBottom: 32, alignItems: 'center' },
  brandTitle: { fontSize: 24, fontWeight: "800", color: "#2ECC71", marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' },
  title: { fontSize: 28, fontWeight: "800", color: "#111827", marginBottom: 6 },
  subtitle: { fontSize: 15, color: "#6B7280", textAlign: 'center' },

  // Tabs Switcher
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: { fontWeight: '600', color: '#6B7280', fontSize: 14 },
  activeTabText: { color: '#2ECC71', fontWeight: '700' },

  // Inputs
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: "#374151", marginLeft: 4 },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 14,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    height: '100%',
  },
  eyeIcon: { padding: 4 },
  forgotText: { color: '#2ECC71', fontWeight: '600', fontSize: 13 },

  // Main Button
  button: {
    backgroundColor: '#2ECC71',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: "#2ECC71",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16, letterSpacing: 0.5 },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    alignItems: 'center'
  },
  bottomText: { color: "#6B7280", fontSize: 15 },
  link: { color: "#2ECC71", fontWeight: "700", fontSize: 15, textDecorationLine: 'underline' }
}); 