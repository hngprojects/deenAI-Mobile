import { Magnetometer } from "expo-sensors";
import { useEffect, useState, useRef, useCallback } from "react";
import { Platform } from "react-native";
import { useLocation } from "./useLocation";

// Mecca coordinates (Al-Masjid al-Haram)
const MECCA_LAT = 21.4225;
const MECCA_LNG = 39.8262;

// Calibration offset for device orientation
const CALIBRATION_OFFSET = 90; // degrees

function getHeading({ x, y }: { x: number; y: number }) {
  try {
    // Validate inputs
    if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
      console.warn("Invalid magnetometer values:", { x, y });
      return 0;
    }

    // Primary attempt: atan2(y, x)
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    if (isNaN(angle)) angle = 0;

    // Normalize to 0..360
    angle = (angle + 360) % 360;

    return angle;
  } catch (error) {
    console.error("Error calculating heading:", error);
    return 0;
  }
}

// Convert degrees to radians
const toRadians = (degrees: number): number => {
  try {
    if (typeof degrees !== 'number' || isNaN(degrees)) return 0;
    return degrees * (Math.PI / 180);
  } catch (error) {
    console.error("Error in toRadians:", error);
    return 0;
  }
};

// Convert radians to degrees
const toDegrees = (radians: number): number => {
  try {
    if (typeof radians !== 'number' || isNaN(radians)) return 0;
    return radians * (180 / Math.PI);
  } catch (error) {
    console.error("Error in toDegrees:", error);
    return 0;
  }
};

// Calculate Qibla direction using spherical trigonometry
const calculateQiblaDirection = (userLat: number, userLng: number): number => {
  try {
    // Validate inputs
    if (!isValidCoordinates(userLat, userLng)) {
      throw new Error("Invalid coordinates for Qibla calculation");
    }

    const φ1 = toRadians(userLat);
    const λ1 = toRadians(userLng);
    const φ2 = toRadians(MECCA_LAT);
    const λ2 = toRadians(MECCA_LNG);

    // Calculate the difference in longitude
    const Δλ = λ2 - λ1;

    // Calculate the bearing using the formula
    const y = Math.sin(Δλ);
    const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);

    let bearing = Math.atan2(y, x);
    bearing = toDegrees(bearing);

    // Normalize to 0-360 degrees
    const result = ((bearing + 360) % 360) - CALIBRATION_OFFSET;

    if (isNaN(result)) {
      throw new Error("Qibla calculation resulted in NaN");
    }

    return result;
  } catch (error) {
    console.error("Error in calculateQiblaDirection:", error);
    throw error;
  }
};

// Calculate distance to Mecca using Haversine formula
const calculateDistanceToMecca = (userLat: number, userLng: number): number => {
  try {
    // Validate inputs
    if (!isValidCoordinates(userLat, userLng)) {
      throw new Error("Invalid coordinates for distance calculation");
    }

    const R = 6371; // Earth's radius in kilometers
    const φ1 = toRadians(userLat);
    const φ2 = toRadians(MECCA_LAT);
    const Δφ = toRadians(MECCA_LAT - userLat);
    const Δλ = toRadians(MECCA_LNG - userLng);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const result = R * c;

    if (isNaN(result)) {
      throw new Error("Distance calculation resulted in NaN");
    }

    return result;
  } catch (error) {
    console.error("Error in calculateDistanceToMecca:", error);
    throw error;
  }
};

// Validate if coordinates are reasonable
const isValidCoordinates = (lat: number, lng: number): boolean => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !isNaN(lat) &&
    !isNaN(lng)
  );
};

