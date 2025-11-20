import InputField from "@/components/InputField";
import PrimaryButton from "@/components/primaryButton";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { useRequestOtp } from "@/hooks/useAuth";
import { theme } from "@/styles/theme";
import { ForgotPasswordSchema } from "@/utils/validation";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const requestOtpMutation = useRequestOtp();

  const handleSendOtp = async () => {
    try {
      setEmailError("");

      await ForgotPasswordSchema.validate({ email }, { abortEarly: false });

      await requestOtpMutation.mutateAsync(email.trim().toLowerCase());
    } catch (error: any) {
      if (error.name === "ValidationError") {
        setEmailError(error.errors[0]);
      } else {
        Alert.alert(
          "Error",
          error.message || "Failed to send verification code. Please try again."
        );
      }
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Reset Password" />

      <Text style={styles.subtitle}>
        Enter your email address below and we&apos;ll send you a verification code to reset your password
      </Text>

      <InputField
        label="Email Address"
        placeholder="Enter your email address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (emailError) setEmailError("");
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        error={emailError}
      />

      <View style={{ marginTop: 10 }}>
        <PrimaryButton
          title={requestOtpMutation.isPending ? "Sending..." : "Send"}
          onPress={handleSendOtp}
          disabled={requestOtpMutation.isPending}
        />
      </View>

      <Text style={styles.footerText}>
        By using Deen AI, you agree to the{" "}
        <Text style={styles.link}>Terms and Privacy Policy.</Text>
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 26,
    lineHeight: 22,
    fontFamily: theme.font.regular,
    color: "#333",
  },
  footerText: {
    marginTop: 20,
    fontSize: 13,
    textAlign: "center",
    color: "#777",
    lineHeight: 18,
    fontFamily: theme.font.regular,
  },
  link: {
    color: theme.color.brand,
    fontFamily: theme.font.semiBold,
  },
});