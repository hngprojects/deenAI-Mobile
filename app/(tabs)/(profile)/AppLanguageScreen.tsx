import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenContainer from "@/components/ScreenContainer";
import { useLanguageStore } from "@/store/language-store";
import { ArrowLeft } from "lucide-react-native";

export default function AppLanguageScreen() {
  const router = useRouter();
  const { language } = useLanguageStore();

  // Fixed Header Component
  const fixedHeader = (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <ArrowLeft color={theme.color.secondary} size={24} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>App Language</Text>

      <View style={styles.placeholder} />
    </View>
  );

  return (
    <ScreenContainer
      fixedHeader={fixedHeader}
      useFixedHeaderLayout={true}
      paddingHorizontal={20}
      backgroundColor={theme.color.background3}
    >
      <TouchableOpacity
        style={styles.languageContainer}
        onPress={() => router.push("/(tabs)/(profile)/SelectLanguageScreen")}
      >
        <View style={styles.languageTextWrapper}>
          <Text style={styles.languageHeading}>App Language</Text>
          <Text style={styles.languageValue}>{language}</Text>
        </View>

        <Image
          source={require("@/assets/images/arrow-right.png")}
          style={styles.arrowImage}
        />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    alignItems: "flex-start",
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.font.semiBold,
    color: theme.color.secondary,
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#F4F4F4",
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#C7C5CC",
  },
  languageTextWrapper: {
    flexDirection: "column",
  },
  languageHeading: {
    fontSize: 18,
    color: theme.color.black,
    fontFamily: theme.font.semiBold,
  },
  languageValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginTop: 3,
    fontFamily: theme.font.regular,
  },
  arrowImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
