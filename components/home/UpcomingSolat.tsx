import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { theme } from "@/styles/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useState, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Move QuickActions OUTSIDE and memoize it
const QuickActions = memo(({
  onQiblaPress,
  onCounterPress,
  onAzkarPress,
  onStreakPress,
  t
}: {
  onQiblaPress: () => void;
  onCounterPress: () => void;
  onAzkarPress: () => void;
  onStreakPress: () => void;
  t: any;
}) => {
  return (
  <View style={styles.quickActionsBox}>
    <TouchableOpacity
      onPress={onQiblaPress}
      style={styles.actionItem}
    >
      <Image
        source={require("../../assets/images/clarity_compass-line.png")}
        style={styles.actionIcon}
        resizeMode="contain"
      />
      <Text style={styles.actionText}>{t("qibla")}</Text>
    </TouchableOpacity>

    <View style={styles.separator} />

    <TouchableOpacity
      style={styles.actionItem}
      onPress={onCounterPress}
    >
      <Image
        source={require("../../assets/images/tasbeeh.png")}
        style={styles.actionIcon}
        resizeMode="contain"
      />
      <Text style={styles.actionText}>{t("counter")}</Text>
    </TouchableOpacity>

    <View style={styles.separator} />

    <TouchableOpacity
      style={styles.actionItem}
      onPress={onAzkarPress}
    >
      <Image
        source={require("../../assets/images/adhkarr.png")}
        style={styles.actionIcon}
        resizeMode="contain"
      />
      <Text style={styles.actionText}>{t("azkar")}</Text>
    </TouchableOpacity>

    <View style={styles.separator} />

    <TouchableOpacity
      style={styles.actionItem}
      onPress={onStreakPress}
    >
      <Image
        source={require("../../assets/images/streaks.png")}
        style={styles.actionIcon}
        resizeMode="contain"
      />
      <Text style={styles.actionText}>{t("streaks")}</Text>
    </TouchableOpacity>
  </View>
  );
});

QuickActions.displayName = 'QuickActions';

