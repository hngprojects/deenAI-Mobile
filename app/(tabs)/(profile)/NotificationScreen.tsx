import ScreenContainer from "@/components/ScreenContainer";
import Toggle from "@/components/ToggleNotifications";
import { useNotification } from "@/hooks/useNotification";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useToast } from "@/hooks/useToast";
import notificationService from "@/service/notification.service";
import { theme } from "@/styles/theme";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
// 🔥 ADD THIS IMPORT
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';

export default function NotificationScreen() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const {
    settings,
    permissionGranted,
    requestPermission,
    togglePrayerNotifications,
    toggleAdhkarNotifications,
    toggleSurahKahfReminder,
    scheduleAllNotifications,
    loading,
  } = useNotification();

  const { prayerTimes, savedLocation } = usePrayerTimes();

  // Local state for notification toggles
  const [notifications, setNotifications] = useState([
    { id: 1, key: "prayer", title: t("prayerReminder"), enabled: false },
    { id: 2, key: "adhan", title: "Use Adhan Sound 🕌", enabled: true, isSubSetting: true },
    { id: 3, key: "adhkar", title: "Daily Adhkar", enabled: false },
    { id: 4, key: "surahKahf", title: "Surah Al-Kahf (Friday)", enabled: false },
    { id: 5, key: "reflection", title: t("reflectionReminder"), enabled: false, comingSoon: true },
    { id: 6, key: "deenai", title: t("deenAIMessageAlert"), enabled: false, comingSoon: true },
  ]);

  // Sync with settings from hook
  useEffect(() => {
    if (settings) {
      setNotifications((prev) =>
        prev.map((notif) => {
          if (notif.key === "prayer") {
            return { ...notif, enabled: settings.prayerTimes.enabled };
          }
          if (notif.key === "adhan") {
            return { ...notif, enabled: settings.prayerTimes.useAdhan };
          }
          if (notif.key === "adhkar") {
            return { ...notif, enabled: settings.adhkar.enabled };
          }
          if (notif.key === "surahKahf") {
            return { ...notif, enabled: settings.surahKahf.enabled };
          }
          return notif;
        })
      );
    }
  }, [settings]);

  /**
   * Request permission if not granted
   */
  const handleRequestPermission = async () => {
    const result = await requestPermission();

    if (result.granted) {
      showToast("Notifications enabled successfully", "success");

      // Auto-schedule if we have prayer times
      if (prayerTimes && savedLocation) {
        await rescheduleNotifications();
      }
    } else {
      Alert.alert(
        "Permission Denied",
        "Please enable notifications in your device settings to receive reminders.",
        [{ text: "OK" }]
      );
    }
  };

  /**
   * Reschedule all notifications
   */
  const rescheduleNotifications = async () => {
    if (!prayerTimes || !savedLocation) {
      console.log("Cannot reschedule - missing prayer times or location");
      return;
    }

    const prayerTimesMap = {
      fajr: prayerTimes.fajr,
      dhuhr: prayerTimes.dhuhr,
      asr: prayerTimes.asr,
      maghrib: prayerTimes.maghrib,
      isha: prayerTimes.isha,
    };

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await scheduleAllNotifications(prayerTimesMap, timezone);
  };

  /**
   * Handle notification toggle
   */
  const handleToggle = async (key: string, currentValue: boolean) => {
    console.log(`🔄 Toggle ${key}:`, !currentValue);

    // Check permission first (except for Adhan toggle)
    if (!permissionGranted && key !== "adhan") {
      await handleRequestPermission();
      return;
    }

    const newValue = !currentValue;

    // Update local state immediately for UI responsiveness
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.key === key ? { ...notif, enabled: newValue } : notif
      )
    );

    try {
      // Update settings based on notification type
      if (key === "prayer") {
        await togglePrayerNotifications(newValue);
        await rescheduleNotifications();
        showToast(
          newValue ? "Prayer reminders enabled" : "Prayer reminders disabled",
          "success"
        );
      } else if (key === "adhan") {
        // Toggle Adhan sound
        await notificationService.toggleAdhanSound(newValue);
        await rescheduleNotifications();
        showToast(
          newValue
            ? "Adhan sound enabled 🕌"
            : "Default notification sound enabled",
          "success"
        );
      } else if (key === "adhkar") {
        await toggleAdhkarNotifications(newValue);
        await rescheduleNotifications();
        showToast(
          newValue ? "Daily Adhkar reminders enabled" : "Daily Adhkar reminders disabled",
          "success"
        );
      } else if (key === "surahKahf") {
        await toggleSurahKahfReminder(newValue);
        await rescheduleNotifications();
        showToast(
          newValue ? "Surah Al-Kahf reminder enabled" : "Surah Al-Kahf reminder disabled",
          "success"
        );
      }
    } catch (error) {
      console.error("Toggle error:", error);
      // Revert on error
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.key === key ? { ...notif, enabled: currentValue } : notif
        )
      );
      showToast("Failed to update notification", "error");
    }
  };

  /**
   * Handle coming soon notifications
   */
  const handleComingSoon = (title: string) => {
    showToast(`${title} is coming soon`, "info");
  };

  const fixedHeader = (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <ArrowLeft color={theme.color.secondary} size={24} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Notifications</Text>

      <View style={styles.placeholder} />
    </View>
  );

  // Check if prayer notifications are enabled (to show/hide Adhan option)
  const prayerNotifEnabled = notifications.find(n => n.key === "prayer")?.enabled;

  return (
    <ScreenContainer
      fixedHeader={fixedHeader}
      useFixedHeaderLayout={true}
      paddingHorizontal={20}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Permission Banner (shown when permission not granted) */}
        {!permissionGranted && (
          <TouchableOpacity
            style={styles.permissionBanner}
            onPress={handleRequestPermission}
            activeOpacity={0.7}
          >
            <Text style={styles.bannerText}>
              Tap to enable notifications
            </Text>
          </TouchableOpacity>
        )}

        {/* Notification Cards */}
        {notifications.map((item) => {
          // Hide Adhan toggle if prayer notifications are disabled
          if (item.key === "adhan" && !prayerNotifEnabled) {
            return null;
          }

          return (
            <View
              key={item.id}
              style={[
                styles.card,
                item.isSubSetting && styles.subSettingCard
              ]}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.title}>{item.title}</Text>
                {item.key === "adhan" && (
                  <Text style={styles.subtitle}>
                    Play Islamic call to prayer for prayer times
                  </Text>
                )}
              </View>

              <Toggle
                value={item.enabled}
                onChange={() =>
                  item.comingSoon
                    ? handleComingSoon(item.title)
                    : handleToggle(item.key, item.enabled)
                }
                disabled={loading || item.comingSoon}
              />
            </View>
          );
        })}

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    alignItems: "flex-start",
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.font.semiBold,
    color: theme.color.secondary,
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  permissionBanner: {
    backgroundColor: theme.color.brand,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  bannerText: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: "#fffcfcff",
  },
  card: {
    paddingVertical: 19,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 19,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C7C5CC",
    gap: 10,
    backgroundColor: "#FFF",
  },
  subSettingCard: {},
  cardLeft: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: theme.color.secondary,
    fontFamily: theme.font.regular,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    fontFamily: theme.font.regular,
    marginTop: 4,
  }
});