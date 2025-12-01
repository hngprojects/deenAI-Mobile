// components/UpcomingSolatCard.tsx
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
// import { usePrayerTimes } from "@/hooks/usePrayerTimes";

interface UpcomingSolatCardProps {
  prayerName: string;
  prayerTime: Date;
  formattedDate: string;
  formattedTime: string;
  locationName: string;
}

export default function UpcomingSolatCard({
  prayerName,
  formattedDate,
  formattedTime,
  locationName,
}: UpcomingSolatCardProps) {
  // const { savedLocation } = usePrayerTimes();

  // Helper to check if location is valid and add source label
  const getLocationDisplay = () => {
    // Check if location is invalid or placeholder
    if (!locationName ||
        locationName === 'Location...' ||
        locationName === 'Unknown Location' ||
        locationName.trim() === '') {
      return null; // Will show loading state
    }

    // Add source label (+user or +emulator) if savedLocation exists
    // if (savedLocation) {
    //   const label = savedLocation.source === 'emulator' ? '+emulator' : '+user';
    //   return `${locationName} ${label}`;
    // }

    // Fallback: return just the location name if no savedLocation
    return locationName;
  };

  const displayLocation = getLocationDisplay();

  return (
    <View style={styles.upcomingContainer}>
      <Text style={styles.upcomingTitle}>Upcoming Solat</Text>
      <View style={styles.upcomingCard}>
        <View style={styles.iconContainer}>
          <Image
            source={require("../assets/images/pTime.png")}
            resizeMode="contain"
          />
        </View>
        <View style={styles.upcomingInfo}>
          <Text style={styles.upcomingDate}>
            {formattedDate} • {formattedTime}
          </Text>
          <Text style={styles.upcomingPrayer}>{prayerName} Prayer</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#FFFFFF" />
            {displayLocation ? (
              <Text style={styles.locationText} numberOfLines={1}>
                {displayLocation}
              </Text>
            ) : (
              <View style={styles.locationLoading}>
                <ActivityIndicator
                  size="small"
                  color="rgba(255, 255, 255, 0.8)"
                />
                <Text style={styles.locationLoadingText}>
                  Getting location...
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  upcomingContainer: {
    paddingHorizontal: 20,
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    fontFamily: theme.font.semiBold,
  },
  upcomingCard: {
    backgroundColor: theme.color.brand,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingDate: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.9,
    fontFamily: theme.font.regular,
  },
  upcomingPrayer: {
    fontSize: 20,
    fontFamily: theme.font.bold,
    color: "#FFFFFF",
    marginBottom: 3,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 4,
    fontFamily: theme.font.regular,
  },
  locationLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 4,
  },
  locationLoadingText: {
    fontSize: 12,
    fontFamily: theme.font.regular,
    color: "rgba(255, 255, 255, 0.8)",
    fontStyle: 'italic',
  },
});