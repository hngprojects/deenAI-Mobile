import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenHeader from '../../../components/screenHeader';
import ScreenContainer from '@/components/ScreenContainer';
import { useLanguageStore } from '@/store/language-store';

export default function AppLanguageScreen() {
  const router = useRouter();
  const { language } = useLanguageStore();

  return (
    <ScreenContainer backgroundColor={theme.color.background3}>
      <ScreenHeader title="App Language" />

      <TouchableOpacity 
        style={styles.languageContainer} 
        onPress={() => router.push('/(tabs)/(profile)/SelectLanguageScreen')}
      >
        <View style={styles.languageTextWrapper}>
          <Text style={styles.languageHeading}>App Language</Text>
          <Text style={styles.languageValue}>{language}</Text>
        </View>

        <Image 
          source={require('@/assets/images/arrow-right.png')} 
          style={styles.arrowImage} 
        />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.background,
    paddingHorizontal: 16,
    paddingTop: 20, 
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#C7C5CC'
  },
  languageTextWrapper: {
    flexDirection: 'column',
  },
  languageHeading: {
    fontSize: 18,
    color: theme.color.black, 
    fontFamily: theme.font.semiBold

  },
  languageValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555', 
    marginTop: 3,
    fontFamily: theme.font.regular
  },
  arrowImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
