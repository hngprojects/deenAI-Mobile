import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function PrayerTimesScreen() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 20));

  // Mock prayer times data
  const prayerTimes = {
    Subh: '05:21 AM',
    Dhuhr: '12:30 PM', 
    Asr: '03:52 PM',
    Maghrib: '06:26 PM',
    Isha: '07:56 PM',
    Tahajjud: '01:39 AM'
  };

  const forbiddenTimes = [
    { period: 'Sunrise', start: '06:34 AM', end: '06:49 AM', icon: 'sunrise' },
    { period: 'Noon', start: '12:22 PM', end: '12:30 PM', icon: 'noon' },
    { period: 'Sunset', start: '06:10 PM', end: '06:25 PM', icon: 'sunset' }
  ];

  const islamicDate = '29 Jumada al-Awwal | 1447AH';

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

  return (
    <View style={[styles.container, { paddingTop: 30 }]}>
      {/* Header - Matching prayer details screen */}
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
              {islamicDate}
            </Text>
          </View>

          <Pressable onPress={navigateToNextDay} style={styles.iconButton}>
            <Image 
              source={require('@/assets/images/prayerTimes-icons/greaterthan.png')}
              style={styles.navIcon}
            />
          </Pressable>
        </View>

        {/* Individual Prayer Times Containers */}
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

        {/* Individual Forbidden Times Containers */}
        <View style={styles.section}>
  <Text style={styles.sectionTitle}>Forbidden Salat Times</Text>
  {forbiddenTimes.map((item, index) => (
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
  // Header matching prayer details screen
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
  // Individual prayer item containers
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
  // Individual forbidden item containers
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
  bottomSpace: {
    height: 20,
  },
});