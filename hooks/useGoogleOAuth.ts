import { useAuthStore } from '@/store/auth-store';
import { authService } from '@/service/auth.service';
import { useToast } from './useToast';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// This is required for web-based auth flows
WebBrowser.maybeCompleteAuthSession();

export const useGoogleOAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthStore();
    const { showToast } = useToast();

    // Determine redirect URI based on environment
    // For development: Use Expo's auth proxy
    // For production: Use custom scheme
    const getRedirectUri = () => {
        const expoProjectId = Constants.expoConfig?.extra?.eas?.projectId;

        // For production builds (standalone apps)
        if (Constants.appOwnership === 'standalone') {
            return `${Constants.expoConfig?.scheme}://redirect`;
        }

        // For development/Expo Go - use Expo's auth proxy
        if (expoProjectId) {
            return `https://auth.expo.io/@${Constants.expoConfig?.owner}/${Constants.expoConfig?.slug}`;
        }

        // Fallback - hardcoded for reliability
        return 'https://auth.expo.io/@deenai/DeenAi-Mobile';
    };

    const redirectUri = getRedirectUri();

    // Configure Google OAuth
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        // For Android production, also include androidClientId
        androidClientId: Constants.appOwnership === 'standalone'
            ? process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID
            : undefined,
        iosClientId: Constants.appOwnership === 'standalone'
            ? process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
            : undefined,
        redirectUri,
    });

    useEffect(() => {
        // Debug logging
        console.log('🔑 Google OAuth Config:', {
            appOwnership: Constants.appOwnership,
            clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
            redirectUri,
            hasRequest: !!request,
            platform: Platform.OS,
        });
    }, [request, redirectUri]);

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleGoogleLogin(id_token);
        } else if (response?.type === 'error') {
            console.error('Google OAuth Error:', response.error);
            showToast('Google sign-in failed. Please try again.', 'error');
            setIsLoading(false);
        } else if (response?.type === 'cancel') {
            setIsLoading(false);
        }
    }, [response]);

    const handleGoogleLogin = async (idToken: string) => {
        try {
            setIsLoading(true);
            const data = await authService.googleLogin(idToken);

            login(
                data.user,
                data.tokens.accessToken,
                data.tokens.refreshToken
            );

            showToast('Welcome! Sign in successful.', 'success');
        } catch (error: any) {
            console.error('Google login error:', error);
            const errorMessage = error?.message || 'Google sign-in failed';
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            setIsLoading(true);
            await promptAsync();
        } catch (error) {
            console.error('Error initiating Google sign-in:', error);
            showToast('Failed to open Google sign-in', 'error');
            setIsLoading(false);
        }
    };

    return {
        signInWithGoogle,
        isLoading,
        disabled: !request || isLoading,
    };
};