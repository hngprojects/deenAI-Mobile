import ScreenContainer from '@/components/ScreenContainer';
import ScreenHeader from '@/components/screenHeader';
import InputField from '@/components/InputField';
import TodaysReflection from '@/components/home/TodaysReflection';
import ReflectionQuote from '@/components/reflect/ReflectionQuote';
import PrimaryButton from '../../components/primaryButton';
import { Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useReflectStore } from '@/store/reflect-store';

export default function ReflectScreen() {
  const router = useRouter();
  const { setDraft, clearDraft } = useReflectStore();

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

    // Navigate to reflection verse screen
    router.push('/(tabs)/(reflect)/reflect-verse');
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
        title="Reflect on this verse"
        onPress={handleReflectOnVerse}
        style={{ marginTop: 12, marginBottom: 30 }}
      />

      <TodaysReflection
        title='My Saved Reflections'
        showSeeAll={true}
        onSeeAll={() => router.push('/(tabs)/(reflect)/saved-reflection')}
      />
    </ScreenContainer>
  );
}