import {
    CreateReflectionRequest,
    Reflection
} from '@/types/reflect.types';
import { apiService } from './api.service';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
}

interface ReflectionsListResponse {
    payload: Reflection[];
    paginationMeta: {
        total: number;
        limit: number;
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}

class ReflectService {

    async getUserReflections(page: number = 1, limit: number = 10, orderBy: 'ASC' | 'DESC' = 'DESC'): Promise<Reflection[]> {
        try {
            console.log('🔄 Fetching reflections...');

            const response = await apiService.get<ApiResponse<ReflectionsListResponse>>('/reflections', {
                params: { page, limit, orderBy }
            });

            console.log('📊 API Response:', response);

            if (response.success && response.data?.payload) {
                console.log('✅ Reflections loaded:', response.data.payload.length);
                return response.data.payload;
            } else {
                console.warn('⚠️ No reflections found in response');
                return [];
            }

        } catch (error) {
            console.error('💥 Error getting reflections:', error);
            return [];
        }
    }

    async getReflectionById(id: string): Promise<Reflection> {
        try {
            const response = await apiService.get<ApiResponse<Reflection>>(`/reflections/${id}`);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Reflection not found');
            }
        } catch (error) {
            console.error('Error getting reflection:', error);
            throw error;
        }
    }

    async createReflection(reflectionData: CreateReflectionRequest): Promise<Reflection> {
        try {
            console.log('🔄 Creating reflection with data:', JSON.stringify(reflectionData, null, 2));

            // Validate required fields before sending
            if (!reflectionData.surah) {
                throw new Error('Surah information is required for reflection');
            }

            if (!reflectionData.content || reflectionData.content.trim() === '') {
                throw new Error('Reflection content cannot be empty');
            }

            if (reflectionData.content.trim().length < 5) {
                throw new Error('Reflection content must be at least 5 characters long');
            }

            // Prepare request data
            const requestData = {
                content: reflectionData.content.trim(),
                surah: reflectionData.surah,
                startAyah: reflectionData.startAyah || undefined,
                endAyah: reflectionData.endAyah || undefined,
            };

            console.log('📤 Final request data:', JSON.stringify(requestData, null, 2));

            const response = await apiService.post<ApiResponse<Reflection>>('/reflections', requestData);

            console.log('📊 Create reflection response:', response);

            if (response.success && response.data) {
                console.log('✅ Reflection created successfully');
                return response.data;
            } else {
                // Handle validation errors from API
                if (response.errors) {
                    const errorMessages = Object.entries(response.errors)
                        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                        .join('; ');
                    throw new Error(`Validation failed: ${errorMessages}`);
                }
                throw new Error(response.message || 'Failed to create reflection');
            }
        } catch (error: any) {
            console.error('💥 Error creating reflection:', error);

            // Re-throw with better error messages
            if (error.message?.includes('Validation failed')) {
                throw error;
            } else if (error.message?.includes('Surah information is required')) {
                throw error;
            } else if (error.message?.includes('content cannot be empty')) {
                throw error;
            } else if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else if (error.message) {
                throw error;
            }

            throw new Error('Failed to create reflection. Please try again.');
        }
    }

    async updateReflection(id: string, content: string): Promise<Reflection> {
        try {
            console.log('🔄 Updating reflection:', { id, contentLength: content.length });

            // Validate content
            if (!content || content.trim() === '') {
                throw new Error('Reflection content cannot be empty');
            }

            if (content.trim().length < 5) {
                throw new Error('Reflection content must be at least 5 characters long');
            }

            const response = await apiService.put<ApiResponse<Reflection>>(`/reflections/${id}`, {
                content: content.trim()
            });

            console.log('📊 Update reflection response:', response);

            if (response.success && response.data) {
                console.log('✅ Reflection updated successfully');
                return response.data;
            } else {
                if (response.errors) {
                    const errorMessages = Object.entries(response.errors)
                        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                        .join('; ');
                    throw new Error(`Validation failed: ${errorMessages}`);
                }
                throw new Error(response.message || 'Failed to update reflection');
            }
        } catch (error: any) {
            console.error('💥 Error updating reflection:', error);

            if (error.message?.includes('Validation failed')) {
                throw error;
            } else if (error.message?.includes('content cannot be empty')) {
                throw error;
            } else if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else if (error.message) {
                throw error;
            }

            throw new Error('Failed to update reflection. Please try again.');
        }
    }

    async deleteReflection(id: string): Promise<void> {
        try {
            console.log('🔄 Deleting reflection:', id);

            const response = await apiService.delete<ApiResponse<void>>(`/reflections/${id}`);

            if (!response.success) {
                throw new Error(response.message || 'Failed to delete reflection');
            }

            console.log('✅ Reflection deleted successfully');
        } catch (error: any) {
            console.error('💥 Error deleting reflection:', error);

            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else if (error.message) {
                throw error;
            }

            throw new Error('Failed to delete reflection. Please try again.');
        }
    }
}

export const reflectService = new ReflectService();