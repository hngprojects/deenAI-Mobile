import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import { theme } from '@/styles/theme';
import VerseItem from '../../components/verseItem'
import { RootStackParamList } from '../(tabs)/quran'; 

type SurahDetailRouteProp = RouteProp<RootStackParamList, 'surahDetail'>;

export default function SurahDetail() {
  const route = useRoute<SurahDetailRouteProp>();
  const { surah } = route.params;

  const versesData = surah.arabic.map((arabic, index) => ({
    verseNumber: index + 1,
    arabicText: arabic,
    translation: surah.translation[index],
  }));

  const renderItem = ({ item }: { item: { verseNumber: number; arabicText: string; translation: string; } }) => (
    <VerseItem
      verseNumber={item.verseNumber}
      arabicText={item.arabicText}
      translation={item.translation}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.surahHeader}>
        <Text style={styles.surahName}>{surah.englishName}</Text>
        <Text style={styles.surahDetails}>{surah.englishMeaning} ({surah.verses} verses)</Text>
      </View>

      <FlatList
        data={versesData}
        keyExtractor={(item) => item.verseNumber.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  surahHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: theme.color.background2,
    borderBottomWidth: 1,
    borderBottomColor: theme.color.brandLight,
    marginBottom: 10,
  },
  surahName: {
    fontSize: 24,
    fontFamily: theme.font.bold,
    color: theme.color.secondary,
    marginBottom: 4,
  },
  surahDetails: {
    fontSize: 16,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
  },
});