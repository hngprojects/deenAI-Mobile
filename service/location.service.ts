import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';
import * as Device from 'expo-device';

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

// Default location for emulator/simulator (Lagos, Nigeria)
const DEFAULT_LOCATION = {
    latitude: 6.5244,
    longitude: 3.3792,
    altitude: null,
    accuracy: 100,
    timestamp: Date.now(),
};

class LocationService {
    /**
     * Check if running on emulator/simulator
     */
    private isEmulator(): boolean {
        return !Device.isDevice;
    }

    /**
     * Get default location for emulator
     */
    private getDefaultLocation(): LocationCoordinates {
        console.log('📍 Using default location (Lagos, Nigeria) for emulator');
        return DEFAULT_LOCATION;
    }

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
            // If emulator, return default location immediately
            if (this.isEmulator()) {
                return {
                    granted: true,
                    location: this.getDefaultLocation(),
                };
            }

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
                try {
                    const location = await this.getCurrentLocation();
                    return {
                        granted: true,
                        location,
                    };
                } catch (locationError) {
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
            // If emulator, return default location
            if (this.isEmulator()) {
                return this.getDefaultLocation();
            }

            const servicesEnabled = await this.checkServicesEnabled();

            if (!servicesEnabled) {
                console.log('⚠️ Location services disabled, using default location');
                return this.getDefaultLocation();
            }

            const { status } = await Location.getForegroundPermissionsAsync();

            if (status !== 'granted') {
                console.log('⚠️ Location permission not granted, using default location');
                return this.getDefaultLocation();
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
            console.log('⚠️ Falling back to default location (Lagos, Nigeria)');
            // Return default location instead of throwing error
            return this.getDefaultLocation();
        }
    }

    /**
     * Check if location permission is granted
     */
    async checkPermission(): Promise<boolean> {
        try {
            // Always return true for emulator
            if (this.isEmulator()) {
                return true;
            }

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
            // For emulator with default location, return Lagos
            if (this.isEmulator() && latitude === DEFAULT_LOCATION.latitude && longitude === DEFAULT_LOCATION.longitude) {
                return 'Lagos, Lagos, Nigeria';
            }

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
            // Fallback to Lagos if it's the default location
            if (latitude === DEFAULT_LOCATION.latitude && longitude === DEFAULT_LOCATION.longitude) {
                return 'Lagos, Lagos, Nigeria';
            }
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
            // For emulator, just call callback once with default location
            if (this.isEmulator()) {
                callback(this.getDefaultLocation());
                return null;
            }

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
                    timeInterval: 10000,
                    distanceInterval: 100,
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
            // For emulator, return default location
            if (this.isEmulator()) {
                return this.getDefaultLocation();
            }

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