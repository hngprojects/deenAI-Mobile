import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  Image, 
  StyleSheet, 
  Dimensions,
  useWindowDimensions 
} from 'react-native';
import { useRouter } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive sizing functions
const responsiveSize = (size: number) => {
  const scale = screenWidth / 375; // 375 is typical mobile width
  return Math.round(size * scale);
};

const responsivePadding = (size: number) => {
  return responsiveSize(size);
};

export default function PrayerDetailsScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 20));

  // Mock data
  const prayerTimes = {
    Asr: '03:52 PM',
    Maghrib: '06:26 PM',
    Isha: '07:56 PM',
    Tahajjud: '01:39 AM'
  };

  const forbiddenTimes = [
    { period: 'Sunrise', start: '06:34 AM', end: '06:49 AM' },
    { period: 'Noon', start: '12:22 PM', end: '12:30 PM' },
    { period: 'Sunset', start: '06:10 PM', end: '06:25 PM' }
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
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <Image 
            source={require('@/assets/images/prayerTimes-icons/arrow-left.png')}
            style={[styles.backIcon, { width: responsiveSize(24), height: responsiveSize(24) }]}
          />
        </Pressable>
        
        <Text style={[styles.headerTitle, { fontSize: responsiveSize(18) }]}>Prayer Times</Text>

        {/* Updated Calendar Icon with Navigation */}
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

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: responsivePadding(16), paddingVertical: responsivePadding(24) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Navigation */}
        <View style={[styles.dateNavigation, { marginBottom: responsiveSize(24) }]}>
          <Pressable onPress={navigateToPreviousDay} style={styles.iconButton}>
            <Image 
              source={require('@/assets/images/prayerTimes-icons/lessthan.png')}
              style={[styles.navIcon, { width: responsiveSize(24), height: responsiveSize(24) }]}
            />
          </Pressable>

          <View style={styles.dateContainer}>
            <Text style={[styles.gregorianDate, { fontSize: responsiveSize(20) }]}>
              {formatGregorianDate(currentDate)}
            </Text>
            <Text style={[styles.islamicDate, { fontSize: responsiveSize(14), marginTop: responsiveSize(4) }]}>
              {islamicDate}
            </Text>
          </View>

          <Pressable onPress={navigateToNextDay} style={styles.iconButton}>
            <Image 
              source={require('@/assets/images/prayerTimes-icons/greaterthan.png')}
              style={[styles.navIcon, { width: responsiveSize(24), height: responsiveSize(24) }]}
            />
          </Pressable>
        </View>

        {/* Upcoming Solat Section */}
        <View style={[styles.section, { marginBottom: responsiveSize(24) }]}>
          <Text style={[styles.sectionTitle, { fontSize: responsiveSize(18), marginBottom: responsiveSize(12) }]}>
            Upcoming Solat
          </Text>
          <View style={[styles.upcomingContainer, { 
            borderRadius: responsiveSize(12), 
            padding: responsiveSize(16) 
          }]}>
            <View style={styles.upcomingContent}>
              <Image 
                source={require('@/assets/images/pTime.png')}
                style={[styles.upcomingIcon, { 
                  width: responsiveSize(55), 
                  height: responsiveSize(55),
                  marginRight: responsiveSize(12),
                  
                }]}
              />
              <View style={styles.upcomingTextContainer}>
                <Text style={[styles.upcomingTime, { fontSize: responsiveSize(14), marginBottom: responsiveSize(2) }]}>
                  Nov. 19 2025 • 12:30pm
                </Text>
                <Text style={[styles.upcomingPrayer, { fontSize: responsiveSize(18), marginBottom: responsiveSize(2) }]}>
                  Dhuhr Prayer
                </Text>
                <Text style={[styles.upcomingLocation, { fontSize: responsiveSize(14) }]}>
                  Lagos, Nigeria
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Prayer Times Containers */}
        <View style={[styles.section, { marginBottom: responsiveSize(24) }]}>
          {Object.entries(prayerTimes).map(([prayer, time]) => (
            <View key={prayer} style={[styles.prayerItemContainer, { marginBottom: responsiveSize(12) }]}>
              <View style={[styles.prayerItem, { 
                borderRadius: responsiveSize(12), 
                padding: responsiveSize(16) 
              }]}>
                <View style={styles.prayerLeft}>
                  <Image 
                    source={require('@/assets/images/speakerIcon.png')}
                    style={[styles.speakerIcon, { 
                      width: responsiveSize(24), 
                      height: responsiveSize(24),
                      marginRight: responsiveSize(12)
                    }]}
                  />
                  <Text style={[styles.prayerName, { fontSize: responsiveSize(16) }]}>{prayer}</Text>
                </View>
                <Text style={[styles.prayerTime, { fontSize: responsiveSize(16) }]}>{time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Forbidden Salat Times */}
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
        
        {/* Add extra padding at bottom for very small screens */}
        <View style={{ height: responsiveSize(20) }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
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
    fontWeight: '600',
    color: '#000000',
  },
  iconButton: {
    padding: 8,
  },
  backIcon: {
    // Size handled by responsive function
  },
  calendarIcon: {
    // Size handled by responsive function
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // Padding handled by responsive function
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateContainer: {
    alignItems: 'center',
    flex: 1,
  },
  gregorianDate: {
    color: '#9C7630',
    fontWeight: '600',
    textAlign: 'center',
  },
  islamicDate: {
    color: '#3C3A35',
    textAlign: 'center',
  },
  navIcon: {
    // Size handled by responsive function
  },
  section: {
    // Margin handled by responsive function
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#000000',
  },
  upcomingContainer: {
    backgroundColor: '#964B00',
  },
  upcomingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingIcon: {
    // Size and margin handled by responsive function
  },
  upcomingTextContainer: {
    flex: 1,
  },
  upcomingTime: {
    color: '#ffffff',
    opacity: 0.9,
  },
  upcomingPrayer: {
    color: '#ffffff',
    fontWeight: '600',
  },
  upcomingLocation: {
    color: '#ffffff',
    opacity: 0.8,
  },
  prayerItemContainer: {
    // Margin handled by responsive function
  },
  prayerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  prayerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speakerIcon: {
    // Size and margin handled by responsive function
  },
  prayerName: {
    color: '#000000',
    fontWeight: '500',
  },
  prayerTime: {
    color: '#000000',
    fontWeight: '500',
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
    color: '#000000',
    fontWeight: '500',
    fontWeight: '500',
    marginBottom: 4,
  },
  forbiddenTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forbiddenTime: {
    color: '#666666',
    fontSize: 14,
  },
  timeSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#666666',
    marginHorizontal: 8,
    opacity: 0.5,
  },
});