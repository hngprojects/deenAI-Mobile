import { Magnetometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { useLocation } from "./useLocation";

// Mecca coordinates (Al-Masjid al-Haram)
const MECCA_LAT = 21.4225;
const MECCA_LNG = 39.8262;

// small calibration if your arrow graphic or device axes are rotated.
// try 0 first. If it reads 90 off, set to 90 or -90 until it matches.
const CALIBRATION_OFFSET = 90; // degrees

function getHeading({ x, y }: { x: number; y: number }) {
  // Primary attempt: atan2(y, x)
  let angle = Math.atan2(y, x) * (180 / Math.PI);
  if (isNaN(angle)) angle = 0;

  // Normalize to 0..360
  angle = (angle + 360) % 360;

  // If your device axes are swapped, try the alternate formula:
  // const alt = (Math.atan2(x, y) * (180 / Math.PI) + 360) % 360;
  // Use alt if primary seems 90 degrees off.

  return angle;
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

// Alternative method using more precise formula
const calculateQiblaDirectionAlt = (
  userLat: number,
  userLng: number
): number => {
  const φ1 = toRadians(userLat);
  const λ1 = toRadians(userLng);
  const φ2 = toRadians(MECCA_LAT);
  const λ2 = toRadians(MECCA_LNG);

  const Δλ = λ2 - λ1;

  const x = Math.cos(φ2) * Math.sin(Δλ);
  const y =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  let bearing = Math.atan2(x, y);
  bearing = toDegrees(bearing);

  return (bearing + 360) % 360;
};

export function useQibla() {
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [distanceToMecca, setDistanceToMecca] = useState<number | null>(null);
  const { location } = useLocation();

  useEffect(() => {
    const subscription = Magnetometer.addListener((data) => {
      setHeading(getHeading(data));
    });
    Magnetometer.setUpdateInterval(10);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      if (!isValidCoordinates(location.latitude, location.longitude)) {
        console.error("Invalid coordinates received");
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

        console.log("📍 Location:", {
          lat: location.latitude.toFixed(4),
          lng: location.longitude.toFixed(4),
        });
        console.log("🕋 Qibla:", direction.toFixed(2) + "°");
        console.log("📏 Distance:", distance.toFixed(0) + " km");
      } catch (error) {
        console.error("Error in Qibla calculation:", error);
      }
    }
  }, [location]);

  const rotation =
    qiblaDirection !== null ? -((qiblaDirection - heading + 180) % 360) : 0;

  return {
    heading,
    qiblaDirection,
    rotation,
    distanceToMecca,
    meccaCoordinates: { lat: MECCA_LAT, lng: MECCA_LNG },
  };
}
