// SurahListItem.tsx

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "@/styles/theme";
import { Surah } from "../app/(tabs)/quran";

interface SurahListItemProps {
  surah: Surah;
  onPress: () => void;
}

const SUBTLE_GRAY = "#999999";

interface ProgressMap {
  [key: number]: number;
}

const MOCK_PROGRESS: ProgressMap = {
  1: 0,
  2: 0,
  3: 155,
  4: 0,
  5: 0,
};

export default function SurahListItem({ surah, onPress }: SurahListItemProps) {
  const totalVerses = surah.verses;
  const currentProgress = MOCK_PROGRESS[surah.number] || 0;
  const showProgress = currentProgress > 0;

  return (
    <TouchableOpacity style={styles.surahCard} onPress={onPress}>
      <View style={styles.textContainer}>
        <Text style={styles.englishName} numberOfLines={1}>
          {surah.englishName}
        </Text>
        <Text style={styles.englishMeaning} numberOfLines={1}>
          {surah.englishMeaning}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.versesCount}>{surah.verses} verses</Text>

        <Text
          style={[styles.progressText, showProgress && styles.progressTextRead]}
        >
          {currentProgress}/{totalVerses}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  surahCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.color.background2,
  },

  textContainer: {
    flex: 1,
    marginRight: 10,
    justifyContent: "center",
  },
  englishName: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: theme.color.secondary,
    marginBottom: 2,
  },
  englishMeaning: {
    fontSize: 12,
    fontFamily: theme.font.regular,
    color: SUBTLE_GRAY,
  },

  infoContainer: {
    alignItems: "flex-end",
    width: 80,
    justifyContent: "center",
  },
  versesCount: {
    fontSize: 12,
    fontFamily: theme.font.regular,
    color: SUBTLE_GRAY,
    marginBottom: 5,
  },

  progressText: {
    fontSize: 14,
    fontFamily: theme.font.semiBold,
    color: SUBTLE_GRAY,
  },
  progressTextRead: {
    color: theme.color.brand,
  },
});
