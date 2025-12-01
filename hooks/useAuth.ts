import { useToast } from '@/hooks/useToast';
import { authService } from '@/service/auth.service';
import { useAuthStore } from '@/store/auth-store';
import { LoginFormValues, SignupFormValues } from '@/types/auth.types';
import { checkPermissionsAndRoute } from '@/utils/permissionHelper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

export const useSignup = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (userData: SignupFormValues) => {
            const { confirmPassword, ...apiData } = userData;
            return authService.signup(apiData);
        },
        onMutate: () => useAuthStore.getState().setLoading(true),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            showToast('Account created! Now login.', 'success');

            // Route to login after successful signup
            router.push({
                pathname: '/(auth)/login',
                params: { email: variables.email }
            });
        },
        onError: (error: any, variables) => {
            useAuthStore.getState().setLoading(false);

            // Check if email already exists
            const errorMessage = error.message?.toLowerCase() || '';
            if (
                errorMessage.includes('already exists') ||
                errorMessage.includes('already registered') ||
                errorMessage.includes('email is taken')
            ) {
                showToast('Account already exists. Please login.', 'warning');
                router.push('/(auth)/login');
            } else {
                showToast(error.message || 'Signup failed. Please try again.', 'error');
            }
        },
        onSettled: () => useAuthStore.getState().setLoading(false),
    });
};

export const useLogin = () => {
    const { login: setAuth } = useAuthStore();
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (credentials: LoginFormValues) => authService.login(credentials),
        onMutate: () => {
            useAuthStore.getState().setLoading(true);
        },
        onSuccess: async (data) => {
            if (data.success) {
                setAuth(
                    data.data.user,
                    data.data.tokens.accessToken,
                    data.data.tokens.refreshToken
                );
                queryClient.invalidateQueries({ queryKey: ['user'] });

                showToast(`Welcome back, ${data.data.user.name}!`, 'success');

                // Check permissions and route accordingly
                await checkPermissionsAndRoute();
            } else {
                throw new Error(data.message || 'Login failed');
            }
        },
        onError: (error: any, variables) => {
            useAuthStore.getState().setLoading(false);

            // Check if account is not verified
            const errorMessage = error.message?.toLowerCase() || '';
            if (
                errorMessage.includes('not verified') ||
                errorMessage.includes('verify your email') ||
                errorMessage.includes('email verification') ||
                errorMessage.includes('please verify')
            ) {
                showToast('Please verify your email first.', 'warning');

                // Route to verify-email with the user's email
                setTimeout(() => {
                    router.push({
                        pathname: '/(auth)/verify-email',
                        params: { email: variables.email }
                    });
                }, 1000);
            } else {
                showToast(error.message || 'Invalid email or password.', 'error');
            }

            console.error('Login error:', error);
            throw error;
        },
        onSettled: () => {
            useAuthStore.getState().setLoading(false);
        },
    });
};

export const useGuestLogin = () => {
    const { setGuest } = useAuthStore();
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async () => {
            // Return a resolved promise to maintain mutation pattern
            return Promise.resolve({ success: true });
        },
        onMutate: () => {
            useAuthStore.getState().setLoading(true);
        },
        onSuccess: async () => {
            // Set guest mode
            setGuest(true);
            queryClient.invalidateQueries({ queryKey: ['user'] });

            showToast('Continuing as guest', 'info');

            // Check permissions for guest users (allow skip option)
            await checkPermissionsAndRoute({ isGuest: true, allowSkip: true });
        },
        onError: (error) => {
            console.error('Guest login error:', error);
            showToast('Failed to continue as guest', 'error');
            // Fallback to tabs even on error
            router.replace('/(tabs)');
        },
        onSettled: () => {
            useAuthStore.getState().setLoading(false);
        },
    });
};

export const useLogout = () => {
    const { token, clearAuth } = useAuthStore();
    const queryClient = useQueryClient();
    const { showToast } = useToast();

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
            showToast('Logout failed', 'error');
            router.replace('/(auth)/login');
        },
    });
};

export const useVerifyEmail = () => {
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ email, otp }: { email: string; otp: string }) =>
            authService.verifyEmail({ email, otp }),
        onSuccess: () => {
            console.log('✅ Email verified successfully');
            showToast('Email verified successfully!', 'success', 4000);
        },
        onError: (error: any) => {
            console.error('❌ Verify email error:', error);
            showToast(error.message || 'Invalid verification code', 'error');
        },
    });
};

export const useResendVerification = () => {
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (email: string) =>
            authService.resendVerification({ email }),
        onSuccess: () => {
            console.log('✅ Verification OTP resent successfully');
            showToast('Verification code sent! Check your inbox.', 'success');
        },
        onError: (error: any) => {
            console.error('❌ Resend verification error:', error);
            showToast(error.message || 'Failed to resend code', 'error');
        },
    });
};

export const useRequestOtp = () => {
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (email: string) => authService.requestOtp({ email }),
        onSuccess: (data, email) => {
            console.log('✅ OTP requested successfully');
            showToast('Password reset email sent! Check inbox.', 'info');

            router.push({
                pathname: '/(auth)/reset-password',
                params: { email },
            });
        },
        onError: (error: any) => {
            console.error('❌ Request OTP error:', error);
            showToast(error.message || 'Failed to send reset email', 'error');
        },
    });
};

export const useVerifyOtp = () => {
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ email, otp }: { email: string; otp: string }) =>
            authService.verifyOtp({ email, otp }),
        onSuccess: () => {
            console.log('✅ OTP verified successfully');
            showToast('OTP verified successfully!', 'success');
        },
        onError: (error: any) => {
            console.error('❌ Verify OTP error:', error);
            showToast(error.message || 'Invalid OTP code', 'error');
        },
    });
};

export const useResetPassword = () => {
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ email, otp, newPassword }: { email: string; otp: string; newPassword: string }) =>
            authService.resetPassword({ email, otp, newPassword }),
        onSuccess: () => {
            console.log('✅ Password reset successfully');
            showToast('Password reset successfully!', 'success', 4000);

            setTimeout(() => {
                router.replace('/(auth)/login');
            }, 1000);
        },
        onError: (error: any) => {
            console.error('❌ Reset password error:', error);
            showToast(error.message || 'Failed to reset password', 'error');
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