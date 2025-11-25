import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(19);

  // Mock prayer times data
  const prayerTimes = {
    Subh: "05:21 AM",
    Dhuhr: "12:30 PM",
    Asr: "03:52 PM",
    Maghrib: "06:26 PM",
    Isha: "07:56 PM",
    Tahajjud: "01:39 AM",
  };

  // Calendar data without row numbers
  const calendarWeeks = [
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30],
    [1, 2, 3, 4, 5, 6, 7],
  ];

  const dayHeaders = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

  const handleDatePress = (date: number) => {
    setSelectedDate(date);
  };

  return (
    <View style={[styles.container, { paddingTop: 30 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <Image
            source={require("@/assets/images/prayerTimes-icons/arrow-left.png")}
            style={styles.backIcon}
          />
        </Pressable>

        {/* Calendar Header with Month/Year */}
        <View style={styles.calendarHeader}>
          <View style={styles.monthYearContainer}>
            <Text style={styles.monthYearText}>November, 2025</Text>
            <Image
              source={require("@/assets/images/prayerTimes-icons/arrow-down.png")}
              style={styles.dropdownIcon}
            />
          </View>
          <Text style={styles.islamicMonthText}>
            Jumada I – Jumada II, 1447
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Calendar Grid - Without "No" Column */}
        <View style={styles.calendarTable}>
          {/* Table Headers - Only Day Headers */}
          <View style={styles.tableHeaderRow}>
            {dayHeaders.map((day) => (
              <View key={day} style={styles.dayHeader}>
                <Text style={styles.tableHeaderText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Table Rows with Borders - No Week Numbers */}
          {calendarWeeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.tableRow}>
              {week.map((date, dayIndex) => (
                <Pressable
                  key={dayIndex}
                  style={[
                    styles.dateCell,
                    styles.tableCell,
                    dayIndex === 6 && styles.lastCell, // Last cell in row
                    date === selectedDate && styles.selectedDateCell,
                  ]}
                  onPress={() => handleDatePress(date)}
                >
                  <Text
                    style={[
                      styles.dateText,
                      date === selectedDate && styles.selectedDateText,
                    ]}
                  >
                    {date}
                  </Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>

        {/* Prayer Times Section */}
        <View style={styles.prayerSection}>
          <Text style={styles.prayerSectionTitle}>Daily Prayers</Text>

          {/* Individual Prayer Time Containers */}
          {Object.entries(prayerTimes).map(([prayer, time]) => (
            <View key={prayer} style={styles.prayerItemContainer}>
              <View style={styles.prayerItem}>
                <View style={styles.prayerLeft}>
                  <Image
                    source={require("@/assets/images/speakerIcon.png")}
                    style={styles.speakerIcon}
                  />
                  <Text style={styles.prayerName}>{prayer}</Text>
                </View>
                <Text style={styles.prayerTime}>{time}</Text>
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

const responsiveSize = (size: number) => {
  const scale = screenWidth / 375;
  return Math.round(size * Math.min(scale, 1.2));
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveSize(16),
    paddingVertical: responsiveSize(16),
    backgroundColor: "#ffffff",
  },
  calendarHeader: {
    alignItems: "center",
    flex: 1,
  },
  monthYearContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsiveSize(4),
  },
  monthYearText: {
    fontSize: responsiveSize(18),
    fontWeight: "600",
    color: "#9C7630",
    marginRight: responsiveSize(8),
  },
  dropdownIcon: {
    width: responsiveSize(16),
    height: responsiveSize(16),
  },
  islamicMonthText: {
    fontSize: responsiveSize(12),
    color: "#666666",
    textAlign: "center",
  },
  iconButton: {
    padding: responsiveSize(8),
  },
  backIcon: {
    width: responsiveSize(24),
    height: responsiveSize(24),
  },
  calendarIcon: {
    width: responsiveSize(20),
    height: responsiveSize(20),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: responsiveSize(16),
    paddingVertical: responsiveSize(20),
  },
  // Updated Calendar Table without "No" Column
  calendarTable: {
    backgroundColor: "#ffffff",
    borderRadius: responsiveSize(12),
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: responsiveSize(24),
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#964B00",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  dayHeader: {
    flex: 1,
    paddingVertical: responsiveSize(12),
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#ffffff",
  },
  tableCell: {
    flex: 1,
    paddingVertical: responsiveSize(12),
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#E5E5E5",
  },
  dateCell: {
    // Additional date cell styling if needed
  },
  lastCell: {
    borderRightWidth: 0, // Remove right border for last cell
  },
  tableHeaderText: {
    fontSize: responsiveSize(14),
    fontWeight: "600",
    color: "#ffffff",
  },
  dateText: {
    fontSize: responsiveSize(14),
    fontWeight: "500",
    color: "#000000",
  },
  selectedDateCell: {
    backgroundColor: "#964B00",
  },
  selectedDateText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  // Prayer Times Section
  prayerSection: {
    marginBottom: responsiveSize(24),
  },
  prayerSectionTitle: {
    fontSize: responsiveSize(18),
    fontWeight: "600",
    color: "#000000",
    marginBottom: responsiveSize(16),
  },
  prayerItemContainer: {
    marginBottom: responsiveSize(12),
  },
  prayerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: responsiveSize(12),
    padding: responsiveSize(16),
  },
  prayerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  prayerName: {
    fontSize: responsiveSize(16),
    color: "#000000",
    fontWeight: "500",
    marginLeft: responsiveSize(12),
  },
  prayerTime: {
    fontSize: responsiveSize(16),
    color: "#000000",
    fontWeight: "500",
  },
  speakerIcon: {
    width: responsiveSize(24),
    height: responsiveSize(24),
  },
  bottomSpace: {
    height: responsiveSize(20),
  },
});
