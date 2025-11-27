import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";

import VerseItem from "@/components/quran/verseItem";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { quranService } from "@/service/quran.service";
import { theme } from "@/styles/theme";
import { Surah, Verse } from "@/types/quran.types";
import { useReadingStore } from "@/store/reading-store";

export default function SurahDetail() {
  const params = useLocalSearchParams();
  const surah: Surah = JSON.parse(params.surah as string);
  const scrollToVerse = params.scrollToVerse
    ? Number(params.scrollToVerse)
    : null;

  const setLastRead = useReadingStore((state) => state.setLastRead);

  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [currentVisibleVerse, setCurrentVisibleVerse] = useState<number>(1);

  const currentVerseRef = useRef<number>(1);
  const flatListRef = useRef<FlatList>(null);

  const loadSurahData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const surahVerses = await quranService.getSurahVerses(surah.number);
      setVerses(surahVerses);
    } catch (err) {
      console.error("Error loading surah verses:", err);
      setError("Failed to load verses");
    } finally {
      setLoading(false);
    }
  }, [surah.number]);

  const loadBookmarks = useCallback(async () => {
    try {
      const allBookmarks = await quranService.getBookmarks();
      const surahBookmarks = allBookmarks
        .filter((b) => b.surahNumber === surah.number)
        .map((b) => b.verseNumber);
      setBookmarks(new Set(surahBookmarks));
    } catch (err) {
      console.error("Error loading bookmarks:", err);
    }
  }, [surah.number]);

  useEffect(() => {
    loadSurahData();
    loadBookmarks();

    // Initial save when opening surah
    setLastRead(surah.number, 1, surah.englishName);
  }, [
    surah.number,
    surah.englishName,
    setLastRead,
    loadSurahData,
    loadBookmarks,
  ]);

  useEffect(() => {
    if (verses.length > 0 && scrollToVerse && flatListRef.current) {
      const index = verses.findIndex((v) => v.number === scrollToVerse);
      if (index !== -1) {
        // Update the visible verse immediately
        setCurrentVisibleVerse(scrollToVerse);

        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.2,
          });
        }, 500);
      }
    }
  }, [verses, scrollToVerse]);

  const toggleBookmark = async (verseNumber: number) => {
    try {
      const isBookmarked = bookmarks.has(verseNumber);

      if (isBookmarked) {
        await quranService.removeBookmark(surah.number, verseNumber);
        setBookmarks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(verseNumber);
          return newSet;
        });
      } else {
        await quranService.addBookmark(
          surah.number,
          verseNumber,
          surah.englishName
        );
        setBookmarks((prev) => new Set(prev).add(verseNumber));
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const firstVisibleVerse = viewableItems[0].item as Verse;
        const verseNumber = firstVisibleVerse.number;

        // Update the visible verse in the header
        setCurrentVisibleVerse(verseNumber);

        if (currentVerseRef.current !== verseNumber) {
          currentVerseRef.current = verseNumber;
          setLastRead(surah.number, verseNumber, surah.englishName);
        }
      }
    },
    [surah.number, surah.englishName, setLastRead]
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 500,
  }).current;

  const renderItem = ({ item }: { item: Verse }) => (
    <VerseItem
      verseNumber={item.number}
      arabicText={item.arabic}
      translation={item.translation}
      transliteration={item.transliteration}
      isBookmarked={bookmarks.has(item.number)}
      onBookmarkPress={() => toggleBookmark(item.number)}
      surahNumber={surah.number}
    />
  );

  const SurahInfoCard = () => (
    <View style={styles.surahInfoCard}>
      <Text style={styles.surahNumberAndName}>
        {surah.number}. {surah.englishName} (&quot;
        {surah.englishNameTranslation}&quot;)
      </Text>
      <Text style={styles.verseCount}>
        {currentVisibleVerse}/{surah.numberOfAyahs}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <ScreenContainer
        backgroundColor={theme.color.white}
        statusBarStyle="dark"
        scrollable={false}
        keyboardAvoiding={false}
      >
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.color.brand} />
          <Text style={styles.loadingText}>Loading verses...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer
        backgroundColor={theme.color.white}
        statusBarStyle="dark"
        scrollable={false}
        keyboardAvoiding={false}
      >
        <View style={styles.fixedHeaderContainer}>
          <ScreenHeader title={surah.englishName} showBackButton={true} />
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      backgroundColor={theme.color.white}
      statusBarStyle="dark"
      scrollable={false}
      keyboardAvoiding={false}
    >
      {/* Fixed Header Section */}
      <View style={styles.fixedHeaderContainer}>
        <ScreenHeader title={surah.englishName} showBackButton={true} />
        <SurahInfoCard />
      </View>

      {/* Scrollable Verses */}
      <FlatList
        ref={flatListRef}
        data={verses}
        keyExtractor={(item) => item.number.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }, 100);
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  fixedHeaderContainer: {
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 54,
    paddingHorizontal: 20,
    backgroundColor: theme.color.white,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  surahInfoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.color.white,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  surahNumberAndName: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: theme.color.secondary,
    flex: 1,
  },
  verseCount: {
    fontSize: 16,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
  },
  errorText: {
    fontSize: 16,
    fontFamily: theme.font.regular,
    color: "#FF4444",
    textAlign: "center",
  },
});
