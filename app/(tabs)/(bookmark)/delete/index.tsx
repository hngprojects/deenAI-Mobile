import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import VerseItem from "@/components/quran/verseItem";
import DeleteConfirmModal from "@/components/delete/DeleteConfirmModal";
import { quranService } from "@/service/quran.service";
import { theme } from "@/styles/theme";

export default function DeleteConfirmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [visible, setVisible] = useState(true);
  const [verse, setVerse] = useState<any>(null);

  const id = params.id as string;  

  useEffect(() => {
    if (!id) return;

    const [surahNumber, verseNumber] = id.split("-").map(Number);

    loadVerse(surahNumber, verseNumber);
  }, []);

  const loadVerse = async (surahNumber: number, verseNumber: number) => {
    const data = await quranService.getBookmarks();
    const match = data.find(
      (b) => b.surahNumber === surahNumber && b.verseNumber === verseNumber
    );
    setVerse(match);
  };

  const deleteBookmark = async () => {
    await quranService.removeBookmark(id);
    setVisible(false);
    router.push("/(tabs)/(bookmark)");
  };

  return (
    <View style={styles.container}>
      <View style={{ opacity: 0.3 }}>
        {verse && (
          <VerseItem
            verseNumber={verse.verseNumber}
            arabicText={verse.arabicText}
            translation={verse.verseText}
            surahNumber={verse.surahNumber}
            surahName={verse.surahName}
            showTransliteration={false}
          />
        )}
      </View>

      <DeleteConfirmModal
        visible={visible}
        setVisible={setVisible}
        onConfirm={deleteBookmark}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.white,
    paddingTop: 60,
  },
});
