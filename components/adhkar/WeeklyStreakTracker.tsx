import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WeeklyStreakTracker = ({ weekData = [] }) => {
  // Default data in case none is passed
  const defaultWeekData = [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: false },
    { day: 'Fri', completed: null },
    { day: 'Sat', completed: null },
    { day: 'Sun', completed: null },
  ];

  const data = weekData.length > 0 ? weekData : defaultWeekData;

  const getCircleStyle = (completed) => {
    if (completed === true) {
      return [styles.circle, styles.completedCircle];
    } else if (completed === false) {
      return [styles.circle, styles.incompleteCircle];
    } else {
      return [styles.circle, styles.upcomingCircle];
    }
  };

  const getCheckmark = (completed) => {
    if (completed === true) {
      return <Text style={styles.checkmark}>✓</Text>;
    } else if (completed === null) {
      return <Text style={[styles.checkmark, styles.fadedCheckmark]}>✓</Text>;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>3 Days Streak!</Text>
      <View style={styles.daysContainer}>
        {data.map((day, index) => (
          <View key={index} style={styles.dayItem}>
            <View style={getCircleStyle(day.completed)}>
              {getCheckmark(day.completed)}
            </View>
            <Text style={styles.dayText}>{day.day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#000',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dayItem: {
    alignItems: 'center',
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  completedCircle: {
    backgroundColor: '#964B00', // Solid brown
  },
  incompleteCircle: {
    backgroundColor: '#fff', // White
    borderWidth: 1,
    borderColor: '#964B00',
  },
  upcomingCircle: {
    backgroundColor: '#964B004D', // Brown with 30% opacity
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fadedCheckmark: {
    color: '#fff',
  },
  dayText: {
    fontSize: 12,
    color: '#000',
    marginTop: 4,
  },
});

export default WeeklyStreakTracker;