import ScreenHeader from "@/components/screenHeader";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileSignOutOverlay() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Sign out" />

      <View style={styles.textWrapper}>
        <Text style={styles.boldText}>
          Do you want to log out?
        </Text>

        <Text style={styles.normalText}>
          You will need to sign in again{"\n"}to access your account.
        </Text>
      </View>

      <View style={styles.buttonWrapper}>
        {/* Cancel button goes back */}
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        {/* Delete button navigates to delete check page */}
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => router.push("/profile/delete/deletecheck")}
        >
          <Text style={styles.deleteButtonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },

  textWrapper: { marginTop: 30, marginBottom: 40 },
  boldText: { fontSize: 16, fontWeight: "700", color: "#000", marginBottom: 10, fontFamily:theme.font.regular },
  normalText: { fontSize: 14, fontWeight: "400", color: "#555", marginBottom: 6, fontFamily:theme.font.regular },

  buttonWrapper: { flexDirection: "column", gap: 12 }, 

  button: {
    width: "100%",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: "#F2393C",
  },
  cancelButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  deleteButton: {
    backgroundColor: theme.color.background, 
    borderWidth: 1,
    borderColor: "#000",
  },
  deleteButtonText: { color: "#000", fontWeight: "700", fontSize: 16 },
});
