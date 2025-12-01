import { Magnetometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useLocation } from "./useLocation";

// Mecca coordinates (Al-Masjid al-Haram)
const MECCA_LAT = 21.4225;
const MECCA_LNG = 39.8262;

// small calibration if your arrow graphic or device axes are rotated.
// try 0 first. If it reads 90 off, set to 90 or -90 until it matches.
const CALIBRATION_OFFSET = 90; // degrees

function getHeading({ x, y }: { x: number; y: number }) {
  try {
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
const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

// Convert radians to degrees
const toDegrees = (radians: number): number => radians * (180 / Math.PI);

// Calculate Qibla direction using spherical trigonometry
const calculateQiblaDirection = (userLat: number, userLng: number): number => {
  const φ1 = toRadians(userLat);
  const λ1 = toRadians(userLng);
  const φ2 = toRadians(MECCA_LAT);
  const λ2 = toRadians(MECCA_LNG);

  // Calculate the difference in longitude
  const Δλ = λ2 - λ1;

  // Calculate the bearing using the formula:
  const y = Math.sin(Δλ);
  const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);

  let bearing = Math.atan2(y, x);
  bearing = toDegrees(bearing);

  // Normalize to 0-360 degrees
  return ((bearing + 360) % 360) - CALIBRATION_OFFSET;
};

// Calculate distance to Mecca using Haversine formula
const calculateDistanceToMecca = (userLat: number, userLng: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const φ1 = toRadians(userLat);
  const φ2 = toRadians(MECCA_LAT);
  const Δφ = toRadians(MECCA_LAT - userLat);
  const Δλ = toRadians(MECCA_LNG - userLng);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};

// Validate if coordinates are reasonable
const isValidCoordinates = (lat: number, lng: number): boolean => {
  return (
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
  // Calculate magnetic field strength (magnitude)
  const fieldStrength = Math.sqrt(
    magneticData.x ** 2 + magneticData.y ** 2 + magneticData.z ** 2
  );

  // Expected Earth's magnetic field: 25-65 µT (microtesla)
  // If field strength is way off, magnetometer needs calibration
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
      // Handle 360° wraparound (e.g., 359° to 1° should be 2°, not 358°)
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
};

export function useQibla() {
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [distanceToMecca, setDistanceToMecca] = useState<number | null>(null);
  const [sensorAvailable, setSensorAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsCalibration, setNeedsCalibration] = useState(false);
  const { location } = useLocation();

  // Calibration detection state
  const [previousReadings, setPreviousReadings] = useState<number[]>([]);
  const [magneticFieldStrength, setMagneticFieldStrength] = useState<number>(0);

  // Check magnetometer availability and subscribe
  useEffect(() => {
    let subscription: any = null;
    let isMounted = true;

    const setupMagnetometer = async () => {
      try {
        // Check if magnetometer is available
        const isAvailable = await Magnetometer.isAvailableAsync();

        if (!isMounted) return;

        if (!isAvailable) {
          console.warn("Magnetometer not available on this device");
          setSensorAvailable(false);
          setError("Compass sensor not available on this device");
          return;
        }

        setSensorAvailable(true);

        // Subscribe to magnetometer updates
        subscription = Magnetometer.addListener((data) => {
          if (isMounted) {
            const calculatedHeading = getHeading(data);
            setHeading(calculatedHeading);

            // Detect calibration issues
            setPreviousReadings((prev) => {
              const newReadings = [...prev, calculatedHeading];
              // Keep only last 10 readings for efficiency
              if (newReadings.length > 10) {
                newReadings.shift();
              }
              return newReadings;
            });

            // Check if calibration is needed
            const { needsCalibration: calibrationNeeded, fieldStrength } =
              detectCalibrationNeeded(data, previousReadings);

            setMagneticFieldStrength(fieldStrength);

            // Only trigger calibration warning if we have enough data
            if (previousReadings.length >= 5) {
              setNeedsCalibration(calibrationNeeded);
            }
          }
        });

        // Set update interval (100ms = 10Hz)
        Magnetometer.setUpdateInterval(100);

        console.log("✅ Magnetometer initialized successfully");
      } catch (err) {
        console.error("Error setting up magnetometer:", err);
        if (isMounted) {
          setSensorAvailable(false);
          setError("Failed to access compass sensor");
        }
      }
    };

    setupMagnetometer();

    // Cleanup function
    return () => {
      isMounted = false;
      if (subscription) {
        try {
          subscription.remove();
          console.log("🧹 Magnetometer subscription cleaned up");
        } catch (err) {
          console.error("Error removing magnetometer subscription:", err);
        }
      }
    };
  }, []);

  // Calculate Qibla direction when location changes
  useEffect(() => {
    if (!location?.latitude || !location?.longitude) {
      return;
    }

    if (!isValidCoordinates(location.latitude, location.longitude)) {
      console.error("Invalid coordinates received:", location);
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

      // Validate calculated values
      if (isNaN(direction) || isNaN(distance)) {
        console.error("Invalid Qibla calculation result");
        setError("Failed to calculate Qibla direction");
        return;
      }

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
      console.error("Error in Qibla calculation:", err);
      setError("Failed to calculate Qibla direction");
    }
  }, [location]);

  // Calculate rotation for compass needle
  const rotation =
    qiblaDirection !== null && sensorAvailable
      ? -((qiblaDirection - heading + 180) % 360)
      : 0;

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
