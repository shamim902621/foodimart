// components/ui/stat-box.tsx
import { StyleSheet, Text, View } from "react-native";

interface StatBoxProps {
  title: string;
  value: string;
  icon?: string;
  color?: string;
}

export function StatBox({ title, value, icon, color = "#3B82F6" }: StatBoxProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon && <Text style={styles.icon}>{icon}</Text>}
      </View>
      <Text style={styles.value}>{value}</Text>
      <View style={[styles.indicator, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  icon: {
    fontSize: 18,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  indicator: {
    width: 32,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
});