import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { useQibla } from "@/hooks/useQibla";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
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
  const { rotation, qiblaDirection, heading, distanceToMecca } = useQibla();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  // const [isCalibrating, setIsCalibrating] = useState(false);

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

  // const handleCalibrate = () => {
  //   setIsCalibrating(true);
  //   // Simulate calibration process
  //   setTimeout(() => setIsCalibrating(false), 2000);
  // };

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

        {/* Main Content */}

        {qiblaDirection && (
          <Animated.View
            style={{
              transform: [{ rotate: `${-rotation}deg` }],
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              animationTimingFunction: "ease-in-out",
              transformOrigin: "center",
              transitionDuration: "1s",
              // backgroundColor: "red",
              overflow: "hidden",
              width: 300,
              height: 300,
            }}
          >
            {/* KA"BAH as pin head */}
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
        {qiblaDirection === null && (
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

      {qiblaDirection && (
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
                {heading?.toFixed(1) || "0"}°
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
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 30,
  },
  compassSection: {
    alignItems: "center",
  },
  orientationIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  orientationText: {
    color: theme.color.brand,
    fontSize: 12,
    marginLeft: 8,
    fontWeight: "500",
  },
  compassWrapper: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  compassOuterRing: {
    position: "absolute",
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    opacity: 0.1,
  },
  compassBase: {
    width: COMPASS_SIZE * 0.9,
    height: COMPASS_SIZE * 0.9,
    borderRadius: (COMPASS_SIZE * 0.9) / 2,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  compassRose: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  compassMarker: {
    position: "absolute",
    top: 0,
    left: "50%",
    width: 2,
    height: "100%",
    marginLeft: -1,
    alignItems: "center",
  },
  markerLine: {
    width: 2,
    height: 20,
    backgroundColor: theme.color.brand,
    opacity: 0.6,
  },
  markerLineLong: {
    height: 30,
    opacity: 1,
  },
  directionLabel: {
    position: "absolute",
    top: 35,
    color: theme.color.brand,
    fontSize: 16,
    fontWeight: "bold",
  },
  qiblaIndicatorContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  qiblaIndicator: {
    position: "absolute",
    top: 20,
    alignItems: "center",
  },
  qiblaArrow: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  kaabaEmoji: {
    fontSize: 24,
  },
  qiblaLabel: {
    color: "#e74c3c",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
  phoneIndicator: {
    position: "absolute",
    top: 10,
    alignItems: "center",
  },
  phoneDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  phoneLabel: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 4,
  },
  centerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  centerDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  calibrationSection: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  calibrateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.color.brand,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 10,
  },
  calibrateButtonActive: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  calibrateText: {
    color: theme.color.background,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  calibrateTextActive: {
    color: theme.color.brand,
  },
  calibrationHint: {
    color: theme.color.gray,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
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
});

export default Qibla;
