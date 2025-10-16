import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");

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

      <TouchableOpacity style={styles.button} onPress={() => router.replace("/home")}>
        <Text style={styles.buttonText}>Login</Text>
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
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 24 },
   input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    margin:10,
    backgroundColor: '#f9f9f9',
  },
   button: {
    backgroundColor: '#2ECC71',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  bottomText: { color: "#fff", textAlign: "center", marginTop: 16 },
  link: { fontWeight: "bold", textDecorationLine: "underline" }
});
