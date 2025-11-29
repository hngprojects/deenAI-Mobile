import PrimaryButton from "@/components/primaryButton";
import ScreenContainer from "@/components/ScreenContainer";
import { theme } from "@/styles/theme";
import { router } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function PasswordResetSuccess() {
    const handleLogin = () => {
        router.replace("/(auth)/login");
    };

    return (
        <ScreenContainer>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Image
                        source={require("../../assets/images/check.png")}
                        style={styles.checkIcon}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.title}>Password Reset{"\n"}Successful</Text>

                <Text style={styles.subtitle}>
                    You can now proceed to log in
                </Text>

                <View style={styles.buttonContainer}>
                    <PrimaryButton
                        title="Login"
                        onPress={handleLogin}
                    />
                </View>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    iconContainer: {
        marginBottom: 40,
    },
    checkIcon: {
        width: 120,
        height: 120,
    },
    title: {
        fontSize: 28,
        fontFamily: theme.font.bold,
        color: theme.color.secondary,
        textAlign: "center",
        marginBottom: 16,
        lineHeight: 36,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: theme.font.regular,
        color: "#666",
        textAlign: "center",
        marginBottom: 60,
    },
    buttonContainer: {
        width: "100%",
        paddingHorizontal: 10,
    },
});