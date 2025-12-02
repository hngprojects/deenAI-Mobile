import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DeleteConfirmCard from "@/components/bookmark/DeleteConfirmCard";
import { quranService } from "@/service/quran.service";
import { theme } from "@/styles/theme";

const VerseItem: React.FC<VerseItemProps> = ({
  verseNumber,
  arabicText,
  translation,
  isBookmarked = false,
  onBookmarkPress,
  surahNumber,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    await quranService.removeBookmark(Number(surahNumber), Number(verseNumber));
    setShowDeleteConfirm(false);
    // optionally update parent state
  };

  const handleCancel = () => setShowDeleteConfirm(false);

  return (
    <View style={styles.container}>
      <Text style={styles.arabicText}>{arabicText}</Text>
      <Text style={styles.translation}>{translation}</Text>

      <TouchableOpacity
        onPress={() => setShowDeleteConfirm(true)}
        style={styles.deleteBtn}
      >
        <Text style={styles.deleteText}>Delete Bookmark</Text>
      </TouchableOpacity>

      {showDeleteConfirm && (
        <DeleteConfirmCard
          surahNumber={surahNumber!}
          verseNumber={verseNumber}
          onConfirm={handleDelete}
          onCancel={handleCancel}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: theme.color.white, marginBottom: 12, borderRadius: 12 },
  arabicText: { fontSize: 18, fontFamily: "Scheherazade-Regular", color: theme.color.secondary },
  translation: { fontSize: 16, fontFamily: theme.font.regular, color: theme.color.secondary },
  deleteBtn: { marginTop: 12, padding: 8, backgroundColor: "#E55153", borderRadius: 8 },
  deleteText: { color: theme.color.white, textAlign: "center" },
});

export default VerseItem;