export default function UpcomingSolat() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    nextPrayer,
    locationName,
    formatTime,
    formatDate,
    refreshLocation,
    loading,
    error,
    savedLocation,
  } = usePrayerTimes();

  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  // Helper to get display-ready location name with source label
  const getLocationDisplay = () => {
    if (!savedLocation) return null;

    // Check for placeholder or empty location
    if (!locationName ||
      locationName === 'Location...' ||
      locationName === 'Unknown Location' ||
      locationName.trim() === '') {
      return 'Getting location...';
    }

    return `${locationName}`;
  };

  const displayLocation = getLocationDisplay();



  // Memoize all handlers to prevent unnecessary re-renders
  const handleSeeAll = useCallback(() => {
    router.push("/(prayer-times)/prayerTimes");
  }, [router]);

  const handlePrayerPress = useCallback(() => {
    router.push("/(prayer-times)/prayerTimes");
  }, [router]);

  const handleQiblaPress = useCallback(() => {
    router.push("/(qibla)");
  }, [router]);

  const handleAllowLocation = useCallback(async () => {
    setIsRequestingLocation(true);
    try {
      console.log('🔄 User requesting location from home screen');
      await refreshLocation();
      console.log('✅ Location refresh completed');
    } catch (error: any) {
      console.error("❌ Error requesting location:", error);

      // The location service already shows appropriate alerts:
      // - For location services disabled -> "Enable location services" alert
      // - For permission denied (can't ask again) -> "Go to settings" alert
      // We don't need to show additional alerts here since they're handled in the service

      // Just log for debugging
      if (error.message?.includes('disabled') || error.message?.includes('services')) {
        console.log('📍 Location services disabled - alert already shown');
      } else if (error.message?.includes('denied') || error.message?.includes('settings')) {
        console.log('📍 Permission denied - settings alert already shown');
      } else {
        // Only show alert for unexpected errors
        Alert.alert(
          "Location Error",
          error.message || "Unable to get your location. Please try again.",
          [{ text: "OK" }]
        );
      }
    } finally {
      setIsRequestingLocation(false);
    }
  }, [refreshLocation]);

  const handleAzkarPress = useCallback(() => {
    router.push("/(adhkar)");
  }, [router]);

  const handleCounterPress = useCallback(() => {
    router.push("/(tasbih)");
  }, [router]);

  const handleStreakPress = useCallback(() => {
    router.push("/(adhkar)/streak-analytics");
  }, [router]);

  // No location saved - show permission request
  if (!savedLocation) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.todayText}>Today</Text>
            <Text style={styles.title}>Upcoming Solat</Text>
          </View>
        </View>

        <View style={styles.noLocationCard}>
          <View style={styles.noLocationContent}>
            <MaterialIcons
              name="location-off"
              size={48}
              color={theme.color.brand}
              style={styles.noLocationIcon}
            />
            <Text style={styles.noLocationTitle}>Enable Location</Text>
            <Text style={styles.noLocationSubtitle}>
              Allow location access to see your prayer times
            </Text>
          </View>

          <TouchableOpacity
            style={styles.allowButton}
            onPress={handleAllowLocation}
            disabled={isRequestingLocation}
          >
            {isRequestingLocation ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.allowButtonText}>Allow Location</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Loading initial prayer times
  if (loading && !nextPrayer) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.todayText}>{t("today")}</Text>
            <Text style={styles.title}>{t("upcomingSolat")}</Text>
          </View>
        </View>

        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={theme.color.brand} />
          <Text style={styles.loadingText}>Loading prayer times...</Text>
          {displayLocation && (
            <Text style={styles.loadingLocationText}>{displayLocation}</Text>
          )}
        </View>
      </View>
    );
  }

  // Error state
  if (error && !nextPrayer) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.todayText}>{t("today")}</Text>
            <Text style={styles.title}>{t("upcomingSolat")}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.errorCard}
          onPress={handleAllowLocation}
          activeOpacity={0.8}
          disabled={isRequestingLocation}
        >
          <MaterialIcons name="error-outline" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Unable to load prayer times</Text>
          <Text style={styles.errorSubtitle}>
            {error || "Please check your location settings"}
          </Text>
          {isRequestingLocation ? (
            <ActivityIndicator
              color={theme.color.brand}
              style={{ marginTop: 8 }}
            />
          ) : (
            <Text style={styles.errorRetry}>Tap to retry</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  // No prayer data available
  if (!nextPrayer) {
    return null;
  }

  // Success state - show prayer times
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.todayText}>{t("today")}</Text>
          <Text style={styles.title}>{t("upcomingSolat")}</Text>
        </View>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={styles.seeAllText}>{t("seeAll")}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardWrapper}>
        <TouchableOpacity
          style={styles.prayerCard}
          onPress={handlePrayerPress}
          activeOpacity={0.9}
        >
          <View style={styles.prayerContent}>
            <View style={styles.iconContainer}>
              <Image
                source={require("../../assets/images/pTime.png")}
                resizeMode="contain"
              />
            </View>

            <View style={styles.prayerInfo}>
              <Text style={styles.prayerTime}>
                {formatDate(nextPrayer.time)} • {formatTime(nextPrayer.time)}
              </Text>
              <Text style={styles.prayerName}>{nextPrayer.name} Prayer</Text>
              <View style={styles.locationContainer}>
                <MaterialIcons
                  name="location-on"
                  size={14}
                  color="rgba(255, 255, 255, 0.8)"
                />
                {displayLocation ? (
                  <Text style={styles.locationText} numberOfLines={1}>
                    {displayLocation}
                  </Text>
                ) : (
                  <View style={styles.locationLoadingContainer}>
                    <ActivityIndicator size="small" color="rgba(255, 255, 255, 0.8)" />
                    <Text style={styles.locationLoadingText}>Getting location...</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <QuickActions
          onQiblaPress={handleQiblaPress}
          onCounterPress={handleCounterPress}
          onAzkarPress={handleAzkarPress}
          onStreakPress={handleStreakPress}
          t={t}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  todayText: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: "#999",
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.font.bold,
    color: theme.color.secondary,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: theme.font.semiBold,
    color: theme.color.brand,
  },

  cardWrapper: {
    backgroundColor: theme.color.brand,
    borderRadius: 20,
    padding: 16,
    gap: 16,
  },

  prayerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prayerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  prayerInfo: {
    flex: 1,
  },
  prayerTime: {
    fontSize: 13,
    fontFamily: theme.font.regular,
    color: theme.color.white,
  },
  prayerName: {
    fontSize: 20,
    fontFamily: theme.font.bold,
    color: theme.color.white,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 13,
    fontFamily: theme.font.regular,
    color: "rgba(255, 255, 255, 0.8)",
    flex: 1,
  },
  locationLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationLoadingText: {
    fontSize: 12,
    fontFamily: theme.font.regular,
    color: "rgba(255, 255, 255, 0.6)",
    fontStyle: 'italic',
  },

  quickActionsBox: {
    backgroundColor: "#FFF4EA",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  actionIcon: {
    width: 25,
    height: 25,
  },
  actionText: {
    fontSize: 14,
    color: theme.color.brand,
    fontFamily: theme.font.semiBold,
  },

  separator: {
    width: 1,
    height: "100%",
    backgroundColor: "#CAAC8F",
  },

  noLocationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  noLocationContent: {
    alignItems: "center",
    gap: 12,
  },
  noLocationIcon: {
    marginBottom: 8,
  },
  noLocationTitle: {
    fontSize: 18,
    fontFamily: theme.font.bold,
    color: "#333",
  },
  noLocationSubtitle: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  allowButton: {
    backgroundColor: theme.color.brand,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  allowButtonText: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: "#FFFFFF",
  },

  loadingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: "#666",
  },
  loadingLocationText: {
    fontSize: 12,
    fontFamily: theme.font.regular,
    color: "#999",
    fontStyle: 'italic',
  },

  errorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  errorTitle: {
    fontSize: 16,
    fontFamily: theme.font.bold,
    color: "#333",
    textAlign: "center",
  },
  errorSubtitle: {
    fontSize: 13,
    fontFamily: theme.font.regular,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
  },
  errorRetry: {
    fontSize: 14,
    fontFamily: theme.font.semiBold,
    color: theme.color.brand,
    marginTop: 8,
  },
});