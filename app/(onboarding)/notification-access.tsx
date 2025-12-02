import ScreenHeader from '@/components/screenHeader';
import SecondaryButton from '@/components/secondaryButton';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import PrimaryButton from '../../components/primaryButton';
import ScreenContainer from '../../components/ScreenContainer';
import { useNotification } from '../../hooks/useNotification';
import { theme } from '../../styles/theme';

export default function NotificationAccessScreen() {
    const router = useRouter();
    const { loading, requestPermission } = useNotification();
    const { setOnboardingComplete } = useAuthStore();

    const handleAllow = async () => {
        const result = await requestPermission();

        if (result.granted) {
            setOnboardingComplete(true);
            router.replace('/(tabs)');
        } else {
            Alert.alert(
                'Permission Denied',
                'Notification access is needed to remind you of prayer times. You can change this later in settings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Continue Anyway',
                        onPress: () => {
                            setOnboardingComplete(true);
                            router.replace('/(tabs)');
                        }
                    }
                ]
            );
        }
    };

    const handleDontAllow = () => {
        setOnboardingComplete(true);
        router.replace('/(tabs)');
    };

    return (
        <ScreenContainer>
            <ScreenHeader title="Notification Access" showBackButton={false} />

            <View style={styles.iconContainer}>
                <View style={styles.bellIconContainer}>
                    <Bell size={60} color={theme.color.brandLight} strokeWidth={1.5} />
                    <View style={styles.notificationBadge} />
                </View>
            </View>

            <Text style={styles.title}>
                Allow DeenAi to Send Notifications?
            </Text>

            <Text style={styles.description}>
                Notifications may include alerts, sounds, and adan. These can be changed in setting
            </Text>
            <View style={styles.buttonContainer}>
                <PrimaryButton
                    title="Allow"
                    onPress={handleAllow}
                    loading={loading}
                />

                <SecondaryButton
                    title="Don't Allow"
                    onPress={handleDontAllow}
                />
            </View>

            <View style={{ flex: 1 }} />


            {/* <View style={styles.bottomContainer}>
                <Text style={styles.termsText}>
                    By using Deen Ai, you agree to the
                </Text>

                <View style={styles.termsContainer}>
                    <TouchableOpacity onPress={() => router.push("/(auth)/terms")}>
                        <Text style={styles.termsLink}>Terms of service</Text>
                    </TouchableOpacity>
                    <Text style={styles.termsContainerText}> and </Text>
                    <TouchableOpacity onPress={() => router.push("/(auth)/privacy")}>
                        <Text style={styles.termsLink}>Privacy Policy</Text>
                    </TouchableOpacity>
                </View>
            </View> */}
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 50,
    },
    bellIconContainer: {
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 5,
        right: 10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#ff0d00ff',
    },
    title: {
        fontSize: 20,
        fontFamily: theme.font.semiBold,
        color: theme.color.secondary,
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        fontFamily: theme.font.regular,
        color: '#27252E',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 50,
        paddingHorizontal: 30,
    },
    buttonContainer: {
        gap: 12,
    },
    termsText: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: theme.font.regular,
        color: '#666',
        marginTop: 30,
        marginBottom: 30,
        lineHeight: 20,
    },
     termsContainerText: {
        fontSize: 14,
        fontFamily: theme.font.regular,
        color: '#666',
    },
    termsLink: {
        color: theme.color.brand,
        fontWeight: '600',
        fontFamily: theme.font.semiBold,
    },
    termsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: -30,
    },
    bottomContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginTop: 40
    }
});