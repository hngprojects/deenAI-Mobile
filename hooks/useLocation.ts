import { useCallback, useEffect, useRef, useState } from 'react';
import locationService, {
    LocationCoordinates,
    LocationPermissionResult
} from '../service/location.service';

export const useLocation = () => {
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<LocationCoordinates | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Track if component is mounted to prevent state updates after unmount
    const isMounted = useRef(true);
    const subscriptionRef = useRef<any>(null);

    // Real-time location subscription with proper cleanup
    useEffect(() => {
        isMounted.current = true;
        let isSubscribed = true;

        const setupLocationWatch = async () => {
            try {
                // Clean up any existing subscription first
                if (subscriptionRef.current?.remove) {
                    subscriptionRef.current.remove();
                }

                const subscription = await locationService.watchLocation((loc) => {
                    if (isSubscribed && isMounted.current) {
                        setLocation(loc);
                    }
                });

                if (isSubscribed) {
                    subscriptionRef.current = subscription;
                }
            } catch (err) {
                console.error('Location watch setup error:', err);
            }
        };

        setupLocationWatch();

        return () => {
            isSubscribed = false;
            isMounted.current = false;

            if (subscriptionRef.current?.remove) {
                subscriptionRef.current.remove();
                subscriptionRef.current = null;
            }
        };
    }, []); // Empty deps - only run once on mount

    const requestPermission = useCallback(async (): Promise<LocationPermissionResult> => {
        try {
            setLoading(true);
            setError(null);

            const result = await locationService.requestPermission();

            if (!isMounted.current) return result;

            if (result.granted && result.location) {
                setLocation(result.location);
            } else {
                setError(result.error || 'Permission denied');
            }

            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to request location permission';

            if (isMounted.current) {
                setError(errorMessage);
            }

            return {
                granted: false,
                error: errorMessage,
            };
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, []);

    const getCurrentLocation = useCallback(async (): Promise<LocationCoordinates | null> => {
        try {
            setLoading(true);
            setError(null);

            const coords = await locationService.getCurrentLocation();

            if (isMounted.current) {
                setLocation(coords);
            }

            return coords;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to get location';

            if (isMounted.current) {
                setError(errorMessage);
            }

            return null;
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, []);

    const checkPermission = useCallback(async (): Promise<boolean> => {
        try {
            return await locationService.checkPermission();
        } catch (err: any) {
            console.error('Check permission error:', err);
            return false;
        }
    }, []);

    const getAddress = useCallback(async (
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

            const address = await locationService.getAddressFromCoordinates(latitude, longitude);
            return address;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to get address';

            if (isMounted.current) {
                setError(errorMessage);
            }

            return null;
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, [location]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

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