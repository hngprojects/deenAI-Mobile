import AsyncStorage from '@react-native-async-storage/async-storage';
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
    sound?: string | boolean;
}

export interface NotificationSettings {
    prayerTimes: {
        enabled: boolean;
        useAdhan: boolean;
        prayers: {
            fajr: boolean;
            dhuhr: boolean;
            asr: boolean;
            maghrib: boolean;
            isha: boolean;
        };
    };
    adhkar: {
        enabled: boolean;
        morning: {
            enabled: boolean;
            time: string;
        };
        evening: {
            enabled: boolean;
            time: string;
        };
    };
    surahKahf: {
        enabled: boolean;
        time: string;
    };
}

const STORAGE_KEY = '@notification_settings';
const NOTIFICATION_IDS_KEY = '@notification_ids';

// ✅ Use new API
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

class NotificationService {
    /**
     * Get next occurrence of a specific time (for daily repeats)
     */
    private getNextOccurrence(hour: number, minute: number, weekday?: number): Date {
        const now = new Date();
        const next = new Date();

        next.setHours(hour);
        next.setMinutes(minute);
        next.setSeconds(0);
        next.setMilliseconds(0);

        // Handle weekday-specific scheduling
        if (weekday !== undefined) {
            const currentWeekday = now.getDay(); // 0 = Sunday, 6 = Saturday
            const targetWeekday = weekday === 0 ? 0 : weekday; // Adjust if needed

            let daysToAdd = targetWeekday - currentWeekday;
            if (daysToAdd < 0) {
                daysToAdd += 7;
            } else if (daysToAdd === 0 && next.getTime() <= now.getTime()) {
                daysToAdd = 7;
            }

            next.setDate(now.getDate() + daysToAdd);
        } else {
            // For daily: if time has passed today, schedule for tomorrow
            if (next.getTime() <= now.getTime()) {
                next.setDate(next.getDate() + 1);
            }
        }

        return next;
    }

    /**
     * Create a daily repeating trigger for specific hour/minute
     */
    private createDailyTrigger(
        hour: number,
        minute: number,
        channelId?: string
    ): Notifications.NotificationTriggerInput {
        const triggerDate = this.getNextOccurrence(hour, minute);

        return {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate.getTime(),
            channelId,
        };
    }

    /**
     * Create a weekly repeating trigger for specific weekday
     */
    private createWeeklyTrigger(
        weekday: number,
        hour: number,
        minute: number,
        channelId?: string
    ): Notifications.NotificationTriggerInput {
        const triggerDate = this.getNextOccurrence(hour, minute, weekday);

        return {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate.getTime(),
            channelId,
        };
    }

    /**
     * Schedule a daily notification with proper repeat handling
     */
    async scheduleDailyNotification(
        title: string,
        body: string,
        hour: number,
        minute: number,
        data?: Record<string, any>,
        sound: string | boolean = true,
        channelId: string = 'default'
    ): Promise<string[]> {
        const notificationIds: string[] = [];

        try {
            // For daily notifications, we need to schedule multiple instances
            // since Android doesn't support native repeating for DATE triggers
            // Schedule for today and the next few days

            for (let i = 0; i < 30; i++) { // Schedule for next 30 days
                const triggerDate = new Date();
                triggerDate.setDate(triggerDate.getDate() + i);
                triggerDate.setHours(hour, minute, 0, 0);

                // Skip if this time has already passed today
                if (i === 0 && triggerDate.getTime() <= Date.now()) {
                    continue;
                }

                const notificationId = await this.scheduleNotification({
                    title,
                    body,
                    data: {
                        ...data,
                        repeatIndex: i,
                        originalHour: hour,
                        originalMinute: minute,
                        isDaily: true,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DATE,
                        date: triggerDate.getTime(),
                        channelId,
                    },
                    sound,
                });

                if (notificationId) {
                    notificationIds.push(notificationId);
                }
            }

            return notificationIds;
        } catch (error) {
            console.error('Error scheduling daily notification:', error);
            return notificationIds;
        }
    }

