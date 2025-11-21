import { useReflectStore } from '@/store/reflect-store';
import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';
import { Bookmark, Edit } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VerseItemProps {
  verseNumber: number;
  arabicText: string;
  translation: string;
  transliteration?: string;
  isBookmarked?: boolean;
  onBookmarkPress?: () => void;
  onReflectPress?: () => void;
  showTransliteration?: boolean;
  surahNumber?: number;
  surahName?: string;
}

const VerseItem: React.FC<VerseItemProps> = ({
  verseNumber,
  arabicText,
  translation,
  transliteration,
  isBookmarked = false,
  onBookmarkPress,
  onReflectPress,
  showTransliteration = true,
  surahNumber,
  surahName,
}) => {
  const router = useRouter();


    const { setDraft } = useReflectStore();

  const handleReflectPress = () => {
    setDraft({
      surahNumber,
      verseNumber,
      arabicText,
      translation,
      surahName,
    });

    console.log('selected surah', surahNumber, verseNumber, arabicText, translation, surahName);

    router.push({
      pathname: '/(tabs)/(reflect)/reflect-verse',
    });
  };

  return (
    <View style={styles.container}>

      <Text style={styles.arabicText}>{arabicText}</Text>

      {showTransliteration && transliteration && (
        <Text style={styles.transliteration}>{transliteration}</Text>
      )}

      <Text style={styles.translation}>{translation}</Text>

      <View style={styles.verseHeader}>
        <View style={styles.verseNumberBadge}>
          <Text style={styles.verseNumberText}>{verseNumber}</Text>
        </View>



        <View style={styles.saurahActions}>
          <TouchableOpacity
            onPress={handleReflectPress}
            activeOpacity={0.7}
            style={styles.reflectButton}
          >
            <Text style={styles.saurahActionsText}>Reflect</Text>
            <Edit
              size={16}
              color={theme.color.secondary}
            // style={styles.editIcon}
            />
          </TouchableOpacity>

          {onBookmarkPress && (
            <TouchableOpacity
              onPress={onBookmarkPress}
              style={styles.bookmarkButton}
              activeOpacity={0.7}
            >
              <Bookmark
                size={20}
                color={isBookmarked ? theme.color.brand : theme.color.secondary}
                fill={isBookmarked ? theme.color.brand : 'transparent'}
              />
            </TouchableOpacity>
          )}
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingVertical: 16,
    backgroundColor: theme.color.white,
    marginBottom: 12,
    borderRadius: 12,
    // borderWidth: 1,
    // borderColor: theme.color.brandLight,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  verseNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    // backgroundColor: theme.color.brandLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseNumberText: {
    fontSize: 14,
    fontFamily: theme.font.semiBold,
    // color: theme.color.brand,
  },
  bookmarkButton: {
    padding: 8,
  },
  reflectButton: {
    backgroundColor: '#F7EEDB',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  arabicText: {
    fontSize: 18,
    fontFamily: 'Scheherazade-Regular',
    color: theme.color.secondary,
    textAlign: 'right',
    lineHeight: 50,
    marginBottom: 12,
  },
  transliteration: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
    opacity: 0.6,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 20,
  },
  translation: {
    fontSize: 16,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
    lineHeight: 24,
  },
  saurahActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  saurahActionsText: {
    fontSize: 14,
    fontFamily: theme.font.semiBold,
    color: theme.color.secondary,
  },
});

export default VerseItem;