import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { useLanguageStore } from "@/store/language-store";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SelectLanguage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguageStore();

  const languages = [
    { key: "English", subtitle: "English" },
    { key: "Arabic", subtitle: "العربية" },
    { key: "French", subtitle: "Français" },
    { key: "Turkish", subtitle: "Türkçe" },
    { key: "Hausa", subtitle: "Hausa" },
    { key: "Swahili", subtitle: "Kiswahili" },
  ];

  const onSelect = (lang: string) => {
    setLanguage(lang);
    router.push("/(tabs)/(profile)/AppLanguageScreen");
  };

  return (
    <ScreenContainer backgroundColor={theme.color.background3}>
      <ScreenHeader title="Select Language" />

      <View style={styles.list}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.key}
            style={styles.item}
            onPress={() => onSelect(lang.key)}
          >
            <View style={styles.textWrapper}>
              <Text style={styles.text}>{lang.key}</Text>
              <Text style={styles.subtitle}>{lang.subtitle}</Text>
            </View>

            {language === lang.key && (
              <Check size={28} color={theme.color.brand} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScreenContainer>
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
    borderWidth: 1,
    borderColor: "#C7C5CC",
  },

  textWrapper: {
    flexDirection: "column",
    flex: 1,
  },

  text: {
    fontSize: 18,
    color: theme.color.black,
    fontFamily: theme.font.semiBold,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginTop: 4,
    fontFamily: theme.font.regular,
  },

  arrowImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
