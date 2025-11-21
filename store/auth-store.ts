import { AuthState, User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthStore extends AuthState {
    isGuest: boolean;
    refreshToken?: string | null;
    hasCompletedOnboarding: boolean; // Track if user completed permissions
    login: (user: User, token: string, refreshToken?: string) => void;
    logout: () => void;
    setGuest: (isGuest: boolean) => void;
    setLoading: (loading: boolean) => void;
    clearAuth: () => void;
    updateToken: (token: string) => void;
    setOnboardingComplete: (complete: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            isGuest: false,
            hasCompletedOnboarding: false,

            login: (user: User, token: string, refreshToken?: string) =>
                set({
                    user,
                    token,
                    refreshToken,
                    isAuthenticated: true,
                    isLoading: false,
                    isGuest: false
                }),

            logout: () =>
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                    isGuest: false,
                    hasCompletedOnboarding: false
                }),

            setGuest: (isGuest: boolean) =>
                set({
                    isGuest,
                    isAuthenticated: false,
                    user: null,
                    token: null,
                    refreshToken: null
                }),

            setLoading: (loading: boolean) =>
                set({ isLoading: loading }),

            clearAuth: () =>
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                    isGuest: false,
                    hasCompletedOnboarding: false
                }),

            updateToken: (token: string) =>
                set({ token }),

            setOnboardingComplete: (complete: boolean) =>
                set({ hasCompletedOnboarding: complete }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);