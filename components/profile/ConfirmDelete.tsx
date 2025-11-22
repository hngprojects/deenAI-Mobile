import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import ScreenHeader from "../screenHeader";
import { useRouter } from "expo-router";

export default function ConfirmDeleteAccount() {
  const router = useRouter();

  const [code, setCode] = useState(["", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value; // store actual value
    setCode(newCode);

    // Move to next input
    if (value && index < 4) {
      const nextInput = inputs.current[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Delete Account" />

      {/* Centered Text Section */}
      <View style={styles.centerTextWrapper}>
        <Text style={styles.boldTitle}>Confirm Delete</Text>
        <Text style={styles.normalText}>A 5-digit code has been sent to</Text>
        <Text style={styles.emailText}>ismail123@gmail.com</Text>
      </View>

      {/* Code Input Boxes */}
      <View style={styles.codeContainer}>
        {code.map((item, index) => (
          <TextInput
            key={index}
            ref={(ref: TextInput | null) => {
              if (ref) inputs.current[index] = ref;
            }}
            style={styles.codeInput}
            maxLength={1}
            keyboardType="number-pad"
            // Show "*" visually but store the real input
            value={item ? "*" : ""}
            onChangeText={(value) => handleChange(value, index)}
          />
        ))}
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => router.push("/profile/delete/deletewarning")}
      >
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  centerTextWrapper: {
    marginTop: 40,
    alignItems: "center",
  },

  boldTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },

  normalText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
    textAlign: "center",
  },

  emailText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },

  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    gap: 10,
  },

  codeInput: {
    width: 55,
    height: 55,
    borderWidth: 1.5,
    borderColor: "#999",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
  },

  deleteButton: {
    backgroundColor: "#F2393C",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 50,
  },

  deleteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
