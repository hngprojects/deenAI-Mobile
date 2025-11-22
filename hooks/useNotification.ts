import { useState } from 'react';
import notificationService, {
    NotificationPermissionResult,
    ScheduleNotificationOptions
} from '../service/notification.service';

export const useNotification = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requestPermission = async (): Promise<NotificationPermissionResult> => {
        try {
            setLoading(true);
            setError(null);

            const result = await notificationService.requestPermission();

            if (!result.granted) {
                setError(result.error || 'Permission denied');
            }

            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to request notification permission';
            setError(errorMessage);
            return {
                granted: false,
                error: errorMessage,
            };
        } finally {
            setLoading(false);
        }
    };

    const checkPermission = async (): Promise<boolean> => {
        try {
            return await notificationService.checkPermission();
        } catch (err: any) {
            console.error('Check permission error:', err);
            return false;
        }
    };

    const scheduleNotification = async (
        options: ScheduleNotificationOptions
    ): Promise<string | null> => {
        try {
            setLoading(true);
            setError(null);

            const notificationId = await notificationService.scheduleNotification(options);

            if (!notificationId) {
                throw new Error('Failed to schedule notification');
            }

            return notificationId;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to schedule notification';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const schedulePrayerNotification = async (
        prayerName: string,
        hour: number,
        minute: number
    ): Promise<string | null> => {
        try {
            setLoading(true);
            setError(null);

            return await notificationService.schedulePrayerNotification(
                prayerName,
                hour,
                minute
            );
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to schedule prayer notification';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const cancelNotification = async (notificationId: string): Promise<void> => {
        try {
            await notificationService.cancelNotification(notificationId);
        } catch (err: any) {
            console.error('Cancel notification error:', err);
        }
    };

    const cancelAllNotifications = async (): Promise<void> => {
        try {
            await notificationService.cancelAllNotifications();
        } catch (err: any) {
            console.error('Cancel all notifications error:', err);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        loading,
        error,
        requestPermission,
        checkPermission,
        scheduleNotification,
        schedulePrayerNotification,
        cancelNotification,
        cancelAllNotifications,
        clearError,
    };
};