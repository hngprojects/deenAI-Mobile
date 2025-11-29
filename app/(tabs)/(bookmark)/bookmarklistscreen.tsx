import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { quranService } from "@/service/quran.service";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import { CheckCircle, ChevronRight, Filter, MoreVertical, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface BookmarkItem {
  surahNumber: number;
  verseNumber: number;
  verseText: string;
  surahName: string;
  selected?: boolean;
}

const BookmarkScreen: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);

  const router = useRouter();

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const all = await quranService.getBookmarks();
    setBookmarks(all);
  };

  const toggleSelection = (id: string) => {
    const updated = bookmarks.map((b) =>
      `${b.surahNumber}-${b.verseNumber}` === id ? { ...b, selected: !b.selected } : b
    );
    setBookmarks(updated);
    setSelectedCount(updated.filter((b) => b.selected).length);
  };

  const handleDeleteSelected = async () => {
    const selected = bookmarks.filter((b) => b.selected);
    for (const b of selected) {
      await quranService.removeBookmark(b.surahNumber, b.verseNumber);
    }
    loadBookmarks();
    setSelectionMode(false);
  };

  const openSurah = (surahNumber: number) => {
    router.push(`/quran/${surahNumber}`);
  };

  const renderItem = ({ item }: { item: BookmarkItem }) => {
    const id = `${item.surahNumber}-${item.verseNumber}`;

    return (
      <TouchableOpacity
        style={[styles.card, item.selected && selectionMode ? styles.cardSelected : null]}
        activeOpacity={0.7}
        onPress={() => selectionMode && toggleSelection(id)}
      >
        <View style={styles.cardContent}>
          {selectionMode && (
            <View style={{ marginRight: 10 }}>
              {item.selected ? (
                <CheckCircle size={22} color={theme.color.brand} />
              ) : (
                <View style={styles.uncheckedCircle} />
              )}
            </View>
          )}

          <View style={{ flex: 1 }}>
            {/* Vertical Quran / Chapter */}
            <Text style={styles.surahName}>{item.surahName}</Text>
            <Text style={styles.chapterText}>Chapter {item.surahNumber}:{item.verseNumber}</Text>

            <Text style={styles.verseText}>{item.verseText}</Text>
          </View>

          {!selectionMode && (
            <TouchableOpacity onPress={() => openSurah(item.surahNumber)}>
              <ChevronRight size={22} color={theme.color.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenContainer backgroundColor={theme.color.white} statusBarStyle="dark">
        <ScreenHeader
          title={selectionMode ? `${selectedCount} selected` : "Bookmark"}
          rightElement={
            !selectionMode ? (
              <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
                <MoreVertical size={24} color={theme.color.secondary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleDeleteSelected}>
                <Trash2 size={24} color={theme.color.brand} />
              </TouchableOpacity>
            )
          }
        />

        {/* Dropdown Overlay */}
        {menuVisible && !selectionMode && (
          <TouchableOpacity
            style={styles.dropdownOverlay}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          >
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectionMode(true);
                  setMenuVisible(false);
                }}
              >
                <View style={styles.dropdownRow}>
                  <CheckCircle size={20} color={theme.color.secondary} />
                  <Text style={styles.dropdownText}>Select</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  // Add filter logic later
                  setMenuVisible(false);
                }}
              >
                <View style={styles.dropdownRow}>
                  <Filter size={20} color={theme.color.secondary} />
                  <Text style={styles.dropdownText}>Filter</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={async () => {
                  for (const b of bookmarks) {
                    await quranService.removeBookmark(b.surahNumber, b.verseNumber);
                  }
                  loadBookmarks();
                  setMenuVisible(false);
                }}
              >
                <View style={styles.dropdownRow}>
                  <Trash2 size={20} color={theme.color.brand} />
                  <Text style={styles.dropdownText}>Delete All</Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}

        <FlatList
          data={bookmarks}
          keyExtractor={(item) => `${item.surahNumber}-${item.verseNumber}`}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        />
      </ScreenContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.white,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardSelected: { backgroundColor: "#f2f2f2" },
  cardContent: { flexDirection: "row", alignItems: "center" },

  uncheckedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.color.secondary,
  },

  surahName: {
    fontFamily: theme.font.semiBold,
    fontSize: 15,
    color: theme.color.secondary,
  },

  chapterText: {
    fontFamily: theme.font.regular,
    fontSize: 14,
    color: theme.color.secondary,
    marginBottom: 4,
  },

  verseText: {
    fontFamily: theme.font.regular,
    fontSize: 14,
    color: theme.color.secondary,
  },

  dropdownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },

  dropdown: {
    position: "absolute",
    top: 60,
    right: 16,
    backgroundColor: theme.color.white,
    paddingVertical: 8,
    borderRadius: 10,
    width: 150,
    elevation: 10,
    zIndex: 1001,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  dropdownText: {
    fontSize: 14,
    fontFamily: theme.font.regular,
  },
});

export default BookmarkScreen;