// Detect if compass needs calibration based on sensor readings
const detectCalibrationNeeded = (
  magneticData: { x: number; y: number; z: number },
  previousReadings: number[]
): { needsCalibration: boolean; fieldStrength: number } => {
  try {
    // Validate input
    if (!magneticData || typeof magneticData.x !== 'number' ||
        typeof magneticData.y !== 'number' || typeof magneticData.z !== 'number') {
      return { needsCalibration: false, fieldStrength: 0 };
    }

    // Calculate magnetic field strength (magnitude)
    const fieldStrength = Math.sqrt(
      magneticData.x ** 2 + magneticData.y ** 2 + magneticData.z ** 2
    );

    if (isNaN(fieldStrength)) {
      return { needsCalibration: false, fieldStrength: 0 };
    }

    // Expected Earth's magnetic field: 25-65 µT (microtesla)
    const FIELD_MIN = 20; // µT
    const FIELD_MAX = 70; // µT
    const fieldOutOfRange =
      fieldStrength < FIELD_MIN || fieldStrength > FIELD_MAX;

    // Check for erratic readings (heading jumping around rapidly)
    let erraticReadings = false;
    if (previousReadings.length >= 5) {
      const recentReadings = previousReadings.slice(-5);
      const differences = [];

      for (let i = 1; i < recentReadings.length; i++) {
        let diff = Math.abs(recentReadings[i] - recentReadings[i - 1]);
        // Handle 360° wraparound
        if (diff > 180) {
          diff = 360 - diff;
        }
        differences.push(diff);
      }

      // If average change is more than 30° per reading, it's erratic
      const avgChange =
        differences.reduce((a, b) => a + b, 0) / differences.length;
      erraticReadings = avgChange > 30;
    }

    return {
      needsCalibration: fieldOutOfRange || erraticReadings,
      fieldStrength,
    };
  } catch (error) {
    console.error("Error in detectCalibrationNeeded:", error);
    return { needsCalibration: false, fieldStrength: 0 };
  }
};

