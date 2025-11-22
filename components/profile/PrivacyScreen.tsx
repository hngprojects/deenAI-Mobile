import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ScreenHeader from "../screenHeader";

export default function PrivacyScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Support" />

      <Text style={styles.text}>
        Your privacy and peace of mind are very important to us. Every chat,
        reflection, and saved note within DeenAi is stored securely and kept
        strictly private.DeenAi does not share, sell, or use your personal
        data for advertising.
      </Text>

      <Text style={styles.text}>
        Your reflections are yours alone, only you can view or delete them. We
        also use secure encryption methods to protect all stored information
        and ensure that your conversations with DeenAi remain confidential.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    marginBottom: 20,
    fontWeight: "400"
  }
});
