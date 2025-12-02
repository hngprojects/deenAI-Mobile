import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';

export interface LocationCoordinates {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    timestamp: number;
    source: 'user' | 'emulator';
}

export interface LocationPermissionResult {
    granted: boolean;
    location?: LocationCoordinates;
    error?: string;
    servicesDisabled?: boolean;
    canAskAgain?: boolean; // NEW: Indicates if we can show system dialog again
}

const DEFAULT_LOCATION = {
    latitude: 6.5244,
    longitude: 3.3792,
    altitude: null,
    accuracy: 100,
    timestamp: Date.now(),
    source: 'emulator' as const,
};

class LocationService {
    /**
     * Check if running on emulator/simulator
     */
    private isEmulator(): boolean {
        return !Device.isDevice;
    }

    /**
     * Get default location for emulator ONLY
     */
    private getDefaultLocation(): LocationCoordinates {
        if (!this.isEmulator()) {
            throw new Error('Default location can only be used on emulator');
        }
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
     * Show alert when permission was previously denied (can't ask again)
     */
    private showPermissionDeniedAlert(): void {
        Alert.alert(
            'Location Permission Required',
            'You previously denied location access. To enable prayer times, please allow location permission in your device settings.',
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

            // REAL DEVICE: Check if services are enabled
            const servicesEnabled = await this.checkServicesEnabled();

            if (!servicesEnabled) {
                this.showEnableServicesAlert();
                return {
                    granted: false,
                    servicesDisabled: true,
                    error: 'Location services are disabled',
                };
            }

            // Check current permission status
            const { status: currentStatus, canAskAgain } = await Location.getForegroundPermissionsAsync();

            // If permission already denied and we can't ask again
            if (currentStatus === 'denied' && !canAskAgain) {
                console.log('⚠️ Permission previously denied, cannot ask again');
                this.showPermissionDeniedAlert();
                return {
                    granted: false,
                    canAskAgain: false,
                    error: 'Location permission was previously denied. Please enable it in settings.',
                };
            }

            // Request permission (this will show system dialog if canAskAgain is true)
            const { status: newStatus, canAskAgain: canAskAgainAfter } = await Location.requestForegroundPermissionsAsync();

            if (newStatus === 'granted') {
                try {
                    const location = await this.getCurrentLocation();
                    return {
                        granted: true,
                        location,
                        canAskAgain: true,
                    };
                } catch (locationError) {
                    console.log('Permission granted but could not get location:', locationError);
                    return {
                        granted: true,
                        error: 'Could not determine current location',
                        canAskAgain: true,
                    };
                }
            }

            // Permission denied
            if (!canAskAgainAfter) {
                // User selected "Don't Allow" or "Deny & Don't Ask Again"
                this.showPermissionDeniedAlert();
            }

            return {
                granted: false,
                canAskAgain: canAskAgainAfter,
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
     * ONLY returns default location on emulator
     * THROWS errors on real devices
     */
    async getCurrentLocation(): Promise<LocationCoordinates> {
        try {
            // If emulator, return default location
            if (this.isEmulator()) {
                return this.getDefaultLocation();
            }

            // REAL DEVICE ONLY from here
            const servicesEnabled = await this.checkServicesEnabled();

            if (!servicesEnabled) {
                throw new Error('Location services are disabled. Please enable them in settings.');
            }

            const { status } = await Location.getForegroundPermissionsAsync();

            if (status !== 'granted') {
                throw new Error('Location permission not granted. Please enable location access.');
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
                source: 'user',
            };
        } catch (error) {
            console.error('Get location error:', error);

            // CRITICAL: Only return default on emulator
            if (this.isEmulator()) {
                console.log('⚠️ Emulator error, using default location');
                return this.getDefaultLocation();
            }

            // REAL DEVICE: Throw the error instead of returning default
            throw error;
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
     * Check if we can ask for permission again (user hasn't permanently denied it)
     */
    async canAskForPermission(): Promise<boolean> {
        try {
            if (this.isEmulator()) {
                return true;
            }

            const { canAskAgain } = await Location.getForegroundPermissionsAsync();
            return canAskAgain;
        } catch (error) {
            console.error('Check can ask permission error:', error);
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
            if (this.isEmulator() && latitude === DEFAULT_LOCATION.latitude && longitude === DEFAULT_LOCATION.longitude) {
                return 'Lagos, Nigeria (Emulator)';
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
            if (this.isEmulator() && latitude === DEFAULT_LOCATION.latitude && longitude === DEFAULT_LOCATION.longitude) {
                return 'Lagos, Nigeria (Emulator)';
            }
            throw new Error('Unable to get address');
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
                        source: 'user',
                    });
                }
            );
        } catch (error) {
            console.error('Watch location error:', error);
            throw error;
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
                throw new Error('Location services are disabled');
            }

            const { status } = await Location.getForegroundPermissionsAsync();

            if (status !== 'granted') {
                throw new Error('Location permission not granted');
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
                source: 'user',
            };
        } catch (error) {
            console.error('Get last known location error:', error);

            // Only return default on emulator
            if (this.isEmulator()) {
                return this.getDefaultLocation();
            }

            throw error;
        }
    }

    /**
     * Helper method to format location string with source label
     */
    formatLocationWithLabel(location: LocationCoordinates): string {
        const label = location.source === 'emulator' ? '(emulator)' : '';
        return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)} ${label}`.trim();
    }

    /**
     * Helper method to get location label
     */
    getLocationLabel(location: LocationCoordinates): string {
        return location.source === 'emulator' ? 'Emulator Location' : 'Your Location';
    }
}

export default new LocationService();