import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ScreenHeader from "../screenHeader";
import { useRouter } from "expo-router";
import { theme } from "@/styles/theme";

export default function DeleteWarningAccount() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Delete Account" />
      <View style={styles.textWrapper}>
        <Text style={styles.text}>
          Clearing your activities will permanently remove {"\n"}
          your chat history, reflections, and saved progress.{"\n"}
           This action cannot be undone.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => router.push("/profile/delete/deletesuccess")}
      >
        <Text style={styles.deleteButtonText}>Clear Activities</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  textWrapper: {
    marginTop: 60,
    alignItems: "center", 
    justifyContent: "center",
  },

  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    lineHeight: 26,
  },

  deleteButton: {
    marginTop: 60,
    backgroundColor: theme.color.brand, 
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  deleteButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
});
