// app/(tabs)/(quran)/surahDetail.tsx

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';

import VerseItem from '@/components/quran/verseItem';
import ScreenContainer from '@/components/ScreenContainer';
import ScreenHeader from '@/components/screenHeader';
import { quranService } from '@/service/quran.service';
import { theme } from '@/styles/theme';
import { Surah, Verse } from '@/types/quran.types';

export default function SurahDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();

  console.log('=== SurahDetail Component Mounted ===');
  console.log('Params received:', params);

  const surah: Surah = JSON.parse(params.surah as string);
  console.log('Parsed surah:', surah);

  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());

  useEffect(() => {
    console.log('useEffect triggered for surah number:', surah.number);
    loadSurahData();
    loadBookmarks();
    saveLastRead();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surah.number]);

  const loadSurahData = async () => {
    try {
      console.log('Starting to load verses for surah:', surah.number);
      setLoading(true);
      setError(null);

      const surahVerses = await quranService.getSurahVerses(surah.number);

      console.log('Verses loaded successfully:', {
        count: surahVerses.length,
        firstVerse: surahVerses[0],
        lastVerse: surahVerses[surahVerses.length - 1]
      });

      setVerses(surahVerses);
    } catch (err) {
      console.error('Error loading surah verses:', err);
      setError('Failed to load verses: ' + (err as Error).message);
    } finally {
      setLoading(false);
      console.log('Loading finished. Verses in state:', verses.length);
    }
  };

  const loadBookmarks = async () => {
    try {
      const allBookmarks = await quranService.getBookmarks();
      const surahBookmarks = allBookmarks
        .filter(b => b.surahNumber === surah.number)
        .map(b => b.verseNumber);
      setBookmarks(new Set(surahBookmarks));
    } catch (err) {
      console.error('Error loading bookmarks:', err);
    }
  };

  const saveLastRead = async () => {
    try {
      await quranService.setLastRead(surah.number, 1, surah.englishName);
    } catch (err) {
      console.error('Error saving last read:', err);
    }
  };

  const toggleBookmark = async (verseNumber: number) => {
    try {
      const isBookmarked = bookmarks.has(verseNumber);

      if (isBookmarked) {
        await quranService.removeBookmark(surah.number, verseNumber);
        setBookmarks(prev => {
          const newSet = new Set(prev);
          newSet.delete(verseNumber);
          return newSet;
        });
      } else {
        await quranService.addBookmark(surah.number, verseNumber, surah.englishName);
        setBookmarks(prev => new Set(prev).add(verseNumber));
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleReflectPress = (verse: Verse) => {
    console.log('Reflect pressed for verse:', verse.number);
    router.push({
      pathname: '/(tabs)/(reflect)/reflect-verse',
      params: {
        surahNumber: surah.number.toString(),
        verseNumber: verse.number.toString(),
        arabicText: verse.arabic,
        translation: verse.translation,
        surahName: surah.englishName
      }
    });
  };

  const renderItem = ({ item, index }: { item: Verse; index: number }) => {
    if (index === 0) {
      console.log('Rendering first verse:', item);
    }
    return (
      <VerseItem
        verseNumber={item.number}
        arabicText={item.arabic}
        translation={item.translation}
        transliteration={item.transliteration}
        isBookmarked={bookmarks.has(item.number)}
        onBookmarkPress={() => toggleBookmark(item.number)}
        onReflectPress={() => handleReflectPress(item)}
        surahNumber={surah.number}
        surahName={surah.englishName}
      />
    );
  };

  const SurahInfoCard = () => (
    <View style={styles.surahInfoCard}>
      <Text style={styles.surahNumberAndName}>
        {surah.number}. {surah.englishName} (&quot;{surah.englishNameTranslation}&quot;)
      </Text>
      <Text style={styles.verseCount}>{verses.length}/{surah.numberOfAyahs}</Text>
    </View>
  );

  const ListHeader = () => {
    console.log('Rendering ListHeader');
    return (
      <>
        <ScreenHeader
          title={surah.englishName}
          showBackButton={true}
          onBackPress={() => router.back()}
        />
        <SurahInfoCard />
      </>
    );
  };

  console.log('Current render state:', { loading, error, versesCount: verses.length });

  if (loading) {
    console.log('Showing loading state');
    return (
      <ScreenContainer
        backgroundColor={theme.color.white}
        statusBarStyle="dark"
        scrollable={false}
        keyboardAvoiding={false}
      >
        <View style={styles.loadingContainer}>
          <ScreenHeader
            title={surah.englishName}
            showBackButton={true}
            onBackPress={() => router.back()}
          />
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.color.brand} />
            <Text style={styles.loadingText}>Loading verses...</Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    console.log('Showing error state:', error);
    return (
      <ScreenContainer
        backgroundColor={theme.color.white}
        statusBarStyle="dark"
        scrollable={false}
        keyboardAvoiding={false}
      >
        <View style={styles.loadingContainer}>
          <ScreenHeader
            title={surah.englishName}
            showBackButton={true}
            onBackPress={() => router.back()}
          />
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  if (verses.length === 0) {
    console.log('Showing empty state');
    return (
      <ScreenContainer
        backgroundColor={theme.color.white}
        statusBarStyle="dark"
        scrollable={false}
        keyboardAvoiding={false}
      >
        <View style={styles.loadingContainer}>
          <ScreenHeader
            title={surah.englishName}
            showBackButton={true}
            onBackPress={() => router.back()}
          />
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>No verses found for this surah</Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  console.log('Rendering FlatList with', verses.length, 'verses');
  return (
    <ScreenContainer
      backgroundColor={theme.color.white}
      statusBarStyle="dark"
      scrollable={false}
      keyboardAvoiding={false}
    >
      <FlatList
        data={verses}
        keyExtractor={(item) => `verse-${surah.number}-${item.number}`}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        removeClippedSubviews={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 54,
    paddingBottom: 40,
  },
  surahInfoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.color.white,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
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
  loadingContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#FF4444',
    textAlign: 'center',
  },
});