"use client"
import ReflectionQuote from '@/components/reflect/ReflectionQuote';
import ScreenContainer from '@/components/ScreenContainer';
import ScreenHeader from '@/components/screenHeader';
import SecondaryButton from '@/components/secondaryButton';
import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextInput, View, } from 'react-native';
import PrimaryButton from '../../../components/primaryButton';

export default function ReflectScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <ScreenContainer>
      <ScreenHeader title={t("editReflection")} />

      <ReflectionQuote />

      <View style={styles.reflection}>
        <Text style={styles.reflectionHeader}>{t("personalReflection")}</Text>
        <Text>{t("editReflectionMessage")}</Text>

        <TextInput
          style={styles.textarea}
          multiline={true}
          numberOfLines={8}
        />
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={t("saveReflection")}
          onPress={() => router.push('/reflect-success')}
          style={styles.button}
        />
        <SecondaryButton
          title={t("shareReflection")}
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