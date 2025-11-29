import { useEffect, useState } from 'react';
import locationService, {
    LocationCoordinates,
    LocationPermissionResult
} from '../service/location.service';

export const useLocation = () => {
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<LocationCoordinates | null>(null);
    const [error, setError] = useState<string | null>(null);
    // Real-time location subscription
    useEffect(() => {
        let subscription: any = null;
        (async () => {
            subscription = await locationService.watchLocation((loc) => {
                setLocation(loc);
            });
        })();
        return () => {
            if (subscription && typeof subscription.remove === 'function') {
                subscription.remove();
            }
        };
    }, []);

    const requestPermission = async (): Promise<LocationPermissionResult> => {
        try {
            setLoading(true);
            setError(null);

            const result = await locationService.requestPermission();

            if (result.granted && result.location) {
                setLocation(result.location);
            } else {
                setError(result.error || 'Permission denied');
            }

            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to request location permission';
            setError(errorMessage);
            return {
                granted: false,
                error: errorMessage,
            };
        } finally {
            setLoading(false);
        }
    };

    const getCurrentLocation = async (): Promise<LocationCoordinates | null> => {
        try {
            setLoading(true);
            setError(null);

            const coords = await locationService.getCurrentLocation();
            setLocation(coords);

            return coords;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to get location';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const checkPermission = async (): Promise<boolean> => {
        try {
            return await locationService.checkPermission();
        } catch (err: any) {
            console.error('Check permission error:', err);
            return false;
        }
    };

    const getAddress = async (
        lat?: number,
        lon?: number
    ): Promise<string | null> => {
        try {
            setLoading(true);

            const latitude = lat ?? location?.latitude;
            const longitude = lon ?? location?.longitude;

            if (!latitude || !longitude) {
                throw new Error('No coordinates available');
            }

            return await locationService.getAddressFromCoordinates(latitude, longitude);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to get address';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        location,
        loading,
        error,
        requestPermission,
        getCurrentLocation,
        checkPermission,
        getAddress,
        clearError,
    };
};