"use client"
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/styles/theme';
import ScreenContainer from '@/components/ScreenContainer';
import ScreenHeader from '@/components/screenHeader';
import ReflectionQuote from '@/components/reflect/ReflectionQuote';
import PrimaryButton from '../../../components/primaryButton';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import SecondaryButton from '@/components/secondaryButton';
import { useRouter } from 'expo-router';

export default function ReflectScreen() {
  const router = useRouter();
  const [readMore, setReadMore] = useState(false);

  const completeText = "“This verse calls the heart back to its true home, the remembrance of Allah. In His presence, the soul finds what the world cannot offer: a peace that stays, even when life feels uncertain. Every remembrance, every quiet whisper of His name, soften what is heavy within us. It reminds us that calm is not found by escaping the storm, but by turning to the One who commands it. For surely, in remembering Allah, the heart returns to peace. ”"

  const truncatedText = completeText.slice(0, 136);

  return (
    <ScreenContainer>
      <ScreenHeader title="Reflect on Verse" />

      <ReflectionQuote />

      <View>
        <Text style={styles.textHeader}>Meaning and Context Note</Text>

        <View style={styles.quoteContainer}>
          <Text style={styles.text}>
            {readMore ? completeText : `${truncatedText}`}
          </Text>
          {!readMore ? (
            <TouchableOpacity
              onPress={() => setReadMore(true)}
              style={styles.readMoreInline}
            >
              <Text style={styles.readMore}>...Read More</Text>
              <ChevronDown size={16} color="#9C7630" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setReadMore(false)}
              style={styles.readMoreInline}
            >
              <Text style={styles.readMore}>Read Less </Text>
              <ChevronUp size={16} color="#9C7630" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.reflection}>
        <Text style={styles.reflectionHeader}>Your Reflection</Text>
        <Text>Write what this verse means to you...</Text>

        <TextInput
          style={styles.textarea}
          multiline={true}
          numberOfLines={8}
        />
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Save reflection"
          onPress={() => router.push('/reflect-success')}
          style={styles.button}
        />
        <SecondaryButton
          title="Share reflection"
          onPress={() => { }}
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  textHeader: {
    fontSize: 18,
    fontFamily: theme.font.bold,
    color: '#3C3A35',
    lineHeight: 24,
    marginTop: 24,
  },
  quoteContainer: {
    // width: 368,
    paddingTop: 7,
    paddingBottom: 7,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    fontStyle: "italic",
    color: "#5E5B54",
    margin: 11
  },
  readMore: {
    color: '#9C7630',
    fontSize: 14,
    lineHeight: 22.4,
    fontWeight: '600',
  },
  readMoreInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-end",
    marginTop: -32,
  },
  reflection: {
    gap: 8,
  },
  reflectionHeader: {
    fontSize: 18,
    fontFamily: theme.font.extraBold,
    color: '#3C3A35',
    lineHeight: 24,
    marginTop: 24,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#C7C5CC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    marginTop: 8,
    minHeight: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 22,
    marginBottom: 30,
  },
  button: {
    flex: 1,
    width: undefined,
  },
})