export function useQibla() {
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [distanceToMecca, setDistanceToMecca] = useState<number | null>(null);
  const [sensorAvailable, setSensorAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsCalibration, setNeedsCalibration] = useState(false);
  const [magneticFieldStrength, setMagneticFieldStrength] = useState<number>(0);
  const { location } = useLocation();

  // Use useRef to store readings - prevents stale closure issues
  const previousReadingsRef = useRef<number[]>([]);
  const isMountedRef = useRef(true);
  const subscriptionRef = useRef<any>(null);
  const setupAttemptedRef = useRef(false);

  // Memoized cleanup function
  const cleanupMagnetometer = useCallback(() => {
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
        console.log("🧹 Magnetometer subscription cleaned up");
      } catch (err) {
        console.error("Error removing magnetometer subscription:", err);
      }
    }
  }, []);

  // Check magnetometer availability and subscribe
  useEffect(() => {
    isMountedRef.current = true;
    let setupTimeout: NodeJS.Timeout;

    const setupMagnetometer = async () => {
      // Prevent multiple setup attempts
      if (setupAttemptedRef.current) {
        console.log("⏭️ Magnetometer setup already attempted, skipping...");
        return;
      }
      setupAttemptedRef.current = true;

      try {
        console.log("🧭 Initializing magnetometer...");
        console.log("📱 Platform:", Platform.OS);
        console.log("🔧 __DEV__:", __DEV__);

        // Add timeout for sensor availability check (production safety)
        const checkAvailability = async (): Promise<boolean> => {
          try {
            const result = await Promise.race([
              Magnetometer.isAvailableAsync(),
              new Promise<boolean>((resolve) =>
                setTimeout(() => resolve(false), 3000)
              )
            ]);
            return result;
          } catch (err) {
            console.error("Error checking magnetometer availability:", err);
            return false;
          }
        };

        const isAvailable = await checkAvailability();

        if (!isMountedRef.current) return;

        if (!isAvailable) {
          console.warn("⚠️ Magnetometer not available on this device");
          setSensorAvailable(false);
          setError("Compass sensor not available on this device");
          return;
        }

        console.log("✅ Magnetometer is available");
        setSensorAvailable(true);

        // Set update interval BEFORE subscribing
        try {
          Magnetometer.setUpdateInterval(100);
        } catch (err) {
          console.warn("Warning setting update interval:", err);
          // Continue anyway, use default interval
        }

        // Subscribe to magnetometer updates with error handling
        subscriptionRef.current = Magnetometer.addListener((data) => {
          try {
            if (!isMountedRef.current) return;

            // Validate magnetometer data
            if (!data || typeof data.x !== 'number' ||
                typeof data.y !== 'number' || typeof data.z !== 'number') {
              console.warn("Invalid magnetometer data received:", data);
              return;
            }

            // Additional validation for extreme values
            if (Math.abs(data.x) > 1000 || Math.abs(data.y) > 1000 || Math.abs(data.z) > 1000) {
              console.warn("Extreme magnetometer values detected:", data);
              return;
            }

            const calculatedHeading = getHeading(data);

            // Validate calculated heading
            if (typeof calculatedHeading !== 'number' || isNaN(calculatedHeading)) {
              console.warn("Invalid heading calculated:", calculatedHeading);
              return;
            }

            setHeading(calculatedHeading);

            // Update readings using ref (prevents re-render and stale closures)
            const currentReadings = [...previousReadingsRef.current, calculatedHeading];
            if (currentReadings.length > 10) {
              currentReadings.shift();
            }
            previousReadingsRef.current = currentReadings;

            // Check calibration status
            const { needsCalibration: calibrationNeeded, fieldStrength } =
              detectCalibrationNeeded(data, previousReadingsRef.current);

            setMagneticFieldStrength(fieldStrength);

            // Only trigger calibration warning if we have enough data
            if (previousReadingsRef.current.length >= 5) {
              setNeedsCalibration(calibrationNeeded);
            }
          } catch (listenerError) {
            console.error("Error in magnetometer listener:", listenerError);
            // Don't crash the app, just log the error
          }
        });

        console.log("✅ Magnetometer initialized successfully");
      } catch (err) {
        console.error("❌ Error setting up magnetometer:", err);
        if (isMountedRef.current) {
          setSensorAvailable(false);
          setError("Failed to access compass sensor");
        }
      }
    };

    // Small delay to ensure component is fully mounted
    setupTimeout = setTimeout(() => {
      setupMagnetometer();
    }, 100);

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      setupAttemptedRef.current = false;
      clearTimeout(setupTimeout);
      cleanupMagnetometer();
    };
  }, [cleanupMagnetometer]);

  // Calculate Qibla direction when location changes
  useEffect(() => {
    if (!location?.latitude || !location?.longitude) {
      console.log("⏳ Waiting for location...");
      return;
    }

    if (!isValidCoordinates(location.latitude, location.longitude)) {
      console.error("❌ Invalid coordinates received:", location);
      setError("Invalid location coordinates");
      return;
    }

    try {
      const direction = calculateQiblaDirection(
        location.latitude,
        location.longitude
      );
      const distance = calculateDistanceToMecca(
        location.latitude,
        location.longitude
      );

      setQiblaDirection(direction);
      setDistanceToMecca(distance);
      setError(null);

      console.log("📍 Location:", {
        lat: location.latitude.toFixed(4),
        lng: location.longitude.toFixed(4),
      });
      console.log("🕋 Qibla:", direction.toFixed(2) + "°");
      console.log("📏 Distance:", distance.toFixed(0) + " km");
    } catch (err) {
      console.error("❌ Error in Qibla calculation:", err);
      setError("Failed to calculate Qibla direction");
      // Set fallback values so UI doesn't crash
      setQiblaDirection(0);
      setDistanceToMecca(0);
    }
  }, [location]);

  // Calculate rotation for compass needle with safety checks
  const rotation = (() => {
    try {
      if (qiblaDirection === null || !sensorAvailable) return 0;
      const calc = -((qiblaDirection - heading + 180) % 360);
      return isNaN(calc) ? 0 : calc;
    } catch (err) {
      console.error("Error calculating rotation:", err);
      return 0;
    }
  })();

  return {
    heading,
    qiblaDirection,
    rotation,
    distanceToMecca,
    sensorAvailable,
    error,
    needsCalibration,
    magneticFieldStrength,
    meccaCoordinates: { lat: MECCA_LAT, lng: MECCA_LNG },
  };
}