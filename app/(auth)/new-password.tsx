import InputField from "@/components/InputField";
import PrimaryButton from "@/components/primaryButton";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { theme } from "@/styles/theme";
import { ResetPasswordSchema } from "@/utils/validation";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function NewPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async () => {
        try {
            // Clear previous errors
            setErrors({});

            // Validate with Yup schema
            await ResetPasswordSchema.validate(
                { password: newPassword, confirmPassword },
                { abortEarly: false }
            );

            setIsLoading(true);

            // TODO: Implement password reset API call
            console.log("Resetting password...");

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            router.replace("/(auth)/success");

        } catch (error: any) {
            if (error.name === "ValidationError") {
                // Handle Yup validation errors
                const validationErrors: { password?: string; confirmPassword?: string } = {};
                error.inner.forEach((err: any) => {
                    if (err.path) {
                        validationErrors[err.path as keyof typeof validationErrors] = err.message;
                    }
                });
                setErrors(validationErrors);
            } else {
                // Handle API errors
                Alert.alert("Error", "Failed to reset password. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScreenContainer>
            <ScreenHeader title="Reset password" />

            <Text style={styles.subtitle}>
                Create a new password, your password should{"\n"}be easy to remember
            </Text>

            <InputField
                label="New Password"
                placeholder="Enter your password"
                value={newPassword}
                onChangeText={(text) => {
                    setNewPassword(text);
                    // Clear error when user starts typing
                    if (errors.password) {
                        setErrors({ ...errors, password: undefined });
                    }
                }}
                secureTextEntry={!showNewPassword}
                showPasswordToggle
                onTogglePassword={() => setShowNewPassword(!showNewPassword)}
                error={errors.password}
            />

            <InputField
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={(text) => {
                    setConfirmPassword(text);
                    // Clear error when user starts typing
                    if (errors.confirmPassword) {
                        setErrors({ ...errors, confirmPassword: undefined });
                    }
                }}
                secureTextEntry={!showConfirmPassword}
                showPasswordToggle
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                error={errors.confirmPassword}
            />

            <View style={{ marginTop: 10 }}>
                <PrimaryButton
                    title={isLoading ? "Resetting..." : "Reset"}
                    onPress={handleReset}
                    disabled={isLoading}
                />
            </View>

            <Text style={styles.footerText}>
                By using Deen Ai, you agree to the{" "}
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