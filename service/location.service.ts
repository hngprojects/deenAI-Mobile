import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';

export interface LocationCoordinates {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    timestamp: number;
}

export interface LocationPermissionResult {
    granted: boolean;
    location?: LocationCoordinates;
    error?: string;
    servicesDisabled?: boolean;
}

class LocationService {
    /**
     * Check if location services are enabled on the device
     */
    private async checkServicesEnabled(): Promise<boolean> {
        try {
            return await Location.hasServicesEnabledAsync();
        } catch (error) {
            console.error('Error checking location services:', error);
            return false;
        }
    }

    /**
     * Show alert to enable location services
     */
    private showEnableServicesAlert(): void {
        Alert.alert(
            'Location Services Disabled',
            'Please enable location services in your device settings to use this feature.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Open Settings',
                    onPress: () => {
                        if (Platform.OS === 'ios') {
                            Linking.openURL('app-settings:');
                        } else {
                            Linking.openSettings();
                        }
                    }
                }
            ]
        );
    }

    /**
     * Request foreground location permission
     */
    async requestPermission(): Promise<LocationPermissionResult> {
        try {
            // First check if location services are enabled
            const servicesEnabled = await this.checkServicesEnabled();

            if (!servicesEnabled) {
                this.showEnableServicesAlert();
                return {
                    granted: false,
                    servicesDisabled: true,
                    error: 'Location services are disabled',
                };
            }

            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status === 'granted') {
                // Try to get current location
                try {
                    const location = await this.getCurrentLocation();
                    return {
                        granted: true,
                        location,
                    };
                } catch (locationError) {
                    // Permission granted but couldn't get location
                    console.log('Permission granted but could not get location:', locationError);
                    return {
                        granted: true,
                        error: 'Could not determine current location',
                    };
                }
            }

            return {
                granted: false,
                error: 'Location permission denied',
            };
        } catch (error) {
            console.error('Location permission error:', error);
            return {
                granted: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Get current location coordinates
     */
    async getCurrentLocation(): Promise<LocationCoordinates> {
        try {
            // Check if services are enabled
            const servicesEnabled = await this.checkServicesEnabled();

            if (!servicesEnabled) {
                throw new Error('Location services are disabled. Please enable them in your device settings.');
            }

            // Check if permission is granted
            const { status } = await Location.getForegroundPermissionsAsync();

            if (status !== 'granted') {
                throw new Error('Location permission not granted');
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
                timeInterval: 5000,
            });

            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                altitude: location.coords.altitude,
                accuracy: location.coords.accuracy,
                timestamp: location.timestamp,
            };
        } catch (error) {
            console.error('Get location error:', error);
            throw error;
        }
    }

    /**
     * Check if location permission is granted
     */
    async checkPermission(): Promise<boolean> {
        try {
            const { status } = await Location.getForegroundPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Check permission error:', error);
            return false;
        }
    }

    /**
     * Get location address from coordinates
     */
    async getAddressFromCoordinates(
        latitude: number,
        longitude: number
    ): Promise<string> {
        try {
            const addresses = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            if (addresses.length > 0) {
                const address = addresses[0];
                return `${address.city}, ${address.region}, ${address.country}`;
            }

            return 'Unknown location';
        } catch (error) {
            console.error('Reverse geocode error:', error);
            return 'Unable to get address';
        }
    }

    /**
     * Watch location changes (for real-time tracking)
     */
    async watchLocation(
        callback: (location: LocationCoordinates) => void
    ): Promise<Location.LocationSubscription | null> {
        try {
            // Check services first
            const servicesEnabled = await this.checkServicesEnabled();

            if (!servicesEnabled) {
                throw new Error('Location services are disabled');
            }

            const hasPermission = await this.checkPermission();

            if (!hasPermission) {
                throw new Error('Location permission not granted');
            }

            return await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    timeInterval: 10000, // Update every 10 seconds
                    distanceInterval: 100, // Update every 100 meters
                },
                (position) => {
                    callback({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        altitude: position.coords.altitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp,
                    });
                }
            );
        } catch (error) {
            console.error('Watch location error:', error);
            return null;
        }
    }

    /**
     * Get last known location (faster but may be outdated)
     */
    async getLastKnownLocation(): Promise<LocationCoordinates | null> {
        try {
            const servicesEnabled = await this.checkServicesEnabled();

            if (!servicesEnabled) {
                return null;
            }

            const { status } = await Location.getForegroundPermissionsAsync();

            if (status !== 'granted') {
                return null;
            }

            const location = await Location.getLastKnownPositionAsync();

            if (!location) {
                return null;
            }

            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                altitude: location.coords.altitude,
                accuracy: location.coords.accuracy,
                timestamp: location.timestamp,
            };
        } catch (error) {
            console.error('Get last known location error:', error);
            return null;
        }
    }
}

export default new LocationService();