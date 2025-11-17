"use client"

import { View, Text, StyleSheet, } from 'react-native';
import { theme } from '@/styles/theme';
import ScreenContainer from '@/components/ScreenContainer';
import PrimaryButton from '../../components/primaryButton';
import { useRouter } from 'expo-router';

export default function ReflectSuccess() {
  const router = useRouter();
  return (
    <ScreenContainer>
      <View style={styles.container} >
        <Text style={styles.textHeader}>Your Reflection has been saved</Text>

        <Text style={styles.containerText}>Your reflection has been added to your journal, a space you can return to anytime for peace and remembrance.</Text>
        <PrimaryButton
          title="Open reflection journal "
          onPress={() => { }}
          style={styles.button}
        />
        <Text
          style={styles.backText}
          onPress={() => router.push('/reflect')}
        >
          Back to Home
        </Text>
      </View>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  textHeader: {
    fontSize: 26,
    fontFamily: theme.font.extraBold,
    textAlign: "center",
    color: '#3C3A35',
    lineHeight: 34,
    marginTop: 24,
    paddingLeft: 61,
    paddingRight: 61,
  },
  containerText: {
    fontSize: 18,
    textAlign: "center",
    color: '#3C3A35',
    lineHeight: 30,
    marginTop: 24,
    paddingLeft: 27,
    paddingRight: 27,
  },
  button: {
    marginTop: 40,
  },
  backText: {
    textAlign: "center",
    color: "#5E5B54",
    fontSize: 12,
    marginTop: 8,
    cursor: "pointer",
  }
})