import PrimaryButton from "@/components/primaryButton";
import ScreenContainer from "@/components/ScreenContainer";
import SecondaryButton from "@/components/secondaryButton";
import { theme } from "@/styles/theme";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TermsAndConditions() {
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

                <Text style={styles.header}>TERMS AND CONDITIONS</Text>

                <Text style={styles.title}>Terms and Conditions</Text>

                <Text style={styles.date}>Last Updated: 22nd November, 2025</Text>

                <Text style={styles.paragraph}>
                    Welcome to Deen AI. These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the Deen AI mobile application and related services (collectively, the &quot;Service&quot;). By using Deen AI, you agree to comply with these Terms.
                </Text>

                <Text style={styles.paragraph}>
                    If you do not agree, please discontinue use of the app.
                </Text>

                <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>

                <Text style={styles.paragraph}>
                    By creating an account or using Deen AI, you confirm that you have read, understood, and accepted these Terms.
                </Text>

                <Text style={styles.sectionTitle}>2. Eligibility</Text>

                <Text style={styles.paragraph}>
                    You must meet the minimum legal age required in your country to use this Service. If you are under the required age, you may not use Deen AI.
                </Text>

                <Text style={styles.sectionTitle}>3. User Account</Text>

                <Text style={styles.paragraph}>
                    To access certain features, you must create an account. You agree to:
                </Text>

                <Text style={styles.bulletPoint}>• Provide accurate and up-to-date information</Text>
                <Text style={styles.bulletPoint}>• Keep your login details secure</Text>
                <Text style={styles.bulletPoint}>• Notify us immediately if you suspect unauthorized access</Text>

                <Text style={styles.paragraph}>
                    You are responsible for all activities under your account.
                </Text>

                <Text style={styles.sectionTitle}>4. Use of the Service</Text>

                <Text style={styles.paragraph}>
                    You agree to:
                </Text>

                <Text style={styles.bulletPoint}>• Use Deen AI for lawful and respectful purposes</Text>
                <Text style={styles.bulletPoint}>• Not attempt to access systems or data without authorization</Text>
                <Text style={styles.bulletPoint}>• Not reverse-engineer or misuse the app</Text>
                <Text style={styles.bulletPoint}>• Upload content that violates copyright or privacy</Text>

                <Text style={styles.paragraph}>
                    We reserve the right to suspend or terminate access for violations.
                </Text>

                <Text style={styles.sectionTitle}>5. Subscription and Payments</Text>

                <Text style={styles.paragraph}>
                    Some features require a paid subscription. By subscribing, you agree that:
                </Text>

                <Text style={styles.bulletPoint}>• Fees may vary based on your selected plan</Text>
                <Text style={styles.bulletPoint}>• Payments are processed through your device&apos;s app store</Text>
                <Text style={styles.bulletPoint}>• Subscriptions renew automatically unless disabled before the renewal date</Text>

                <Text style={styles.paragraph}>
                    All refunds must follow Apple App Store or Google Play Store policies.
                </Text>

                <Text style={styles.sectionTitle}>6. Intellectual Property</Text>

                <Text style={styles.paragraph}>
                    All content, features, branding, and functionality within Deen AI are the property of Deen AI and protected by copyright and other intellectual property laws. You may not copy, modify, distribute, or reverse-engineer any part of the Service.
                </Text>

                <Text style={styles.sectionTitle}>7. User Content</Text>

                <Text style={styles.paragraph}>
                    If you submit or upload content through the app, you grant Deen AI a limited license to process that content solely for the purpose of providing the Service. You retain ownership of your content.
                </Text>

                <Text style={styles.paragraph}>
                    You agree not to upload content that is illegal, harmful, or violates the rights of others.
                </Text>

                <Text style={styles.sectionTitle}>8. Privacy</Text>

                <Text style={styles.paragraph}>
                    Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your data.
                </Text>

                <Text style={styles.sectionTitle}>9. AI-Generated Responses</Text>

                <Text style={styles.paragraph}>
                    Deen AI provides automated responses using artificial intelligence. You understand and agree that:
                </Text>

                <Text style={styles.bulletPoint}>• AI-generated outputs may not always be accurate</Text>
                <Text style={styles.bulletPoint}>• Deen AI is not responsible for decisions made based on AI responses</Text>
                <Text style={styles.bulletPoint}>• AI content should not be treated as professional, legal, medical, or financial advice</Text>

                <Text style={styles.sectionTitle}>10. Limitation of Liability</Text>

                <Text style={styles.paragraph}>
                    To the maximum extent permitted by law, Deen AI is not liable for:
                </Text>

                <Text style={styles.bulletPoint}>• Loss of data</Text>
                <Text style={styles.bulletPoint}>• Service interruptions</Text>
                <Text style={styles.bulletPoint}>• Inaccurate or incomplete AI outputs</Text>
                <Text style={styles.bulletPoint}>• Damage resulting from misuse of the Service</Text>

                <Text style={styles.paragraph}>
                    Your use of the app is at your own risk.
                </Text>

                <Text style={styles.sectionTitle}>11. Termination</Text>

                <Text style={styles.paragraph}>
                    We may suspend or terminate access to your account if you:
                </Text>

                <Text style={styles.bulletPoint}>• Violate these Terms</Text>
                <Text style={styles.bulletPoint}>• Misuse the Service</Text>
                <Text style={styles.bulletPoint}>• Engage in harmful or fraudulent activity</Text>

                <Text style={styles.paragraph}>
                    You may stop using the Service at any time by deleting your account.
                </Text>

                <Text style={styles.sectionTitle}>12. Changes to Terms</Text>

                <Text style={styles.paragraph}>
                    We may update these Terms when necessary. Changes will be posted in the app with an updated &quot;Last Updated&quot; date. Continued use after changes means you accept the updated Terms.
                </Text>

                <Text style={styles.sectionTitle}>13. Contact Us</Text>

                <Text style={styles.paragraph}>
                    If you have questions about these Terms, contact us at:
                </Text>

                <Text style={styles.bulletPoint}>• Email: <Text style={styles.link}>buddy.deen@gmail.com</Text></Text>
                <Text style={styles.bulletPoint}>• In-App Support: Available through the settings section</Text>

                <Text style={styles.paragraph}>
                    Thank you for using Deen AI.
                </Text>

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