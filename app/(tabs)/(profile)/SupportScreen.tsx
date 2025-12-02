import ScreenContainer from "@/components/ScreenContainer";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SupportScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  // Fixed Header Component
  const fixedHeader = (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/(tabs)/(profile)")}
        activeOpacity={0.7}
      >
        <ArrowLeft color={theme.color.secondary} size={24} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>{t('supportScreenTitle')}</Text>

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
      <View style={styles.list}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push("/(tabs)/(profile)/support/ContactScreen")}
        >
          <Text style={styles.title}>{t('supportScreenContact')}</Text>
          <Image
            source={require("@/assets/images/arrow-right.png")}
            style={styles.arrow}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push("/(tabs)/(profile)/support/FAQScreen")}
        >
          <Text style={styles.title}>{t('supportScreenFAQ')}</Text>
          <Image
            source={require("@/assets/images/arrow-right.png")}
            style={styles.arrow}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
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
  list: {
    marginTop: 20,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#F4F4F4",
    borderRadius: 12,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C7C5CC",
  },
  title: {
    fontSize: 16,
    color: theme.color.secondary,
    fontFamily: theme.font.regular,
  },
  arrow: {
    width: 24,
    height: 24,
  },
});
