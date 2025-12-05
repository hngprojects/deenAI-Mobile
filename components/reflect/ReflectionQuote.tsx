import { theme } from '@/styles/theme';
import { Edit3Icon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ReflectionQuoteProps {
  onReflectPress?: () => void;
  disabled?: boolean;
}

export default function ReflectionQuote({ onReflectPress, disabled }: ReflectionQuoteProps) {
  return (
    <View style={styles.reflectionCard}>
      <Text style={styles.reflectionText}>
        Those who believe and whose hearts find rest in the remembrance of Allah. Surely, in the remembrance of Allah do hearts find peace.
      </Text>

      <View style={styles.referenceRow}>
        {/* Surah container */}
        <View style={styles.referenceContainer}>
          <Text style={styles.referenceText}>(Surah Ar-Ra&lsquo;d 13:28)</Text>
        </View>

        {/* Reflect button */}
        <TouchableOpacity 
          style={[styles.editContainer, disabled && styles.editContainerDisabled]}
          onPress={onReflectPress}
          disabled={disabled}
        >
          <Edit3Icon size={16} color="#F9F9F9" />
          <Text style={styles.editText}>Reflect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  reflectionCard: {
    paddingVertical: 16,
    paddingHorizontal: 16,
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
  },
  reflectionVerse: {
    color: "#3C3A35",
    fontSize: 16,
    fontFamily: theme.font.bold,
    textAlign: 'center',
  },
  referenceContainer: {
    borderRadius: 35,
    backgroundColor: '#FFF4EA',
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  referenceText: {
    fontSize: 14,
    color: '#964B00',
    fontFamily: theme.font.semiBold,
    textAlign: 'center',
    lineHeight: 16,
  },
  referenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
    width: '100%',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#964B00',
    paddingVertical: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    minWidth: 100,
  },
  editContainerDisabled: {
    opacity: 0.5,
  },
  editText: {
    fontSize: 14,
    color: '#F9F9F9',
    fontFamily: theme.font.semiBold,
    marginLeft: 10,
  },
});