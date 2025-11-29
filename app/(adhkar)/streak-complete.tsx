import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  View,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import WeeklyStreakTracker from '@/components/adhkar/WeeklyStreakTracker';

const StreakCompleteScreen = () => {
  const router = useRouter();

  const handleClose = () => {
    router.push('/index');
  };

  const handleViewAnalytics = () => {
    // Navigate to analytics screen
    router.push('/analytics');
  };

  const handleBackToAzkar = () => {
    // Navigate back to main Azkar screen
    router.push('/adhkar');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* X Button - Top Right */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeText}>X</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.celebrationIconSection}>
    <Image 
      source={require('@/assets/images/adhkar/big-fire-icon.png')} // Your large celebration icon
      style={styles.celebrationIcon}
      resizeMode="contain"
    />
  </View>
        {/* Celebration Text */}
        <View style={styles.textSection}>
          <Text style={styles.boldText}>Streak Complete!</Text>
          <Text style={styles.lightText}>Alhamdullilah! You've completed your Adhkar for today.</Text>
          <Text style={styles.lightText}>May your dedication be rewarded</Text>
        </View>

        {/* Streak Number with Fire Icon */}
        <View style={styles.streakNumberSection}>
          <Text style={styles.streakNumber}>3</Text>
          <Image 
            source={require('@/assets/images/adhkar/fire-pit.png')}
            style={styles.fireIcon}
            resizeMode="contain"
          />
        </View>

        {/* Weekly Streak Tracker */}
        <WeeklyStreakTracker />

        {/* Achievement Container */}
        <View style={styles.achievementContainer}>
          <Text style={styles.achievementTitle}>Today's Achievement</Text>
          
          <View style={styles.achievementsRow}>
            {/* Minutes */}
            <View style={styles.achievementItem}>
              <Image 
                source={require('@/assets/images/adhkar/time-icon.png')}
                style={styles.achievementIcon}
                resizeMode="contain"
              />
              <Text style={styles.achievementValue}>5</Text>
              <Text style={styles.achievementLabel}>Minutes</Text>
            </View>

            {/* Day Streak */}
            <View style={styles.achievementItem}>
              <Image 
                source={require('@/assets/images/adhkar/small-fire-icon.png')}
                style={styles.achievementIcon}
                resizeMode="contain"
              />
              <Text style={styles.achievementValue}>13</Text>
              <Text style={styles.achievementLabel}>Day Streak</Text>
            </View>

            {/* Total Days */}
            <View style={styles.achievementItem}>
              <Image 
                source={require('@/assets/images/adhkar/date-icon.png')}
                style={styles.achievementIcon}
                resizeMode="contain"
              />
              <Text style={styles.achievementValue}>46</Text>
              <Text style={styles.achievementLabel}>Total Days</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleViewAnalytics}
          >
            <Text style={styles.primaryButtonText}>View Analytics</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={handleBackToAzkar}
          >
            <Text style={styles.secondaryButtonText}>Back to Azkar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  // Text section
  textSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  boldText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  lightText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },
  // Streak number section
  streakNumberSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  streakNumber: {
    fontSize: 56,
    fontWeight: '800',
    color: '#000',
    marginRight: 8,
  },
  fireIcon: {
    width: 40,
    height: 40,
  },
  // Achievement container styles
  achievementContainer: {
    backgroundColor: '#ffff',
    width: '100%',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 10,
    marginBottom: 20,
  },
  achievementsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  achievementItem: {
    alignItems: 'center',
    flex: 1,
  },
  achievementIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
  },
  achievementValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  achievementLabel: {
    fontSize: 14,
    color: '#737373',
  },
  // Action buttons
  buttonsContainer: {
    width: '100%',
    marginTop: 30,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#964B00',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffff',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#964B00',
  },
  secondaryButtonText: {
    color: '#3C3A35',
    fontSize: 16,
    fontWeight: '600',
  },
  celebrationIconSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  celebrationIcon: {
    width: 120, 
    height: 120, 
  },
  

});

export default StreakCompleteScreen;