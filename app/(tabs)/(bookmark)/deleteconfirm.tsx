import { quranService } from "@/service/quran.service";
import { theme } from "@/styles/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

export default function DeleteConfirm() {
  const { surahNumber, verseNumber } = useLocalSearchParams();
  const [fullPageData, setFullPageData] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    loadQuranPage();
  }, []);

  const loadQuranPage = async () => {
    const page = await quranService.getVersePage(
      Number(surahNumber),
      Number(verseNumber)
    );
    setFullPageData(page);
  };

  const handleDelete = async () => {
    await quranService.removeBookmark(
      Number(surahNumber),
      Number(verseNumber)
    );

    router.push("/(tabs)/(quran)");
  };

  const handleCancel = async () => {
    const bookmarks = await quranService.getBookmarks();

    if (bookmarks.length === 0) {
      router.push("/(tabs)/(bookmark)");
    } else {
      router.push("/(tabs)/(bookmark)/bookmarklistscreen");
    }
  };

  return (
    <View style={styles.container}>

      {/* Quran Background (same style as Surah pages) */}
      <ScrollView
        style={styles.backgroundScroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.arabic}>{fullPageData?.arabic}</Text>

        {fullPageData?.translations?.map((t: string, index: number) => (
          <Text key={index} style={styles.translation}>
            {t}
          </Text>
        ))}
      </ScrollView>

      {/* Delete Card — unchanged */}
      <View style={styles.card}>
        <Text style={styles.title}>Confirm Delete</Text>

        <Text style={styles.subTitle}>
          Are you sure you want to delete Surah {surahNumber} : {verseNumber}{"\n"} from your bookmark?
        </Text>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>Confirm Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.white,
    justifyContent: "center",
    alignItems: "center",
  },

  backgroundScroll: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 20,
    paddingTop: 60,
    opacity: 0.18, // slight fade so card stays clear
  },

  arabic: {
    fontSize: 30,
    fontFamily: theme.font.arabic,
    lineHeight: 44,
    textAlign: "center",
    color: theme.color.secondary,
    marginBottom: 30,
  },

  translation: {
    fontSize: 16,
    fontFamily: theme.font.regular,
    lineHeight: 24,
    textAlign: "center",
    color: theme.color.secondary,
    marginBottom: 12,
  },

  // Original card kept exactly the same
  card: {
    backgroundColor: theme.color.white,
    padding: 24,
    borderRadius: 14,
    width: "80%",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    position: "absolute",
  },

  title: {
    fontSize: 18,
    fontFamily: theme.font.semiBold,
    color: theme.color.black,
    marginBottom: 8,
  },

  subTitle: {
    fontSize: 16,
    fontFamily: theme.font.regular,
    color: theme.color.black,
    marginBottom: 24,
  },

  deleteBtn: {
    width: "70%",
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#E55153",
    marginBottom: 12,
  },

  deleteText: {
    color: theme.color.white,
    fontSize: 15,
    fontFamily: theme.font.semiBold,
    textAlign: "center",
  },

  cancelBtn: {
    width: "70%",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.color.black,
  },

  cancelText: {
    fontSize: 15,
    fontFamily: theme.font.semiBold,
    textAlign: "center",
    color: theme.color.black,
  },
});
