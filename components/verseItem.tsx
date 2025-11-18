import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';
import { MessageSquare } from 'lucide-react-native';

interface VerseItemProps {
  verseNumber: number;
  arabicText: string;
  translation: string;
}



export default function VerseItem({ verseNumber, arabicText, translation }: VerseItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.verseHeader}>
        <Text style={styles.verseNumber}>{verseNumber}.</Text>
        <TouchableOpacity style={styles.reflectButton}>
          <Text style={styles.reflectText}>Reflect</Text>
          <MessageSquare size={16} color={theme.color.brand} />
        </TouchableOpacity>
      </View>

      <Text style={styles.arabicText}>{arabicText}</Text>

      <Text style={styles.translationText}>{translation}</Text>

      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  verseNumber: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: theme.color.secondary,
  },
  reflectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: theme.color.brandLight + '30',
    gap: 4,
  },
  reflectText: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: theme.color.brand,
  },

  arabicText: {
    fontSize: 24,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
    textAlign: 'right',
    lineHeight: 45,
    marginBottom: 10,
  },

  translationText: {
    fontSize: 15,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
    lineHeight: 24,
  },

  divider: {
    marginTop: 20,
    height: 1,
    backgroundColor: theme.color.background2,
  },
});