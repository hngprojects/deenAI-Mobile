import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Flame, Lock } from "lucide-react-native";
import { theme } from "@/styles/theme";

const AzkarStreakCalender = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER STREAK */}
      <View style={styles.centered}>
        <View style={styles.streakIconCircle}>
          <Flame size={42} color={theme.color.brand} strokeWidth={1.4} />
        </View>
        <View style={styles.streakNumberBox}>
          <Text style={styles.streakNumber}>3</Text>
        </View>
        <Text style={styles.streakLabel}>Day streak</Text>
      </View>

      {/* STATS ROW */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Image
            source={require("@/assets/images/adkhar/fire.png")}
            resizeMode="contain"
          />
          <Text style={styles.statCardNumber}>3</Text>
          <Text style={styles.statCardLabel}>Current</Text>
        </View>

        <View style={styles.statCard}>
          <Image
            source={require("@/assets/images/adhkar/badge.png")}
            resizeMode="contain"
          />
          <Text style={styles.statCardNumber}>28</Text>
          <Text style={styles.statCardLabel}>Longest</Text>
        </View>

        <View style={styles.statCard}>
          <Image
            source={require("@/assets/images/adhkar/calender.png")}
            resizeMode="contain"
          />
          <Text style={styles.statCardNumber}>46</Text>
          <Text style={styles.statCardLabel}>Total Days</Text>
        </View>
      </View>

      {/* STREAK CALENDAR */}
      <Text style={styles.sectionTitle}>Streak Calendar</Text>

      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarMonth}>November 2025</Text>

          <View style={styles.calendarArrows}>
            <TouchableOpacity style={styles.arrowBtn}>
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.arrowBtn}>
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* WEEK DAYS */}
        <View style={styles.weekRow}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <Text key={d} style={styles.weekLabel}>
              {d}
            </Text>
          ))}
        </View>

        {/* CALENDAR DATES */}
        <View style={styles.calendarGrid}>
          {/* 1–30 Calendar Example */}
          {[...Array(30)].map((_, i) => {
            const day = i + 1;

            const isHighlighted = day >= 5 && day <= 18;
            const isToday = day === 6;

            return (
              <View
                key={day}
                style={[
                  styles.dayCell,
                  isToday && styles.today,
                  isHighlighted && styles.streakDay,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    isToday && styles.todayText,
                    isHighlighted && styles.streakDayText,
                  ]}
                >
                  {day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* ACHIEVEMENTS */}
      <Text style={styles.sectionTitle}>Achievements</Text>

      <View style={styles.achievementsGrid}>
        {/* Active Achievement */}
        <View style={[styles.achievementCard, styles.activeAchievement]}>
          <Flame size={24} color={theme.color.brand} />
          <Text style={styles.achievementText}>7 Day Streak</Text>
        </View>

        {/* Locked Achievement */}
        <View style={styles.achievementCard}>
          <Image
            source={require("@/assets/images/adkhar/fire.png")}
            resizeMode="contain"
          />
          <Lock size={24} color="#BBB" />
          <Text style={styles.achievementLocked}>30 Day Streak</Text>
          <Text style={styles.lockedLabel}>Locked</Text>
        </View>

        <View style={styles.achievementCard}>
          <Flame size={24} color={theme.color.brand} />

          <Text style={styles.achievementLocked}>100 Days Streak</Text>
          <Text style={styles.lockedLabel}>Locked</Text>
        </View>

        <View style={[styles.achievementCard, styles.activeAchievement]}>
          <Flame size={24} color={theme.color.brand} />
          <Text style={styles.achievementText}>7 Day Streak</Text>
        </View>
      </View>

      {/* QUOTE BOX */}
      <View style={styles.quoteBox}>
        <Image
          source={require("@/assets/images/adkhar/fire.png")}
          resizeMode="contain"
        />
        <Text style={styles.quoteText}>
          “Allah love those that are constant in their actions”
        </Text>
        <Text style={styles.quoteSource}>– Hadith (Sahih Muslim)</Text>
      </View>
    </ScrollView>
  );
};

export default AzkarStreakCalender;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  centered: { alignItems: "center", marginBottom: 30 },

  streakIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },

  streakNumberBox: {
    marginTop: 12,
    backgroundColor: theme.color.brand,
    paddingVertical: 6,
    paddingHorizontal: 24,
    borderRadius: 16,
  },

  streakNumber: { color: "white", fontSize: 18, fontWeight: "700" },
  streakLabel: { marginTop: 6, fontSize: 14, color: "#777" },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  statCard: {
    width: "30%",
    backgroundColor: "#FFF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
  },

  statCardNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.color.secondary,
    marginVertical: 4,
  },

  statCardLabel: {
    fontSize: 12,
    color: "#777",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.color.secondary,
    marginBottom: 10,
  },

  calendarContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },

  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  calendarMonth: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.color.secondary,
  },

  calendarArrows: { flexDirection: "row", gap: 10 },

  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F3F3",
    justifyContent: "center",
    alignItems: "center",
  },

  arrowText: { fontSize: 18, color: "#444" },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  weekLabel: { fontSize: 12, color: "#AAA" },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  dayCell: {
    width: "13%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 6,
    borderRadius: 10,
  },

  dayText: { color: "#444" },

  today: {
    backgroundColor: theme.color.brand,
  },

  todayText: {
    color: "white",
    fontWeight: "700",
  },

  streakDay: {
    backgroundColor: "#F6E7D9",
  },

  streakDayText: {
    color: theme.color.brand,
    fontWeight: "600",
  },

  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 30,
  },

  achievementCard: {
    width: "48%",
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
  },

  activeAchievement: {
    backgroundColor: "#FFF7EE",
    borderColor: theme.color.brand,
    borderWidth: 1,
  },

  achievementText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: theme.color.brand,
  },

  achievementLocked: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#999",
  },

  lockedLabel: {
    fontSize: 11,
    color: "#BBB",
  },

  quoteBox: {
    marginTop: 20,
    backgroundColor: theme.color.brand,
    padding: 20,
    borderRadius: 16,
  },

  quoteMark: { fontSize: 28, color: "white", marginBottom: 6 },

  quoteText: { color: "white", fontSize: 15, lineHeight: 22 },

  quoteSource: {
    marginTop: 6,
    color: "#FFECCC",
    fontSize: 12,
    fontStyle: "italic",
  },
});
