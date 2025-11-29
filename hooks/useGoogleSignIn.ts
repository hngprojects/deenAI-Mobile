import { authService } from '@/service/auth.service';
import { useAuthStore } from '@/store/auth-store';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useToast } from './useToast';

// Import this helper if you have it, or copy it here
const checkPermissionsAndRoute = async () => {
    try {
        const hasCompletedOnboarding = useAuthStore.getState().hasCompletedOnboarding;

        if (hasCompletedOnboarding) {
            router.replace('/(tabs)');
            return;
        }

        // Check location and notification permissions
        const Location = await import('expo-location');
        const Notifications = await import('expo-notifications');

        const locationStatus = await Location.getForegroundPermissionsAsync();
        if (!locationStatus.granted) {
            router.replace('/(onboarding)/location-access');
            return;
        }

        const notificationStatus = await Notifications.getPermissionsAsync();
        if (!notificationStatus.granted) {
            router.replace('/(onboarding)/notification-access');
            return;
        }

        useAuthStore.getState().setOnboardingComplete(true);
        router.replace('/(tabs)');
    } catch (error) {
        console.error('Permission check error:', error);
        router.replace('/(tabs)');
    }
};

export const useGoogleSignIn = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isConfigured, setIsConfigured] = useState(false);
    const { login } = useAuthStore();
    const { showToast } = useToast();

    useEffect(() => {
        configureGoogleSignIn();
    }, []);

    const configureGoogleSignIn = () => {
        try {
            GoogleSignin.configure({
                webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
                iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
                offlineAccess: true, // Changed to true to get refresh token
                scopes: ['profile', 'email'],
            });

            setIsConfigured(true);
            console.log('✅ Google Sign-In configured successfully');
        } catch (error) {
            console.error('❌ Error configuring Google Sign-In:', error);
            setIsConfigured(false);
        }
    };

    const signInWithGoogle = async () => {
        if (!isConfigured) {
            showToast('Google Sign-In not ready. Please try again.', 'error');
            return;
        }

        try {
            setIsLoading(true);
            console.log('🔐 Starting Google Sign-In...');

            await GoogleSignin.hasPlayServices();
            console.log('✅ Google Play Services available');

            const userInfo = await GoogleSignin.signIn();
            console.log('✅ Google Sign-In successful');

            const tokens = await GoogleSignin.getTokens();
            const idToken = tokens.idToken;

            if (!idToken) {
                throw new Error('No ID token received from Google');
            }

            console.log('✅ ID token received, authenticating with backend...');

            // authService.googleLogin returns the full response with 'data' wrapper
            const response = await authService.googleLogin(idToken);

            console.log('✅ Backend authentication successful');

            // ✅ FIX: Access nested data correctly
            if (response.success && response.data) {
                login(
                    response.data.user,
                    response.data.tokens.accessToken,
                    response.data.tokens.refreshToken
                );

                showToast(`Welcome, ${response.data.user.name}!`, 'success');

                // Navigate after successful login
                await checkPermissionsAndRoute();
            } else {
                throw new Error(response.message || 'Google login failed');
            }

        } catch (error: any) {
            console.error('❌ Google Sign-In Error:', error);

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('ℹ️ User cancelled sign-in');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                showToast('Sign-in already in progress', 'info');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                showToast('Google Play Services not available on this device', 'error');
            } else {
                const errorMessage = error?.message || 'Google sign-in failed';
                showToast(errorMessage, 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
            console.log('✅ Signed out from Google');
        } catch (error) {
            console.error('❌ Error signing out from Google:', error);
        }
    };

    return {
        signInWithGoogle,
        signOut,
        isLoading,
        disabled: !isConfigured || isLoading,
    };
};