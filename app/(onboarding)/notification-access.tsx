import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import PrimaryButton from '../../components/primaryButton';
import ScreenContainer from '../../components/ScreenContainer';
import { useNotification } from '../../hooks/useNotification';
import { theme } from '../../styles/theme';
import ScreenHeader from '@/components/screenHeader';
import SecondaryButton from '@/components/secondaryButton';

export default function NotificationAccessScreen() {
    const router = useRouter();
    const { loading, requestPermission } = useNotification();

    const handleAllow = async () => {
        const result = await requestPermission();

        if (result.granted) {
            router.replace('/(tabs)');
        } else {
            Alert.alert(
                'Permission Denied',
                'Notification access is needed to remind you of prayer times. You can change this later in settings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Continue Anyway',
                        onPress: () => router.replace('/(tabs)')
                    }
                ]
            );
        }
    };

    const handleDontAllow = () => {
        router.replace('/(tabs)');
    };

    return (
        <ScreenContainer>
            <ScreenHeader title="Notification Access" />

            <View style={styles.iconContainer}>
                <View style={styles.bellIconContainer}>
                    <Bell size={60} color={theme.color.brandLight} strokeWidth={1.5} />
                    <View style={styles.notificationBadge} />
                </View>
            </View>

            <Text style={styles.title}>
                Allow NoorAi to Send Notifications?
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
                    // style={styles.secondaryButton}
                />
            </View>

            <View style={{ flex: 1 }} />

            <Text style={styles.termsText}>
                By using Deen Ai, you agree to the{' '}
                <Text style={styles.termsLink}>Terms and Privacy Policy.</Text>
            </Text>
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
        // paddingHorizontal: 10,
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
    secondaryButton: {
        backgroundColor: theme.color.white,
        borderWidth: 1,
        borderColor: '#E0E0E0',
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
    termsLink: {
        color: theme.color.brand,
        fontFamily: theme.font.semiBold,
    },
});