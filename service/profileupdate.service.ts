import { ContactSupportType, EditProfileType, OtpResponse, RequestOtpPayload, VerifyOtpPayload } from '@/types/profile.types';
import { apiService } from './api.service';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
}

class ProfileUpdateService {
    async getProfile(): Promise<ApiResponse<any>> {
        return apiService.get<ApiResponse<any>>('/users/me/profile');
    }

    async editProfile(userData: { username: string; name: string; avatarFile?: any }): Promise<ApiResponse<any>> {
        const formData = new FormData();
        
        if (userData.username) formData.append('username', userData.username);
        if (userData.name) formData.append('name', userData.name);
        
        if (userData.avatarFile) {
            formData.append('avatar', {
                uri: userData.avatarFile.uri,
                type: 'image/jpeg',
                name: 'avatar.jpg'
            } as any);
        }

        return apiService.patch<ApiResponse<any>>('/users/me/profile', formData);
    }

    async contactSupport(userData: ContactSupportType): Promise<ApiResponse<ContactSupportType>> {
        return apiService.post<ApiResponse<ContactSupportType>>('/contact', userData);
    }

    async updateProfile(id: string, content: string) {}

    async deleteAccount(id: string) {}

    async resendVerification(payload: RequestOtpPayload): Promise<OtpResponse> {
        return this.apiCall<OtpResponse>('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify(payload),
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

    private async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
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
}

export const profileupdateService = new ProfileUpdateService();