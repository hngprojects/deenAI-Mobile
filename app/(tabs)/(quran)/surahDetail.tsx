import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";

import ReadModeView from "@/app/(tabs)/(quran)/readMode";
import VerseItem from "@/components/quran/verseItem";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { quranService } from "@/service/quran.service";
import { useReadingStore } from "@/store/reading-store";
import { theme } from "@/styles/theme";
import { Surah, Verse } from "@/types/quran.types";

export default function SurahDetail() {
  const params = useLocalSearchParams();
  const surah: Surah = JSON.parse(params.surah as string);
  const scrollToVerse = params.scrollToVerse
    ? Number(params.scrollToVerse)
    : null;

  const setLastRead = useReadingStore((state) => state.setLastRead);
  const isReadMode = useReadingStore((state) => state.isReadMode);
  const toggleReadMode = useReadingStore((state) => state.toggleReadMode);
  const setLastReadPage = useReadingStore((state) => state.setLastReadPage);

  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [currentVerseNumber, setCurrentVerseNumber] = useState(1);
  const [pageForSurah, setPageForSurah] = useState<number | null>(null);

  const flatListRef = useRef<FlatList>(null);

  const loadSurahData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const surahVerses = await quranService.getSurahVerses(surah.number);
      setVerses(surahVerses);

      const page = await quranService.getPageForVerse(surah.number, 1);
      if (page) {
        setPageForSurah(page);
      }
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

  const handleToggleReadMode = async () => {
    try {
      // If switching TO read mode, save the current page
      if (!isReadMode && pageForSurah) {
        setLastReadPage(pageForSurah);
      }

      toggleReadMode();
    } catch (err) {
      console.error("Error toggling read mode:", err);
    }
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const firstVisibleVerse = viewableItems[0].item as Verse;
        const verseNumber = firstVisibleVerse.number;

        setCurrentVerseNumber(verseNumber);
        setLastRead(surah.number, verseNumber, surah.englishName);
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
        {currentVerseNumber}/{surah.numberOfAyahs}
      </Text>
    </View>
  );

  const BasmalaHeader = () => {
    // Don't show Basmala for Al-Fatiha (1) and At-Tawbah (9)
    if (surah.number === 1 || surah.number === 9) {
      return null;
    }

    return (
      <View style={styles.basmalaContainer}>
        <Text style={styles.basmalaText}>
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </Text>
      </View>
    );
  };

  if (isReadMode) {
    return (
      <ScreenContainer
        backgroundColor="#FFFFFF"
        statusBarStyle="dark"
        scrollable={false}
        keyboardAvoiding={false}
      >
        <View style={styles.readModeHeader}>
          <ScreenHeader
            title={surah.englishName}
            showBackButton={true}
            rightComponent={
              <TouchableOpacity
                onPress={handleToggleReadMode}
                style={styles.toggleButton}
              >
                <Image
                  source={require("@/assets/images/qurantoggle.png")}
                  style={styles.toggleIcon}
                />
              </TouchableOpacity>
            }
          />
        </View>
        <ReadModeView initialPage={pageForSurah || 1} />
      </ScreenContainer>
    );
  }

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
        <View style={styles.fixedHeader}>
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
      {/* FIXED HEADER */}
      <View style={styles.fixedHeader}>
        <ScreenHeader
          title={surah.englishName}
          showBackButton={true}
          rightComponent={
            <TouchableOpacity
              onPress={handleToggleReadMode}
              style={styles.toggleButton}
            >
              <Image
                source={require("@/assets/images/qurantoggle.png")}
                style={styles.toggleIcon}
              />
            </TouchableOpacity>
          }
        />
        <SurahInfoCard />
      </View>

      {/* SCROLLABLE CONTENT */}
      <FlatList
        ref={flatListRef}
        data={verses}
        keyExtractor={(item) => item.number.toString()}
        renderItem={renderItem}
        ListHeaderComponent={BasmalaHeader}
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
  fixedHeader: {
    backgroundColor: theme.color.white,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 54,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  readModeHeader: {
    backgroundColor: "#FFFFFF",
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 54,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  toggleButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    // backgroundColor: theme.color.gray,
  },
  toggleIcon: {
    width: 24,
    height: 24,
    tintColor: "#737373",
    borderRightWidth: 2,
    borderRightColor: "#737373",
  },
  flatList: {
    flex: 1,
  },
  listContent: {
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
  basmalaContainer: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  basmalaText: {
    fontSize: 32,
    fontFamily: "Scheherazade-Regular",
    color: theme.color.brand,
    textAlign: "center",
    lineHeight: 50,
  },
});
