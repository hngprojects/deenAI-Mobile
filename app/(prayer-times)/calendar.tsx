import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { theme } from "@/styles/theme";
import {
  generateCalendarGrid,
  getHijriDateString,
  getISOWeekNumber,
} from "@/utils/calendarLogic";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function CalendarScreen() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Use the main hook with autoUpdate disabled (no countdown needed)
  const {
    prayerTimes,
    selectedDate,
    hijriDate,
    loading,
    error,
    savedLocation,
    changeDate,
    formatTime
  } = usePrayerTimes({ autoUpdate: false });

  const calendarWeeks = useMemo(
    () => generateCalendarGrid(currentMonth),
    [currentMonth]
  );

  const weekNumbers = useMemo(
    () =>
      calendarWeeks.map((week) => {
        const firstRealDay = week.find((d) => d !== null) as Date;
        return getISOWeekNumber(firstRealDay);
      }),
    [calendarWeeks]
  );

  const hijriString = useMemo(
    () => getHijriDateString(currentMonth),
    [currentMonth]
  );

  const dayHeaders = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const prayerOrder = [
    { key: "fajr", label: "Fajr" },
    { key: "sunrise", label: "Sunrise" },
    { key: "dhuhr", label: "Dhuhr" },
    { key: "asr", label: "Asr" },
    { key: "maghrib", label: "Maghrib" },
    { key: "isha", label: "Isha" },
  ];

  const handleDatePress = (dateObj: Date | null) => {
    if (dateObj) {
      changeDate(dateObj);
    }
  };

  const nextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const prevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    changeDate(today);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <Image
            source={require("@/assets/images/prayerTimes-icons/arrow-left.png")}
            style={styles.backIcon}
          />
        </Pressable>

        <View style={styles.calendarHeader}>
          <View style={styles.monthYearContainer}>
            {/* <Pressable
              onPress={prevMonth}
              hitSlop={10}
              style={styles.navButton}
            >
              <Ionicons name="chevron-back" size={20} color="#3C3A35" />
            </Pressable> */}
            <Text style={styles.monthYearText}>
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </Text>
            {/* <Pressable
              onPress={nextMonth}
              hitSlop={10}
              style={styles.navButton}
            >
              <Ionicons name="chevron-forward" size={20} color="#3C3A35" />
            </Pressable> */}
          </View>
          <Text style={styles.islamicMonthText}>{hijriString}</Text>
        </View>

        <Pressable onPress={goToToday} style={styles.todayButton}>
          <Text style={styles.todayButtonText}>Today</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar Grid */}
        <View style={styles.calendarTable}>
          <View style={styles.tableHeaderRow}>
            {dayHeaders.map((day, index) => (
              <View
                key={day}
                style={[
                  styles.dayHeader,
                  index === dayHeaders.length - 1 && styles.lastDayHeader,
                ]}
              >
                <Text style={styles.tableHeaderText}>{day}</Text>
              </View>
            ))}
          </View>

          {calendarWeeks.map((week, weekIndex) => {
            const isLastWeek = weekIndex === calendarWeeks.length - 1;
            const hasNextMonthDates = week.some(
              (dateObj) =>
                dateObj && dateObj.getMonth() !== currentMonth.getMonth()
            );

            return (
              <View
                key={weekIndex}
                style={[
                  styles.tableRow,
                  isLastWeek && hasNextMonthDates && styles.lastWeekRow,
                ]}
              >
                {week.map((dateObj, dayIndex) => {
                  const isSelected = dateObj && isSameDate(dateObj, selectedDate);
                  const isTodayDate = dateObj && isToday(dateObj);
                  const isCurrentMonth =
                    dateObj && dateObj.getMonth() === currentMonth.getMonth();
                  const isLastCell = dayIndex === 6;

                  return (
                    <Pressable
                      key={dayIndex}
                      style={[
                        styles.dateCell,
                        isSelected && styles.selectedDateCell,
                        isTodayDate && !isSelected && styles.todayDateCell,
                        isLastCell && styles.lastCell,
                      ]}
                      onPress={() => handleDatePress(dateObj)}
                      disabled={!dateObj}
                    >
                      <Text
                        style={[
                          styles.dateText,
                          !isCurrentMonth && styles.otherMonthText,
                          isSelected && styles.selectedDateText,
                          isTodayDate && !isSelected && styles.todayDateText,
                          !dateObj && styles.emptyDateText,
                        ]}
                      >
                        {dateObj ? dateObj.getDate() : ""}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            );
          })}

          {/* Week Numbers */}
          <View style={styles.weekNumberRow}>
            {weekNumbers.map((wn, i) => (
              <View key={i} style={styles.weekNumberCell}>
                <Text style={styles.weekNumberText}>W{wn}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Selected Date Info */}
        {/* <View style={styles.selectedDateInfo}>
          <Text style={styles.selectedDateLabel}>Selected Date</Text>
          <Text style={styles.selectedDateText}>
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
          {hijriDate && (
            <Text style={styles.selectedHijriText}>{hijriDate.formatted}</Text>
          )}
        </View> */}

        {/* Prayer Times Section */}
        {!savedLocation ? (
          <View style={styles.noLocationCard}>
            <Text style={styles.noLocationText}>
              Location access required for prayer times
            </Text>
            <Pressable
              style={styles.enableLocationButton}
              onPress={() => router.push("/(prayer-times)/prayerTimes")}
            >
              <Text style={styles.enableLocationButtonText}>
                Enable Location
              </Text>
            </Pressable>
          </View>
        ) : loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={theme.color.brand} />
            <Text style={styles.loadingText}>Loading prayer times...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : prayerTimes ? (
          <View style={styles.prayerSection}>
            <Text style={styles.prayerSectionTitle}>Prayer Times</Text>
            {prayerOrder.map(({ key, label }) => {
              const time = prayerTimes[key as keyof typeof prayerTimes];
              if (!time || !(time instanceof Date)) return null;

              const formattedTime = formatTime(time);
              const timeParts = formattedTime.match(/^(.+?)(\s*[AP]M)$/i);
              const timeValue = timeParts ? timeParts[1] : formattedTime;
              const period = timeParts ? timeParts[2].trim() : "";

              return (
                <View key={key} style={styles.prayerItem}>
                  <View style={styles.prayerLeft}>
                    <View style={styles.prayerIconContainer}>
                      <Image
                        source={require("@/assets/images/prayerTimes-icons/speakerIcon.png")}
                        style={styles.speakerIcon}
                      />
                    </View>
                    <Text style={styles.prayerName}>{label}</Text>
                  </View>
                  <View style={styles.prayerTimeContainer}>
                    <Text style={styles.prayerTime}>{timeValue}</Text>
                    <Text style={styles.prayerPeriod}>{period}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const responsiveSize = (size: number) =>
  Math.round(size * Math.min(screenWidth / 375, 1.2));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: responsiveSize(20),
    paddingVertical: responsiveSize(16),
    gap: responsiveSize(12),
  },
  iconButton: {
    padding: responsiveSize(8),
  },
  backIcon: {
    width: responsiveSize(24),
    height: responsiveSize(24),
  },
  calendarHeader: {
    flex: 1,
    alignItems: "center",
  },
  monthYearContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: responsiveSize(4),
    gap: responsiveSize(16),
  },
  monthYearText: {
    fontSize: responsiveSize(18),
    fontWeight: "600",
    color: theme.color.brand,
    fontFamily: theme.font.semiBold,
    minWidth: responsiveSize(140),
    textAlign: "center",
  },
  navButton: {
    padding: responsiveSize(4),
    width: responsiveSize(32),
    height: responsiveSize(32),
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonText: {
    fontSize: responsiveSize(28),
    color: theme.color.brand,
    fontWeight: "600",
    fontFamily: theme.font.semiBold,
  },
  islamicMonthText: {
    fontSize: responsiveSize(12),
    color: "#666666",
    textAlign: "center",
    fontFamily: theme.font.regular,
  },
  todayButton: {
    backgroundColor: theme.color.brand,
    paddingHorizontal: responsiveSize(12),
    paddingVertical: responsiveSize(6),
    borderRadius: responsiveSize(8),
  },
  todayButtonText: {
    fontSize: responsiveSize(12),
    color: "#FFFFFF",
    fontFamily: theme.font.semiBold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: responsiveSize(16),
    paddingTop: responsiveSize(20),
  },
  calendarTable: {
    backgroundColor: "#FFFFFF",
    borderRadius: responsiveSize(10),
    overflow: "hidden",
    marginBottom: responsiveSize(20),
    borderWidth: 1,
    borderColor: '#c3c3c6ff',

    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 3,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: theme.color.brand,
    borderTopLeftRadius: responsiveSize(10),
    borderTopRightRadius: responsiveSize(10),
    padding: responsiveSize(8),
  },
  tableRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#dfd3d3ff",
  },
  lastWeekRow: {
    backgroundColor: "#F9F9F9",
  },
  dayHeader: {
    flex: 1,
    paddingVertical: responsiveSize(12),
    alignItems: "center",
    justifyContent: "center",
  },
  lastDayHeader: {
    borderRightWidth: 0,
  },
  tableHeaderText: {
    fontSize: responsiveSize(13),
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: theme.font.semiBold,
  },
  dateCell: {
    flex: 1,
    paddingVertical: responsiveSize(16),
    alignItems: "center",
    justifyContent: "center",
    minHeight: responsiveSize(50),
  },
  selectedDateCell: {
    backgroundColor: theme.color.brand,
  },
  todayDateCell: {
    backgroundColor: "#FFF4E6",
  },
  lastCell: {
    borderRightWidth: 0,
  },
  dateText: {
    fontSize: responsiveSize(15),
    fontWeight: "500",
    color: "#3C3A35",
    fontFamily: theme.font.regular,
  },
  otherMonthText: {
    color: "#CCCCCC",
  },
  selectedDateText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontFamily: theme.font.bold,
  },
  todayDateText: {
    color: theme.color.brand,
    fontWeight: "600",
    fontFamily: theme.font.semiBold,
  },
  emptyDateText: {
    color: "transparent",
  },
  weekNumberRow: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
  },
  weekNumberCell: {
    flex: 1,
    paddingVertical: responsiveSize(8),
    alignItems: "center",
    justifyContent: "center",
  },
  weekNumberText: {
    fontSize: responsiveSize(11),
    color: "#999",
    fontWeight: "500",
    fontFamily: theme.font.regular,
  },
  selectedDateInfo: {
    backgroundColor: "#FFFFFF",
    borderRadius: responsiveSize(12),
    padding: responsiveSize(16),
    marginBottom: responsiveSize(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedDateLabel: {
    fontSize: responsiveSize(12),
    color: "#999",
    fontFamily: theme.font.regular,
    marginBottom: responsiveSize(4),
  },
  selectedDateText: {
    fontSize: responsiveSize(16),
    color: "#333",
    fontFamily: theme.font.semiBold,
    marginBottom: responsiveSize(4),
  },
  selectedHijriText: {
    fontSize: responsiveSize(13),
    color: theme.color.brand,
    fontFamily: theme.font.regular,
  },
  prayerSection: {
    marginBottom: responsiveSize(24),
  },
  prayerSectionTitle: {
    fontSize: responsiveSize(18),
    color: "#333",
    fontFamily: theme.font.bold,
    marginBottom: responsiveSize(12),
    paddingHorizontal: responsiveSize(4),
  },
  prayerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: responsiveSize(12),
    padding: responsiveSize(16),
    marginBottom: responsiveSize(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  prayerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: responsiveSize(12),
  },
  prayerIconContainer: {
    width: responsiveSize(40),
    height: responsiveSize(40),
    borderRadius: responsiveSize(20),
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  speakerIcon: {
    width: responsiveSize(20),
    height: responsiveSize(20),
  },
  prayerName: {
    fontSize: responsiveSize(16),
    color: "#3C3A35",
    fontWeight: "500",
    fontFamily: theme.font.regular,
  },
  prayerTimeContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: responsiveSize(4),
  },
  prayerTime: {
    fontSize: responsiveSize(18),
    color: theme.color.brand,
    fontWeight: "600",
    fontFamily: theme.font.semiBold,
  },
  prayerPeriod: {
    fontSize: responsiveSize(13),
    color: theme.color.brand,
    fontWeight: "500",
    fontFamily: theme.font.regular,
  },
  noLocationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: responsiveSize(12),
    padding: responsiveSize(24),
    alignItems: "center",
    gap: responsiveSize(16),
    marginBottom: responsiveSize(24),
  },
  noLocationText: {
    fontSize: responsiveSize(14),
    color: "#666",
    textAlign: "center",
    fontFamily: theme.font.regular,
  },
  enableLocationButton: {
    backgroundColor: theme.color.brand,
    paddingHorizontal: responsiveSize(24),
    paddingVertical: responsiveSize(12),
    borderRadius: responsiveSize(8),
  },
  enableLocationButtonText: {
    fontSize: responsiveSize(14),
    color: "#FFFFFF",
    fontFamily: theme.font.semiBold,
  },
  loadingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: responsiveSize(12),
    padding: responsiveSize(32),
    alignItems: "center",
    gap: responsiveSize(16),
    marginBottom: responsiveSize(24),
  },
  loadingText: {
    fontSize: responsiveSize(14),
    color: "#666",
    fontFamily: theme.font.regular,
  },
  errorCard: {
    backgroundColor: "#FEE",
    borderRadius: responsiveSize(12),
    padding: responsiveSize(16),
    marginBottom: responsiveSize(24),
  },
  errorText: {
    fontSize: responsiveSize(14),
    color: "#C00",
    textAlign: "center",
    fontFamily: theme.font.regular,
  },
  bottomSpace: {
    height: responsiveSize(40),
  },
});