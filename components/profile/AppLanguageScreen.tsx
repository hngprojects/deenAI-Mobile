import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ScreenHeader from '../screenHeader';
import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';

export default function AppLanguageScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScreenHeader title="App Language" />

      <TouchableOpacity 
        style={styles.languageContainer} 
        onPress={() => router.push('/profile/selectlanguage')} 
      >
        <View style={styles.languageTextWrapper}>
          <Text style={styles.languageHeading}>App Language</Text>
          <Text style={styles.languageValue}>English</Text>
        </View>

        <Image 
          source={require('../../assets/images/arrow-right.png')} 
          style={styles.arrowImage} 
        />
      </TouchableOpacity>
    </View>
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
  },
  languageTextWrapper: {
    flexDirection: 'column',
  },
  languageHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333', 
  },
  languageValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555', 
    marginTop: 4,
  },
  arrowImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
