import { useToast } from '@/hooks/useToast';
import { profileupdateService } from '@/service/profileupdate.service';
import { ContactSupportType, EditProfileType } from '@/types/profile.types';
import { useAuthStore } from '@/store/auth-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

export const useEditProfile = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const { setLoading } = useAuthStore.getState();

    return useMutation({
        mutationFn: (userData: EditProfileType) => {
            return profileupdateService.editProfile(userData);
        },

        onMutate: () => {
            setLoading(true);
        },

        onSuccess: () => {
            setLoading(false);

            queryClient.invalidateQueries({ queryKey: ['user'] });

            showToast('Profile updated successfully', 'success');

            router.push('/(tabs)/(profile)/ProfileScreen');
        },

        onError: (error: any) => {
            setLoading(false);
            showToast(error?.message || 'Profile update failed', 'error');
        }
    });
};


export const useContactSupport = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const { setLoading } = useAuthStore.getState();

    return useMutation({
        mutationFn: (userData: ContactSupportType) => {
            return profileupdateService.contactSupport(userData);
        },

        onMutate: () => {
            setLoading(true);
        },

        onSuccess: () => {
            setLoading(false);

            queryClient.invalidateQueries({ queryKey: ['user'] });

            showToast('Profile updated successfully', 'success');

            router.push('/(tabs)/(profile)/ProfileScreen');
        },

        onError: (error: any) => {
            setLoading(false);
            showToast(error?.message || 'Profile update failed', 'error');
        }
    });
};