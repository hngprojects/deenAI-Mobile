import { ContactSupportType, EditProfileType } from '@/types/profile.types';
import { apiService } from './api.service';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
}

class ProfileUpdateService {
    async editProfile(userData: EditProfileType): Promise<ApiResponse<EditProfileType>> {
        // clean data: remove fields UI uses but backend does not need
        const { email, ...apiData } = userData as any;

        return apiService.post<ApiResponse<EditProfileType>>(
            '/user/editprofile',
            apiData
        );
    }

    async contactSupport(userData: ContactSupportType): Promise<ApiResponse<ContactSupportType>> {
    // clean data: remove fields UI uses but backend does not need
    const { ...apiData } = userData as any;

        return apiService.post<ApiResponse<ContactSupportType>>(
            '/user/contactSupport',
            apiData
        );
    }

    async updateProfile(id: string, content: string) {
        /* untouched */
    }

    async deleteAccount(id: string) {
        /* untouched */
    }
    
}

export const profileupdateService = new ProfileUpdateService();
