import { theme } from '@/styles/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ReflectionQuote() {
  return (
    <View style={styles.reflectionCard}>
      <Text style={styles.reflectionText}>
        Those who believe and whose hearts find rest in the remembrance of Allah. Surely, in the remembrance of Allah do hearts find peace.
      </Text>

      <Text style={styles.reflectionVerse}>
        (Surah Ar-Ra’d 13:28)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  reflectionCard: {
    paddingVertical: 24.5,
    paddingHorizontal: 29,
    borderWidth: 1,
    backgroundColor: theme.color.background,
    borderColor: '#E3E3E3',
    gap: 13,
    marginTop: 28,
    marginBottom: 12,
    borderRadius: 8,
  },
  reflectionText: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: '#555',
    lineHeight: 24,
    textAlign: 'center',
  },
  reflectionVerse: {
    color: "#3C3A35",
    fontSize: 16,
    fontFamily: theme.font.bold,
    textAlign: 'center',
    
  }
});