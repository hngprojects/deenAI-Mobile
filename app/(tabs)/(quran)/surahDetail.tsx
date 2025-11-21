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
// import { styles } from '../../../app-example/styles/styles';

export default function SurahDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const surah: Surah = JSON.parse(params.surah as string);

  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadSurahData();
    loadBookmarks();
    saveLastRead();
    console.log('SurahDetail', surah.number);
  }, [surah.number]);

  const loadSurahData = async () => {
    try {
      setLoading(true);
      setError(null);
      const surahVerses = await quranService.getSurahVerses(surah.number);
      setVerses(surahVerses);
    } catch (err) {
      console.error('Error loading surah verses:', err);
      setError('Failed to load verses');
    } finally {
      setLoading(false);
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
       {surah.number}. {surah.englishName} ("{surah.englishNameTranslation}")
      </Text>
      <Text style={styles.verseCount}>0/{surah.numberOfAyahs}</Text>
    </View>
  );

  const ListHeader = () => (
    <>
      <View style={{ paddingLeft: 20 }}>
        <ScreenHeader
          title={surah.englishName}
          showBackButton={true}
        />
      </View>
        <SurahInfoCard />
    </>
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
        <ScreenHeader
          title={surah.englishName}
          showBackButton={true}
        // onBackPress={() => router.back()}
        />
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
      <FlatList
        data={verses}
        keyExtractor={(item) => item.number.toString()}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        style={styles.flatList} c
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