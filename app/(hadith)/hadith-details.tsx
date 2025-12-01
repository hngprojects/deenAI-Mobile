import { useToast } from "@/hooks/useToast";
import { useHadithStore } from "@/store/hadith-store";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Clipboard,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HadithDetailScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { currentCollection, currentBook, getHadithByNumber, collections } =
    useHadithStore();

  const [currentHadithIndex, setCurrentHadithIndex] = useState(0);

  useEffect(() => {
    setCurrentHadithIndex(0);
  }, [currentBook]);

  if (!currentCollection || !currentBook) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No hadith selected</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentHadithNumber =
    currentBook.hadiths[currentHadithIndex]?.hadithnumber;
  const arabicHadith = currentHadithNumber
    ? getHadithByNumber(currentCollection, currentHadithNumber, "arabic")
    : null;
  const englishHadith = currentHadithNumber
    ? getHadithByNumber(currentCollection, currentHadithNumber, "english")
    : null;

  const collection = collections.find((c) => c.id === currentCollection);

  const handlePrevious = () => {
    if (currentHadithIndex > 0) {
      setCurrentHadithIndex(currentHadithIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentHadithIndex < currentBook.hadiths.length - 1) {
      setCurrentHadithIndex(currentHadithIndex + 1);
    }
  };

  const handleCopyEnglish = () => {
    if (!englishHadith) {
      showToast("No text to copy", "error");
      return;
    }

    try {
      Clipboard.setString(englishHadith.text);
      showToast("English text copied to clipboard", "success");
    } catch (error) {
      showToast("Failed to copy text", "error");
    }
  };

  const handleShare = async () => {
    if (!englishHadith || !arabicHadith) {
      showToast("Unable to share hadith", "error");
      return;
    }

    try {
      const shareText = `${collection?.name} - ${currentBook.book}\nHadith ${englishHadith.hadithnumber}\n\n${englishHadith.text}\n\nReference: Book ${englishHadith.reference.book}, Hadith ${englishHadith.reference.hadith}`;

      await Share.share({
        message: shareText,
      });
    } catch (error) {
      showToast("Failed to share hadith", "error");
    }
  };

  const handleLike = () => {
    showToast("Like feature coming soon", "info");
  };

  if (!arabicHadith || !englishHadith) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Hadith not found</Text>
        </View>
      </View>
    );
  }

  const extractNarrator = (text: string): string => {
    const patterns = [
      /Narrated ['"]?([^:'"]+)['"]?:/i,
      /^([^:]+):/,
      /It was narrated (?:from|that) ([^:]+):/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return "Unknown";
  };

  const narrator = extractNarrator(englishHadith.text);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {currentBook.book}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </View>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Chapter Title */}
        <Text style={styles.chapterTitle}>
          ({currentHadithIndex + 1}) Chapter: {currentBook.book}
        </Text>

        <View style={styles.hadithNumberBadge}>
          <Text style={styles.hadithNumberText}>
            {englishHadith.hadithnumber}
          </Text>
        </View>

        <View style={styles.arabicContainer}>
          <Text style={styles.arabicText}>{arabicHadith.text}</Text>
        </View>

        <Text style={styles.narrator}>Narrated &apos;{narrator}:</Text>

        <Text style={styles.englishText}>{englishHadith.text}</Text>

        {englishHadith.grades && englishHadith.grades.length > 0 && (
          <View style={styles.gradesContainer}>
            <Text style={styles.gradeTitle}>Grading:</Text>
            {englishHadith.grades.map((grade, index) => (
              <View key={index} style={styles.gradeItem}>
                <Text style={styles.gradeName}>{grade.name}:</Text>
                <Text style={styles.gradeValue}> {grade.grade}</Text>
              </View>
            ))}
          </View>
        )}

        {/* <View style={styles.referenceContainer}>
          <Text style={styles.referenceText}>
            Reference: Book {englishHadith.reference.book}, Hadith {englishHadith.reference.hadith}
          </Text>
        </View> */}

        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            Hadith {currentHadithIndex + 1} of {currentBook.numberOfHadith}
          </Text>
        </View>

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentHadithIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePrevious}
            disabled={currentHadithIndex === 0}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={currentHadithIndex === 0 ? "#CCC" : theme.color.brand}
            />
            <Text
              style={[
                styles.navButtonText,
                currentHadithIndex === 0 && styles.navButtonTextDisabled,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              currentHadithIndex === currentBook.hadiths.length - 1 &&
                styles.navButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={currentHadithIndex === currentBook.hadiths.length - 1}
          >
            <Text
              style={[
                styles.navButtonText,
                currentHadithIndex === currentBook.hadiths.length - 1 &&
                  styles.navButtonTextDisabled,
              ]}
            >
              Next
            </Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={
                currentHadithIndex === currentBook.hadiths.length - 1
                  ? "#CCC"
                  : theme.color.brand
              }
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCopyEnglish}
        >
          <Ionicons name="copy-outline" size={24} color="#000" />
        </TouchableOpacity>

        {/* <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleLike}
                >
                    <Ionicons name="heart-outline" size={24} color="#000" />
                </TouchableOpacity> */}

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.font.bold,
    color: "#000",
    maxWidth: "80%",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  chapterTitle: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: "#333",
    marginBottom: 20,
    lineHeight: 24,
    backgroundColor: "#ffffffff",
    padding: 10,
    borderRadius: 8,
  },
  arabicContainer: {
    padding: 20,
    borderRadius: 12,
  },
  arabicText: {
    fontSize: 19,
    lineHeight: 36,
    textAlign: "right",
    fontFamily: "Scheherazade-Regular",
    color: "#000",
  },
  hadithNumberBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    height: 25,
    borderRadius: 7,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#edededff",
  },
  hadithNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B1A7BE",
  },
  narrator: {
    fontSize: 16,
    color: "#454443ff",
    marginBottom: 12,
    paddingHorizontal: 20,
    fontFamily: theme.font.bold,
  },
  englishText: {
    fontSize: 16,
    lineHeight: 26,
    color: "#77746eff",
    marginBottom: 24,
    paddingHorizontal: 20,
    fontFamily: theme.font.bold,
  },
  gradesContainer: {
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  gradeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  gradeItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  gradeName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  gradeValue: {
    fontSize: 14,
    color: "#333",
  },
  referenceContainer: {
    marginBottom: 12,
  },
  referenceText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  counterContainer: {
    alignItems: "center",
  },
  counterText: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.color.brand,
  },
  navButtonTextDisabled: {
    color: "#CCC",
  },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 40,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  actionButton: {
    padding: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  backLink: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
});
