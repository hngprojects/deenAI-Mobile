import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { useQibla } from "@/hooks/useQibla";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const COMPASS_SIZE = width * 0.6;

const Qibla = () => {
  const {
    rotation,
    qiblaDirection,
    heading,
    distanceToMecca,
    sensorAvailable,
    error
  } = useQibla();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Animate in when data is available
    if (qiblaDirection !== null) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [qiblaDirection]);

  // Show error alert if sensor is not available
  useEffect(() => {
    if (sensorAvailable === false) {
      Alert.alert(
        "Compass Not Available",
        "Your device doesn't support compass functionality. The Qibla direction will be shown based on your location only.",
        [{ text: "OK" }]
      );
    }
  }, [sensorAvailable]);

  return (
    <ScreenContainer backgroundColor={theme.color.background}>
      <ScreenHeader
        title="Qibla Direction"
        headerStyle={{
          paddingHorizontal: 0,
        }}
      />

      <View style={styles.container}>
        <LinearGradient
          colors={[theme.color.gradientStart, theme.color.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 15,
            width: 15,
            borderRadius: 100000,
            animationDuration: "2s",
          }}
        />

        {error && sensorAvailable === false && (
          <View style={styles.errorContainer}>
            <Ionicons
              name="warning-outline"
              size={60}
              color={theme.color.brand}
              style={styles.errorIcon}
            />
            <Text style={styles.errorText}>Compass Not Available</Text>
            <Text style={styles.errorSubtext}>
              Your device doesn't support compass sensors. You can still see the Qibla direction based on your location.
            </Text>
          </View>
        )}

        {/* Main Content - Show if sensor available or at least direction calculated */}
        {qiblaDirection !== null && sensorAvailable !== false && (
          <Animated.View
            style={{
              transform: [{ rotate: `${-rotation}deg` }],
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              animationTimingFunction: "ease-in-out",
              transformOrigin: "center",
              transitionDuration: "1s",
              overflow: "hidden",
              width: 300,
              height: 300,
            }}
          >
            {/* KA'BAH as pin head */}
            <Text
              style={{
                fontSize: 50,
              }}
            >
              🕋
            </Text>

            <Image
              style={{ width: COMPASS_SIZE, height: COMPASS_SIZE }}
              source={require("@/assets/compass.png")}
            />
          </Animated.View>
        )}

        {/* Loading State */}
        {qiblaDirection === null && !error && sensorAvailable !== false && (
          <View style={styles.loadingContainer}>
            <Ionicons
              name="compass"
              size={60}
              color={theme.color.brand}
              style={styles.loadingIcon}
            />
            <Text style={styles.loadingText}>Finding Qibla Direction...</Text>
            <Text style={styles.loadingSubtext}>
              Ensuring accurate location and compass data
            </Text>
          </View>
        )}
      </View>

      {/* Metadata below compass */}
      {qiblaDirection !== null && (
        <View style={styles.infoPanel}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons
                name="compass-outline"
                size={20}
                color={theme.color.brand}
              />
              <Text style={styles.infoLabel}>Heading</Text>
              <Text style={styles.infoValue}>
                {sensorAvailable ? `${heading?.toFixed(1) || "0"}°` : "—"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons
                name="navigate-outline"
                size={20}
                color={theme.color.brand}
              />
              <Text style={styles.infoLabel}>Qibla</Text>
              <Text style={styles.infoValue}>
                {qiblaDirection !== null
                  ? (qiblaDirection + 90).toFixed(1)
                  : "—"}
                °
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons
                name="location-outline"
                size={20}
                color={theme.color.brand}
              />
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>
                {distanceToMecca ? `${distanceToMecca.toFixed(0)} km` : "—"}
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  infoPanel: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    alignItems: "center",
    flex: 1,
  },
  infoLabel: {
    color: theme.color.text,
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    color: theme.color.text,
    fontSize: 18,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  loadingIcon: {
    opacity: 0.7,
    marginBottom: 20,
  },
  loadingText: {
    color: theme.color.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  loadingSubtext: {
    color: theme.color.gray,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
    paddingHorizontal: 40,
  },
  errorIcon: {
    opacity: 0.7,
    marginBottom: 20,
  },
  errorText: {
    color: theme.color.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  errorSubtext: {
    color: theme.color.gray,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default Qibla;