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
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { RefreshCcw } from "lucide-react-native";
import PrimaryButton from "@/components/primaryButton";

const { width } = Dimensions.get("window");
const COMPASS_SIZE = width * 0.6;

const Qibla = () => {
  // Wrap hook call in try-catch for extra safety
  let hookData;
  try {
    hookData = useQibla();
  } catch (error) {
    console.error("Failed to initialize useQibla hook:", error);
    // Return error state
    hookData = {
      rotation: 0,
      qiblaDirection: null,
      heading: 0,
      distanceToMecca: null,
      sensorAvailable: false,
      error: "Failed to initialize compass",
      needsCalibration: false,
      magneticFieldStrength: 0,
    };
  }

  const {
    rotation,
    qiblaDirection,
    heading,
    distanceToMecca,
    sensorAvailable,
    error,
    needsCalibration,
    magneticFieldStrength,
  } = hookData;

  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [hasShownAutoCalibration, setHasShownAutoCalibration] = useState(false);

  useEffect(() => {
    // Animate in when data is available
    try {
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
    } catch (animError) {
      console.error("Animation error:", animError);
      // Continue without animation
    }
  }, [qiblaDirection]);

  // Show error alert if sensor is not available
  useEffect(() => {
    try {
      if (sensorAvailable === false && error) {
        Alert.alert(
          "Compass Not Available",
          "Your device doesn't support compass functionality. The Qibla direction will be shown based on your location only.",
          [{ text: "OK" }]
        );
      }
    } catch (alertError) {
      console.error("Alert error:", alertError);
    }
  }, [sensorAvailable, error]);

  // Auto-detect calibration issues and show modal
  useEffect(() => {
    try {
      if (needsCalibration && !hasShownAutoCalibration && sensorAvailable) {
        setIsCalibrating(true);
        setHasShownAutoCalibration(true);

        const timer = setTimeout(() => {
          setHasShownAutoCalibration(false);
        }, 30000);

        return () => clearTimeout(timer);
      }
    } catch (calibrationError) {
      console.error("Calibration detection error:", calibrationError);
    }
  }, [needsCalibration, hasShownAutoCalibration, sensorAvailable]);

  // Safe number formatting
  const formatNumber = (num: number | null | undefined, decimals: number = 1): string => {
    try {
      if (num === null || num === undefined || isNaN(num)) return "—";
      return num.toFixed(decimals);
    } catch (error) {
      console.error("Number formatting error:", error);
      return "—";
    }
  };

  return (
    <>
      <ScreenContainer backgroundColor={theme.color.background}>
        <ScreenHeader
          title="Qibla Direction"
          headerStyle={{
            paddingHorizontal: 0,
          }}
          rightComponent={
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              {needsCalibration && sensorAvailable && (
                <Ionicons
                  name="warning"
                  size={24}
                  color="#FFA500"
                  style={{ marginRight: -4 }}
                />
              )}
              <Ionicons
                name="refresh"
                size={24}
                color={theme.color.brand}
                onPress={() => setIsCalibrating(true)}
              />
            </View>
          }
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
            }}
          />

          {/* Calibration Warning Banner */}
          {needsCalibration && sensorAvailable && !isCalibrating && (
            <View style={styles.calibrationBanner}>
              <Ionicons
                name="warning"
                size={20}
                color="#FFA500"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.calibrationBannerText}>
                Compass needs calibration for accurate readings
              </Text>
            </View>
          )}

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
                Your device doesn&apos;t support compass sensors. You can still see
                the Qibla direction based on your location.
              </Text>
            </View>
          )}

          {/* Main Content - Show if sensor available or at least direction calculated */}
          {qiblaDirection !== null && sensorAvailable !== false && (
            <Animated.View
              style={{
                transform: [{ rotate: `${rotation}deg` }],
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "hidden",
                width: 300,
                height: 300,
              }}
            >
              {/* KA'BAH as pin head */}
              <Text style={{ fontSize: 50 }}>🕋</Text>

              <Image
                style={{ width: COMPASS_SIZE, height: COMPASS_SIZE }}
                source={require("@/assets/compass.png")}
                resizeMode="contain"
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
                  {sensorAvailable ? `${formatNumber(heading)}°` : "—"}
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
                    ? `${formatNumber(qiblaDirection + 90)}°`
                    : "—"}
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
                  {distanceToMecca ? `${formatNumber(distanceToMecca, 0)} km` : "—"}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScreenContainer>

      <Modal
        visible={isCalibrating}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsCalibrating(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <RefreshCcw size={48} color={theme.color.brand} />

            <Text style={styles.modalTitle}>Compass Needs Calibration</Text>

            <Text style={styles.modalText}>
              Move your phone in a figure 8 motion to improve accuracy. This
              helps recalibrate the compass sensors for precise Qibla
              direction.
            </Text>

            {magneticFieldStrength > 0 && (
              <View style={styles.calibrationInfo}>
                <Text style={styles.calibrationInfoText}>
                  Field Strength: {formatNumber(magneticFieldStrength)} µT
                </Text>
                <Text style={styles.calibrationInfoSubtext}>
                  {magneticFieldStrength < 20 || magneticFieldStrength > 70
                    ? "⚠ Out of normal range (25-65 µT)"
                    : "✓ Within normal range"}
                </Text>
              </View>
            )}

            <PrimaryButton
              onPress={() => setIsCalibrating(false)}
              title="Done"
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "#1a19194d",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    gap: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    color: theme.color.text,
  },
  calibrationInfo: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    alignItems: "center",
  },
  calibrationInfoText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.color.text,
    marginBottom: 4,
  },
  calibrationInfoSubtext: {
    fontSize: 12,
    color: theme.color.gray,
    textAlign: "center",
  },
  calibrationBanner: {
    backgroundColor: "rgba(255, 165, 0, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 165, 0, 0.3)",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  calibrationBannerText: {
    flex: 1,
    fontSize: 14,
    color: theme.color.text,
    lineHeight: 18,
  },
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