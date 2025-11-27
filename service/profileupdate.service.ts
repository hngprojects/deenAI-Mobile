import { ContactSupportType, EditProfileType, OtpResponse, RequestOtpPayload, VerifyOtpPayload } from '@/types/profile.types';
import { apiService } from './api.service';


interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
class ProfileUpdateService {
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

    async editProfile(userData: EditProfileType): Promise<ApiResponse<EditProfileType>> {
        const { email, ...apiData } = userData as any;

        return apiService.patch<ApiResponse<EditProfileType>>(
            '/users/me/profile',
            apiData
        );
    }

    async contactSupport(userData: ContactSupportType): Promise<ApiResponse<ContactSupportType>> {
    const { ...apiData } = userData as any;

        return apiService.post<ApiResponse<ContactSupportType>>(
            '/contact',
            apiData
        );
    }

    async updateProfile(id: string, content: string) {
    }

    async deleteAccount(id: string) {
    }

    
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
    
}

export const profileupdateService = new ProfileUpdateService();   