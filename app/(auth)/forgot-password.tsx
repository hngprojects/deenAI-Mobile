import InputField from "@/components/InputField";
import PrimaryButton from "@/components/primaryButton";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { theme } from "@/styles/theme";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  return (
    <ScreenContainer>
      <ScreenHeader title="Reset Password" />

      <Text style={styles.subtitle}>Enter your email address below and we&apos;ll send you a link to reset your password </Text>

      <InputField
        label="Email Address"
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
      />

      <View style={{ marginTop: 10 }}>
        <PrimaryButton
          title="Send"
          onPress={() => router.push("/(auth)/reset-password")}
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
  container: {
    padding: 24,
    paddingBottom: 80,
  },
  backBtn: {
    marginBottom: 12,
    width: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    // color: "#555",
    marginTop: 20,
    marginBottom: 26,
    lineHeight: 20,
    fontFamily: theme.font.regular,
  },
  footerText: {
    marginTop: 20,
    fontSize: 13,
    textAlign: "center",
    color: "#777",
    lineHeight: 18,
  },
  link: {
    color: "#b86e00",
    fontWeight: "600",
  },
});
