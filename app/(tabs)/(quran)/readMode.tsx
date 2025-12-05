// components/quran/ReadModeView.tsx
import { quranService } from "@/service/quran.service";
import { useReadingStore } from "@/store/reading-store";
import { PageVerse } from "@/types/quran.types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const BasmalaImage = require("../../../assets/images/basmala-calligraphy.png");

const { width, height } = Dimensions.get("window");

interface ReadModeViewProps {
  initialPage?: number;
}

// Helper function to convert numbers to Arabic numerals
function convertToArabicNumerals(num: number): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((digit) => arabicNumerals[parseInt(digit)])
    .join("");
}

// decorative verse marker with ornamental brackets
function getVerseMarker(num: number): string {
  const arabicNum = convertToArabicNumerals(num);
  return ` ﴿${arabicNum}﴾ `;
}

// Arabic surah name
function getSurahNameArabic(surahNumber: number): string {
  const surahNames: { [key: number]: string } = {
    1: "ٱلْفَاتِحَة",
    2: "ٱلْبَقَرَة",
    3: "آلِ عِمْرَان",
    4: "ٱلنِّسَاء",
    5: "ٱلْمَائِدَة",
    6: "ٱلْأَنْعَام",
    7: "ٱلْأَعْرَاف",
    8: "ٱلْأَنْفَال",
    9: "ٱلتَّوْبَة",
    10: "يُونُس",
    11: "هُود",
    12: "يُوسُف",
    13: "ٱلرَّعْد",
    14: "إِبْرَاهِيم",
    15: "ٱلْحِجْر",
    16: "ٱلنَّحْل",
    17: "ٱلْإِسْرَاء",
    18: "ٱلْكَهْف",
    19: "مَرْيَم",
    20: "طه",
    21: "ٱلْأَنْبِيَاء",
    22: "ٱلْحَجّ",
    23: "ٱلْمُؤْمِنُون",
    24: "ٱلنُّور",
    25: "ٱلْفُرْقَان",
    26: "ٱلشُّعَرَاء",
    27: "ٱلنَّمْل",
    28: "ٱلْقَصَص",
    29: "ٱلْعَنْكَبُوت",
    30: "ٱلرُّوم",
    31: "لُقْمَان",
    32: "ٱلسَّجْدَة",
    33: "ٱلْأَحْزَاب",
    34: "سَبَأ",
    35: "فَاطِر",
    36: "يس",
    37: "ٱلصَّافَّات",
    38: "ص",
    39: "ٱلزُّمَر",
    40: "غَافِر",
    41: "فُصِّلَت",
    42: "ٱلشُّورىٰ",
    43: "ٱلزُّخْرُف",
    44: "ٱلدُّخَان",
    45: "ٱلْجَاثِيَة",
    46: "ٱلْأَحْقَاف",
    47: "مُحَمَّد",
    48: "ٱلْفَتْح",
    49: "ٱلْحُجُرَات",
    50: "ق",
    51: "ٱلذَّارِيَات",
    52: "ٱلطُّور",
    53: "ٱلنَّجْم",
    54: "ٱلْقَمَر",
    55: "ٱلرَّحْمَٰن",
    56: "ٱلْوَاقِعَة",
    57: "ٱلْحَدِيد",
    58: "ٱلْمُجَادِلَة",
    59: "ٱلْحَشْر",
    60: "ٱلْمُمْتَحَنَة",
    61: "ٱلصَّفّ",
    62: "ٱلْجُمُعَة",
    63: "ٱلْمُنَافِقُون",
    64: "ٱلتَّغَابُن",
    65: "ٱلطَّلَاق",
    66: "ٱلتَّحْرِيم",
    67: "ٱلْمُلْك",
    68: "ٱلْقَلَم",
    69: "ٱلْحَاقَّة",
    70: "ٱلْمَعَارِج",
    71: "نُوح",
    72: "ٱلْجِنّ",
    73: "ٱلْمُزَّمِّل",
    74: "ٱلْمُدَّثِّر",
    75: "ٱلْقِيَامَة",
    76: "ٱلْإِنْسَان",
    77: "ٱلْمُرْسَلَات",
    78: "ٱلنَّبَأ",
    79: "ٱلنَّازِعَات",
    80: "عَبَسَ",
    81: "ٱلتَّكْوِير",
    82: "ٱلْإِنْفِطَار",
    83: "ٱلْمُطَفِّفِين",
    84: "ٱلْإِنْشِقَاق",
    85: "ٱلْبُرُوج",
    86: "ٱلطَّارِق",
    87: "ٱلْأَعْلىٰ",
    88: "ٱلْغَاشِيَة",
    89: "ٱلْفَجْر",
    90: "ٱلْبَلَد",
    91: "ٱلشَّمْس",
    92: "ٱللَّيْل",
    93: "ٱلضُّحىٰ",
    94: "ٱلشَّرْح",
    95: "ٱلتِّين",
    96: "ٱلْعَلَق",
    97: "ٱلْقَدْر",
    98: "ٱلْبَيِّنَة",
    99: "ٱلزَّلْزَلَة",
    100: "ٱلْعَادِيَات",
    101: "ٱلْقَارِعَة",
    102: "ٱلتَّكَاثُر",
    103: "ٱلْعَصْر",
    104: "ٱلْهُمَزَة",
    105: "ٱلْفِيل",
    106: "قُرَيْش",
    107: "ٱلْمَاعُون",
    108: "ٱلْكَوْثَر",
    109: "ٱلْكَافِرُون",
    110: "ٱلنَّصْر",
    111: "ٱلْمَسَد",
    112: "ٱلْإِخْلَاص",
    113: "ٱلْفَلَق",
    114: "ٱلنَّاس",
  };
  return surahNames[surahNumber] || "";
}

