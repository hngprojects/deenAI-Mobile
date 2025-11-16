import InputField from "@/components/InputField";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import PrimaryButton from "@/components/primaryButton";
import { ArrowLeft } from "lucide-react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <ArrowLeft />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Forgot Password</Text>

      <Text style={styles.subtitle}>Enter your email address below and we&apos;ll send you a link to reset your password </Text>

      <InputField
        label="Email Address"
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Sign Up Button */}
      <View style={{ marginTop: 10 }}>
        <PrimaryButton
          title="Send"
          onPress={() => router.push("/forgot-password/ForgotPassword")}
        />
      </View>

      <Text style={styles.footerText}>
        By using Noor AI, you agree to the{" "}
        <Text style={styles.link}>Terms and Privacy Policy.</Text>
      </Text>
    </ScrollView>
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
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 26,
    lineHeight: 20,
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
