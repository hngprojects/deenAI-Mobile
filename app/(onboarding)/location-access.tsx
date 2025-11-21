import ScreenHeader from '@/components/screenHeader';
import SecondaryButton from '@/components/secondaryButton';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import React from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import PrimaryButton from '../../components/primaryButton';
import ScreenContainer from '../../components/ScreenContainer';
import { useLocation } from '../../hooks/useLocation';
import { theme } from '../../styles/theme';

export default function LocationAccessScreen() {
    const router = useRouter();
    const { loading, requestPermission } = useLocation();

    const handleRequestPermission = async () => {
        const result = await requestPermission();

        if (result.granted) {
            router.replace('/(onboarding)/notification-access');
        } else {
            Alert.alert(
                'Permission Denied',
                'Location access is needed to get prayer times for your current location. You can change this later in settings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Continue Anyway',
                        onPress: () => router.replace('/(onboarding)/notification-access')
                    }
                ]
            );
        }
    };

    const handleDontAllow = () => {
        router.replace('/(onboarding)/notification-access');
    };

    return (
        <ScreenContainer>
            <ScreenHeader title="Location Access" showBackButton={false} />

            <View style={styles.iconContainer}>
                <MapPin size={80} color={theme.color.brandLight} strokeWidth={1.5} />
            </View>

            <Text style={styles.title}>
                Allow DeenAi to use your Location?
            </Text>

            <Text style={styles.description}>
                Allow this permission to get the prayer time of your current location.
            </Text>

            <View style={styles.mapContainer}>
                <Image
                    source={require('../../assets/images/map-demo.png')}
                    style={styles.mapImage}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.buttonContainer}>
                <PrimaryButton
                    title="Allow Once"
                    onPress={handleRequestPermission}
                    loading={loading}
                />

                <SecondaryButton
                    title="Don't Allow"
                    onPress={handleDontAllow}
                />

                <SecondaryButton
                    title="Allow while using App"
                    onPress={handleRequestPermission}
                />
            </View>

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
        marginTop: 40,
        marginBottom: 30,
    },
    title: {
        fontSize: 22,
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
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    mapContainer: {
        width: '100%',
        height: 250,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 30,
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
        marginBottom: 100,
        lineHeight: 20,
    },
    termsLink: {
        color: theme.color.brand,
        fontFamily: theme.font.semiBold,
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
});