export default function ReadModeView({ initialPage = 1 }: ReadModeViewProps) {
  const lastReadPage = useReadingStore((state) => state.lastReadPage);
  const [currentPage, setCurrentPage] = useState(
    initialPage || lastReadPage || 1
  );
  const [pageData, setPageData] = useState<{
    [key: number]: PageVerse[];
  }>({});
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const flatListRef = useRef<FlatList>(null);
  const setLastReadPage = useReadingStore((state) => state.setLastReadPage);

  const pages = Array.from({ length: 604 }, (_, i) => i + 1);

  const loadPage = useCallback(
    async (pageNumber: number) => {
      if (pageData[pageNumber]) return;

      try {
        setLoading((prev) => ({ ...prev, [pageNumber]: true }));
        const pageVerses = await quranService.getPageVerses(pageNumber);
        setPageData((prev) => ({ ...prev, [pageNumber]: pageVerses }));
        if (pageNumber === currentPage) {
          setLastReadPage(pageNumber);
        }
      } catch (error) {
        console.error("Error loading page:", error);
      } finally {
        setLoading((prev) => ({ ...prev, [pageNumber]: false }));
      }
    },
    [currentPage, pageData, setLastReadPage]
  );

  useEffect(() => {
    loadPage(currentPage);
    if (currentPage > 1) loadPage(currentPage - 1);
    if (currentPage < 604) loadPage(currentPage + 1);
  }, [currentPage, loadPage]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const visiblePage = viewableItems[0].item;
      setCurrentPage(visiblePage);
    }
  }).current;

  const renderPage = useCallback(
    ({ item: pageNumber }: { item: number }) => {
      const verses = pageData[pageNumber] || [];
      const isLoading = loading[pageNumber] && verses.length === 0;

      const shouldShowSurahHeader =
        verses.length > 0 &&
        verses[0].numberInSurah === 1 &&
        verses[0].surahNumber !== 1;

      const shouldShowBasmala =
        verses.length > 0 &&
        verses[0].numberInSurah === 1 &&
        verses[0].surahNumber !== 1 &&
        verses[0].surahNumber !== 9;

      const buildPageText = () => {
        if (verses.length === 0) return "";

        return verses
          .map((verse) => {
            return verse.text + getVerseMarker(verse.numberInSurah);
          })
          .join(" ");
      };

      return (
        <View style={styles.pageContainer}>
          <View style={styles.pageContent}>
            {/* Page Number at Top */}
            <View style={styles.pageNumberTop}>
              <Text style={styles.pageNumberText}>
                {convertToArabicNumerals(pageNumber)}
              </Text>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8B7355" />
              </View>
            ) : (
              <ScrollView
                style={styles.textContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {/* Surah Header */}
                {shouldShowSurahHeader && (
                  <View style={styles.surahHeaderContainer}>
                    <Text style={styles.surahNameText}>
                      سُورَةُ {getSurahNameArabic(verses[0].surahNumber)}
                    </Text>
                    <View style={styles.decorativeLine} />
                  </View>
                )}

                {/* Basmala */}
                {shouldShowBasmala && (
                  <View style={styles.basmalaImageContainer}>
                    <Image
                      source={BasmalaImage}
                      style={styles.basmalaImage}
                      resizeMode="contain"
                    />
                  </View>
                )}

                {/* Main Quran Text */}
                <Text
                  style={styles.quranText}
                  allowFontScaling={false}
                  numberOfLines={0}
                >
                  {buildPageText()}
                </Text>
              </ScrollView>
            )}
          </View>
        </View>
      );
    },
    [pageData, loading]
  );

  useEffect(() => {
    if (flatListRef.current && initialPage > 1) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: initialPage - 1,
          animated: false,
        });
      }, 100);
    }
  }, [initialPage]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={pages}
        renderItem={renderPage}
        keyExtractor={(item) => item.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        initialScrollIndex={initialPage - 1}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: false,
            });
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9f9f9",
  },
  pageContainer: {
    width: width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pageContent: {
    width: "100%",
    flex: 1,
    backgroundColor: "#F9f9f9",

    padding: 16,

    elevation: 5,
  },
  pageNumberTop: {
    alignItems: "center",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#5A2D00",
    marginBottom: 12,
  },
  pageNumberText: {
    fontFamily: "me_quran",
    fontSize: 50,
    color: "#5A2D00",
    letterSpacing: 2,
  },
  textContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  surahHeaderContainer: {
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 4,
  },
  surahNameText: {
    fontFamily: "me_quran",
    fontSize: 22,
    color: "#5A2D00",
    textAlign: "center",
    marginBottom: 8,
  },
  decorativeLine: {
    width: "50%",
    height: 2,
    backgroundColor: "#5A2D00",
  },
  basmalaImageContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  basmalaImage: {
    width: "80%",
    height: 60,
    maxWidth: 200,
  },
  quranText: {
    fontFamily: "me_quran",
    fontSize: 20,
    lineHeight: 46,
    color: "#3C3A35",
    textAlign: "justify",
    writingDirection: "rtl",
    paddingHorizontal: 8,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
