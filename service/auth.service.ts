import { AuthResponse, AuthTokens, LoginFormValues, OtpResponse, RequestOtpPayload, ResetPasswordPayload, SignupFormValues, User, VerifyOtpPayload } from '@/types/auth.types';
import { apiService } from './api.service';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
class AuthService {
    private async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        return await response.json();
    }

    async login(credentials: LoginFormValues): Promise<AuthResponse> {
        return this.apiCall<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async googleLogin(idToken: string): Promise<AuthResponse> {
        const response = await apiService.post<any>('/auth/google', { idToken }, { skipAuth: true });
        return response.data; // Extract data from wrapper
    }


    async signup(userData: SignupFormValues): Promise<AuthResponse> {
        const { confirmPassword, ...apiData } = userData;

        return this.apiCall<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(apiData),
        });
    }

    async logout(token: string): Promise<void> {
        console.log('🚪 Logout Attempt');

        return this.apiCall<void>('/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }

    async resendVerification(payload: RequestOtpPayload): Promise<OtpResponse> {
        return this.apiCall<OtpResponse>('/auth/resend-verification', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    async verifyEmail(payload: VerifyOtpPayload): Promise<OtpResponse> {
        return this.apiCall<OtpResponse>('/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    async getCurrentUser(token: string): Promise<User> {
        console.log('👤 Get Current User Attempt');

        return this.apiCall<User>('/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }

    async refreshToken(refreshToken: string): Promise<{ tokens: AuthTokens }> {
        console.log('🔄 Refreshing access token...');

        return this.apiCall<{ tokens: AuthTokens }>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
        });
    }

    async requestOtp(payload: RequestOtpPayload): Promise<OtpResponse> {
        return this.apiCall<OtpResponse>('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    async verifyOtp(payload: VerifyOtpPayload): Promise<OtpResponse> {
        return this.apiCall<OtpResponse>('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    async resetPassword(payload: ResetPasswordPayload): Promise<OtpResponse> {
        return this.apiCall<OtpResponse>('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }
}

export const authService = new AuthService();