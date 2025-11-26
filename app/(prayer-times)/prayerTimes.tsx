import UpcomingSolatCard from '@/components/UpcomingSolatCard';
import { theme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import LocationPermissionModal from '../../components/LocationPermissionModal';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';

export default function PrayerTimesScreen() {
  const {
    prayerTimes,
    selectedDate,
    hijriDate,
    nextPrayer,
    loading,
    error,
    locationName,
    savedLocation,
    refreshLocation,
    nextDay,
    previousDay,
    formatTime,
    formatDate,
  } = usePrayerTimes();

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    // Check if location exists, if not show modal
    const checkLocation = async () => {
      // Wait a moment for the hook to initialize
      setTimeout(() => {
        if (savedLocation === null && !loading) {
          setShowPermissionModal(true);
        }
      }, 500);
    };

    checkLocation();
  }, [savedLocation, loading]);

  const handleRequestPermission = async () => {
    try {
      setPermissionLoading(true);
      setPermissionError(null);

      await refreshLocation();

      // Check if location was successfully obtained after a delay
      setTimeout(() => {
        if (savedLocation) {
          setShowPermissionModal(false);
          setPermissionError(null);
        } else if (error) {
          setPermissionError(error);
        } else {
          // Even if there's no savedLocation yet, close modal
          // as the location service will use default location
          setShowPermissionModal(false);
        }
        setPermissionLoading(false);
      }, 1500);
    } catch (err: any) {
      // Don't show error, just close modal as we have fallback location
      console.log('Location request completed with fallback');
      setShowPermissionModal(false);
      setPermissionLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowPermissionModal(false);
    // Navigate back if no location is set
    if (!savedLocation) {
      router.back();
    }
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  // Calculate which prayer is next for today or tomorrow
  const getNextPrayerForDisplay = () => {
    const now = new Date();
    const todayString = now.toDateString();

    // If viewing today, find next prayer
    if (isToday && prayerTimes) {
      const prayersList = [
        { name: 'Fajr', time: new Date(prayerTimes.fajr) },
        { name: 'Dhuhr', time: new Date(prayerTimes.dhuhr) },
        { name: 'Asr', time: new Date(prayerTimes.asr) },
        { name: 'Maghrib', time: new Date(prayerTimes.maghrib) },
        { name: 'Isha', time: new Date(prayerTimes.isha) },
      ];

      // Find first prayer that hasn't passed yet
      for (const prayer of prayersList) {
        if (now < prayer.time) {
          return prayer;
        }
      }

      // All prayers done for today, return Fajr as next (tomorrow)
      return { name: 'Fajr', time: new Date(prayerTimes.fajr), isNextDay: true };
    }

    return nextPrayer;
  };

  const renderPrayerItem = (name: string, time: Date, isNext: boolean = false) => {
    const isPast = new Date() > time && isToday;

    // Don't render if prayer has passed or if it's the next prayer (shown in upcoming card)
    if (isPast || isNext) {
      return null;
    }

    return (
      <TouchableOpacity
        key={name}
        style={[
          styles.prayerItem,
          isNext && styles.nextPrayerItem,
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.prayerInfo}>
          <Ionicons
            name="volume-medium-outline"
            size={24}
            color={isNext ? '#FFFFFF' : '#8B4513'}
          />
          <Text style={[
            styles.prayerName,
            isNext && styles.nextPrayerText,
          ]}>
            {name}
          </Text>
        </View>
        <Text style={[
          styles.prayerTime,
          isNext && styles.nextPrayerText,
        ]}>
          {formatTime(time)}
        </Text>
      </TouchableOpacity>
    );
  };

  const getForbiddenTimeImage = (label: string) => {
    switch (label) {
      case 'Sunrise':
        return require('../../assets/images/material-symbols-light_prayer-times.png');
      case 'Noon':
        return require('../../assets/images/material-symbols-light_prayer-times-sun.png');
      case 'Sunset':
        return require('../../assets/images/material-symbols-light_prayer-times-nig.png');
      default:
        return require('../../assets/images/material-symbols-light_prayer-times.png');
    }
  };

  const renderForbiddenTime = (label: string, startTime: Date, endTime: Date) => {
    return (
      <View key={label} style={styles.forbiddenItem}>
        <View style={styles.forbiddenIcon}>
          <Image
            source={getForbiddenTimeImage(label)}
            style={styles.forbiddenImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.forbiddenInfo}>
          <Text style={styles.forbiddenLabel}>{label}</Text>
          <View style={styles.forbiddenTimes}>
            <Text style={styles.forbiddenTime}>{formatTime(startTime)}</Text>
            <View style={styles.timeSeparator} />
            <Text style={styles.forbiddenTime}>{formatTime(endTime)}</Text>
          </View>
        </View>
      </View>
    );
  };

  // Show loading while initial data loads
  if (loading && !prayerTimes) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Prayer Times</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B4513" />
          <Text style={styles.loadingText}>Loading prayer times...</Text>
        </View>
      </View>
    );
  }

  // Show empty state if no prayer times
  if (!prayerTimes) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Prayer Times</Text>
          <View style={{ width: 24 }} />
        </View>

        <LocationPermissionModal
          visible={showPermissionModal}
          loading={permissionLoading}
          error={permissionError}
          onRequestPermission={handleRequestPermission}
          onClose={handleCloseModal}
        />

        <View style={styles.emptyContainer}>
          <Ionicons name="location-outline" size={80} color="#CCC" />
          <Text style={styles.emptyText}>No prayer times available</Text>
          <Text style={styles.emptySubtext}>Please enable location access</Text>
          <TouchableOpacity
            style={styles.enableButton}
            onPress={() => setShowPermissionModal(true)}
          >
            <Text style={styles.enableButtonText}>Enable Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Calculate forbidden times
  const sunriseEnd = new Date(prayerTimes.sunrise);
  sunriseEnd.setMinutes(sunriseEnd.getMinutes() + 15);

  const noonStart = new Date(prayerTimes.dhuhr);
  noonStart.setMinutes(noonStart.getMinutes() - 8);
  const noonEnd = new Date(prayerTimes.dhuhr);
  noonEnd.setMinutes(noonEnd.getMinutes() + 8);

  const sunsetStart = new Date(prayerTimes.maghrib);
  sunsetStart.setMinutes(sunsetStart.getMinutes() - 15);

  return (
    <View style={styles.container}>
      <LocationPermissionModal
        visible={showPermissionModal}
        loading={permissionLoading}
        error={permissionError}
        onRequestPermission={handleRequestPermission}
        onClose={handleCloseModal}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prayer Times</Text>
        <TouchableOpacity onPress={() => router.push('/(prayer-times)/calendar')}>
          <Ionicons name="calendar-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshLocation}
            tintColor="#8B4513"
          />
        }
      >
        {/* Date Navigation */}
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={previousDay}>
            <Ionicons name="chevron-back" size={20} color="#3C3A35" />
          </TouchableOpacity>
          <View style={styles.dateInfo}>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            <Text style={styles.hijriText}>{hijriDate?.formatted}</Text>
          </View>
          <TouchableOpacity onPress={nextDay}>
            <Ionicons name="chevron-forward" size={20} color="#3C3A35" />
          </TouchableOpacity>
        </View>

        {/* Next Prayer Highlight */}
        {isToday && getNextPrayerForDisplay() && (
          <UpcomingSolatCard
            prayerName={getNextPrayerForDisplay().name}
            prayerTime={getNextPrayerForDisplay().time}
            formattedDate={formatDate(getNextPrayerForDisplay().time)}
            formattedTime={formatTime(getNextPrayerForDisplay().time)}
            locationName={locationName}
          />
        )}

        {/* Prayer Times List */}
        <View style={styles.prayerListContainer}>
          {renderPrayerItem('Subh', prayerTimes.fajr, isToday && getNextPrayerForDisplay()?.name === 'Fajr')}
          {renderPrayerItem('Dhuhr', prayerTimes.dhuhr, isToday && getNextPrayerForDisplay()?.name === 'Dhuhr')}
          {renderPrayerItem('Asr', prayerTimes.asr, isToday && getNextPrayerForDisplay()?.name === 'Asr')}
          {renderPrayerItem('Maghrib', prayerTimes.maghrib, isToday && getNextPrayerForDisplay()?.name === 'Maghrib')}
          {renderPrayerItem('Isha', prayerTimes.isha, isToday && getNextPrayerForDisplay()?.name === 'Isha')}
          {renderPrayerItem('Tahajjud', prayerTimes.fajr, false)}
        </View>

        {/* Forbidden Prayer Times */}
        <View style={styles.forbiddenContainer}>
          <Text style={styles.forbiddenTitle}>Forbidden Salat Times</Text>
          {renderForbiddenTime('Sunrise', prayerTimes.sunrise, sunriseEnd)}
          {renderForbiddenTime('Noon', noonStart, noonEnd)}
          {renderForbiddenTime('Sunset', sunsetStart, prayerTimes.maghrib)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  enableButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: '#8B4513',
    borderRadius: 12,
  },
  enableButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: theme.font.regular,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginTop: 1,
  },
  dateInfo: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    color: theme.color.brand,
    marginBottom: 4,
    fontFamily: theme.font.regular,

  },
  hijriText: {
    fontSize: 14,
    color: '#666',
        fontFamily: theme.font.regular,

  },
  upcomingContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  upcomingCard: {
    backgroundColor: theme.color.brand,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  upcomingIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingDate: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
        fontFamily: theme.font.regular,
  },
  upcomingPrayer: {
    fontSize: 20,
    fontFamily: theme.font.regular,
    color: '#FFFFFF',
    marginBottom: 3,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  prayerListContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  prayerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E3E3E3',
  },
  nextPrayerItem: {
    backgroundColor: '#8B4513',
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 12,
    fontFamily: theme.font.regular,
  },
  prayerTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: theme.font.regular,
  },
  nextPrayerText: {
    color: '#FFFFFF',
  },
  pastPrayerText: {
    color: '#999',
        fontFamily: theme.font.regular,

  },
  forbiddenContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  forbiddenTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  forbiddenItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  forbiddenIcon: {
    borderRadius: 28,
    // backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  forbiddenImage: {
    width: 50,
    height: 50,
  },
  forbiddenInfo: {
    flex: 1,
  },
  forbiddenLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
        fontFamily: theme.font.regular,

  },
  forbiddenTimes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forbiddenTime: {
    fontSize: 16,
    color: '#666',
        fontFamily: theme.font.semiBold,

  },
  timeSeparator: {
    width: 40,
    height: 1,
    backgroundColor: '#DDD',
    marginHorizontal: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});