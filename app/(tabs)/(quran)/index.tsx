import FeaturedSurahCard from "@/components/quran/featuredSurahCard";
import SurahListItem from "@/components/quran/surahListItem";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { quranService } from "@/service/quran.service";
import { theme } from "@/styles/theme";
import { Surah } from "@/types/quran.types";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SearchBar from "@/components/searchBar";

export type RootStackParamList = {
  Quran: undefined;
  surahDetail: { surah: string };
};

type QuranScreenProp = NativeStackNavigationProp<RootStackParamList, "Quran">;

export default function Quran() {
  const navigation = useNavigation<QuranScreenProp>();
  const [searchText, setSearchText] = useState("");
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuranData();
  }, []);

  const loadQuranData = async () => {
    try {
      setLoading(true);
      setError(null);
      await quranService.initialize();
      const allSurahs = await quranService.getAllSurahs();
      setSurahs(allSurahs);
    } catch (err) {
      console.error("Error loading Quran data:", err);
      setError("Failed to load Quran data. Please restart the app.");
    } finally {
      setLoading(false);
    }
  };

  const alFatihah = useMemo(() => surahs.find((s) => s.number === 1), [surahs]);

  const filteredSurahs = useMemo(() => {
    if (!searchText) {
      return surahs;
    }

    const lowerCaseSearch = searchText.toLowerCase();

    return surahs.filter(
      (s) =>
        s.englishName.toLowerCase().includes(lowerCaseSearch) ||
        s.englishNameTranslation.toLowerCase().includes(lowerCaseSearch) ||
        s.name.includes(searchText) ||
        s.number.toString().includes(lowerCaseSearch)
    );
  }, [searchText, surahs]);

  const handleNavigateToSurah = useCallback(
    (surah: Surah) => {
      navigation.navigate("surahDetail", {
        surah: JSON.stringify(surah),
      });
    },
    [navigation]
  );

  const renderSurahCard = useCallback(
    ({ item }: { item: Surah }) => (
      <SurahListItem
        surah={item}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/(quran)/surahDetail",
            params: { surah: JSON.stringify(item) },
          })
        }
      />
    ),
    []
  );

  const ListHeader = useCallback(
    () => (
      <>
        {!searchText && alFatihah && (
          <FeaturedSurahCard
            surah={alFatihah}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(quran)/surahDetail",
                params: { surah: JSON.stringify(alFatihah) },
              })
            }
          />
        )}

        <Text style={styles.surahsSectionHeader}>Surahs</Text>
      </>
    ),
    [searchText, alFatihah]
  );

  if (loading) {
    return (
      <ScreenContainer
        backgroundColor={theme.color.white}
        statusBarStyle="dark"
        scrollable={false}
        keyboardAvoiding={false}
      >
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.color.brand} />
          <Text style={styles.loadingText}>Loading Quran...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer
        backgroundColor={theme.color.white}
        statusBarStyle="dark"
        scrollable={false}
        keyboardAvoiding={false}
      >
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      backgroundColor={theme.color.white}
      statusBarStyle="dark"
      scrollable={false}
      showsVerticalScrollIndicator={false}
      keyboardAvoiding={false}
    >
      <View style={styles.fixedHeader}>
        <ScreenHeader
          titleAlign="left"
          showBackButton={false}
          title="Quran"
          titleStyle={{
            fontSize: 28,
            fontFamily: theme.font.bold,
          }}
        />

        <SearchBar
          placeholder="Search a chapter"
          searchText={searchText}
          onSearchChange={setSearchText}
        />
      </View>

      <FlatList
        data={filteredSurahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={renderSurahCard}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  fixedHeader: {
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 54,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: theme.color.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  flatList: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 28,
    fontFamily: theme.font.bold,
    color: theme.color.secondary,
    marginTop: 10,
    marginBottom: 20,
  },
  surahsSectionHeader: {
    fontSize: 20,
    fontFamily: theme.font.semiBold,
    color: theme.color.secondary,
    marginBottom: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
  },
  errorText: {
    fontSize: 16,
    fontFamily: theme.font.regular,
    color: "#FF4444",
    textAlign: "center",
  },
});
