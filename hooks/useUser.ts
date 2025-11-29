import { profileupdateService } from '@/service/profileupdate.service';
import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@tanstack/react-query';

interface UserProfile {
    id: string;
    userId: string;
    avatar?: string;
    language?: string;
    username: string;
    name?: string;
    email?: string;
    timezone?: string;
    createdAt: string;
    updatedAt: string;
}

export const useUser = () => {
    const { token, isAuthenticated, user: authUser } = useAuthStore();

    return useQuery<UserProfile>({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await profileupdateService.getProfile();

            return {
                ...response.data,
                name: authUser?.name,
                email: authUser?.email,
            } as UserProfile;
        },
        enabled: isAuthenticated && !!token,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 2,
        refetchOnMount: 'always',
    });
};