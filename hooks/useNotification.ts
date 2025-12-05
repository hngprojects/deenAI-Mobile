import { useState, useEffect, useCallback } from 'react';
import notificationService, {
    NotificationPermissionResult,
    ScheduleNotificationOptions,
    NotificationSettings,
} from '../service/notification.service';
import * as Notifications from 'expo-notifications';

export const useNotification = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [settings, setSettings] = useState<NotificationSettings | null>(null);
    const [permissionGranted, setPermissionGranted] = useState(false);

    /**
     * Load settings and check permission on mount
     */
    useEffect(() => {
        loadSettings();
        checkInitialPermission();
    }, []);

    /**
     * Load notification settings
     */
    const loadSettings = async () => {
        try {
            const savedSettings = await notificationService.getSettings();
            setSettings(savedSettings);
        } catch (err) {
            console.error('Error loading settings:', err);
        }
    };

    /**
     * Check initial permission status
     */
    const checkInitialPermission = async () => {
        const granted = await notificationService.checkPermission();
        setPermissionGranted(granted);
    };

    /**
     * Request notification permission
     */
    const requestPermission = async (): Promise<NotificationPermissionResult> => {
        try {
            setLoading(true);
            setError(null);

            const result = await notificationService.requestPermission();

            if (result.granted) {
                setPermissionGranted(true);
            } else {
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

    /**
     * Check notification permission
     */
    const checkPermission = async (): Promise<boolean> => {
        try {
            const granted = await notificationService.checkPermission();
            setPermissionGranted(granted);
            return granted;
        } catch (err: any) {
            console.error('Check permission error:', err);
            return false;
        }
    };

    /**
     * Schedule all notifications (prayer times, adhkar, surah kahf)
     */
    const scheduleAllNotifications = async (
        prayerTimes: { [key: string]: Date },
        timezone: string
    ): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            const hasPermission = await checkPermission();
            if (!hasPermission) {
                throw new Error('Notification permission not granted. Please enable notifications in settings.');
            }

            await notificationService.scheduleAllNotifications(prayerTimes, timezone);

            // console.log('✅ All notifications scheduled successfully');
            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to schedule notifications';
            setError(errorMessage);
            console.error('Schedule all notifications error:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Schedule prayer notifications only
     */
    const schedulePrayerNotifications = async (
        prayerTimes: { [key: string]: Date },
        timezone: string
    ): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            await notificationService.schedulePrayerNotifications(prayerTimes, timezone);
            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to schedule prayer notifications';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Schedule Adhkar notifications
     */
    const scheduleAdhkarNotifications = async (timezone: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            await notificationService.scheduleMorningAdhkar(timezone);
            await notificationService.scheduleEveningAdhkar(timezone);
            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to schedule Adhkar notifications';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Schedule Surah Kahf Friday reminder
     */
    const scheduleSurahKahfReminder = async (timezone: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            await notificationService.scheduleSurahKahfReminder(timezone);
            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to schedule Surah Kahf reminder';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update notification settings
     */
    const updateSettings = async (newSettings: NotificationSettings): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            await notificationService.saveSettings(newSettings);
            setSettings(newSettings);

            console.log('✅ Settings updated successfully');
            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to update settings';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Toggle prayer time notifications
     */
    const togglePrayerNotifications = async (enabled: boolean): Promise<void> => {
        if (!settings) return;

        const newSettings = {
            ...settings,
            prayerTimes: {
                ...settings.prayerTimes,
                enabled,
            },
        };

        await updateSettings(newSettings);
    };

    /**
     * Toggle specific prayer notification
     */
    const toggleSpecificPrayer = async (
        prayerName: keyof NotificationSettings['prayerTimes']['prayers'],
        enabled: boolean
    ): Promise<void> => {
        if (!settings) return;

        const newSettings = {
            ...settings,
            prayerTimes: {
                ...settings.prayerTimes,
                prayers: {
                    ...settings.prayerTimes.prayers,
                    [prayerName]: enabled,
                },
            },
        };

        await updateSettings(newSettings);
    };

    /**
     * Toggle Adhkar notifications
     */
    const toggleAdhkarNotifications = async (enabled: boolean): Promise<void> => {
        if (!settings) return;

        const newSettings = {
            ...settings,
            adhkar: {
                ...settings.adhkar,
                enabled,
            },
        };

        await updateSettings(newSettings);
    };

    /**
     * Update Adhkar time
     */
    const updateAdhkarTime = async (
        type: 'morning' | 'evening',
        time: string
    ): Promise<void> => {
        if (!settings) return;

        const newSettings = {
            ...settings,
            adhkar: {
                ...settings.adhkar,
                [type]: {
                    ...settings.adhkar[type],
                    time,
                },
            },
        };

        await updateSettings(newSettings);
    };

    /**
     * Toggle Surah Kahf reminder
     */
    const toggleSurahKahfReminder = async (enabled: boolean): Promise<void> => {
        if (!settings) return;

        const newSettings = {
            ...settings,
            surahKahf: {
                ...settings.surahKahf,
                enabled,
            },
        };

        await updateSettings(newSettings);
    };

    /**
     * Update Surah Kahf reminder time
     */
    const updateSurahKahfTime = async (time: string): Promise<void> => {
        if (!settings) return;

        const newSettings = {
            ...settings,
            surahKahf: {
                ...settings.surahKahf,
                time,
            },
        };

        await updateSettings(newSettings);
    };

    /**
     * Cancel all notifications
     */
    const cancelAllNotifications = async (): Promise<void> => {
        try {
            setLoading(true);
            await notificationService.cancelAllNotifications();
        } catch (err: any) {
            console.error('Cancel all notifications error:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Get all scheduled notifications (for debugging)
     */
    const getScheduledNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
        try {
            return await notificationService.getScheduledNotifications();
        } catch (err: any) {
            console.error('Get scheduled notifications error:', err);
            return [];
        }
    };

    /**
     * Clear error
     */
    const clearError = () => {
        setError(null);
    };

    return {
        // State
        loading,
        error,
        settings,
        permissionGranted,

        // Permission
        requestPermission,
        checkPermission,

        // Scheduling
        scheduleAllNotifications,
        schedulePrayerNotifications,
        scheduleAdhkarNotifications,
        scheduleSurahKahfReminder,

        // Settings management
        updateSettings,
        togglePrayerNotifications,
        toggleSpecificPrayer,
        toggleAdhkarNotifications,
        updateAdhkarTime,
        toggleSurahKahfReminder,
        updateSurahKahfTime,

        // Utilities
        cancelAllNotifications,
        getScheduledNotifications,
        clearError,
    };
};