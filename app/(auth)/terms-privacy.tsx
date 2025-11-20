import PrimaryButton from "@/components/primaryButton";
import ScreenContainer from "@/components/ScreenContainer";
import SecondaryButton from "@/components/secondaryButton";
import { theme } from "@/styles/theme";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PrivacyPolicy() {
    const insets = useSafeAreaInsets();

    const handleAccept = () => {
        // TODO: Save user's acceptance
        router.back();
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={styles.wrapper}>
            <ScreenContainer
                backgroundColor="#FAFAFA"
                scrollable={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 180 }}
            >

                <Text style={styles.header}>TERMS AND PRIVACY POLICY</Text>

                <Text style={styles.title}>Deen AI Privacy Policy</Text>

                <Text style={styles.date}>Last Updated on 18th, Nov 2025</Text>

                <Text style={styles.sectionTitle}>1. Introduction</Text>

                <Text style={styles.paragraph}>
                    Welcome to Deen AI. Your privacy is important to us. This Privacy Policy explains how we collect, use, store, protect, and share your information when you use the Deen AI mobile application and related services.
                </Text>

                <Text style={styles.paragraph}>
                    By using Deen AI, you agree to the practices described in this policy.
                </Text>

                <Text style={styles.sectionTitle}>2. Information We Collect</Text>

                <Text style={styles.paragraph}>
                    We collect the following types of information to provide and improve our services:
                </Text>

                <Text style={styles.subSectionTitle}>2.1 Personal Information</Text>

                <Text style={styles.bulletPoint}>• Name</Text>
                <Text style={styles.bulletPoint}>• Email address</Text>
                <Text style={styles.bulletPoint}>• Phone number (if applicable)</Text>
                <Text style={styles.bulletPoint}>• Account login details</Text>
                <Text style={styles.bulletPoint}>• Profile information</Text>

                <Text style={styles.subSectionTitle}>2.2 Verification & Security Information</Text>

                <Text style={styles.bulletPoint}>• One-time verification codes (OTP)</Text>
                <Text style={styles.bulletPoint}>• Password reset codes</Text>
                <Text style={styles.bulletPoint}>• Authentication logs</Text>

                <Text style={styles.subSectionTitle}>2.3 Usage Data</Text>

                <Text style={styles.bulletPoint}>• App interactions and features used</Text>
                <Text style={styles.bulletPoint}>• Device information (model, OS, unique identifiers)</Text>
                <Text style={styles.bulletPoint}>• IP address and approximate location</Text>
                <Text style={styles.bulletPoint}>• Error logs and diagnostic data</Text>

                <Text style={styles.subSectionTitle}>2.4 Optional Data (only if you choose to provide it)</Text>

                <Text style={styles.bulletPoint}>• User uploaded content</Text>
                <Text style={styles.bulletPoint}>• Feedback or support messages</Text>

                <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>

                <Text style={styles.paragraph}>
                    We use collected data to:
                </Text>

                <Text style={styles.bulletPoint}>• Create and manage your Deen AI account</Text>
                <Text style={styles.bulletPoint}>• Verify your identity and secure your account</Text>
                <Text style={styles.bulletPoint}>• Provide services and personalization</Text>
                <Text style={styles.bulletPoint}>• Improve performance and usability</Text>
                <Text style={styles.bulletPoint}>• Troubleshoot issues and detect fraud</Text>
                <Text style={styles.bulletPoint}>• Communicate updates, alerts, and support messages</Text>

                <Text style={styles.paragraph}>
                    We do not sell your personal information.
                </Text>

                <Text style={styles.sectionTitle}>4. How We Share Your Information</Text>

                <Text style={styles.paragraph}>
                    We may share limited data with:
                </Text>

                <Text style={styles.bulletPoint}>• Service partners (e.g., email/SMS/notification partners)</Text>
                <Text style={styles.bulletPoint}>• Analytics tools to improve app performance</Text>
                <Text style={styles.bulletPoint}>• Legal authorities (only if required by law</Text>

                <Text style={styles.paragraph}>
                    We never share your information with third parties for advertising.
                </Text>

                <Text style={styles.sectionTitle}>5. Data Storage & Security</Text>

                <Text style={styles.paragraph}>
                    We use industry-standard security measures to protect your personal information:
                </Text>

                <Text style={styles.bulletPoint}>• Encrypted data transmission (TLS)</Text>
                <Text style={styles.bulletPoint}>• Secure authentication protocols</Text>
                <Text style={styles.bulletPoint}>• Regular security audits</Text>

                <Text style={styles.paragraph}>
                    However, no digital system is completely secure. We work continuously to protect your data.
                </Text>

                <Text style={styles.sectionTitle}>6. Your Rights</Text>

                <Text style={styles.paragraph}>
                    Depending on your region, you may have the right to:
                </Text>

                <Text style={styles.bulletPoint}>• Access your personal data</Text>
                <Text style={styles.bulletPoint}>• Update or correct your information</Text>
                <Text style={styles.bulletPoint}>• Request deletion of your account</Text>
                <Text style={styles.bulletPoint}>• Withdraw consent for optional data collection</Text>

                <Text style={styles.paragraph}>
                    To exercise your rights, contact us at <Text style={styles.link}>buddy.deen@gmail.com</Text>
                </Text>

                <Text style={styles.sectionTitle}>7. Data Retention</Text>

                <Text style={styles.paragraph}>
                    We retain your information as long as necessary to:
                </Text>

                <Text style={styles.bulletPoint}>• Maintain your active account</Text>
                <Text style={styles.bulletPoint}>• Provide ongoing services</Text>
                <Text style={styles.bulletPoint}>• Comply with legal obligations</Text>

                <Text style={styles.paragraph}>
                    You may request deletion of your account at any time.
                </Text>

                <Text style={styles.sectionTitle}>8. Children's Privacy</Text>

                <Text style={styles.paragraph}>
                    Deen AI does not knowingly collect personal data from children under 13 without parental consent. If we learn that such data has been collected, we will remove it promptly.
                </Text>

                <Text style={styles.sectionTitle}>9. Third-Party Links and Services</Text>

                <Text style={styles.paragraph}>
                    The app may include links or integrations with third-party services. Their privacy practices are governed by this policy. Please review their policies separately.
                </Text>

                <Text style={styles.sectionTitle}>10. Changes to this Privacy Policy</Text>

                <Text style={styles.paragraph}>
                    We may update this Privacy Policy occasionally. Updated versions will be posted in the app with a revised "Last Updated" date.
                </Text>

                <Text style={styles.sectionTitle}>11. Contact Us</Text>

                <Text style={styles.paragraph}>
                    If you have questions or concerns about this Privacy Policy:
                </Text>

                <Text style={styles.bulletPoint}>• Email: <Text style={styles.link}>buddy.deen@gmail.com</Text></Text>
                <Text style={styles.bulletPoint}>• App Support: Available within the Deen AI app</Text>

            </ScreenContainer>

            <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 10 }]}>
                <PrimaryButton
                    title="Accept & Continue"
                    onPress={handleAccept}
                />

                <View style={styles.backButtonWrapper}>
                    <SecondaryButton
                        title="Back"
                        onPress={handleBack}
                        style={styles.backButton}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    },
    header: {
        fontSize: 11,
        fontFamily: theme.font.regular,
        color: "#999",
        letterSpacing: 1,
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontFamily: theme.font.bold,
        color: theme.color.secondary,
        marginBottom: 6,
    },
    date: {
        fontSize: 13,
        fontFamily: theme.font.regular,
        color: "#666",
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: theme.font.bold,
        color: theme.color.secondary,
        marginTop: 20,
        marginBottom: 12,
    },
    subSectionTitle: {
        fontSize: 15,
        fontFamily: theme.font.semiBold,
        color: theme.color.secondary,
        marginTop: 12,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 14,
        fontFamily: theme.font.regular,
        color: "#555",
        lineHeight: 22,
        marginBottom: 12,
    },
    bulletPoint: {
        fontSize: 14,
        fontFamily: theme.font.regular,
        color: "#555",
        lineHeight: 22,
        marginLeft: 12,
        marginBottom: 6,
    },
    link: {
        color: theme.color.brand,
        fontFamily: theme.font.semiBold,
    },
    buttonContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FAFAFA",
        paddingHorizontal: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 18,
    },

    backButtonWrapper: {
        marginTop: 12,
    },
    backButton: {
        backgroundColor: "#f5f5f5ff",
        borderWidth: 1,
        borderColor: "#d5d5d5ff",
    },
    backButtonText: {
        color: theme.color.brand,
    },
});