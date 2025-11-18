import { AuthState, User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthStore extends AuthState {
    isGuest: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    setGuest: (isGuest: boolean) => void;
    setLoading: (loading: boolean) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            isGuest: false,

            login: (user: User, token: string) =>
                set({ user, token, isAuthenticated: true, isLoading: false, isGuest: false }),

            logout: () =>
                set({ user: null, token: null, isAuthenticated: false, isLoading: false, isGuest: false }),

            setGuest: (isGuest: boolean) =>
                set({ isGuest, isAuthenticated: false, user: null, token: null }),

            setLoading: (loading: boolean) =>
                set({ isLoading: loading }),

            clearAuth: () =>
                set({ user: null, token: null, isAuthenticated: false, isLoading: false, isGuest: false }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);