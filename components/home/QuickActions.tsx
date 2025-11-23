import { theme } from "@/styles/theme";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QuickActions() {
  const handleDeenAiPress = () => {
    // TODO: Navigate to Deen AI chat
    router.push("/(deenai)");
  };

  const handleHadithPress = () => {
    console.log("Hadith pressed");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.card, styles.deenAiCard]}
        onPress={handleDeenAiPress}
        activeOpacity={0.9}
      >
        <Image
          source={require("../../assets/images/ms.png")}
          style={styles.cardIcon}
          resizeMode="contain"
        />

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            Uncover new &{"\n"}amazing things{"\n"}with Deen Ai
          </Text>
          <View style={styles.ctaButton}>
            <Text style={styles.ctaText}>Let&apos;s Chat</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.hadithCard]}
        onPress={handleHadithPress}
        activeOpacity={0.9}
      >
        <Image
          source={require("../../assets/images/book.png")}
          style={styles.cardIcon}
          resizeMode="contain"
        />

        <View style={styles.cardContent}>
          <Text style={styles.hadithTitle}>Learn about Hadiths</Text>
          <Text style={styles.hadithDescription}>
            Find light and guidance for how you feel, see, through the Quran or
            Hadith.
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E3E3E3",
  },
  deenAiCard: {
    backgroundColor: theme.color.white,
  },
  hadithCard: {
    backgroundColor: theme.color.white,
  },
  cardIcon: {
    width: 60,
    height: 60,
    marginBottom: 16,
    alignSelf: "center",
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: theme.font.regular,
    color: "#404040",
    lineHeight: 24,
  },
  ctaButton: {
    alignSelf: "flex-start",
  },
  ctaText: {
    fontSize: 16,
    fontFamily: theme.font.bold,
    color: "#9C7630",
  },
  hadithTitle: {
    fontSize: 16,
    fontFamily: theme.font.bold,
    color: theme.color.secondary,
    marginBottom: 8,
  },
  hadithDescription: {
    fontSize: 15,
    fontFamily: theme.font.regular,
    color: "#666",
    lineHeight: 20,
  },
});
