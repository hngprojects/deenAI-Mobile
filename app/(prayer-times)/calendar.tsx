// app/(prayer-times)/calendar.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';

export default function CalendarScreen() {
  const {
    prayerTimes,
    selectedDate,
    hijriDate,
    changeDate,
    goToToday,
    formatTime,
  } = usePrayerTimes();

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const previousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const selectDate = (day: number) => {
    const newDate = new Date(currentMonth);
    newDate.setDate(day);
    changeDate(newDate);
    router.back();
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const today = new Date();
  const isCurrentMonth = currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === today.getDate();
      const isSelected = selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear();

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isToday && styles.todayCell,
            isSelected && styles.selectedCell,
          ]}
          onPress={() => selectDate(day)}
        >
          <Text style={[
            styles.dayText,
            isToday && styles.todayText,
            isSelected && styles.selectedText,
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {monthNames[currentMonth.getMonth()]}, {currentMonth.getFullYear()}
          </Text>
          <Text style={styles.headerSubtitle}>
            Jumada I - Jumada II, {hijriDate?.year || 1447}
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Month Navigation */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={previousMonth} style={styles.monthButton}>
            <Ionicons name="chevron-back" size={24} color="#8B4513" />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={nextMonth} style={styles.monthButton}>
            <Ionicons name="chevron-forward" size={24} color="#8B4513" />
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          {/* Day Names Header */}
          <View style={styles.dayNamesRow}>
            {dayNames.map((day) => (
              <View key={day} style={styles.dayNameCell}>
                <Text style={styles.dayNameText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {renderCalendarDays()}
          </View>
        </View>

        {/* Prayer Times for Selected Date */}
        {prayerTimes && (
          <View style={styles.prayerTimesContainer}>
            <Text style={styles.prayerTimesTitle}>
              Prayer Times - {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </Text>

            <View style={styles.prayerTimesList}>
              <PrayerTimeRow icon="sunny-outline" name="Subh" time={formatTime(prayerTimes.fajr)} />
              <PrayerTimeRow icon="partly-sunny-outline" name="Dhuhr" time={formatTime(prayerTimes.dhuhr)} />
              <PrayerTimeRow icon="cloudy-outline" name="Asr" time={formatTime(prayerTimes.asr)} />
              <PrayerTimeRow icon="moon-outline" name="Maghrib" time={formatTime(prayerTimes.maghrib)} />
              <PrayerTimeRow icon="moon" name="Isha" time={formatTime(prayerTimes.isha)} />
              <PrayerTimeRow icon="star-outline" name="Tahajjud" time={formatTime(prayerTimes.fajr)} />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const PrayerTimeRow = ({ icon, name, time }: { icon: any, name: string, time: string }) => (
  <View style={styles.prayerTimeRow}>
    <View style={styles.prayerTimeLeft}>
      <Ionicons name={icon} size={20} color="#8B4513" />
      <Text style={styles.prayerTimeName}>{name}</Text>
    </View>
    <Text style={styles.prayerTimeValue}>{time}</Text>
  </View>
);

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
    backgroundColor: '#FFFFFF',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 1,
  },
  monthButton: {
    padding: 8,
  },
  todayButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#8B4513',
    borderRadius: 8,
  },
  todayButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#8B4513',
  },
  dayNameCell: {
    width: 40,
    alignItems: 'center',
  },
  dayNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  todayCell: {
    backgroundColor: '#FFF5E6',
  },
  selectedCell: {
    backgroundColor: '#8B4513',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  todayText: {
    fontWeight: '600',
    color: '#8B4513',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  prayerTimesContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  prayerTimesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  prayerTimesList: {
    gap: 12,
  },
  prayerTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  prayerTimeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prayerTimeName: {
    fontSize: 16,
    color: '#333',
  },
  prayerTimeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
  },
});