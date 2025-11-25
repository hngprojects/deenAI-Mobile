import { useLocation } from '@/hooks/useLocation';
import prayerService from '@/service/prayer.service';
import { usePrayerStore } from '@/store/prayer-store';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PrayerTimesScreen() {
  const router = useRouter();
  const { location: userLocation, getCurrentLocation, checkPermission } = useLocation();
  const {
    prayerTimes,
    currentDate,
    islamicDate,
    location,
    isLoading,
    error,
    setPrayerTimes,
    setCurrentDate,
    setIslamicDate,
    setLocation,
    setLoading,
    setError,
  } = usePrayerStore();

  const [initializing, setInitializing] = useState(true);

  // Initialize location and prayer times
  useEffect(() => {
    initializePrayerTimes();
  }, []);

  // Mock forbidden times data (not implemented yet)
  const forbiddenTimesData = [
    { period: 'Sunrise', start: '06:34 AM', end: '06:49 AM', icon: 'sunrise' },
    { period: 'Noon', start: '12:22 PM', end: '12:30 PM', icon: 'noon' },
    { period: 'Sunset', start: '06:10 PM', end: '06:25 PM', icon: 'sunset' }
  ];

  // Update prayer times when date or location changes
  useEffect(() => {
    if (location) {
      updatePrayerTimes(location, currentDate);
    }
  }, [currentDate, location]);

  const initializePrayerTimes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we have permission
      const hasPermission = await checkPermission();
      
      let coords = userLocation;
      
      if (!coords && hasPermission) {
        coords = await getCurrentLocation();
      }

      if (coords) {
        setLocation(coords);
        updatePrayerTimes(coords, currentDate);
      } else {
        setError('Unable to get location. Please enable location services.');
      }
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to initialize prayer times');
    } finally {
      setLoading(false);
      setInitializing(false);
    }
  };

  const updatePrayerTimes = (coords: any, date: Date) => {
    try {
      // Get prayer times
      const times = prayerService.getFormattedPrayerTimes(coords, date);
      setPrayerTimes(times);

      // Get Islamic date
      const hijriDate = prayerService.getIslamicDate(date);
      setIslamicDate(hijriDate);
    } catch (err) {
      console.error('Error updating prayer times:', err);
      setError('Failed to calculate prayer times');
    }
  };

  const formatGregorianDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const navigateToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const navigateToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  // Show loading state
  if (initializing || isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#9C7630" />
        <Text style={styles.loadingText}>Loading prayer times...</Text>
      </View>
    );
  }

  // Show error state
  if (error && !prayerTimes) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={initializePrayerTimes} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: 30 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <Image 
            source={require('@/assets/images/prayerTimes-icons/arrow-left.png')}
            style={styles.backIcon}
          />
        </Pressable>
        
        <Text style={styles.headerTitle}>Prayer Times</Text>

        <Pressable 
          style={styles.iconButton}
          onPress={() => router.push('/(tabs)/(prayer-times)/calendar')}
        >
          <Image 
            source={require('@/assets/images/prayerTimes-icons/calendar.png')}
            style={styles.calendarIcon}
          />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Date Navigation */}
        <View style={styles.dateNavigation}>
          <Pressable onPress={navigateToPreviousDay} style={styles.iconButton}>
            <Image 
              source={require('@/assets/images/prayerTimes-icons/lessthan.png')}
              style={styles.navIcon}
            />
          </Pressable>

          <View style={styles.dateContainer}>
            <Text style={styles.gregorianDate}>
              {formatGregorianDate(currentDate)}
            </Text>
            <Text style={styles.islamicDate}>
              {islamicDate || 'Loading...'}
            </Text>
          </View>

          <Pressable onPress={navigateToNextDay} style={styles.iconButton}>
            <Image 
              source={require('@/assets/images/prayerTimes-icons/greaterthan.png')}
              style={styles.navIcon}
            />
          </Pressable>
        </View>

        {/* Prayer Times */}
        {prayerTimes && (
          <View style={styles.section}>
            {Object.entries(prayerTimes).map(([prayer, time]) => (
              <View key={prayer} style={styles.prayerItemContainer}>
                <View style={styles.prayerItem}>
                  <View style={styles.prayerLeft}>
                    <Image 
                      source={require('@/assets/images/speakerIcon.png')}
                      style={styles.speakerIcon}
                    />
                    <Text style={styles.prayerName}>{prayer}</Text>
                  </View>
                  <Text style={styles.prayerTime}>{time}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Forbidden Times (Mock data - not yet implemented) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forbidden Salat Times</Text>
          {forbiddenTimesData.map((item, index) => (
            <View key={index} style={styles.forbiddenItemContainer}>
              <View style={styles.forbiddenItem}>
                <Image 
                  source={
                    item.period === 'Sunrise' 
                      ? require('@/assets/images/prayerTimes-icons/sunrise.png')
                      : item.period === 'Noon'
                      ? require('@/assets/images/prayerTimes-icons/noon.png')
                      : require('@/assets/images/prayerTimes-icons/sunset-icon.png')
                  }
                  style={styles.forbiddenIcon}
                />
                <View style={styles.forbiddenTextContainer}>
                  <Text style={styles.forbiddenPeriod}>{item.period}</Text>
                  <View style={styles.forbiddenTimeContainer}>
                    <Text style={styles.forbiddenTime}>{item.start}</Text>
                    <View style={styles.timeSeparatorLine} />
                    <Text style={[styles.forbiddenTime, styles.endTime]}>{item.end}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Extra space at bottom */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#9C7630',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  iconButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  calendarIcon: {
    width: 35,
    height: 35,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dateContainer: {
    alignItems: 'center',
    flex: 1,
  },
  gregorianDate: {
    fontSize: 20,
    color: '#9C7630',
    fontWeight: '600',
    textAlign: 'center',
  },
  islamicDate: {
    fontSize: 14,
    color: '#3C3A35',
    marginTop: 4,
    textAlign: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  prayerItemContainer: {
    marginBottom: 12,
  },
  prayerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  prayerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerName: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    marginLeft: 12,
  },
  prayerTime: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  speakerIcon: {
    width: 24,
    height: 24,
  },
  forbiddenItemContainer: {
    marginBottom: 12,
  },
  forbiddenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  forbiddenIcon: {
    width: 55,
    height: 55,
  },
  forbiddenTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  forbiddenPeriod: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 4,
  },
  forbiddenTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  forbiddenTime: {
    fontSize: 14,
    color: '#666666',
  },
  timeSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#666666',
    marginHorizontal: 8,
    opacity: 0.5,
  },
  endTime: {},
  bottomSpace: {
    height: 20,
  },
});