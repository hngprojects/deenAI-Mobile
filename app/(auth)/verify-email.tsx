import PrimaryButton from "@/components/primaryButton";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { useVerifyEmail, useResendVerification } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { theme } from "@/styles/theme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View, AppState } from "react-native";

const RESEND_COOLDOWN_KEY = '@resend_verification_cooldown';
const COOLDOWN_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function VerifyEmail() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [canResend, setCanResend] = useState(true);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const verifyEmailMutation = useVerifyEmail();
    const resendVerificationMutation = useResendVerification();
    const { showToast } = useToast();

    // Check cooldown on mount and when app comes to foreground
    useEffect(() => {
        checkCooldown();

        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                checkCooldown();
            }
        });

        return () => {
            subscription.remove();
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    // Timer countdown effect
    useEffect(() => {
        if (timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1000) {
                        setCanResend(true);
                        if (timerRef.current) {
                            clearInterval(timerRef.current);
                        }
                        AsyncStorage.removeItem(RESEND_COOLDOWN_KEY);
                        return 0;
                    }
                    return prev - 1000;
                });
            }, 1000);

            return () => {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            };
        }
    }, [timeRemaining]);

    useEffect(() => {
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }, []);

    const checkCooldown = async () => {
        try {
            const cooldownEndTime = await AsyncStorage.getItem(RESEND_COOLDOWN_KEY);

            if (cooldownEndTime) {
                const endTime = parseInt(cooldownEndTime, 10);
                const now = Date.now();
                const remaining = endTime - now;

                if (remaining > 0) {
                    setTimeRemaining(remaining);
                    setCanResend(false);
                } else {
                    await AsyncStorage.removeItem(RESEND_COOLDOWN_KEY);
                    setCanResend(true);
                    setTimeRemaining(0);
                }
            } else {
                setCanResend(true);
                setTimeRemaining(0);
            }
        } catch (error) {
            console.error('Error checking cooldown:', error);
        }
    };

    const startCooldown = async () => {
        const endTime = Date.now() + COOLDOWN_DURATION;
        try {
            await AsyncStorage.setItem(RESEND_COOLDOWN_KEY, endTime.toString());
            setTimeRemaining(COOLDOWN_DURATION);
            setCanResend(false);
        } catch (error) {
            console.error('Error starting cooldown:', error);
        }
    };

    const formatTime = (milliseconds: number): string => {
        const totalSeconds = Math.ceil(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

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
            await verifyEmailMutation.mutateAsync({
                email: email as string,
                otp: verificationCode
            });

            // Clear cooldown on successful verification
            await AsyncStorage.removeItem(RESEND_COOLDOWN_KEY);

            // Route to login on successful verification
            router.push("/(auth)/login");
        } catch (error: any) {
            // Error toast already shown in useVerifyEmail hook
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
            console.error("Verification error:", error);
        }
    };

    const handleResendCode = async () => {
        if (!canResend) {
            showToast(
                `Please wait ${formatTime(timeRemaining)} before resending`,
                "warning"
            );
            return;
        }

        if (!email) {
            showToast("Email not found. Please try again.", "error");
            return;
        }

        try {
            await resendVerificationMutation.mutateAsync(email as string);
            await startCooldown();

            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } catch (error: any) {
            // Error toast already shown in useResendVerification hook
            console.error("Resend code error:", error);
        }
    };

    return (
        <ScreenContainer>
            <ScreenHeader title="Verify Email" />

            <Text style={styles.subtitle}>
                A verification code has been sent to your email {"\n"}
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
                        editable={!verifyEmailMutation.isPending}
                    />
                ))}
            </View>

            <View style={{ marginTop: 24 }}>
                <PrimaryButton
                    title={verifyEmailMutation.isPending ? "Verifying..." : "Verify"}
                    onPress={handleVerify}
                    disabled={verifyEmailMutation.isPending}
                />
            </View>

            <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn&apos;t receive? </Text>
                <Text
                    style={[
                        styles.resendLink,
                        (!canResend || resendVerificationMutation.isPending) && styles.resendLinkDisabled
                    ]}
                    onPress={
                        resendVerificationMutation.isPending || !canResend
                            ? undefined
                            : handleResendCode
                    }
                >
                    {resendVerificationMutation.isPending
                        ? "Sending..."
                        : !canResend
                        ? `Resend in ${formatTime(timeRemaining)}`
                        : "Resend Code"
                    }
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