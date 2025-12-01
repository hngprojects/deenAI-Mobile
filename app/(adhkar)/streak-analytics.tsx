import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { useStreakStore } from "@/store/streak-store";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function StreakAnalyticsScreen() {
  const {
    currentStreak,
    longestStreak,
    totalDays,
    streakHistory,
    getStreakForDate,
  } = useStreakStore();

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I've maintained a ${currentStreak}-day Azkar streak on Deen AI! 🔥 My longest streak is ${longestStreak} days. Join me in building consistent spiritual habits!`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handlePreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split("T")[0];
      const streakDay = getStreakForDate(dateString);

      days.push({
        day,
        date: dateString,
        completed: streakDay?.completed || false,
        isToday: dateString === new Date().toISOString().split("T")[0],
      });
    }

    return days;
  };

  const calendarDays = getCalendarDays();
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  // Achievement badges
  const achievements = [
    {
      id: "7day",
      title: "7 Day Streak",
      icon: "flame",
      unlocked: longestStreak >= 7,
      locked: true,
    },
    {
      id: "30day",
      title: "30 Day Streak",
      icon: "flame",
      unlocked: longestStreak >= 30,
      locked: true,
    },
    {
      id: "100day",
      title: "100 Days Streak",
      icon: "flame",
      unlocked: longestStreak >= 100,
      locked: true,
    },
    {
      id: "1000day",
      title: "1000 Day Streak",
      icon: "flame",
      unlocked: longestStreak >= 1000,
      locked: true,
    },
  ];

  return (
    <ScreenContainer>
      <ScreenHeader title="Your Azkar Streak" showBackButton />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Streak Display */}
        <View style={styles.mainStreakCard}>
          <View style={styles.streakIconContainer}>
            <Image
              source={require("@/assets/images/fire-pit.png")}
              resizeMode="contain"
              style={{ width: 80, height: 80 }}
            />
            <View style={styles.streakIconBadge}>
              <Text style={styles.streakBadgeNumber}>{currentStreak}</Text>
            </View>
          </View>
          <Text style={styles.streakLabel}>Day streak</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconWrapper}>
              <Image
                source={require("@/assets/images/sFlame.png")}
                resizeMode="contain"
                style={{ width: 25, height: 25 }}
              />
            </View>
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Current</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconWrapper}>
              <Image
                source={require("@/assets/images/achie.png")}
                resizeMode="contain"
                style={{ width: 25, height: 25 }}
              />
            </View>
            <Text style={styles.statValue}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Longest</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconWrapper}>
              <Image
                source={require("@/assets/images/tDays.png")}
                resizeMode="contain"
                style={{ width: 25, height: 25 }}
              />
            </View>
            <Text style={styles.statValue}>{totalDays}</Text>
            <Text style={styles.statLabel}>Total Days</Text>
          </View>
        </View>

        {/* Calendar */}
        {/* <View style={styles.calendarSection}>
                    <Text style={styles.sectionTitle}>Streak Calendar</Text>

                    <View style={styles.calendarCard}>
                        <View style={styles.monthHeader}>
                            <TouchableOpacity
                                onPress={handlePreviousMonth}
                                style={styles.monthButton}
                            >
                                <Ionicons name="chevron-back" size={20} color="#666" />
                            </TouchableOpacity>

                            <Text style={styles.monthText}>{getMonthName(currentMonth)}</Text>

                            <TouchableOpacity
                                onPress={handleNextMonth}
                                style={styles.monthButton}
                            >
                                <Ionicons name="chevron-forward" size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.weekHeader}>
                            {weekDays.map((day, index) => (
                                <Text key={index} style={styles.weekDayText}>
                                    {day}
                                </Text>
                            ))}
                        </View>

                        <View style={styles.calendarGrid}>
                            {calendarDays.map((day, index) => {
                                if (!day) {
                                    return <View key={`empty-${index}`} style={styles.dayCell} />;
                                }

                                return (
                                    <View key={day.date} style={styles.dayCell}>
                                        <View
                                            style={[
                                                styles.dayCircle,
                                                day.completed && styles.dayCircleCompleted,
                                                day.isToday && styles.dayCircleToday,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.dayText,
                                                    day.completed && styles.dayTextCompleted,
                                                ]}
                                            >
                                                {day.day}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View> */}

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>

          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  achievement.locked && styles.achievementCardLocked,
                ]}
              >
                <View
                  style={[
                    styles.achievementIcon,
                    achievement.locked && styles.achievementIconLocked,
                  ]}
                >
                  <Ionicons
                    name={achievement.icon as any}
                    size={32}
                    color={achievement.locked ? "#CCC" : "#964B00"}
                  />
                </View>
                <Text
                  style={[
                    styles.achievementTitle,
                    achievement.locked && styles.achievementTitleLocked,
                  ]}
                >
                  {achievement.title}
                </Text>
                {achievement.locked && (
                  <Text style={styles.lockedText}>Locked</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Quote */}
        <View style={styles.quoteCard}>
          <Ionicons name="chatbox-ellipses" size={32} color="#FFF" />
          <Text style={styles.quoteText}>
            &quot;Allah love those that are constant in their actions.&quot;
          </Text>
          <Text style={styles.quoteSource}>~ Hadith (Sahih Muslim)</Text>
        </View>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-social" size={20} color="#964B00" />
          <Text style={styles.shareButtonText}>Share My Streak</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  mainStreakCard: {
    // backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  streakIconContainer: {
    position: "relative",
    marginBottom: 16,
    backgroundColor: "#ffffffff",
    padding: 20,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#e2dfddff",
  },
  streakIconBadge: {
    position: "absolute",
    bottom: -25,
    left: "10%",
    // transform: [{ translateX: -25 }],
    backgroundColor: "#964B00",
    borderRadius: 15,
    width: 80,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFF",
    zIndex: 1,
  },
  streakBadgeNumber: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  streakLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2dfddff",
  },
  statIconWrapper: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eaeae9ff",
    borderRadius: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  calendarSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  calendarCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    width: 36,
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  dayCircleCompleted: {
    backgroundColor: "#964B00",
  },
  dayCircleToday: {
    borderWidth: 2,
    borderColor: "#964B00",
  },
  dayText: {
    fontSize: 12,
    color: "#666",
  },
  dayTextCompleted: {
    color: "#FFF",
    fontWeight: "600",
  },
  achievementsSection: {
    marginBottom: 24,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  achievementCard: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementCardLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF3E7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  achievementIconLocked: {
    backgroundColor: "#F5F5F5",
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "center",
  },
  achievementTitleLocked: {
    color: "#999",
  },
  lockedText: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
  },
  quoteCard: {
    backgroundColor: "#964B00",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  quoteText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  quoteSource: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    fontStyle: "italic",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#964B00",
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#964B00",
  },
});
