import InputField from "@/components/InputField";
import SocialButton from "@/components/socialLoginButton";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import PrimaryButton from "@/components/primaryButton";
import { ArrowLeft } from "lucide-react-native";

export default function CreateAccount() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false); // track if user tried to submit

  const validate = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = () => {
    setSubmitted(true);
    if (validate()) {
      router.push("/create-account/createAccountSuccess");
    }
  };

  // Update handlers to clear errors as user types
  const handleNameChange = (text: string) => {
    setName(text);
    if (submitted && text.trim()) setErrors(prev => ({ ...prev, name: "" }));
  };
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (submitted) {
      if (!text.trim() || /^\S+@\S+\.\S+$/.test(text)) setErrors(prev => ({ ...prev, email: "" }));
    }
  };
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (submitted && (text.length >= 6)) setErrors(prev => ({ ...prev, password: "" }));
  };
  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (submitted && text === password) setErrors(prev => ({ ...prev, confirmPassword: "" }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <ArrowLeft />
      </TouchableOpacity>

      <Text style={styles.title}>Create new account</Text>
      <Text style={styles.subtitle}>
        Start by creating a free account, it helps you save your
        chats, reflections, and progress with ease.
      </Text>


      <InputField label="Name" placeholder="Enter your name" value={name} onChangeText={handleNameChange} error={errors.name} />
      <InputField label="Email Address" placeholder="Enter your email" value={email} onChangeText={handleEmailChange} error={errors.email} />
      <InputField label="Create Password" placeholder="Enter your password" secure value={password} onChangeText={handlePasswordChange} error={errors.password} />
      <InputField label="Confirm Password" placeholder="Confirm your password" secure value={confirmPassword} onChangeText={handleConfirmPasswordChange} error={errors.confirmPassword} />

      <View style={{ marginTop: 10 }}>
        <PrimaryButton title="Sign Up" onPress={handleSignUp} />
      </View>

      <Text style={styles.or}>or</Text>

      <SocialButton icon={require("@/assets/images/Apple.png")} label="Continue with Apple" onPress={() => {}} />
      <SocialButton icon={require("@/assets/images/Google.png")} label="Continue with Google" onPress={() => {}} />

      <Text style={styles.footerText}>
        By using Noor AI, you agree to the <Text style={styles.link}>Terms and Privacy Policy.</Text>
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
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
});
