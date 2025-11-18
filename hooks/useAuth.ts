import { authService } from '@/service/auth.service';
import { useAuthStore } from '@/store/auth-store';
import { LoginFormValues, SignupFormValues } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
            setAuth(data.user, data.token);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            router.replace('/(onboarding)/location-access');
        },
        onError: (error) => {
            useAuthStore.getState().setLoading(false);
            console.error('Login error:', error);
        },
        onSettled: () => {
            useAuthStore.getState().setLoading(false);
        },
    });
};

export const useSignup = () => {
    const { login: setAuth } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userData: SignupFormValues) => authService.signup(userData),
        onMutate: () => {
            useAuthStore.getState().setLoading(true);
        },
        onSuccess: (data) => {
            setAuth(data.user, data.token);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            router.replace('/(onboarding)/location-access');
        },
        onError: (error) => {
            useAuthStore.getState().setLoading(false);
            console.error('Signup error:', error);
        },
        onSettled: () => {
            useAuthStore.getState().setLoading(false);
        },
    });
};

export const useGuestLogin = () => {
    const { setGuest } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            // Simulate API call for guest mode if needed
            return Promise.resolve();
        },
        onSuccess: () => {
            setGuest(true);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            router.replace('/(tabs)');
        },
        onError: (error) => {
            console.error('Guest login error:', error);
        },
    });
};

export const useLogout = () => {
    const { logout: clearAuth } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            clearAuth();
            queryClient.clear();
            router.replace('/');
        },
        onError: (error) => {
            console.error('Logout error:', error);
        },
    });
};

export const useCurrentUser = () => {
    const { token, isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ['user'],
        queryFn: () => authService.getCurrentUser(token!),
        enabled: !!token && isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });
};

// Enhanced auth hook with guest support
export const useAuth = () => {
    const { user, token, isAuthenticated, isLoading, isGuest } = useAuthStore();

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        isGuest,
        // Helper computed properties
        canAccessPremium: isAuthenticated, // Only authenticated users get premium
        shouldShowAuthPrompts: isGuest, // Show upgrade prompts to guests
    };
};