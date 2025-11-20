import { authService } from '@/service/auth.service';
import { useAuthStore } from '@/store/auth-store';
import { LoginFormValues, SignupFormValues } from '@/types/auth.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

export const useLogin = () => {
    const { login: setAuth } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginFormValues) => authService.login(credentials),
        onMutate: () => {
            useAuthStore.getState().setLoading(true);
        },
        onSuccess: (data) => {
            if (data.success) {
                setAuth(
                    data.data.user,
                    data.data.tokens.accessToken,
                    data.data.tokens.refreshToken
                );
                queryClient.invalidateQueries({ queryKey: ['user'] });
                router.replace('/(tabs)');
            } else {
                throw new Error(data.message || 'Login failed');
            }
        },
        onError: (error) => {
            useAuthStore.getState().setLoading(false);
            console.error('Login error:', error);
            throw error;
        },
        onSettled: () => {
            useAuthStore.getState().setLoading(false);
        },
    });
};

export const useSignup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userData: SignupFormValues) => {
            const { confirmPassword, ...apiData } = userData;
            return authService.signup(apiData);
        },
        onMutate: () => useAuthStore.getState().setLoading(true),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            router.replace('/(onboarding)/location-access');
        },
        onError: () => useAuthStore.getState().setLoading(false),
        onSettled: () => useAuthStore.getState().setLoading(false),
    });
};

export const useGuestLogin = () => {
    const { setGuest } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => Promise.resolve(),
        onSuccess: () => {
            setGuest(true);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            router.replace('/(tabs)');
        },
    });
};

export const useLogout = () => {
    const { token, clearAuth } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (token) {
                await authService.logout(token);
            }
        },
        onMutate: () => {
            clearAuth();
            queryClient.clear();
        },
        onSuccess: () => {
            console.log('✅ Logged out successfully');
            router.replace('/(auth)/login');
        },
        onError: (error) => {
            console.error('❌ Logout error:', error);
            router.replace('/(auth)/login');
        },
    });
};

export const useRequestOtp = () => {
    return useMutation({
        mutationFn: (email: string) => authService.requestOtp({ email }),
        onSuccess: (data, email) => {
            console.log('✅ OTP requested successfully');
            router.push({
                pathname: '/(auth)/reset-password',
                params: { email },
            });
        },
        onError: (error) => {
            console.error('❌ Request OTP error:', error);
        },
    });
};

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: ({ email, otp }: { email: string; otp: string }) =>
            authService.verifyOtp({ email, otp }),
        onSuccess: () => {
            console.log('✅ OTP verified successfully');
        },
        onError: (error) => {
            console.error('❌ Verify OTP error:', error);
        },
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: ({ email, otp, newPassword }: { email: string; otp: string; newPassword: string }) =>
            authService.resetPassword({ email, otp, newPassword }),
        onSuccess: () => {
            console.log('✅ Password reset successfully');
            router.replace('/(auth)/login');
        },
        onError: (error) => {
            console.error('❌ Reset password error:', error);
        },
    });
};

export const useAuth = () => {
    const { user, token, isAuthenticated, isLoading, isGuest } = useAuthStore();

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        isGuest,
        canAccessPremium: isAuthenticated,
        shouldShowAuthPrompts: isGuest,
    };
};