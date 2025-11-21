import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DeleteSuccess() {
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Text style={styles.check}>✓</Text>
      </View>

    
      <Text style={styles.successText}>Account Deleted Successfully</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#50981D",
    backgroundColor: "#fff", 
    alignItems: "center",
    justifyContent: "center",
  },

  check: {
    color: "#50981D",
    fontSize: 40,
    fontWeight: "bold",
    marginTop: -4,
  },

  successText: {
    marginTop: 25,
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
});
