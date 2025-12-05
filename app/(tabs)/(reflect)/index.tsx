import InputField from '@/components/InputField';
import ScreenContainer from '@/components/ScreenContainer';
import TodaysReflection from '@/components/home/TodaysReflection';
import GuestReflectionCard from '@/components/reflect/GuestReflectionCard';
import ReflectionQuote from '@/components/reflect/ReflectionQuote';
import ScreenHeader from '@/components/screenHeader';
import { useAuthStore } from '@/store/auth-store';
import { useReflectStore } from '@/store/reflect-store';
import { theme } from '@/styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StatusBar, StyleSheet, View } from 'react-native';

type ReflectStackParamList = {
  'index': undefined;
  'reflect-verse': {
    reflectionId?: string;
    editMode?: string;
    content?: string;
    surahNumber?: string;
    startAyah?: string;
    verseText?: string;
    surahName?: string;
  };
  'reflect-success': undefined;
  'saved-reflection': undefined;
};

type ReflectIndexProp = NativeStackNavigationProp<ReflectStackParamList, 'index'>;

export default function ReflectScreen() {
  const navigation = useNavigation<ReflectIndexProp>();
  const { setDraft, clearDraft } = useReflectStore();
  const { t } = useTranslation();
  const { isGuest } = useAuthStore();
  const [guestMode, setGuestMode] = useState(false);

  useEffect(() => {
    // Update only after hydration (one render later)
    setGuestMode(isGuest);
  }, [isGuest]);

  // Static verse data from ReflectionQuote
  const staticVerse = {
    translation: "Those who believe and whose hearts find rest in the remembrance of Allah. Surely, in the remembrance of Allah do hearts find peace.",
    surahNumber: 13,
    verseNumber: 28,
    surahName: "Ar-Ra'd",
    arabicName: "الرعد",
  };

  const handleReflectOnVerse = () => {
    if (isGuest) return; 
    // Clear any existing draft
    clearDraft();

    // Set draft with the static verse data
    setDraft({
      surahNumber: staticVerse.surahNumber,
      verseNumber: staticVerse.verseNumber,
      translation: staticVerse.translation,
      surahName: staticVerse.surahName,
      content: '', // Start with empty content
    });

    console.log('📝 Setting draft for reflection:', staticVerse);

    // Navigate to reflection verse screen using navigation.navigate
    navigation.navigate('reflect-verse', {
      surahNumber: staticVerse.surahNumber.toString(),
      startAyah: staticVerse.verseNumber.toString(),
      verseText: staticVerse.translation,
      surahName: staticVerse.surahName,
    });
  };

  return (
    <ScreenContainer scrollable={false} showsVerticalScrollIndicator={false}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <ScreenHeader
          titleAlign="left"
          showBackButton={false}
          title={t("reflection")}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <InputField
          label=''
          placeholder={t("searchChapter")}
          leftIcon={<Search size={18} color="#667185" />}
        />

        <ReflectionQuote 
          onReflectPress={handleReflectOnVerse}
          disabled={guestMode}
        />

        {guestMode ? (
          <GuestReflectionCard />
        ) : (
          <TodaysReflection
            title={t("savedReflections")}
            showSeeAll={true}
            onSeeAll={() => navigation.navigate('saved-reflection')}
          />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  fixedHeader: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 54,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: theme.color.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
});