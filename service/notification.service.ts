import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface NotificationPermissionResult {
    granted: boolean;
    error?: string;
}

export interface ScheduleNotificationOptions {
    title: string;
    body: string;
    data?: Record<string, any>;
    trigger?: Notifications.NotificationTriggerInput;
}

class NotificationService {
    constructor() {
        // Configure default notification behavior
        this.configureNotifications();
    }

    /**
     * Configure how notifications are handled
     */
    private configureNotifications() {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });
    }

    /**
     * Request notification permission
     */
    async requestPermission(): Promise<NotificationPermissionResult> {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            // Only ask if permission has not already been determined
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus === 'granted') {
                // Get push notification token (for remote notifications)
                await this.registerForPushNotifications();

                return {
                    granted: true,
                };
            }

            return {
                granted: false,
                error: 'Notification permission denied',
            };
        } catch (error) {
            console.error('Notification permission error:', error);
            return {
                granted: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Check if notification permission is granted
     */
    async checkPermission(): Promise<boolean> {
        try {
            const { status } = await Notifications.getPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Check notification permission error:', error);
            return false;
        }
    }

    /**
     * Register for push notifications and get token
     */
    async registerForPushNotifications(): Promise<string | null> {
        try {
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            const token = await Notifications.getExpoPushTokenAsync({
                projectId: 'your-project-id', // Replace with your Expo project ID
            });

            console.log('Push notification token:', token.data);
            return token.data;
        } catch (error) {
            console.error('Register for push notifications error:', error);
            return null;
        }
    }

    /**
     * Schedule a local notification
     */
    async scheduleNotification(
        options: ScheduleNotificationOptions
    ): Promise<string | null> {
        try {
            const hasPermission = await this.checkPermission();

            if (!hasPermission) {
                throw new Error('Notification permission not granted');
            }

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: options.title,
                    body: options.body,
                    data: options.data || {},
                    sound: true,
                },
                trigger: options.trigger || null, // null means show immediately
            });

            return notificationId;
        } catch (error) {
            console.error('Schedule notification error:', error);
            return null;
        }
    }

    /**
     * Schedule daily prayer time notifications
     */
    async schedulePrayerNotification(
        prayerName: string,
        hour: number,
        minute: number
    ): Promise<string | null> {
        try {
            return await this.scheduleNotification({
                title: `${prayerName} Prayer Time`,
                body: `It's time for ${prayerName} prayer`,
                data: { type: 'prayer', name: prayerName },
                trigger: {
                    hour,
                    minute,
                    repeats: true,
                },
            });
        } catch (error) {
            console.error('Schedule prayer notification error:', error);
            return null;
        }
    }

    /**
     * Cancel a scheduled notification
     */
    async cancelNotification(notificationId: string): Promise<void> {
        try {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
        } catch (error) {
            console.error('Cancel notification error:', error);
        }
    }

    /**
     * Cancel all scheduled notifications
     */
    async cancelAllNotifications(): Promise<void> {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
        } catch (error) {
            console.error('Cancel all notifications error:', error);
        }
    }

    /**
     * Get all scheduled notifications
     */
    async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
        try {
            return await Notifications.getAllScheduledNotificationsAsync();
        } catch (error) {
            console.error('Get scheduled notifications error:', error);
            return [];
        }
    }

    /**
     * Add notification received listener
     */
    addNotificationReceivedListener(
        listener: (notification: Notifications.Notification) => void
    ): Notifications.Subscription {
        return Notifications.addNotificationReceivedListener(listener);
    }

    /**
     * Add notification response listener (when user taps notification)
     */
    addNotificationResponseListener(
        listener: (response: Notifications.NotificationResponse) => void
    ): Notifications.Subscription {
        return Notifications.addNotificationResponseReceivedListener(listener);
    }
}

export default new NotificationService();