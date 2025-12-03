import InputField from "@/components/InputField";
import PrimaryButton from "@/components/primaryButton";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { useResetPassword } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { theme } from "@/styles/theme";
import { ResetPasswordSchema } from "@/utils/validation";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function NewPassword() {
    const { email, otp } = useLocalSearchParams<{ email: string; otp: string }>();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

    const resetPasswordMutation = useResetPassword();
    const { showToast } = useToast();

    const handleReset = async () => {
        try {
            setErrors({});

            await ResetPasswordSchema.validate(
                { password: newPassword, confirmPassword },
                { abortEarly: false }
            );

            if (!email || !otp) {
                showToast("Session expired. Please restart the password reset process.", "error");
                setTimeout(() => {
                    router.replace("/(auth)/forgot-password");
                }, 1000);
                return;
            }

            await resetPasswordMutation.mutateAsync({
                email: email as string,
                otp: otp as string,
                newPassword: newPassword
            });

        } catch (error: any) {
            if (error.name === "ValidationError") {
                const validationErrors: { password?: string; confirmPassword?: string } = {};
                error.inner.forEach((err: any) => {
                    if (err.path) {
                        validationErrors[err.path as keyof typeof validationErrors] = err.message;
                    }
                });
                setErrors(validationErrors);
            } else {
                showToast(
                    error.message || "Failed to reset password. Please try again.",
                    "error"
                );
            }
        }
    };

    return (
        <ScreenContainer>
            <ScreenHeader title="Reset password" />

            <Text style={styles.subtitle}>
                Create a new password. Your password should{"\n"}be easy to remember
            </Text>

            <InputField
                label="New Password"
                placeholder="Enter your password"
                value={newPassword}
                onChangeText={(text) => {
                    setNewPassword(text);
                    if (errors.password) {
                        setErrors({ ...errors, password: undefined });
                    }
                }}
                secureTextEntry={!showNewPassword}
                showPasswordToggle
                onTogglePassword={() => setShowNewPassword(!showNewPassword)}
                error={errors.password}
                editable={!resetPasswordMutation.isPending}
            />

            <InputField
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                        setErrors({ ...errors, confirmPassword: undefined });
                    }
                }}
                secureTextEntry={!showConfirmPassword}
                showPasswordToggle
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                error={errors.confirmPassword}
                editable={!resetPasswordMutation.isPending}
            />

            <View style={{ marginTop: 10 }}>
                <PrimaryButton
                    title={resetPasswordMutation.isPending ? "Resetting..." : "Reset"}
                    onPress={handleReset}
                    disabled={resetPasswordMutation.isPending}
                />
            </View>

            {/* <Text style={styles.footerText}>
                By using Deen AI, you agree to the{" "}
                <Text style={styles.link}>Terms and Privacy Policy.</Text>
            </Text> */}
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