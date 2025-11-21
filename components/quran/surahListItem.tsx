import { theme } from '@/styles/theme';
import { Surah } from '@/types/quran.types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SurahListItemProps {
  surah: Surah;
  onPress: () => void;
}

const SurahListItem: React.FC<SurahListItemProps> = ({ surah, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left Side: English Name and Translation */}
      <View style={styles.leftContainer}>
        <Text style={styles.englishName}>{surah.englishName}</Text>
        <Text style={styles.translation}>{surah.englishNameTranslation}</Text>
      </View>

      {/* Right Side: Verses Count and Progress */}
      <View style={styles.rightContainer}>
        <Text style={styles.versesCount}>{surah.numberOfAyahs} verses</Text>
        <Text style={styles.progress}>0/{surah.numberOfAyahs}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d8d8d8ff',
    borderRadius: 12,
    marginBottom: 12,
  },
  leftContainer: {
    flex: 1,
  },
  englishName: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: theme.color.secondary,
    marginBottom: 4,
  },
  translation: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
    opacity: 0.6,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  versesCount: {
    fontSize: 14,
    fontFamily: theme.font.semiBold,
    color: theme.color.secondary,
    marginBottom: 4,
  },
  progress: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
    opacity: 0.6,
  },
});

export default SurahListItem;