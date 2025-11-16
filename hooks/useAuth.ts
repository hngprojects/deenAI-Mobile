import { useState } from 'react';
import { AuthError, LoginFormValues, SignupFormValues, SocialProvider, User } from '../types';
import authService from '@/service/auth.service';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<AuthError | null>(null);

    const signup = async (data: SignupFormValues) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.signup(data);
            setUser(response.user);

            return response;
        } catch (err: any) {
            const authError: AuthError = {
                message: err.message || 'Signup failed. Please try again.',
            };
            setError(authError);
            throw authError;
        } finally {
            setLoading(false);
        }
    };

    const login = async (data: LoginFormValues) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.login(data);
            setUser(response.user);

            return response;
        } catch (err: any) {
            const authError: AuthError = {
                message: err.message || 'Login failed. Please try again.',
            };
            setError(authError);
            throw authError;
        } finally {
            setLoading(false);
        }
    };

    const socialLogin = async (provider: SocialProvider) => {
        try {
            setLoading(true);
            setError(null);

            // Here you would integrate with expo-apple-authentication or expo-google-sign-in
            // For now, we'll simulate it
            console.log(`Initiating ${provider} login...`);

            // Example: Get token from Apple/Google
            // const token = await getTokenFromProvider(provider);
            // const response = await authService.socialLogin(provider, token);

            // Simulated response
            const response = {
                user: {
                    id: '123',
                    name: 'Social User',
                    email: 'user@example.com',
                    createdAt: new Date(),
                },
                token: 'fake-token',
            };

            setUser(response.user);
            return response;
        } catch (err: any) {
            const authError: AuthError = {
                message: err.message || 'Social login failed. Please try again.',
            };
            setError(authError);
            throw authError;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await authService.logout();
            setUser(null);
        } catch (err: any) {
            console.error('Logout error:', err);
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        user,
        loading,
        error,
        signup,
        login,
        socialLogin,
        logout,
        clearError,
    };
};