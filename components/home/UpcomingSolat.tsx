import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { theme } from "@/styles/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UpcomingSolat() {
  const router = useRouter();
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

  const handleSeeAll = () => {
    router.push("/(prayer-times)/prayerTimes");
  };

  const handlePrayerPress = () => {
    router.push("/(prayer-times)/prayerTimes");
  };

  const handleAllowLocation = async () => {
    setIsRequestingLocation(true);
    try {
      await refreshLocation();
    } catch (error) {
      console.error("Error requesting location:", error);
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const handleAzkarPress = () => {
    router.push("/(adhkar)");
  };

   const handleCounterPress = () => {
    router.push("/(tasbih)");
  };

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

  if (loading && !nextPrayer) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.todayText}>Today</Text>
            <Text style={styles.title}>Upcoming Solat</Text>
          </View>
        </View>

        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={theme.color.brand} />
          <Text style={styles.loadingText}>Loading prayer times...</Text>
        </View>
      </View>
    );
  }

  if (error && !nextPrayer) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.todayText}>Today</Text>
            <Text style={styles.title}>Upcoming Solat</Text>
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

  if (!nextPrayer) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.todayText}>Today</Text>
          <Text style={styles.title}>Upcoming Solat</Text>
        </View>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={styles.seeAllText}>See all</Text>
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
                <Text style={styles.locationText}>
                  {locationName || "Unknown Location"}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Actions Box */}
        <View style={styles.quickActionsBox}>
          <TouchableOpacity style={styles.actionItem}>
            <Image
              source={require("../../assets/images/clarity_compass-line.png")}
              style={styles.actionIcon}
              resizeMode="contain"
            />
            <Text style={styles.actionText}>Qibla</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.actionItem}
            onPress={handleCounterPress}
          >
            <Image
              source={require("../../assets/images/tasbeeh.png")}
              style={styles.actionIcon}
              resizeMode="contain"
            />
            <Text style={styles.actionText}>Counter</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleAzkarPress}
          >
            <Image
              source={require("../../assets/images/adhkarr.png")}
              style={styles.actionIcon}
              resizeMode="contain"
            />
            <Text style={styles.actionText}>Azkar</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.actionItem}>
            <Image
              source={require("../../assets/images/streaks.png")}
              style={styles.actionIcon}
              resizeMode="contain"
            />
            <Text style={styles.actionText}>Streaks</Text>
          </TouchableOpacity>
        </View>
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
    height: '100%',
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
    gap: 16,
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
