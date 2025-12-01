import InputField from '@/components/InputField';
import ScreenContainer from '@/components/ScreenContainer';
import TodaysReflection from '@/components/home/TodaysReflection';
import ReflectionQuote from '@/components/reflect/ReflectionQuote';
import ScreenHeader from '@/components/screenHeader';
import { useReflectStore } from '@/store/reflect-store';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search } from 'lucide-react-native';
import { useTranslation } from "react-i18next";
import PrimaryButton from '../../../components/primaryButton';

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
  // Static verse data from ReflectionQuote
  const staticVerse = {
    translation: "Those who believe and whose hearts find rest in the remembrance of Allah. Surely, in the remembrance of Allah do hearts find peace.",
    surahNumber: 13,
    verseNumber: 28,
    surahName: "Ar-Ra'd",
    arabicName: "الرعد",
  };

  const handleReflectOnVerse = () => {
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
    <ScreenContainer>
      <ScreenHeader
        titleAlign="left"
        showBackButton={false}
        title="Reflection"
      />

      <InputField
        label=''
        placeholder="Search a chapter"
        leftIcon={<Search size={18} color="#667185" />}
      />

      <ReflectionQuote />

      <PrimaryButton
        title={t("reflectVerse")}
        onPress={handleReflectOnVerse}
        style={{ marginTop: 12, marginBottom: 30 }}
      />

      <TodaysReflection
        title='My Saved Reflections'
        showSeeAll={true}
        onSeeAll={() => navigation.navigate('saved-reflection')}
      />
    </ScreenContainer>
  );
}