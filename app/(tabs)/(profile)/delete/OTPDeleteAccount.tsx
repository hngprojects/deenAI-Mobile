import ScreenTitle from "@/components/ScreenTitle";
import { theme } from "@/styles/theme";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useVerifyOtp } from "@/hooks/useUpdateProfile";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export default function OTPDeleteAccount() {
  const router = useRouter();

  // GET EMAIL FROM PREVIOUS SCREEN
  const { email } = useLocalSearchParams();

  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputs = useRef<any>([]);

  const { mutate: verifyOtp, isPending } = useVerifyOtp();
  const { isConnected, showNoConnectionToast } = useNetworkStatus();

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

  const handleVerify = () => {
    if (!isConnected) {
      showNoConnectionToast();
      return;
    }

    const code = otp.join("");

    // Use the dynamic email instead of hardcoded email
    verifyOtp(
      { email: String(email), otp: code },
      {
        onSuccess: () => {
          router.push("/(tabs)/(profile)/delete/DeleteAccountSuccess");
        },
      }
    );
  };

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
        A 5-digit code has been sent to{" "}
        <Text style={styles.boldEmail}>{email}</Text>
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            style={[styles.otpBox, digit ? styles.otpFilled : null]}
            value={digit}
            secureTextEntry={true}
            keyboardType="numeric"
            maxLength={1}
            textContentType="oneTimeCode"
            onChangeText={(text) =>
              handleChange(text.replace(/[^0-9]/g, ""), index)
            }
          />
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.deleteButton,
          { opacity: isComplete && !isPending ? 1 : 0.5 },
        ]}
        disabled={!isComplete || isPending}
        onPress={handleVerify}
      >
        <Text style={styles.deleteButtonText}>
          {isPending ? "Verifying..." : "Delete Account"}
        </Text>
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
