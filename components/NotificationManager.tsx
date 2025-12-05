import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { useNotification } from '../hooks/useNotification';
import { usePrayerTimes } from '../hooks/usePrayerTimes';

/**
 * NotificationManager - Handles all notification logic
 * Place this component in your root layout (_layout.tsx)
 *
 * It will:
 * 1. Listen for notification interactions
 * 2. Auto-schedule notifications when prayer times are updated
 * 3. Handle notification navigation
 */
export const NotificationManager: React.FC = () => {
    const { scheduleAllNotifications, permissionGranted } = useNotification();
    const { prayerTimes, savedLocation } = usePrayerTimes();

    /**
     * Schedule notifications when prayer times or location changes
     */
    useEffect(() => {
        if (!permissionGranted || !prayerTimes || !savedLocation) {
            console.log('⏭️ Skipping notification scheduling:', {
                permissionGranted,
                hasPrayerTimes: !!prayerTimes,
                hasLocation: !!savedLocation,
            });
            return;
        }

        // Convert prayer times to the format needed
        const prayerTimesMap = {
            fajr: prayerTimes.fajr,
            dhuhr: prayerTimes.dhuhr,
            asr: prayerTimes.asr,
            maghrib: prayerTimes.maghrib,
            isha: prayerTimes.isha,
        };

        // Get timezone (you can enhance this based on location)
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        console.log('📅 Scheduling notifications for prayer times:', prayerTimesMap);
        scheduleAllNotifications(prayerTimesMap, timezone);
    }, [prayerTimes, savedLocation, permissionGranted]);

    /**
     * Handle notification received (when app is open)
     */
    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(
            (notification) => {
                // console.log('🔔 Notification received:', notification);

                // You can show a custom in-app notification here if needed
                const { type, name, category } = notification.request.content.data || {};

                console.log('Notification type:', type);
                if (type === 'prayer') {
                    console.log('Prayer notification for:', name);
                } else if (type === 'adhkar') {
                    console.log('Adhkar notification:', category);
                } else if (type === 'surah-kahf') {
                    console.log('Surah Kahf reminder');
                }
            }
        );

        return () => subscription.remove();
    }, []);

    /**
     * Handle notification tap (navigate to appropriate screen)
     */
    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                console.log('👆 Notification tapped:', response);

                const { type, name, category } = response.notification.request.content.data || {};

                // Navigate based on notification type
                if (type === 'prayer') {
                    // Navigate to prayer times screen
                    router.push('/(prayer-times)/prayerTimes');
                } else if (type === 'adhkar') {
                    // Navigate to adhkar screen
                    if (category === 'morning') {
                        router.push('/(adhkar)?category=morning');
                    } else if (category === 'evening') {
                        router.push('/(adhkar)?category=evening');
                    } else {
                        router.push('/(adhkar)');
                    }
                } else if (type === 'surah-kahf') {
                    // Navigate to Surah Kahf (chapter 18)
                    router.push('/(tabs)/(quran)/surahDetail?surahId=18');
                }
            }
        );

        return () => subscription.remove();
    }, []);

    // This component doesn't render anything
    return null;
};

export default NotificationManager;