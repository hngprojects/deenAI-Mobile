import { useCallback, useEffect, useRef, useState } from 'react';
import prayerService, { HijriDate, PrayerSettings, PrayerTimesData, SavedLocation } from '../service/prayer.service';
import { useLocation } from './useLocation';

export const usePrayerTimes = () => {
  const { getCurrentLocation, getAddress, requestPermission } = useLocation();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<string>('');
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('00:00:00');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedLocation, setSavedLocation] = useState<SavedLocation | null>(null);
  const [settings, setSettings] = useState<PrayerSettings | null>(null);
  const [locationName, setLocationName] = useState<string>('');

  // Track if component is mounted
  const isMounted = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadComplete = useRef(false);
  const isLoadingLocation = useRef(false);

  /**
   * Load saved location and settings on mount
   */
  useEffect(() => {
    isMounted.current = true;
    loadInitialData();

    return () => {
      isMounted.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  /**
   * Calculate prayer times when location, date, or settings change
   */
  useEffect(() => {
    if (savedLocation && isMounted.current) {
      calculateTimes(savedLocation.latitude, savedLocation.longitude, selectedDate);
    }
  }, [savedLocation, selectedDate, settings]);

  /**
   * Update current prayer and countdown every second
   */
  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!prayerTimes || !savedLocation || !isMounted.current) return;

    // Update immediately first
    updatePrayerInfo();

    // Then set interval
    intervalRef.current = setInterval(() => {
      if (isMounted.current) {
        updatePrayerInfo();
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [prayerTimes, savedLocation, settings]);

  /**
   * Update prayer info (current, next, time remaining)
   */
  const updatePrayerInfo = useCallback(() => {
    if (!prayerTimes || !savedLocation || !isMounted.current) return;

    try {
      const current = prayerService.getCurrentPrayer(prayerTimes);
      setCurrentPrayer(current);

      const next = prayerService.getNextPrayer(
        prayerTimes,
        savedLocation.latitude,
        savedLocation.longitude,
        settings || undefined
      );
      setNextPrayer(next);

      const remaining = prayerService.getTimeUntilNextPrayer(next.time);
      setTimeRemaining(remaining);
    } catch (err) {
      console.error('Error updating prayer info:', err);
    }
  }, [prayerTimes, savedLocation, settings]);

  /**
   * Load initial data
   */
  const loadInitialData = async () => {
    if (initialLoadComplete.current) return;

    try {
      setLoading(true);
      setError(null);

      // Load settings and saved location in parallel
      const [savedLoc, savedSettings] = await Promise.all([
        prayerService.getSavedLocation(),
        prayerService.getSettings(),
      ]);

      if (!isMounted.current) return;

      // Set settings first
      setSettings(savedSettings);

      // Handle location
      if (savedLoc) {
        setSavedLocation(savedLoc);
        setLocationName(savedLoc.city || 'Unknown Location');
      } else {
        // No saved location - try to get current location in background
        // This will only work if permission was already granted
        fetchCurrentLocationSilently();
      }

      initialLoadComplete.current = true;
    } catch (err: any) {
      console.error('Error loading initial data:', err);
      if (isMounted.current) {
        setError(err.message || 'Failed to load data');
      }
    } finally {
      // Delay to prevent flicker
      setTimeout(() => {
        if (isMounted.current) {
          setLoading(false);
        }
      }, 100);
    }
  };

  /**
   * Fetch current location silently (only works if permission already granted)
   */
  const fetchCurrentLocationSilently = async () => {
    if (isLoadingLocation.current) return;

    isLoadingLocation.current = true;

    try {
      const coords = await getCurrentLocation();

      if (!coords || !isMounted.current) {
        isLoadingLocation.current = false;
        return;
      }

      let address = 'Unknown Location';
      try {
        const reverseGeocode = await getAddress(coords.latitude, coords.longitude);
        if (reverseGeocode) {
          address = reverseGeocode;
        }
      } catch (geoError) {
        console.log('Reverse geocoding failed, using default');
      }

      if (!isMounted.current) {
        isLoadingLocation.current = false;
        return;
      }

      const newLocation: SavedLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        city: address.split(',')[0],
        country: address.split(',').pop()?.trim(),
        timestamp: Date.now(),
      };

      await prayerService.saveLocation(newLocation);

      if (isMounted.current) {
        setSavedLocation(newLocation);
        setLocationName(address);
      }
    } catch (err) {
      console.log('Could not get location silently (permission may not be granted)');
      // Don't set error - user hasn't explicitly requested location yet
    } finally {
      isLoadingLocation.current = false;
    }
  };

  /**
   * Calculate prayer times
   */
  const calculateTimes = useCallback(
    (latitude: number, longitude: number, date: Date) => {
      try {
        const times = prayerService.calculatePrayerTimes(
          latitude,
          longitude,
          date,
          settings || undefined
        );

        if (!isMounted.current) return;

        setPrayerTimes(times);

        const hijri = prayerService.getHijriDate(date);
        setHijriDate(hijri);

        // Cache asynchronously
        prayerService.cachePrayerTimes(date, times).catch(console.error);

        setError(null);
      } catch (err: any) {
        console.error('Error calculating prayer times:', err);
        if (isMounted.current) {
          setError(err.message || 'Failed to calculate prayer times');
        }
      }
    },
    [settings]
  );

  /**
   * Refresh location - REQUEST PERMISSION FIRST, then get location
   * This is the function that should be called when user explicitly taps "Allow Location"
   */
  const refreshLocation = useCallback(async () => {
    try {
      console.log('🔄 Starting location refresh with permission request...');
      setLoading(true);
      setError(null);

      // CRITICAL FIX: Request permission first
      const permissionResult = await requestPermission();

      if (!permissionResult.granted) {
        console.log('❌ Permission not granted:', permissionResult.error);
        throw new Error(
          permissionResult.servicesDisabled
            ? 'Location services are disabled. Please enable them in your device settings.'
            : permissionResult.error || 'Location permission denied'
        );
      }

      console.log('✅ Permission granted, getting location...');

      // Permission granted, now get the location
      const coords = permissionResult.location || await getCurrentLocation();

      if (!coords) {
        throw new Error('Could not get location');
      }

      console.log('📍 Got coordinates:', coords.latitude, coords.longitude);

      // Get location name
      let address = 'Unknown Location';
      try {
        const reverseGeocode = await getAddress(coords.latitude, coords.longitude);
        if (reverseGeocode) {
          address = reverseGeocode;
        }
      } catch (geoError) {
        console.log('⚠️ Reverse geocoding failed, using default');
      }

      if (!isMounted.current) return;

      setLocationName(address);

      // Save location
      const newLocation: SavedLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        city: address.split(',')[0],
        country: address.split(',').pop()?.trim(),
        timestamp: Date.now(),
      };

      await prayerService.saveLocation(newLocation);

      if (isMounted.current) {
        setSavedLocation(newLocation);
        console.log('✅ Location saved successfully');
      }
    } catch (err: any) {
      console.error('❌ Error refreshing location:', err);
      if (isMounted.current) {
        setError(err.message || 'Failed to get location');
      }
      throw err; // Re-throw so UI can handle it
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [requestPermission, getCurrentLocation, getAddress]);

  /**
   * Set location manually
   */
  const setManualLocation = useCallback(async (
    latitude: number,
    longitude: number,
    cityName?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      let locationName = cityName;
      if (!cityName) {
        const address = await getAddress(latitude, longitude);
        locationName = address || 'Unknown Location';
      }

      if (!isMounted.current) return;

      setLocationName(locationName || 'Manual Location');

      const newLocation: SavedLocation = {
        latitude,
        longitude,
        city: locationName?.split(',')[0] || 'Manual Location',
        country: locationName?.split(',').pop()?.trim() || '',
        timestamp: Date.now(),
      };

      await prayerService.saveLocation(newLocation);

      if (isMounted.current) {
        setSavedLocation(newLocation);
        setError(null);
      }
    } catch (err: any) {
      console.error('Error setting manual location:', err);
      if (isMounted.current) {
        setError(err.message || 'Failed to set location');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [getAddress]);

  const changeDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const nextDay = useCallback(() => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  }, []);

  const previousDay = useCallback(() => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  }, []);

  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  const updateSettings = useCallback(async (newSettings: PrayerSettings) => {
    try {
      await prayerService.saveSettings(newSettings);
      if (isMounted.current) {
        setSettings(newSettings);
      }
    } catch (err: any) {
      console.error('Error updating settings:', err);
      if (isMounted.current) {
        setError(err.message || 'Failed to update settings');
      }
    }
  }, []);

  const isForbiddenTime = useCallback((): boolean => {
    if (!prayerTimes) return false;
    return prayerService.isForbiddenTime(prayerTimes);
  }, [prayerTimes]);

  const formatTime = useCallback((date: Date): string => {
    return prayerService.formatTime(date);
  }, []);

  const formatDate = useCallback((date: Date): string => {
    return prayerService.formatDate(date);
  }, []);

  return {
    // State
    prayerTimes,
    selectedDate,
    hijriDate,
    currentPrayer,
    nextPrayer,
    timeRemaining,
    loading,
    error,
    savedLocation,
    locationName,
    settings,

    // Actions
    refreshLocation,
    setManualLocation,
    changeDate,
    nextDay,
    previousDay,
    goToToday,
    updateSettings,
    isForbiddenTime,
    formatTime,
    formatDate,
  };
};