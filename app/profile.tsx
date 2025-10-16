import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 My Profile</Text>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace("/welcome")}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  logoutButton: { backgroundColor: "#2ECC71", padding: 14, borderRadius: 10 },
  logoutText: { color: "#fff", fontWeight: "bold" },
});
