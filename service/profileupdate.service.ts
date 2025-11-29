import { ContactSupportType, OtpResponse, RequestOtpPayload, VerifyOtpPayload } from '@/types/profile.types';
import { apiService } from './api.service';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
    status_code?: number;
}

interface ProfileData {
    id: string;
    userId: string;
    avatar?: string;
    language?: string;
    username: string;
    timezone?: string;
    createdAt: string;
    updatedAt: string;
}

class ProfileUpdateService {
    /**
     * Get current user profile
     */
    async getProfile(): Promise<ApiResponse<ProfileData>> {
        return apiService.get<ApiResponse<ProfileData>>('/users/me/profile');
    }

    /**
     * Update user profile with optional avatar
     * API accepts: username, name, language, timezone, avatar
     */
    async editProfile(userData: {
        username?: string;
        name?: string;
        language?: string;
        timezone?: string;
        avatarFile?: any
    }): Promise<ApiResponse<ProfileData>> {
        const formData = new FormData();

        // ✅ Add fields only if they exist (partial update)
        if (userData.username) {
            formData.append('username', userData.username);
        }
        if (userData.name) {
            formData.append('name', userData.name);
        }
        if (userData.language) {
            formData.append('language', userData.language);
        }
        if (userData.timezone) {
            formData.append('timezone', userData.timezone);
        }

        // ✅ Add avatar file if provided (JPEG/PNG/WebP/GIF)
        if (userData.avatarFile) {
            formData.append('avatar', {
                uri: userData.avatarFile.uri,
                type: userData.avatarFile.type || 'image/jpeg',
                name: userData.avatarFile.name || 'avatar.jpg'
            } as any);
        }

        return apiService.patch<ApiResponse<ProfileData>>('/users/me/profile', formData);
    }

    /**
     * Submit contact support request
     */
    async contactSupport(userData: ContactSupportType): Promise<ApiResponse<ContactSupportType>> {
        return apiService.post<ApiResponse<ContactSupportType>>('/contact', userData);
    }

    /**
     * Resend email verification OTP
     */
    async resendVerification(payload: RequestOtpPayload): Promise<OtpResponse> {
        return apiService.post<OtpResponse>('/auth/resend-verification', payload);
    }

    /**
     * Request password reset OTP
     */
    async requestOtp(payload: RequestOtpPayload): Promise<OtpResponse> {
        return apiService.post<OtpResponse>('/auth/forgot-password', payload);
    }

    /**
     * Verify OTP code
     */
    async verifyOtp(payload: VerifyOtpPayload): Promise<OtpResponse> {
        return apiService.post<OtpResponse>('/auth/verify-otp', payload);
    }
}

export const profileupdateService = new ProfileUpdateService();