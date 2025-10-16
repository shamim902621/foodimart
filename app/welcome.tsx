import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽️ Foodly</Text>
      <Text style={styles.subtitle}>Order delicious food from nearby restaurants!</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/signup")}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2ECC71", justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 36, fontWeight: "bold", color: "#fff", marginBottom: 12 },
  subtitle: { fontSize: 18, color: "#fff", textAlign: "center", marginBottom: 32 },
  button: { backgroundColor: "#fff", paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 },
  buttonText: { color: "#2ECC71", fontWeight: "bold", fontSize: 18 }
});
