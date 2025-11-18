import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ScreenHeader from "../screenHeader";
import { theme } from "@/styles/theme";

export default function DeleteAccountScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Delete Account" />

      <View style={styles.textWrapper}>
        <Text style={styles.boldText}>
          Are you sure you want to delete your 
          Account?
        </Text>
        <Text style={styles.normalText}>
           Once you delete your account, it cannot be undone. All
             your data will permanently be erased from this app
             includes your profile information. Preferences, saved 
                 content, and any activity history.


        </Text>
        <Text style={styles.normalText}>
    
            We’re sad to see you go, but we understand that 
           sometimes it’s necessary. Please take a moment to 
            consider the consequences before proceeding.
        </Text>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.deleteButton]}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },

  textWrapper: { marginTop: 30, marginBottom: 40 },
  boldText: { fontSize: 16, fontWeight: "700", color: "#000", marginBottom: 10 },
  normalText: { fontSize: 14, fontWeight: "400", color: "#555", marginBottom: 6 },

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
