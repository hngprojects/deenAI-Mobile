import ScreenContainer from "@/components/ScreenContainer";
import { quranService } from "@/service/quran.service";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import { ChevronRight, Filter, MoreHorizontal, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
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

const { width } = Dimensions.get("window");

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
    setBookmarks(all.map((x) => ({ ...x, selected: false })));
  };

  const toggleSelection = (id: string) => {
    const updated = bookmarks.map((b) =>
      `${b.surahNumber}-${b.verseNumber}` === id
        ? { ...b, selected: !b.selected }
        : b
    );
    setBookmarks(updated);
    setSelectedCount(updated.filter((x) => x.selected).length);
  };

  const startSelecting = (id: string) => {
    setSelectionMode(true);
    const updated = bookmarks.map((b) =>
      `${b.surahNumber}-${b.verseNumber}` === id
        ? { ...b, selected: true }
        : b
    );
    setBookmarks(updated);
    setSelectedCount(1);
  };

  const handleDeleteSelected = () => {
    router.push("/(tabs)/(bookmark)/deleteconfirm");
  };

  const openVersePage = (surahNumber: number, verseNumber: number) => {
    router.push("/(tabs)/(quran)");
  };

  const renderItem = ({ item }: { item: BookmarkItem }) => {
    const id = `${item.surahNumber}-${item.verseNumber}`;
    const selectedStyle = item.selected && selectionMode ? styles.cardSelected : {};

    return (
      <TouchableOpacity
        style={[styles.card, selectedStyle]}
        activeOpacity={0.8}
        onPress={() => {
          if (selectionMode) return toggleSelection(id);
          openVersePage(item.surahNumber, item.verseNumber);
        }}
        onLongPress={() => startSelecting(id)}
      >
        <View style={styles.cardContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.surahName}>{item.surahName}</Text>
            <Text style={styles.chapterText}>
              Chapter {item.surahNumber}:{item.verseNumber}
            </Text>
            <Text style={styles.verseText}>{item.verseText}</Text>
          </View>

          <TouchableOpacity onPress={() => openVersePage(item.surahNumber, item.verseNumber)}>
            <ChevronRight size={22} color={theme.color.secondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer backgroundColor={theme.color.white} statusBarStyle="dark">
      {/* Header */}
      <View style={styles.headerContainer}>
        {/* Back arrow */}
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <ChevronRight
            size={26}
            color={theme.color.secondary}
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>
            {selectionMode ? `${selectedCount} selected` : "Bookmark"}
          </Text>
          {selectionMode && selectedCount > 0 && (
            <TouchableOpacity
            onPress={() =>
                router.push({
                    pathname: "/(tabs)/(bookmark)/deleteconfirm",
                    params: {
                        items: JSON.stringify(
                            bookmarks
                            .filter((b) => b.selected)
                            .map((b) => `${b.surahNumber}-${b.verseNumber}`)
                        ),
                    },
                })
            }
            style={styles.deleteIcon}
            >
                <Trash2 size={22} color={theme.color.brand} />
                </TouchableOpacity>
            )}

        </View>

        {!selectionMode && (
          <TouchableOpacity
            onPress={() => setMenuVisible(!menuVisible)}
            style={styles.headerIcon}
          >
            <MoreHorizontal size={26} color={theme.color.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {menuVisible && !selectionMode && (
        <View style={styles.dropdownOverlay}>
          <View style={styles.dropdownCard}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setSelectionMode(true);
                setMenuVisible(false);
              }}
            >
              <Text style={styles.dropdownText}>Select</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => setMenuVisible(false)}
            >
              <View style={styles.dropdownRow}>
                <Filter size={18} color={theme.color.secondary} />
                <Text style={styles.dropdownText}>Filter</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setMenuVisible(false);
                router.push("/(tabs)/(bookmark)/deleteconfirm");
              }}
            >
              <View style={styles.dropdownRow}>
                <Trash2 size={18} color={theme.color.brand} />
                <Text style={styles.dropdownText}>Delete All</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={bookmarks}
        keyExtractor={(item) => `${item.surahNumber}-${item.verseNumber}`}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 1000,
  },
  headerIcon: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: theme.font.semiBold,
    color: theme.color.secondary,
  },
  deleteIcon: {
    padding: 4,
  },
  dropdownOverlay: {
    position: "absolute",
    top: 60, // below header
    right: 16,
    zIndex: 1000,
    width: 160,
  },
  dropdownCard: {
    backgroundColor: theme.color.white,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    paddingVertical: 8,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: theme.font.regular,
  },
  card: {
    backgroundColor: theme.color.white,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardSelected: {
    backgroundColor: "#f0f0f0",
    borderColor: theme.color.secondary,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
});

export default BookmarkScreen;
