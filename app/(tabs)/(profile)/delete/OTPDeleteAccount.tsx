import ScreenTitle from "@/components/ScreenTitle";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OTPDeleteAccount() {
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputs = useRef<any>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;

    const updated = [...otp];
    updated[index] = text;
    setOtp(updated);

    if (text && index < 4) {
      inputs.current[index + 1].focus();
    }
  };

  const isComplete = otp.every((digit) => digit.length === 1);

  return (
    <View style={styles.container}>
      <ScreenTitle
        title="Delete Account"
        onBackPress={() =>
          router.push("/(tabs)/(profile)/delete/DeleteAccoutReasonScreen")
        }
      />

      <Text style={styles.confirmTitle}>Confirm Delete</Text>
      <Text style={styles.infoText}>
        An 5-digit code has been sent to{" "}
        <Text style={styles.boldEmail}>ismail123@gmail.com</Text>
      </Text>

      {/* OTP BOXES */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            style={[styles.otpBox, digit ? styles.otpFilled : null]}
            value={digit}
            keyboardType="numeric"
            maxLength={1}
            secureTextEntry={true}
            textContentType="oneTimeCode"
            onChangeText={(text) =>
              handleChange(text.replace(/[^0-9]/g, ""), index)
            }
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.deleteButton, { opacity: isComplete ? 1 : 0.5 }]}
        disabled={!isComplete}
        onPress={() => {
          if (!isComplete) return;
          router.push("/(tabs)/(profile)/delete/DeleteAccountSuccess");
        }}
      >
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },

  confirmTitle: {
    textAlign: "center",
    fontSize: 20,
    marginTop: 40,
    fontFamily: theme.font.semiBold,
  },

  infoText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    fontFamily: theme.font.regular,
  },

  boldEmail: {
    fontFamily: theme.font.semiBold,
    color: "#000",
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingHorizontal: 10,
  },
  otpFilled: {
    backgroundColor: "#C7C5CC",
  },

  otpBox: {
    width: 55,
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    fontFamily: theme.font.semiBold,
    backgroundColor: "#fff",
  },

  deleteButton: {
    marginTop: 40,
    backgroundColor: "#E55153",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: theme.font.semiBold,
  },
});
