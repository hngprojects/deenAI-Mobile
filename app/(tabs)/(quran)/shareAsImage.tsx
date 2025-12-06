// app/(tabs)/(quran)/shareAsImage.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { theme } from "@/styles/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const GRID_COLUMNS = 3;
const GRID_ITEM_SIZE = (width - 60) / GRID_COLUMNS;

interface Background {
  id: number;
  type: "image";
  image: any;
}

const BACKGROUNDS: Background[] = [
  {
    id: 1,
    type: "image",
    image: require("@/assets/images/share-image/1.png"),
  },
  {
    id: 2,
    type: "image",
    image: require("@/assets/images/share-image/2.png"),
  },
  {
    id: 3,
    type: "image",
    image: require("@/assets/images/share-image/3.png"),
  },
  {
    id: 4,
    type: "image",
    image: require("@/assets/images/share-image/4.png"),
  },
  {
    id: 5,
    type: "image",
    image: require("@/assets/images/share-image/5.png"),
  },
  {
    id: 6,
    type: "image",
    image: require("@/assets/images/share-image/6.png"),
  },
];

export default function ShareAsImage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedBackground, setSelectedBackground] = useState<Background>(
    BACKGROUNDS[0]
  );

  const arabicText = params.arabicText as string;
  const translation = params.translation as string;
  const surahName = params.surahName as string;
  const surahNumber = params.surahNumber as string;
  const verseNumber = params.verseNumber as string;

  const calculateCardHeight = () => {
    const totalLength = arabicText.length + translation.length;

    if (totalLength < 300) return 400;
    else if (totalLength < 600) return 500;
    else if (totalLength < 1000) return 600;
    else if (totalLength < 1500) return 700;
    else if (totalLength < 2000) return 800;
    else return 900;
  };

  const cardHeight = calculateCardHeight();

  // Auto-scaling
  const getSmartFontSizes = () => {
    const totalLength = arabicText.length + translation.length;

    // Short verses (< 200 chars)
    if (totalLength < 200) {
      return {
        arabic: 26,
        translation: 18,
        lineHeightArabic: 48,
        lineHeightTranslation: 28,
      };
    }
    // Medium-short verses (200-400 chars)
    else if (totalLength < 400) {
      return {
        arabic: 23,
        translation: 17,
        lineHeightArabic: 42,
        lineHeightTranslation: 26,
      };
    }
    // Medium verses (400-700 chars)
    else if (totalLength < 700) {
      return {
        arabic: 20,
        translation: 15,
        lineHeightArabic: 36,
        lineHeightTranslation: 24,
      };
    }
    // Long verses (700-1100 chars)
    else if (totalLength < 1100) {
      return {
        arabic: 17,
        translation: 14,
        lineHeightArabic: 30,
        lineHeightTranslation: 22,
      };
    }
    // Very long verses (1100-1600 chars)
    else if (totalLength < 1600) {
      return {
        arabic: 15,
        translation: 13,
        lineHeightArabic: 26,
        lineHeightTranslation: 20,
      };
    }
    // Extremely long verses (1600+ chars)
    else {
      return {
        arabic: 15,
        translation: 12,
        lineHeightArabic: 24,
        lineHeightTranslation: 18,
      };
    }
  };

  const smartSizes = getSmartFontSizes();

  const handleDone = () => {
    router.push({
      pathname: "/(tabs)/(quran)/shareImageCustomize",
      params: {
        arabicText,
        translation,
        surahName,
        surahNumber,
        verseNumber,
        backgroundImageIndex: selectedBackground.id.toString(),
      },
    });
  };

  return (
    <ScreenContainer
      backgroundColor={theme.color.white}
      statusBarStyle="dark"
      scrollable={false}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 10,
          paddingHorizontal: 10,
        }}
      >
        <ScreenHeader title="Share Quran" showBackButton={true} />

        <ScrollView
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Preview Card */}
          <View style={styles.previewSection}>
            <ImageBackground
              source={selectedBackground.image}
              style={[styles.previewCard, { height: cardHeight }]}
              imageStyle={{ borderRadius: 16 }}
            >
              <View style={styles.overlay}>
                <View style={styles.previewContent}>
                  <Text
                    style={[
                      styles.previewArabic,
                      {
                        fontSize: smartSizes.arabic,
                        lineHeight: smartSizes.lineHeightArabic,
                      },
                    ]}
                  >
                    {arabicText}
                  </Text>
                  <Text
                    style={[
                      styles.previewTranslation,
                      {
                        fontSize: smartSizes.translation,
                        lineHeight: smartSizes.lineHeightTranslation,
                      },
                    ]}
                  >
                    {translation}
                  </Text>

                  <View style={styles.bottomRow}>
                    <View style={styles.previewReference}>
                      <Text style={styles.previewReferenceText}>
                        {surahName} ({surahNumber}:{verseNumber})
                      </Text>
                    </View>

                    <View style={styles.watermark}>
                      <Text style={styles.watermarkText}>Deen AI</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* Background Selection Grid */}
          <View style={styles.backgroundSection}>
            <Text style={styles.sectionTitle}>Select a background</Text>
            <View style={styles.backgroundGrid}>
              {BACKGROUNDS.map((bg) => (
                <TouchableOpacity
                  key={bg.id}
                  onPress={() => setSelectedBackground(bg)}
                  activeOpacity={0.7}
                >
                  <ImageBackground
                    source={bg.image}
                    style={[
                      styles.backgroundItem,
                      selectedBackground.id === bg.id &&
                        styles.selectedBackground,
                    ]}
                    imageStyle={{ borderRadius: 12 }}
                  >
                    {selectedBackground.id === bg.id && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Done Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}
          activeOpacity={0.8}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  previewSection: {
    marginTop: 56,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.font.semiBold,
    color: theme.color.secondary,
    marginBottom: 16,
  },
  previewCard: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  previewContent: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  previewArabic: {
    fontFamily: "AmiriQuran-Regular",
    marginBottom: 16,
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  previewTranslation: {
    fontFamily: theme.font.regular,
    marginBottom: 16,
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewReference: {
    flex: 1,
  },
  previewReferenceText: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    opacity: 0.9,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  watermark: {
    alignItems: "flex-end",
  },
  watermarkText: {
    fontSize: 12,
    fontFamily: theme.font.regular,
    opacity: 0.7,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  backgroundSection: {
    marginBottom: 120,
  },
  backgroundGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  backgroundItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  selectedBackground: {
    borderWidth: 3,
    borderColor: theme.color.brand,
  },
  checkmark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.color.brand,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    padding: 20,
  },
  doneButton: {
    backgroundColor: theme.color.brand,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: theme.font.semiBold,
  },
});
