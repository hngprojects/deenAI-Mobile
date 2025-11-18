import React, { useState, useMemo } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import SurahListItem from "../../components/surahListItem";
import FeaturedSurahCard from "../../components/featuredSurahCard";
import SearchBar from "../../components/searchBar";

import { theme } from "@/styles/theme";
import { surahs } from "../../mockData";


export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishMeaning: string;
  verses: number;
  arabic: string[];
  transliteration: string[];
  translation: string[];
}

export type RootStackParamList = {
  Quran: undefined;
  surahDetail: { surah: Surah };
};

type QuranScreenProp = NativeStackNavigationProp<RootStackParamList, "Quran">;
// ------------------------------------------------------------------

export default function Quran() {
  const navigation = useNavigation<QuranScreenProp>();
  const [searchText, setSearchText] = useState("");


  const alFatihah = useMemo(() => surahs.find((s) => s.number === 1), []);


  const filteredSurahs = useMemo(() => {
    if (!searchText) {
      return surahs;
    }

    const lowerCaseSearch = searchText.toLowerCase();

    return surahs.filter(
      (s) =>
      
        s.englishName.toLowerCase().includes(lowerCaseSearch) ||
        s.englishMeaning.toLowerCase().includes(lowerCaseSearch) ||
        s.number.toString().includes(lowerCaseSearch)
    );
  }, [searchText]);

  const renderSurahCard = ({ item }: { item: Surah }) => (
    <SurahListItem
      surah={item}
      onPress={() => navigation.navigate("surahDetail", { surah: item })}
    />
  );

  const ListHeader = () => (
    <>
      <Text style={styles.screenTitle}>Quran</Text>

      <SearchBar
        placeholder="Search a chapter"
        searchText={searchText}
        onSearchChange={setSearchText}
      />

 
      {!searchText && alFatihah && (
        <FeaturedSurahCard
          surah={alFatihah}
          onPress={() =>
            navigation.navigate("surahDetail", { surah: alFatihah })
          }
        />
      )}

      <Text style={styles.surahsSectionHeader}>Surahs</Text>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredSurahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={renderSurahCard}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
});
