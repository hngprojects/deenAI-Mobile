import { useQuery } from '@tanstack/react-query';
import { profileupdateService } from '@/service/profileupdate.service';

export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => profileupdateService.getProfile(),
        select: (data) => data.data,
    });
};