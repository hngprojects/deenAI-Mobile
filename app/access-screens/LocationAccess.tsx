import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {  View,  Text,   StyleSheet,   ScrollView,   TouchableOpacity,  Alert,  Platform,  Linking, ActivityIndicator} from "react-native";
import { ArrowLeft, MapPin, Navigation } from "lucide-react-native";
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PrimaryButton from "@/components/primaryButton";
import PrimaryButton2 from "@/components/primaryButton2";

// Type definitions for location data
interface LocationData {
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

// AsyncStorage keys
const STORAGE_KEYS = {
  USER_LOCATION: 'userLocation',
  PERMISSION_DECLINED: 'locationPermissionDeclined',
  PERMISSION_ASKED: 'locationPermissionAsked',
};

export default function LocationPermissionScreen({ onNext }: { onNext: () => void }) {
  const router = useRouter();
  
  // State management
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('undetermined');
  const [hasLocationServices, setHasLocationServices] = useState(true);

  // Generate static map image URL
//   const getMapImageUrl = (lat?: number, lon?: number) => {
//     const latitude = lat || 37.7749;
//     const longitude = lon || -122.4194;
//     const zoom = lat ? 13 : 10;
//     const size = '600x400';
    
//     // Using OpenStreetMap static map service (free, no API key needed)
//     return `https://www.mapquestapi.com/staticmap/v5/map?key=YOUR_KEY_HERE&center=${latitude},${longitude}&size=${size}&zoom=${zoom}&type=map&locations=${latitude},${longitude}|marker-sm-616161`;
//   };

  // Initialize location services and check permissions
  const initializeLocation = async () => {
    try {
      // Check if location services are enabled
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      setHasLocationServices(servicesEnabled);

      if (!servicesEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings to use this feature.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openDeviceSettings }
          ]
        );
        return;
      }

      // Check current permission status
      const { status } = await Location.getForegroundPermissionsAsync();
      setPermissionStatus(status);
      
