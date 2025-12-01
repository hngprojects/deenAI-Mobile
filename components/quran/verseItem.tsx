import { quranService } from '@/service/quran.service';
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
  isBookmarked = false,
  onBookmarkPress,
  surahNumber,
}) => {
  const { setDraft } = useReflectStore();
  const router = useRouter();

  const handleReflectPress = () => {
    setDraft({
      surahNumber,
      verseNumber,
      arabicText,
      translation,
      surahName,
    });

    router.push({
      pathname: '/reflect-verse',
      params: {
        surahNumber: surahNumber?.toString(),
        startAyah: verseNumber?.toString(),
        verseText: translation,
        surahName: surahName,
      },
    });
  };

  const handleBookmarkLongPress = async () => {
    try {
      const allBookmarks = await quranService.getBookmarks();

      if (allBookmarks.length === 0) {
        router.push('/(tabs)/(bookmark)'); // No bookmarks
      } else {
        router.push('/(tabs)/(bookmark)/bookmarklistscreen'); // Bookmarks exist
      }
    } catch (err) {
      console.log('Error fetching bookmarks:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.arabicText}>{arabicText}</Text>
      <Text style={styles.translation}>{translation}</Text>

      <TouchableOpacity
        onPress={() => setShowDeleteConfirm(true)}
        style={styles.deleteBtn}
      >
        <Text style={styles.deleteText}>Delete Bookmark</Text>
      </TouchableOpacity>

        <View style={styles.saurahActions}>
          <TouchableOpacity
            onPress={handleReflectPress}
            activeOpacity={0.7}
            style={styles.reflectButton}
          >
            <Text style={styles.saurahActionsText}>Reflect</Text>
            <Edit size={16} color={theme.color.secondary} />
          </TouchableOpacity>

          {/* {onBookmarkPress && (
            <TouchableOpacity
              style={styles.bookmarkButton}
              activeOpacity={0.7}
              onPress={onBookmarkPress} // Tap toggles bookmark
              onLongPress={handleBookmarkLongPress} // Long press navigates based on bookmarks
              delayLongPress={300}
            >
              <Bookmark
                size={20}
                color={isBookmarked ? theme.color.brand : theme.color.secondary}
                fill={isBookmarked ? theme.color.brand : 'transparent'}
              />
            </TouchableOpacity>
          )} */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: theme.color.white, marginBottom: 12, borderRadius: 12 },
  arabicText: { fontSize: 18, fontFamily: "Scheherazade-Regular", color: theme.color.secondary },
  translation: { fontSize: 16, fontFamily: theme.font.regular, color: theme.color.secondary },
  deleteBtn: { marginTop: 12, padding: 8, backgroundColor: "#E55153", borderRadius: 8 },
  deleteText: { color: theme.color.white, textAlign: "center" },
});

export default VerseItem;
