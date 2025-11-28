import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { X } from "lucide-react-native";
import { theme } from "@/styles/theme";

export default function WelcomeDrawer({ onClose }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={{ fontSize: 40 }}>⚡</Text>
      </View>

      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <X size={24} color="#999" />
      </TouchableOpacity>

      <Text style={styles.title}>Welcome to Deen AI!</Text>
      <Text style={styles.subtitle}>
        This is your first step toward building a consistent spiritual rhythm.
      </Text>

      <Text style={styles.streakNumber}>🔥 0</Text>
      <Text style={styles.streakLabel}>Days Streak!</Text>

      <View style={styles.daysRow}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <View key={d} style={styles.dayCircle}>
            <Text style={styles.dayText}>{d}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  iconContainer: {
    alignSelf: "center",
    padding: 14,
    backgroundColor: "#F5F5F5",
    borderRadius: 50,
    marginTop: 10,
  },
  closeBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: theme.font.bold,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#777",
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  streakNumber: {
    fontSize: 26,
    textAlign: "center",
    marginTop: 4,
  },
  streakLabel: {
    fontSize: 14,
    textAlign: "center",
    color: "#999",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 10,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 11,
    color: "#999",
  },
  button: {
    marginTop: 20,
    backgroundColor: theme.color.brand,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontFamily: theme.font.semiBold,
    fontSize: 16,
  },
});
