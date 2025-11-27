import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "@/styles/theme";
import { ChevronRight } from "lucide-react-native";
import { Surah } from "@/types/quran.types";
import { Image } from "expo-image";

interface FeaturedSurahCardProps {
  surah: Surah;
  onPress: () => void;
  verseNumber?: number;
  totalVerses?: number;
}

export default function FeaturedSurahCard({
  surah,
  onPress,
  verseNumber,
  totalVerses,
}: FeaturedSurahCardProps) {
  const actionText = verseNumber
    ? `Continue Reading • Verse ${verseNumber}`
    : "Start Reading";

  return (
    <TouchableOpacity style={styles.featuredCard} onPress={onPress}>
      <View style={styles.contentWrapper}>
        <View style={styles.leftContent}>
          <View style={styles.iconRow}>
            <View style={styles.iconContainer}>
              <Image
                source={require("../../assets/images/bookicon.png")}
                style={styles.iconImage}
              />
            </View>
          </View>

          <View style={styles.textColumn}>
            <Text style={styles.featuredTitle}>
              {surah.englishName} ({surah.englishNameTranslation})
            </Text>

            {verseNumber && totalVerses && (
              <Text style={styles.verseInfo}>
                {verseNumber}/{totalVerses}
              </Text>
            )}

            <Text style={styles.actionText}>{actionText}</Text>
          </View>
        </View>

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
  iconImage: {
    width: 55,
    height: 55,
    resizeMode: "contain",
  },
  verseInfo: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: theme.color.white,
    opacity: 0.7,
    marginBottom: 2,
  },
});
