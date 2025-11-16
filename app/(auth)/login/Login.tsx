import InputField from "@/components/InputField";
import SocialButton from "@/components/socialLoginButton";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useState } from "react";
import PrimaryButton from "@/components/primaryButton";
import { ArrowLeft, Check } from "lucide-react-native";

export default function LoginScreen() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [rememberMe, setRememberMe] = useState(false);
 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <ArrowLeft />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Login to account</Text>

      <Text style={styles.subtitle}>Welcome back! Ready to connect with NoorAI? </Text>

      {/* Form Fields */}
      <InputField
        label="Name"
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <InputField
        label="Email Address"
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Remember Me & Forgotten Password */}
   <View style={styles.optionsContainer}>
      <TouchableOpacity
        style={styles.rememberMe}
        onPress={() => setRememberMe(!rememberMe)}
      >
        <View style={[styles.checkbox, rememberMe && styles.checked]}>
          {rememberMe && <Check size={16} color="#fff" />}
        </View>
        <Text style={styles.rememberMeText}>Remember Me</Text>
      </TouchableOpacity>
    

        <TouchableOpacity onPress={() => router.push("/forgot-password/ForgotPassword")}>
          <Text style={styles.forgotText}>Forgotten Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Button */}
      <View style={{ marginTop: 10 }}>
        <PrimaryButton
          title="Login"
          onPress={() => router.push("/create-account/createAccountSuccess")}
        />
      </View>

      {/* OR */}
      <Text style={styles.or}>or</Text>

      {/* Social login */}
      <SocialButton
        icon={require("@/assets/images/Apple.png")}
        label="Continue with Apple"
        onPress={() => {}}
      />

      <SocialButton
        icon={require("@/assets/images/Google.png")}
        label="Continue with Google"
        onPress={() => {}}
      />

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
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: -10,
  },
   rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#555",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  checked: {
    backgroundColor: "b45309",
    borderColor: "b45309",
  },
  rememberMeText: {
    fontSize: 14,
    color: "#555",
  },
  forgotText: {
    color: "#b86e00",
    fontSize: 14,
    fontWeight: "600",
  },
  or: {
    textAlign: "center",
    marginVertical: 16,
    color: "#666",
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
