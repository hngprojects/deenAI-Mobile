// FeaturedSurahCard.tsx

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "@/styles/theme";
import { Surah } from "../app/(tabs)/quran";
import { BookText, ChevronRight } from "lucide-react-native";

interface FeaturedSurahCardProps {
  surah: Surah;
  onPress: () => void;
}

export default function FeaturedSurahCard({
  surah,
  onPress,
}: FeaturedSurahCardProps) {
  const actionText = "Continue Reading";

  return (
    <TouchableOpacity style={styles.featuredCard} onPress={onPress}>
      <View style={styles.contentWrapper}>
        {/* Left Side: Icon, Name, and Action Text */}
        <View style={styles.leftContent}>
          {/* Icon Section */}
          <View style={styles.iconRow}>
            <View style={styles.iconContainer}>
              <BookText size={18} color={theme.color.brand} />
            </View>
          </View>

          {/* Text Section */}
          <View style={styles.textColumn}>
            {/* Surah Name (Transliteration) */}
            <Text style={styles.featuredTitle}>
              {surah.englishName} ({surah.englishMeaning})
            </Text>
            {/* Action Text */}
            <Text style={styles.actionText}>{actionText}</Text>
          </View>
        </View>

        {/* Right Side: Arrow Icon */}
        <ChevronRight size={24} color={theme.color.white} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  featuredCard: {
    backgroundColor: theme.color.brand,
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    minHeight: 85,
    justifyContent: "center",
  },
  contentWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconRow: {
    marginRight: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.color.white,
    justifyContent: "center",
    alignItems: "center",
  },
  textColumn: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 14,
    fontFamily: theme.font.semiBold,
    color: theme.color.white,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 16,
    fontFamily: theme.font.regular,
    color: theme.color.white,
    opacity: 0.9,
  },
});
