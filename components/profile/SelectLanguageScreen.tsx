import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenHeader from "../screenHeader";

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
    <View style={styles.container}>
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
            <Image
              source={require("../../assets/images/arrow-right.png")}
              style={styles.arrowImage}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.color.background },
  list: { marginTop: 20, paddingHorizontal: 16 },
  item: {
    padding: 16,
    backgroundColor: "#F4F4F4",
    borderRadius: 12,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textWrapper: {
    flexDirection: "column",
  },
  text: { fontSize: 16, fontWeight: "700", color: theme.color.secondary },
  subtitle: { fontSize: 14, fontWeight: "500", color: "#555", marginTop: 4 },
  arrowImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
