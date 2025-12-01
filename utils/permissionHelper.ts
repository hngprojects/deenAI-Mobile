// utils/permissionHelper.ts

import { useAuthStore } from '@/store/auth-store';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

interface PermissionCheckOptions {
    isGuest?: boolean;
    allowSkip?: boolean;
}

/**
 * Check permissions and route user accordingly
 * Supports different flows for authenticated users vs guests
 */
export const checkPermissionsAndRoute = async (
    options: PermissionCheckOptions = {}
) => {
    const { isGuest = false, allowSkip = false } = options;

    try {
        const hasCompletedOnboarding = useAuthStore.getState().hasCompletedOnboarding;

        // If user already completed onboarding, go straight to tabs
        if (hasCompletedOnboarding) {
            router.replace('/(tabs)');
            return;
        }

        // Check location permission
        const locationStatus = await Location.getForegroundPermissionsAsync();

        if (!locationStatus.granted) {
            router.replace({
                pathname: '/(onboarding)/location-access',
                params: { isGuest: isGuest.toString(), allowSkip: allowSkip.toString() }
            });
            return;
        }

        // Check notification permission
        const notificationStatus = await Notifications.getPermissionsAsync();

        if (!notificationStatus.granted) {
            router.replace({
                pathname: '/(onboarding)/notification-access',
                params: { isGuest: isGuest.toString(), allowSkip: allowSkip.toString() }
            });
            return;
        }

        // Both permissions granted, mark onboarding complete and go to tabs
        useAuthStore.getState().setOnboardingComplete(true);
        router.replace('/(tabs)');
    } catch (error) {
        console.error('Permission check error:', error);
        // If there's an error, just go to tabs
        router.replace('/(tabs)');
    }
};

/**
 * Check if user needs to see permission screens
 */
export const needsPermissionSetup = async (): Promise<boolean> => {
    try {
        const hasCompletedOnboarding = useAuthStore.getState().hasCompletedOnboarding;
        if (hasCompletedOnboarding) return false;

        const locationStatus = await Location.getForegroundPermissionsAsync();
        const notificationStatus = await Notifications.getPermissionsAsync();

        return !locationStatus.granted || !notificationStatus.granted;
    } catch (error) {
        console.error('Error checking permission status:', error);
        return false;
    }
};

/**
 * Skip onboarding for guest users (they can enable permissions later from settings)
 */
export const skipOnboardingForGuest = () => {
    useAuthStore.getState().setOnboardingComplete(true);
    router.replace('/(tabs)');
};