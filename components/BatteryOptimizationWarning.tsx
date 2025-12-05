import { useNotification } from '@/hooks/useNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { Alert, Platform } from 'react-native';

export const BatteryOptimizationWarning: React.FC = () => {
    const { permissionGranted } = useNotification();

    useEffect(() => {
        const showWarning = async () => {
            // Only show once per session
            const hasShown = await AsyncStorage.getItem('@battery_warning_shown');

            if (!hasShown && permissionGranted && Platform.OS === 'android') {
                setTimeout(() => {
                    Alert.alert(
                        '📱 For Reliable Notifications',
                        `To ensure you receive prayer time notifications:

1. Go to Settings → Apps → DeenAi
2. Tap "Battery"
3. Select "Unrestricted"

Otherwise, notifications may be delayed when your screen is off.`,
                        [
                            { text: "Don't Show Again", onPress: () => AsyncStorage.setItem('@battery_warning_shown', 'true') },
                            { text: 'OK' }
                        ]
                    );
                }, 5000); // Show after 5 seconds
            }
        };

        showWarning();
    }, [permissionGranted]);

    return null;
};