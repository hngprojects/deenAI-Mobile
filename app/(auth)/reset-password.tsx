import PrimaryButton from "@/components/primaryButton";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { useRequestOtp, useVerifyOtp } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { theme } from "@/styles/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function ResetPassword() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const verifyOtpMutation = useVerifyOtp();
    const requestOtpMutation = useRequestOtp();
    const { showToast } = useToast();

    useEffect(() => {
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }, []);

    const handleCodeChange = (text: string, index: number) => {
        if (text && !/^\d+$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const verificationCode = code.join("");

        if (verificationCode.length !== 6) {
            showToast("Please enter the complete 6-digit verification code", "warning");
            return;
        }

        if (!email) {
            showToast("Email not found. Please try again.", "error");
            router.back();
            return;
        }

        try {
            await verifyOtpMutation.mutateAsync({
                email: email as string,
                otp: verificationCode
            });

            router.push({
                pathname: "/(auth)/new-password",
                params: { email, otp: verificationCode }
            });
        } catch (error: any) {
            showToast(
                error.message || "Invalid verification code. Please try again.",
                "error"
            );
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        }
    };

    const handleResendCode = async () => {
        if (!email) {
            showToast("Email not found. Please try again.", "error");
            return;
        }

        try {
            await requestOtpMutation.mutateAsync(email as string);
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } catch (error: any) {
            // Error toast already shown in useRequestOtp hook
        }
    };

  return (
    <ScreenContainer>
      <ScreenHeader title="Reset password" />

            <Text style={styles.subtitle}>
                A verification code has been sent to{"\n"}
                <Text style={styles.emailText}>{email}</Text>
                {"\n"}Enter the code below to verify your account
            </Text>

            <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        style={[
                            styles.codeInput,
                            digit && styles.codeInputFilled,
                        ]}
                        value={digit}
                        onChangeText={(text) => handleCodeChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                        editable={!verifyOtpMutation.isPending}
                    />
                ))}
            </View>

            <View style={{ marginTop: 24 }}>
                <PrimaryButton
                    title={verifyOtpMutation.isPending ? "Verifying..." : "Verify"}
                    onPress={handleVerify}
                    disabled={verifyOtpMutation.isPending}
                />
            </View>

            <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn&apos;t receive? </Text>
                <Text
                    style={[
                        styles.resendLink,
                        requestOtpMutation.isPending && styles.resendLinkDisabled
                    ]}
                    onPress={requestOtpMutation.isPending ? undefined : handleResendCode}
                >
                    {requestOtpMutation.isPending ? "Sending..." : "Resend Code"}
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
    emailText: {
        color: theme.color.brand,
        fontFamily: theme.font.semiBold,
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
    resendLinkDisabled: {
        color: "#999",
    },
});