      // If already granted, get location
      if (status === 'granted') {
        await loadStoredLocationOrFetch();
      } else {
        // Load any previously stored location
        await loadStoredLocation();
      }
    } catch (error) {
      console.error('Error initializing location:', error);
    }
  };

  // Check permission status and location services on mount
  useEffect(() => {
    initializeLocation();
  }, [initializeLocation]);


  // Load location from storage or fetch new one
  const loadStoredLocationOrFetch = async () => {
    const stored = await loadStoredLocation();
    
    // If no stored location or it's old (> 1 hour), fetch new one
    if (!stored || Date.now() - stored.timestamp > 3600000) {
      await getCurrentLocation();
    }
  };

  // Load stored location from AsyncStorage
  const loadStoredLocation = async (): Promise<LocationData | null> => {
    try {
      const storedLocation = await AsyncStorage.getItem(STORAGE_KEYS.USER_LOCATION);
      if (storedLocation) {
        const parsed = JSON.parse(storedLocation);
        setLocationData(parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading stored location:', error);
    }
    return null;
  };

  // Save location to AsyncStorage
  const saveLocationToStorage = async (location: LocationData) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_LOCATION, 
        JSON.stringify(location)
      );
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  // Open device settings
  const openDeviceSettings = async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      console.error('Error opening settings:', error);
      Alert.alert('Error', 'Unable to open settings. Please open settings manually.');
    }
  };

  // Request location permission and get current location
  const handleAllowLocation = async () => {
    try {
      setIsLoading(true);

      // Check if location services are enabled first
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openDeviceSettings }
          ]
        );
        setIsLoading(false);
        return;
      }

      // Mark that we've asked for permission
      await AsyncStorage.setItem(STORAGE_KEYS.PERMISSION_ASKED, 'true');

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status === 'granted') {
        await getCurrentLocation();
        
        // Navigate to next screen after successful permission
        setTimeout(() => {
          if (onNext) {
            onNext();
          } else {
            router.push("/access-screens/NotificationsAccess");
          }
        }, 500); // Small delay to show the location data
      } else if (status === 'denied') {
        // Check if user has permanently denied permission
        const canAskAgain = await Location.getForegroundPermissionsAsync();
        
        Alert.alert(
          'Permission Denied',
          canAskAgain.canAskAgain 
            ? 'Location permission is required to get accurate prayer times. Please allow location access.'
            : 'Location permission was denied. You can enable it in your device settings to get accurate prayer times.',
          [
            { text: 'Continue Without', onPress: handleDontAllow, style: 'cancel' },
            { 
              text: canAskAgain.canAskAgain ? 'Try Again' : 'Open Settings', 
              onPress: canAskAgain.canAskAgain ? handleAllowLocation : openDeviceSettings
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      Alert.alert('Error', 'Failed to request location permission. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get current location and reverse geocode
  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);

      // Get current position with high accuracy and timeout
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 1,
      }).catch(async () => {
        // Fallback to balanced accuracy if high accuracy fails
        return await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      });

      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        
        const locationData: LocationData = {
          city: address.city || address.subregion || 'Unknown City',
          region: address.region || address.district || '',
          country: address.country || '',
          latitude,
          longitude,
          timestamp: Date.now(),
        };

        setLocationData(locationData);
        
        // Save to AsyncStorage
        await saveLocationToStorage(locationData);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      
      Alert.alert(
        'Location Error',
        'Unable to retrieve your location. Please check:\n\n• Location services are enabled\n• You have good GPS signal\n• App has location permission',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: getCurrentLocation },
          { text: 'Settings', onPress: openDeviceSettings }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle "Don't Allow" - skip to next screen
  const handleDontAllow = async () => {
    try {
      // Store that user declined permission
      await AsyncStorage.setItem(STORAGE_KEYS.PERMISSION_DECLINED, 'true');
      
      if (onNext) {
        onNext();
      } else {
        router.push("/login/Login");
      }
    } catch (error) {
      console.error('Error saving declined status:', error);
      // Continue anyway
      if (onNext) {
        onNext();
      } else {
        router.push("/login/Login");
      }
    }
  };

  // Retry getting location if permission is already granted
  const handleRefreshLocation = async () => {
    if (permissionStatus === 'granted') {
      await getCurrentLocation();
    } else {
      await handleAllowLocation();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backBtn}
        disabled={isLoading}
      >
        <ArrowLeft color="#1f2937" />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconWrapper}>
     
            <MapPin size={42} color="#b45309" strokeWidth={2} />
        
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Allow NoorAi to use your Location?
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          {!hasLocationServices 
            ? 'Location services are disabled. Please enable them to continue.'
            : 'Allow this permission to get the prayer time of your current location.'}
        </Text>

        {/* Map Preview */}
        <View style={styles.mapPreview}>
          {/* Decorative Map Background */}
          <View style={styles.mapBackground}>
            {/* Grid pattern to simulate map */}
            <View style={styles.mapGrid}>
              {[...Array(6)].map((_, i) => (
                <View key={`h-${i}`} style={styles.gridLineHorizontal} />
              ))}
              {[...Array(6)].map((_, i) => (
                <View key={`v-${i}`} style={styles.gridLineVertical} />
              ))}
            </View>
            
            {/* Map-like shapes */}
            <View style={styles.mapShape1} />
            <View style={styles.mapShape2} />
            <View style={styles.mapShape3} />
            
            {/* Roads */}
            <View style={styles.road1} />
            <View style={styles.road2} />
          </View>

          {/* Overlay with location info */}
          <View style={styles.mapOverlay}>
            <View style={styles.mapInfoCard}>
              <View style={styles.mapPinCircle}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#b45309" />
                ) : (
                  <Navigation size={24} color="#b45309" />
                )}
              </View>

              {locationData ? (
                <>
                  <Text style={styles.city}>{locationData.city}</Text>
                  <Text style={styles.subCity}>
                    {[locationData.region, locationData.country]
                      .filter(Boolean)
                      .join(' • ')}
                  </Text>

                  {/* Refresh button if location already obtained */}
                  {permissionStatus === 'granted' && (
                    <TouchableOpacity
                      style={styles.refreshBtn}
                      onPress={handleRefreshLocation}
                      disabled={isLoading}
                    >
                      <Text style={styles.refreshText}>
                        {isLoading ? 'Updating...' : 'Update Location'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <>
                  <Text style={styles.city}>Your Location</Text>
                  <Text style={styles.subCity}>
                    {isLoading
                      ? 'Getting your location...'
                      : permissionStatus === 'granted'
                      ? 'Tap "Allow" to get location'
                      : 'Allow access to see your location'}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Location Services Warning */}
        {!hasLocationServices && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Location services are disabled
            </Text>
            <TouchableOpacity onPress={openDeviceSettings}>
              <Text style={styles.warningLink}>Open Settings</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Buttons */}
        <PrimaryButton
          title={isLoading ? "Getting Location..." : "Allow"}
          onPress={handleAllowLocation}
          disabled={isLoading || !hasLocationServices}
        />
        
        <PrimaryButton2
          title="Don't Allow"
          onPress={handleDontAllow}
        />

        {/* Terms */}
        <Text style={styles.terms}>
          By using Noor AI, you agree to the{" "}
          <Text style={styles.termsHighlight}>Terms and Privacy Policy</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },

  backBtn: {
    marginBottom: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },

  content: {
    padding: 24,
    alignItems: "center",
  },

  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fef3c7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 12,
  },

  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#4b5563",
    marginBottom: 24,
    lineHeight: 24,
  },

  mapPreview: {
    width: "100%",
    height: 280,
    backgroundColor: "#e8f4f8",
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },

  mapBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e8f4f8',
    position: 'relative',
  },

  mapGrid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  gridLineHorizontal: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#d1e7f0',
  },

  gridLineVertical: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: '#d1e7f0',
  },

  mapShape1: {
    position: 'absolute',
    top: 40,
    left: 30,
    width: 120,
    height: 80,
    backgroundColor: '#c8e0ea',
    borderRadius: 40,
    opacity: 0.6,
  },

  mapShape2: {
    position: 'absolute',
    bottom: 60,
    right: 40,
    width: 100,
    height: 100,
    backgroundColor: '#b8d8e5',
    borderRadius: 50,
    opacity: 0.5,
  },

  mapShape3: {
    position: 'absolute',
    top: 120,
    right: 80,
    width: 80,
    height: 60,
    backgroundColor: '#d5eaf2',
    borderRadius: 30,
    opacity: 0.7,
  },

  road1: {
    position: 'absolute',
    top: 100,
    left: 0,
    width: '100%',
    height: 3,
    backgroundColor: '#a8d0df',
    transform: [{ rotate: '15deg' }],
  },

  road2: {
    position: 'absolute',
    top: 150,
    left: -50,
    width: '120%',
    height: 2,
    backgroundColor: '#b8dce8',
    transform: [{ rotate: '-10deg' }],
  },

  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },

  mapInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  mapCenter: {
    alignItems: "center",
  },

  mapPinCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  city: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginTop: 4,
  },

  subCity: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },

  refreshBtn: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
  },

  refreshText: {
    fontSize: 12,
    color: '#b45309',
    fontWeight: '600',
  },

  warningBox: {
    width: '100%',
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },

  warningText: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '600',
    marginBottom: 6,
  },

  warningLink: {
    fontSize: 14,
    color: '#b45309',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  terms: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 18,
    lineHeight: 16,
  },

  termsHighlight: {
    color: "#b45309",
    fontWeight: "500",
  },
});