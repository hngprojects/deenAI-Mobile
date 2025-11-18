// import { View, Text } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';
import ScreenHeader from '@/components/screenHeader';
import InputField from '@/components/InputField';
import TodaysReflection from '@/components/home/TodaysReflection';
import ReflectionQuote from '@/components/reflect/ReflectionQuote';
import PrimaryButton from '../../components/primaryButton';
import { Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ReflectScreen() {
  const router = useRouter();
  
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
        onPress={() => router.push('/reflect-verse')}
        style={{ marginTop: 12, marginBottom: 30 }}
      />

      <TodaysReflection 
        title='My Saved Reflections' 
      />
    </ScreenContainer>
  );
}