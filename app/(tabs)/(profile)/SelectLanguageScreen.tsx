<<<<<<< HEAD:components/profile/SelectLanguageScreen.tsx
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenHeader from "../screenHeader";
=======
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';
import ScreenHeader from '@/components/screenHeader';
import ScreenContainer from '@/components/ScreenContainer';
>>>>>>> 61c9f02 (feat: Update Profile):app/(tabs)/(profile)/SelectLanguageScreen.tsx

export default function SelectLanguage() {
  const router = useRouter();
  const [_, setSelectedLanguage] = useState("English");

  const languages = [
    { key: "English", subtitle: "English" },
    { key: "Arabic", subtitle: "العربية" },
    { key: "French", subtitle: "Français" },
    { key: "Turkish", subtitle: "Türkçe" },
    { key: "Hausa", subtitle: "Hausa" },
    { key: "Swahili", subtitle: "Kiswahili" },
  ];

  return (
    <ScreenContainer backgroundColor={theme.color.background3}>
      <ScreenHeader title="Select Language" />
      <View style={styles.list}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.key}
            style={styles.item}
            onPress={() => setSelectedLanguage(lang.key)}
          >
            <View style={styles.textWrapper}>
              <Text style={styles.text}>{lang.key}</Text>
              <Text style={styles.subtitle}>{lang.subtitle}</Text>
            </View>
<<<<<<< HEAD:components/profile/SelectLanguageScreen.tsx
            <Image
              source={require("../../assets/images/arrow-right.png")}
              style={styles.arrowImage}
            />
=======
 
>>>>>>> 61c9f02 (feat: Update Profile):app/(tabs)/(profile)/SelectLanguageScreen.tsx
          </TouchableOpacity>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.color.background },
  list: { marginTop: 20, paddingHorizontal: 16 },
<<<<<<< HEAD:components/profile/SelectLanguageScreen.tsx
  item: {
    padding: 16,
    backgroundColor: "#F4F4F4",
    borderRadius: 12,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
=======
  item: { 
    padding: 16, 
    backgroundColor: '#F4F4F4', 
    borderRadius: 12, 
    marginBottom: 14, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' ,
    borderWidth: 1,
    borderColor: '#C7C5CC'
>>>>>>> 61c9f02 (feat: Update Profile):app/(tabs)/(profile)/SelectLanguageScreen.tsx
  },
  textWrapper: {
    flexDirection: "column",
  },
<<<<<<< HEAD:components/profile/SelectLanguageScreen.tsx
  text: { fontSize: 16, fontWeight: "700", color: theme.color.secondary },
  subtitle: { fontSize: 14, fontWeight: "500", color: "#555", marginTop: 4 },
=======
  text: { fontSize: 16, fontWeight: '700', color: theme.color.secondary, fontFamily:theme.font.bold  },
  subtitle: { fontSize: 14, fontWeight: '500', color: '#555', marginTop: 4, fontFamily:theme.font.regular },
>>>>>>> 61c9f02 (feat: Update Profile):app/(tabs)/(profile)/SelectLanguageScreen.tsx
  arrowImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
