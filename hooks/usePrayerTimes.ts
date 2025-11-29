import { useCallback, useEffect, useRef, useState } from 'react';
import prayerService, { HijriDate, PrayerSettings, PrayerTimesData, SavedLocation } from '../service/prayer.service';
import { useLocation } from './useLocation';

export const usePrayerTimes = () => {
  const { location, getCurrentLocation, getAddress } = useLocation();
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

  // Track if initial load is complete
  const initialLoadComplete = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Load saved location and settings on mount - OPTIMIZED
   */
  useEffect(() => {
    loadInitialData();
  }, []);

  /**
   * Calculate prayer times when location or date changes - OPTIMIZED
   */
  useEffect(() => {
    if (savedLocation) {
      calculateTimes(savedLocation.latitude, savedLocation.longitude, selectedDate);
    }
  }, [savedLocation, selectedDate, settings]);

  /**
   * Update current prayer and countdown every second - OPTIMIZED
   */
  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!prayerTimes || !savedLocation) return;

    // Update immediately first
    updatePrayerInfo();

    // Then set interval
    intervalRef.current = setInterval(() => {
      updatePrayerInfo();
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [prayerTimes, savedLocation, settings]);

  /**
   * Extract prayer update logic for reuse
   */
  const updatePrayerInfo = useCallback(() => {
    if (!prayerTimes || !savedLocation) return;

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
   * Load initial data - OPTIMIZED with parallel loading
   */
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load both in parallel for faster loading
      const [savedLoc, savedSettings] = await Promise.all([
        prayerService.getSavedLocation(),
        prayerService.getSettings(),
      ]);

      // Set settings first (doesn't trigger re-render of times calculation)
      setSettings(savedSettings);

      // Then set location (this will trigger prayer times calculation)
      if (savedLoc) {
        setSavedLocation(savedLoc);
        setLocationName(savedLoc.city || 'Unknown Location');
      } else {
        // No saved location - try to get current location
        console.log('No saved location found, attempting to get current location...');
        // Don't block here - let the user see the UI while location loads
        getCurrentLocation()
          .then(async (coords) => {
            if (coords) {
              let address = 'Unknown Location';
              try {
                const reverseGeocode = await getAddress(coords.latitude, coords.longitude);
                if (reverseGeocode) {
                  address = reverseGeocode;
                }
              } catch (geoError) {
                console.log('Reverse geocoding failed');
              }

              const newLocation: SavedLocation = {
                latitude: coords.latitude,
                longitude: coords.longitude,
                city: address.split(',')[0],
                country: address.split(',').pop()?.trim(),
                timestamp: Date.now(),
              };

              await prayerService.saveLocation(newLocation);
              setSavedLocation(newLocation);
              setLocationName(address);
            }
          })
          .catch((err) => {
            console.error('Failed to get current location:', err);
            setError('Location access required for prayer times');
          });
      }

      initialLoadComplete.current = true;
    } catch (err: any) {
      console.error('Error loading initial data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      // Set loading to false after a short delay to prevent flicker
      setTimeout(() => setLoading(false), 100);
    }
  };

  /**
   * Calculate prayer times - OPTIMIZED with immediate state update
   */
  const calculateTimes = useCallback(
    (latitude: number, longitude: number, date: Date) => {
      try {
        // Calculate times synchronously (this is fast)
        const times = prayerService.calculatePrayerTimes(
          latitude,
          longitude,
          date,
          settings || undefined
        );

        // Update state immediately
        setPrayerTimes(times);

        // Calculate Hijri date
        const hijri = prayerService.getHijriDate(date);
        setHijriDate(hijri);

        // Cache asynchronously (don't await)
        prayerService.cachePrayerTimes(date, times).catch(console.error);

        setError(null);
      } catch (err: any) {
        console.error('Error calculating prayer times:', err);
        setError(err.message || 'Failed to calculate prayer times');
      }
    },
    [settings]
  );

  /**
   * Refresh location and prayer times
   */
  const refreshLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const coords = await getCurrentLocation();

      if (!coords) {
        throw new Error('Could not get location');
      }

      // Get location name (will default to "Lagos, Nigeria" if reverse geocoding fails)
      let address = 'Unknown Location';
      try {
        const reverseGeocode = await getAddress(coords.latitude, coords.longitude);
        if (reverseGeocode) {
          address = reverseGeocode;
        }
      } catch (geoError) {
        console.log('Reverse geocoding failed, using default name');
      }

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
      setSavedLocation(newLocation);

    } catch (err: any) {
      console.error('Error refreshing location:', err);
      setError(err.message || 'Failed to refresh location');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Set location manually (useful for testing/emulator)
   */
  const setManualLocation = async (latitude: number, longitude: number, cityName?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get location name if not provided
      let locationName = cityName;
      if (!cityName) {
        const address = await getAddress(latitude, longitude);
        locationName = address || 'Unknown Location';
      }
      setLocationName(locationName || 'Manual Location');

      // Save location
      const newLocation: SavedLocation = {
        latitude,
        longitude,
        city: locationName?.split(',')[0] || 'Manual Location',
        country: locationName?.split(',').pop()?.trim() || '',
        timestamp: Date.now(),
      };

      await prayerService.saveLocation(newLocation);
      setSavedLocation(newLocation);

      setError(null);
    } catch (err: any) {
      console.error('Error setting manual location:', err);
      setError(err.message || 'Failed to set location');
    } finally {
      setLoading(false);
    }
  };

  const changeDate = (date: Date) => {
    setSelectedDate(date);
  };

  /**
   * Go to next day
   */
  const nextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  /**
   * Go to previous day
   */
  const previousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  /**
   * Go to today
   */
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  /**
   * Update prayer settings
   */
  const updateSettings = async (newSettings: PrayerSettings) => {
    try {
      await prayerService.saveSettings(newSettings);
      setSettings(newSettings);
    } catch (err: any) {
      console.error('Error updating settings:', err);
      setError(err.message || 'Failed to update settings');
    }
  };

  /**
   * Check if it's a forbidden prayer time
   */
  const isForbiddenTime = (): boolean => {
    if (!prayerTimes) return false;
    return prayerService.isForbiddenTime(prayerTimes);
  };

  /**
   * Format time
   */
  const formatTime = (date: Date): string => {
    return prayerService.formatTime(date);
  };

  /**
   * Format date
   */
  const formatDate = (date: Date): string => {
    return prayerService.formatDate(date);
  };

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