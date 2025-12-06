import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { theme } from "@/styles/theme";
import Slider from "@react-native-community/slider";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const IMAGE_WIDTH = 1080;
const IMAGE_HEIGHT = 1350;
const IMAGE_ASPECT_RATIO = IMAGE_HEIGHT / IMAGE_WIDTH; // 1.25

const COLORS = [
  "#FFFFFF", // White
  "#000000", // Black
  "#F7EEDB", // Cream
  "#8B6F47", // Brown
  "#2C2416", // Dark Brown
  "#4A90E2", // Blue
  "#E74C3C", // Red
  "#2ECC71", // Green
];

export default function ShareImageCustomize() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const imageRef = useRef(null);
  const insets = useSafeAreaInsets();

  const arabicText = params.arabicText as string;
  const translation = params.translation as string;
  const surahName = params.surahName as string;
  const surahNumber = params.surahNumber as string;
  const verseNumber = params.verseNumber as string;
  const backgroundImageIndex = params.backgroundImageIndex as string;

  const BACKGROUND_IMAGES: { [key: string]: any } = {
    "1": require("@/assets/images/share-image/1.png"),
    "2": require("@/assets/images/share-image/2.png"),
    "3": require("@/assets/images/share-image/3.png"),
    "4": require("@/assets/images/share-image/4.png"),
    "5": require("@/assets/images/share-image/5.png"),
    "6": require("@/assets/images/share-image/6.png"),
  };

  const backgroundImage =
    BACKGROUND_IMAGES[backgroundImageIndex] || BACKGROUND_IMAGES["1"];

  //  Auto-Scaling
  const getBaseTranslationFontSize = () => {
    const totalLength = arabicText.length + translation.length;

    if (totalLength < 400) {
      return 17;
    } else if (totalLength < 700) {
      return 15;
    } else if (totalLength < 1100) {
      return 14;
    } else if (totalLength < 2000) {
      return 12;
    } else if (totalLength < 3000) {
      return 10;
    } else {
      return 8; // Absolute minimum
    }
  };

  const baseTranslationSize = getBaseTranslationFontSize();

  const ARABIC_FONT_SIZE = 10;
  const [fontSize, setFontSize] = useState(baseTranslationSize);
  const [alignment, setAlignment] = useState<"left" | "center" | "right">(
    "center"
  );
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate the image and return the URI
  const generateImage = async (): Promise<string | null> => {
    try {
      const uri = await captureRef(imageRef, {
        format: "jpg",
        quality: 0.9,
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
      });
      return uri;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  };

  // Share the image
  const handleShare = async () => {
    try {
      setIsGenerating(true);

      const uri = await generateImage();
      if (!uri) {
        Alert.alert("Error", "Failed to generate image. Please try again.");
        return;
      }

      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (!isSharingAvailable) {
        Alert.alert("Sharing not available", "Unable to share on this device");
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "image/jpeg",
        dialogTitle: "Share Qur'an Verse",
      });
    } catch (error) {
      console.error("Error sharing image:", error);
      Alert.alert("Error", "Failed to share image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
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
        <ScreenHeader title="Sharing as Image" showBackButton={true} />

        <ScrollView
          style={[
            styles.contentContainer,
            { paddingTop: 10, paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Preview Card - Fixed Aspect Ratio */}
          <View style={styles.previewSection}>
            <View ref={imageRef} collapsable={false}>
              <ImageBackground
                source={backgroundImage}
                style={styles.previewCard}
                imageStyle={{ borderRadius: 16 }}
              >
                <View style={styles.overlay}>
                  <View style={styles.previewContent}>
                    <Text
                      style={[
                        styles.previewArabic,
                        {
                          color: textColor,
                          textAlign: alignment,
                          fontSize: ARABIC_FONT_SIZE,
                        },
                      ]}
                    >
                      {arabicText}
                    </Text>
                    <Text
                      style={[
                        styles.previewTranslation,
                        {
                          color: textColor,
                          fontSize: fontSize,
                          textAlign: alignment,
                        },
                      ]}
                    >
                      {translation}
                    </Text>

                    <View style={styles.bottomRow}>
                      <View style={styles.previewReference}>
                        <Text
                          style={[
                            styles.previewReferenceText,
                            { color: textColor },
                          ]}
                        >
                          {surahName} ({surahNumber}:{verseNumber})
                        </Text>
                      </View>

                      <View style={styles.watermark}>
                        <Text
                          style={[styles.watermarkText, { color: textColor }]}
                        >
                          Deen AI
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View>

          {/* Customization Controls */}
          <View style={styles.controlsSection}>
            {/* Translation Font Size */}
            <View style={styles.controlGroup}>
              <View style={styles.controlRow}>
                <Text style={styles.controlLabel}>Translation Font Size</Text>
                <View style={styles.sliderVisualContainer}>
                  <Text style={styles.smallA}>A</Text>
                  <Slider
                    style={styles.sliderFullWidth}
                    minimumValue={8}
                    maximumValue={28}
                    value={fontSize}
                    onValueChange={setFontSize}
                    minimumTrackTintColor={theme.color.brand}
                    maximumTrackTintColor="#E5E5E5"
                    thumbTintColor={theme.color.brand}
                  />
                  <Text style={styles.largeA}>A</Text>
                </View>
              </View>
            </View>

            {/* Alignment */}
            <View style={styles.controlGroup}>
              <View style={styles.controlRow}>
                <Text style={styles.controlLabel}>Alignment</Text>
                <View style={styles.alignmentButtons}>
                  <TouchableOpacity
                    style={[
                      styles.alignmentButton,
                      alignment === "left" && styles.alignmentButtonActive,
                    ]}
                    onPress={() => setAlignment("left")}
                  >
                    <AlignLeft
                      size={20}
                      color={
                        alignment === "left" ? "#FFFFFF" : theme.color.secondary
                      }
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.alignmentButton,
                      alignment === "center" && styles.alignmentButtonActive,
                    ]}
                    onPress={() => setAlignment("center")}
                  >
                    <AlignCenter
                      size={20}
                      color={
                        alignment === "center"
                          ? "#FFFFFF"
                          : theme.color.secondary
                      }
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.alignmentButton,
                      alignment === "right" && styles.alignmentButtonActive,
                    ]}
                    onPress={() => setAlignment("right")}
                  >
                    <AlignRight
                      size={20}
                      color={
                        alignment === "right"
                          ? "#FFFFFF"
                          : theme.color.secondary
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Color Picker */}
            <View style={styles.controlGroup}>
              <View style={styles.controlRow}>
                <Text style={styles.controlLabel}>Color</Text>
                <View style={styles.colorGridHorizontal}>
                  {COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      onPress={() => setTextColor(color)}
                      style={[
                        styles.colorItem,
                        { backgroundColor: color },
                        color === "#FFFFFF" && styles.colorItemBorder,
                        textColor === color && styles.colorItemSelected,
                      ]}
                    >
                      {textColor === color && (
                        <View style={styles.colorCheckmark}>
                          <Text
                            style={[
                              styles.colorCheckmarkText,
                              {
                                color:
                                  color === "#FFFFFF" ? "#000000" : "#FFFFFF",
                              },
                            ]}
                          >
                            ✓
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Action Buttons */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={[
            styles.shareButton,
            isGenerating && styles.shareButtonDisabled,
          ]}
          onPress={handleShare}
          activeOpacity={0.8}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.shareButtonText}>Share</Text>
          )}
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
    aspectRatio: IMAGE_ASPECT_RATIO,
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
    marginTop: "auto",
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
  controlsSection: {
    marginBottom: 40,
  },
  controlGroup: {
    marginBottom: 32,
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  controlLabel: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
    fontWeight: "500",
    minWidth: "40%",
  },
  sliderVisualContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sliderFullWidth: {
    flex: 1,
    height: 40,
    marginHorizontal: 5,
  },
  smallA: {
    fontSize: 10,
    color: theme.color.secondary,
    fontFamily: theme.font.semiBold,
    minWidth: 15,
    textAlign: "left",
  },
  largeA: {
    fontSize: 12,
    color: theme.color.secondary,
    fontFamily: theme.font.semiBold,
    minWidth: 20,
    textAlign: "right",
  },
  alignmentButtons: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
    justifyContent: "flex-end",
  },
  alignmentButton: {
    flex: 0.3,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  alignmentButtonActive: {
    backgroundColor: theme.color.brand,
    borderColor: theme.color.brand,
  },
  colorGridHorizontal: {
    flexDirection: "row",
    gap: 6,
    flex: 1,
    justifyContent: "center",
  },
  colorItem: {
    width: 25,
    height: 25,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  colorItemBorder: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  colorItemSelected: {
    borderWidth: 3,
    borderColor: theme.color.brand,
  },
  colorCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  colorCheckmarkText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: theme.color.white,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    gap: 12,
  },
  shareButton: {
    flex: 1,
    backgroundColor: theme.color.brand,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonDisabled: {
    opacity: 0.6,
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: theme.font.semiBold,
  },
});