    async requestPermission(): Promise<NotificationPermissionResult> {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus === 'granted') {
                await this.registerForPushNotifications();
                return { granted: true };
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
                await Notifications.setNotificationChannelAsync('prayer-times', {
                    name: 'Prayer Times',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                    sound: 'adhan',
                    enableVibrate: true,
                    enableLights: true,
                    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                    bypassDnd: false,
                    showBadge: true,
                });

                await Notifications.setNotificationChannelAsync('adhkar', {
                    name: 'Daily Adhkar',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                    sound: 'default',
                    enableVibrate: true,
                    enableLights: true,
                    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                    showBadge: true,
                });

                await Notifications.setNotificationChannelAsync('surah-kahf', {
                    name: 'Surah Kahf Reminder',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                    sound: 'default',
                    enableVibrate: true,
                    enableLights: true,
                    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                    showBadge: true,
                });

                console.log('✅ Android notification channels created with MAX importance');
            }

            const token = await Notifications.getExpoPushTokenAsync({
                projectId: '524cdef3-3a7b-4fe8-b570-ca1758a8424d',
            });

            console.log('Push notification token:', token.data);
            return token.data;
        } catch (error) {
            console.error('Register for push notifications error:', error);
            return null;
        }
    }

    /**
     * Get default notification settings
     */
    getDefaultSettings(): NotificationSettings {
        return {
            prayerTimes: {
                enabled: true,
                useAdhan: true,
                prayers: {
                    fajr: true,
                    dhuhr: true,
                    asr: true,
                    maghrib: true,
                    isha: true,
                },
            },
            adhkar: {
                enabled: true,
                morning: {
                    enabled: true,
                    time: '06:00',
                },
                evening: {
                    enabled: true,
                    time: '23:09',
                },
            },
            surahKahf: {
                enabled: true,
                time: '09:00',
            },
        };
    }

    /**
     * Save notification settings
     */
    async saveSettings(settings: NotificationSettings): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving notification settings:', error);
            throw error;
        }
    }

    /**
     * Get notification settings
     */
    async getSettings(): Promise<NotificationSettings> {
        try {
            const settingsJson = await AsyncStorage.getItem(STORAGE_KEY);
            if (settingsJson) {
                return JSON.parse(settingsJson);
            }
            return this.getDefaultSettings();
        } catch (error) {
            console.error('Error getting notification settings:', error);
            return this.getDefaultSettings();
        }
    }

    /**
     * Save notification IDs for tracking
     */
    private async saveNotificationIds(ids: string[]): Promise<void> {
        try {
            await AsyncStorage.setItem(NOTIFICATION_IDS_KEY, JSON.stringify(ids));
        } catch (error) {
            console.error('Error saving notification IDs:', error);
        }
    }

    /**
     * Get saved notification IDs
     */
    private async getNotificationIds(): Promise<string[]> {
        try {
            const idsJson = await AsyncStorage.getItem(NOTIFICATION_IDS_KEY);
            return idsJson ? JSON.parse(idsJson) : [];
        } catch (error) {
            console.error('Error getting notification IDs:', error);
            return [];
        }
    }

    /**
     * Schedule a single notification
     */
    async scheduleNotification(
        options: ScheduleNotificationOptions
    ): Promise<string | null> {
        try {
            const hasPermission = await this.checkPermission();

            if (!hasPermission) {
                throw new Error('Notification permission not granted');
            }

            // 🔥 CRITICAL FIX: Reference Android raw resource CORRECTLY
            let soundToUse: any = true;

            if (options.sound === 'adhan.mp3') {
                if (Platform.OS === 'android') {
                    // Android raw resource: Use filename WITHOUT .mp3 extension
                    soundToUse = 'adhan'; // ← NO .mp3 extension!
                    console.log('🔊 Android: Using raw resource "adhan" (no extension)');
                } else {
                    // iOS: Keep .mp3 extension
                    soundToUse = 'adhan.mp3';
                    console.log('🔊 iOS: Using "adhan.mp3"');
                }
            } else if (options.sound !== undefined) {
                soundToUse = options.sound;
            }

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: options.title,
                    body: options.body,
                    data: options.data || {},
                    sound: soundToUse,
                    priority: Notifications.AndroidNotificationPriority.MAX,
                    vibrate: [0, 250, 250, 250],
                },
                trigger: options.trigger || null,
            });

            return notificationId;
        } catch (error) {
            console.error('Schedule notification error:', error);
            return null;
        }
    }


    /**
     * 🔥 FIXED: Schedule prayer time notifications with DATE triggers
     */
    async schedulePrayerNotifications(
        prayerTimes: { [key: string]: Date },
        timezone: string
    ): Promise<void> {
        try {
            const settings = await this.getSettings();
            if (!settings.prayerTimes.enabled) {
                console.log('Prayer time notifications are disabled');
                return;
            }

            // 🔥 FIRST: Cancel existing prayer notifications
            const scheduled = await Notifications.getAllScheduledNotificationsAsync();
            const prayerNotifications = scheduled.filter(n =>
                n.content.data?.type === 'prayer'
            );

            for (const notif of prayerNotifications) {
                await Notifications.cancelScheduledNotificationAsync(notif.identifier);
            }
            console.log(`🗑️ Cancelled ${prayerNotifications.length} old prayer notifications`);

            const scheduledIds: string[] = [];
            const prayerNames = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

            for (const prayerName of prayerNames) {
                const prayerKey = prayerName as keyof typeof settings.prayerTimes.prayers;

                if (!settings.prayerTimes.prayers[prayerKey]) {
                    console.log(`${prayerName} notifications are disabled`);
                    continue;
                }

                const prayerTime = prayerTimes[prayerName];
                if (!prayerTime) continue;

                const hour = prayerTime.getHours();
                const minute = prayerTime.getMinutes();

                // 🔥 FIX: Get correct sound reference
                let soundToUse: any = true;
                if (settings.prayerTimes.useAdhan) {
                    if (Platform.OS === 'android') {
                        soundToUse = 'adhan'; // Android raw resource (no extension)
                    } else {
                        soundToUse = 'adhan.mp3'; // iOS with extension
                    }
                }

                // 🔥 FIX: Only schedule NEXT occurrence, not 30 days!
                const triggerDate = new Date(prayerTime);

                // If time has passed today, schedule for tomorrow
                if (triggerDate.getTime() <= Date.now()) {
                    triggerDate.setDate(triggerDate.getDate() + 1);
                }

                const notificationId = await this.scheduleNotification({
                    title: `${prayerName.charAt(0).toUpperCase() + prayerName.slice(1)} Prayer Time 🕌`,
                    body: `It's time for ${prayerName.charAt(0).toUpperCase() + prayerName.slice(1)} prayer`,
                    data: {
                        type: 'prayer',
                        name: prayerName,
                        channelId: 'prayer-times',
                        useAdhan: settings.prayerTimes.useAdhan,
                        originalHour: hour,
                        originalMinute: minute,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DATE,
                        date: triggerDate.getTime(),
                        channelId: 'prayer-times',
                    },
                    sound: soundToUse,
                });

                if (notificationId) {
                    scheduledIds.push(notificationId);
                    console.log(`✅ Scheduled ${prayerName} for ${triggerDate.toLocaleString()}`);
                }
            }

            const existingIds = await this.getNotificationIds();
            await this.saveNotificationIds([...existingIds, ...scheduledIds]);
        } catch (error) {
            console.error('Error scheduling prayer notifications:', error);
            throw error;
        }
    }

    /**
     * Schedule morning Adhkar with DATE triggers
     */
    async scheduleMorningAdhkar(timezone: string): Promise<void> {
        try {
            const settings = await this.getSettings();
            if (!settings.adhkar.enabled || !settings.adhkar.morning.enabled) {
                console.log('Morning Adhkar notifications are disabled');
                return;
            }

            const [hour, minute] = settings.adhkar.morning.time.split(':').map(Number);
            const scheduledIds: string[] = [];

            // Schedule for the next 30 days
            for (let i = 0; i < 30; i++) {
                const triggerDate = new Date();
                triggerDate.setDate(triggerDate.getDate() + i);
                triggerDate.setHours(hour, minute, 0, 0);

                // If it's today and time has passed, schedule for tomorrow
                if (i === 0 && triggerDate.getTime() <= Date.now()) {
                    continue;
                }

                const notificationId = await this.scheduleNotification({
                    title: 'Morning Adhkar Reminder 🌅',
                    body: 'Start your day with morning supplications',
                    data: {
                        type: 'adhkar',
                        category: 'morning',
                        channelId: 'adhkar',
                        dayOffset: i,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DATE,
                        date: triggerDate.getTime(),
                        channelId: 'adhkar',
                    },
                });

                if (notificationId) {
                    scheduledIds.push(notificationId);
                }
            }

            if (scheduledIds.length > 0) {
                const existingIds = await this.getNotificationIds();
                await this.saveNotificationIds([...existingIds, ...scheduledIds]);
                console.log(`✅ Scheduled morning Adhkar for ${hour}:${minute} (next 30 days)`);
            }
        } catch (error) {
            console.error('Error scheduling morning Adhkar:', error);
            throw error;
        }
    }

    /**
     * Schedule evening Adhkar with DATE triggers
     */
    async scheduleEveningAdhkar(timezone: string): Promise<void> {
        try {
            const settings = await this.getSettings();
            if (!settings.adhkar.enabled || !settings.adhkar.evening.enabled) {
                console.log('Evening Adhkar notifications are disabled');
                return;
            }

            const [hour, minute] = settings.adhkar.evening.time.split(':').map(Number);
            const scheduledIds: string[] = [];

            // Schedule for the next 30 days
            for (let i = 0; i < 30; i++) {
                const triggerDate = new Date();
                triggerDate.setDate(triggerDate.getDate() + i);
                triggerDate.setHours(hour, minute, 0, 0);

                // If it's today and time has passed, schedule for tomorrow
                if (i === 0 && triggerDate.getTime() <= Date.now()) {
                    continue;
                }

                const notificationId = await this.scheduleNotification({
                    title: 'Evening Adhkar Reminder 🌙',
                    body: 'End your day with evening supplications',
                    data: {
                        type: 'adhkar',
                        category: 'evening',
                        channelId: 'adhkar',
                        dayOffset: i,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DATE,
                        date: triggerDate.getTime(),
                        channelId: 'adhkar',
                    },
                });

                if (notificationId) {
                    scheduledIds.push(notificationId);
                }
            }

            if (scheduledIds.length > 0) {
                const existingIds = await this.getNotificationIds();
                await this.saveNotificationIds([...existingIds, ...scheduledIds]);
                console.log(`✅ Scheduled evening Adhkar for ${hour}:${minute} (next 30 days)`);
            }
        } catch (error) {
            console.error('Error scheduling evening Adhkar:', error);
            throw error;
        }
    }

    /**
     * Schedule Surah Kahf Friday reminder with DATE triggers
     */
    async scheduleSurahKahfReminder(timezone: string): Promise<void> {
        try {
            const settings = await this.getSettings();
            if (!settings.surahKahf.enabled) {
                console.log('Surah Kahf notifications are disabled');
                return;
            }

            const [hour, minute] = settings.surahKahf.time.split(':').map(Number);
            const scheduledIds: string[] = [];

            // Find the next 4 Fridays (next month)
            const now = new Date();
            for (let week = 0; week < 4; week++) {
                const triggerDate = new Date(now);

                // Calculate days until next Friday
                const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
                const daysUntilFriday = (5 - currentDay + 7) % 7;
                const daysToAdd = daysUntilFriday + (week * 7);

                triggerDate.setDate(now.getDate() + daysToAdd);
                triggerDate.setHours(hour, minute, 0, 0);

                // Skip if this Friday has already passed today
                if (week === 0 && triggerDate.getTime() <= Date.now()) {
                    continue;
                }

                const notificationId = await this.scheduleNotification({
                    title: 'Surah Al-Kahf Reminder 📖',
                    body: 'Read Surah Al-Kahf on this blessed Friday',
                    data: {
                        type: 'surah-kahf',
                        channelId: 'surah-kahf',
                        weekOffset: week,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DATE,
                        date: triggerDate.getTime(),
                        channelId: 'surah-kahf',
                    },
                });

                if (notificationId) {
                    scheduledIds.push(notificationId);
                }
            }

            if (scheduledIds.length > 0) {
                const existingIds = await this.getNotificationIds();
                await this.saveNotificationIds([...existingIds, ...scheduledIds]);
                console.log(`✅ Scheduled Surah Kahf for Fridays at ${hour}:${minute} (next 4 Fridays)`);
            }
        } catch (error) {
            console.error('Error scheduling Surah Kahf reminder:', error);
            throw error;
        }
    }

    /**
     * Schedule all notifications at once
     */
    async scheduleAllNotifications(
        prayerTimes: { [key: string]: Date },
        timezone: string
    ): Promise<void> {
        try {
            console.log('🔔 Starting to schedule all notifications...');

            // Cancel first, then wait a bit before rescheduling
            await this.cancelAllNotifications();
            await new Promise(resolve => setTimeout(resolve, 500));

            await this.schedulePrayerNotifications(prayerTimes, timezone);
            await this.scheduleMorningAdhkar(timezone);
            await this.scheduleEveningAdhkar(timezone);
            await this.scheduleSurahKahfReminder(timezone);

            // Show what's scheduled after a small delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.debugScheduledNotifications();

            // console.log('✅ All notifications scheduled successfully');
        } catch (error) {
            console.error('Error scheduling all notifications:', error);
            throw error;
        }
    }

    /**
     * 🔥 DEBUG: Show all scheduled notifications
     */
    async debugScheduledNotifications(): Promise<void> {
        try {
            const scheduled = await this.getScheduledNotifications();
            console.log('\n📋 SCHEDULED NOTIFICATIONS:', scheduled.length);

            if (scheduled.length === 0) {
                console.log('⚠️ WARNING: No notifications are scheduled!');
                console.log('This might indicate a scheduling issue.');
            }

            scheduled.forEach((notif, index) => {
                const trigger = notif.trigger as any;
                console.log(`\n${index + 1}. ${notif.content.title}`);
                console.log('   ID:', notif.identifier);
                console.log('   Body:', notif.content.body);
                console.log('   Type:', notif.content.data?.type);
                console.log('   Trigger type:', trigger.type);

                if (trigger.type === 'date' && trigger.date) {
                    const triggerDate = new Date(trigger.date);
                    console.log('   Scheduled for:', triggerDate.toLocaleString());
                    console.log('   In', Math.round((triggerDate.getTime() - Date.now()) / 1000 / 60), 'minutes');
                }
            });
            console.log('\n');
        } catch (error) {
            console.error('Debug scheduled notifications error:', error);
        }
    }

    /**
     * Toggle Adhan sound for prayer notifications
     */
    async toggleAdhanSound(enabled: boolean): Promise<void> {
        try {
            const settings = await this.getSettings();
            settings.prayerTimes.useAdhan = enabled;
            await this.saveSettings(settings);
            console.log(`Adhan sound ${enabled ? 'enabled' : 'disabled'}`);
        } catch (error) {
            console.error('Error toggling Adhan sound:', error);
            throw error;
        }
    }

    /**
     * Cancel a scheduled notification
     */
    async cancelNotification(notificationId: string): Promise<void> {
        try {
            await Notifications.cancelScheduledNotificationAsync(notificationId);

            const existingIds = await this.getNotificationIds();
            const updatedIds = existingIds.filter(id => id !== notificationId);
            await this.saveNotificationIds(updatedIds);
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
            await this.saveNotificationIds([]);
            console.log('🗑️ All notifications cancelled');
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
     * Add notification response listener
     */
    addNotificationResponseListener(
        listener: (response: Notifications.NotificationResponse) => void
    ): Notifications.Subscription {
        return Notifications.addNotificationResponseReceivedListener(listener);
    }
}

export default new NotificationService();