import PrimaryButton from "@/components/primaryButton";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { theme } from "@/styles/theme";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function ResetPassword() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleCodeChange = (text: string, index: number) => {
    // Only allow numbers
    if (text && !/^\d+$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const verificationCode = code.join("");
    if (verificationCode.length === 6) {
      // TODO: Verify code and navigate to new password screen
      console.log("Verification code:", verificationCode);
      router.push("/(auth)/new-password");
    }
  };

  const handleResendCode = () => {
    // TODO: Implement resend code logic
    console.log("Resending code...");
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Reset password" />

      <Text style={styles.subtitle}>
        A verification code has been sent to your email.{"\n"}
        Enter the code below to verify your account
      </Text>

      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[styles.codeInput, digit && styles.codeInputFilled]}
            value={digit}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>

      <View style={{ marginTop: 24 }}>
        <PrimaryButton title="Verify" onPress={handleVerify} />
      </View>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn&apos;t receive ? </Text>
        <Text style={styles.resendLink} onPress={handleResendCode}>
          Resend Code
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 32,
    lineHeight: 22,
    fontFamily: theme.font.regular,
    color: "#333",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 8,
  },
  codeInput: {
    width: 50,
    height: 56,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    fontSize: 24,
    fontFamily: theme.font.semiBold,
    textAlign: "center",
    color: "#222",
    backgroundColor: "#FAFAFA",
  },
  codeInputFilled: {
    borderColor: theme.color.brand,
    backgroundColor: "#FFF",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  resendText: {
    fontSize: 15,
    color: "#777",
    fontFamily: theme.font.regular,
  },
  resendLink: {
    fontSize: 15,
    color: theme.color.brand,
    fontFamily: theme.font.semiBold,
  },
});
