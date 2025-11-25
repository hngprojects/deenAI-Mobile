import React, { useMemo } from "react";
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
import { usePrayerStore, usePrayerTimes } from "@/store/prayerStore";
import {
  generateCalendarGrid,
  getHijriDateString,
} from "@/utils/calendarLogic";

const { width: screenWidth } = Dimensions.get("window");

export default function CalendarScreen() {
  const router = useRouter();
  const { currentDate, setDate, nextMonth, prevMonth } = usePrayerStore();

  // ✨ Use the dedicated hook to get calculated prayer times reactively
  const prayerTimes = usePrayerTimes() as Record<string, string>;

  // These useMemos ensure calculation only runs when currentDate changes
  const calendarWeeks = useMemo(
    () => generateCalendarGrid(currentDate),
    [currentDate]
  );

  const hijriString = useMemo(
    () => getHijriDateString(currentDate),
    [currentDate]
  );

  const dayHeaders = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Define prayer order to match your design
  const prayerOrder = ["Subh", "Dhuhr", "Asr", "Maghrib", "Isha", "Tahajjud"];

  const handleDatePress = (dateObj: Date | null) => {
    if (dateObj) {
      setDate(dateObj);
    }
  };

  const handleNextMonth = () => {
    nextMonth();
  };

  const handlePrevMonth = () => {
    prevMonth();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <Image
            source={require("@/assets/images/prayerTimes-icons/arrow-left.png")}
            style={styles.backIcon}
          />
        </Pressable>

        <View style={styles.calendarHeader}>
          <View style={styles.monthYearContainer}>
            <Pressable
              onPress={handlePrevMonth}
              hitSlop={10}
              style={styles.navButton}
            >
              <Text style={styles.navButtonText}>‹</Text>
            </Pressable>
            <Text style={styles.monthYearText}>
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </Text>
            <Pressable
              onPress={handleNextMonth}
              hitSlop={10}
              style={styles.navButton}
            >
              <Text style={styles.navButtonText}>›</Text>
            </Pressable>
          </View>
          <Text style={styles.islamicMonthText}>{hijriString}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            // Check if this is the last week and has dates from next month
            const isLastWeek = weekIndex === calendarWeeks.length - 1;
            const hasNextMonthDates = week.some(
              (dateObj) =>
                dateObj && dateObj.getMonth() !== currentDate.getMonth()
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
                  const isSelected =
                    dateObj &&
                    dateObj.getDate() === currentDate.getDate() &&
                    dateObj.getMonth() === currentDate.getMonth() &&
                    dateObj.getFullYear() === currentDate.getFullYear();

                  const isCurrentMonth =
                    dateObj && dateObj.getMonth() === currentDate.getMonth();

                  const isLastCell = dayIndex === 6;

                  return (
                    <Pressable
                      key={dayIndex}
                      style={[
                        styles.dateCell,
                        isSelected && styles.selectedDateCell,
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
        </View>

        <View style={styles.prayerSection}>
          {prayerOrder.map((prayer) => {
            const time = prayerTimes[prayer];
            if (!time) return null;

            return (
              <View key={prayer} style={styles.prayerItem}>
                <View style={styles.prayerLeft}>
                  <Image
                    source={require("@/assets/images/prayerTimes-icons/speakerIcon.png")}
                    style={styles.speakerIcon}
                  />
                  <Text style={styles.prayerName}>{prayer}</Text>
                </View>
                <Text style={styles.prayerTime}>{time}</Text>
              </View>
            );
          })}
        </View>

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
    backgroundColor: "#FFFFFF",
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
    marginRight: responsiveSize(32),
  },
  monthYearContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: responsiveSize(4),
    gap: responsiveSize(12),
  },
  monthYearText: {
    fontSize: responsiveSize(18),
    fontWeight: "600",
    color: "#964B00",
    fontFamily: "NunitoSans-SemiBold",
  },
  navButton: {
    padding: responsiveSize(4),
  },
  navButtonText: {
    fontSize: responsiveSize(20),
    color: "#964B00",
    fontWeight: "600",
    fontFamily: "NunitoSans-SemiBold",
  },
  islamicMonthText: {
    fontSize: responsiveSize(12),
    color: "#666666",
    textAlign: "center",
    fontFamily: "NunitoSans-Regular",
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
    borderRadius: responsiveSize(16),
    overflow: "hidden",
    marginBottom: responsiveSize(24),
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#964B00",
    borderTopLeftRadius: responsiveSize(16),
    borderTopRightRadius: responsiveSize(16),
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#D5D4DF",
  },
  lastWeekRow: {
    backgroundColor: "#D5D4DF",
  },
  dayHeader: {
    flex: 1,
    paddingVertical: responsiveSize(14),
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "rgba(255, 255, 255, 0.2)",
  },
  lastDayHeader: {
    borderRightWidth: 0,
  },
  tableHeaderText: {
    fontSize: responsiveSize(13),
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "NunitoSans-SemiBold",
  },
  dateCell: {
    flex: 1,
    paddingVertical: responsiveSize(18),
    alignItems: "center",
    justifyContent: "center",
    minHeight: responsiveSize(52),
    borderRightWidth: 1,
    borderRightColor: "#E8E8E8",
  },
  selectedDateCell: {
    backgroundColor: "#964B00",
    marginHorizontal: responsiveSize(4),
    marginVertical: responsiveSize(4),
    borderRadius: responsiveSize(8),
  },
  lastCell: {
    borderRightWidth: 0,
  },
  dateText: {
    fontSize: responsiveSize(15),
    fontWeight: "500",
    color: "#3C3A35",
    fontFamily: "NunitoSans-Regular",
  },
  otherMonthText: {
    color: "#CCCCCC",
  },
  selectedDateText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontFamily: "NunitoSans-Bold",
  },
  emptyDateText: {
    color: "transparent",
  },
  prayerSection: {
    marginBottom: responsiveSize(24),
  },
  prayerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: responsiveSize(12),
    padding: responsiveSize(16),
    marginBottom: responsiveSize(12),
  },
  prayerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  speakerIcon: {
    width: responsiveSize(24),
    height: responsiveSize(24),
  },
  prayerName: {
    fontSize: responsiveSize(16),
    color: "#3C3A35",
    fontWeight: "500",
    marginLeft: responsiveSize(12),
    fontFamily: "NunitoSans-Regular",
  },
  prayerTime: {
    fontSize: responsiveSize(16),
    color: "#3C3A35",
    fontWeight: "600",
    fontFamily: "NunitoSans-SemiBold",
  },
  bottomSpace: {
    height: responsiveSize(40),
  },
});
