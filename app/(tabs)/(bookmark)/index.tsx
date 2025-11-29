import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const EmptyBookmarkScreen: React.FC = () => {
  const router = useRouter();

  return (
    <ScreenContainer backgroundColor={theme.color.white} statusBarStyle="dark">
      <ScreenHeader title="Bookmark" />

      <View style={styles.emptyContainer}>
        <Image
          source={require("@/assets/images/quran-02.png")}
          style={styles.emptyImage}
        />
        <Text style={styles.emptyTitle}>Your bookmark is empty</Text>
        <Text style={styles.emptySubtitle}>
          Start reading Quran to add to your bookmark
        </Text>

        <TouchableOpacity
          style={styles.startReadingBtn}
          onPress={() => router.push("/(tabs)/(quran)")}
        >
          <Text style={styles.startReadingText}>Start Reading Quran</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyImage: { width: 140, height: 140, marginBottom: 24 },
  emptyTitle: { fontSize: 18, fontFamily: theme.font.semiBold, marginBottom: 8 },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    opacity: 0.6,
    marginBottom: 20,
    textAlign: "center",
  },
  startReadingBtn: {
    backgroundColor: theme.color.brand,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  startReadingText: {
    color: theme.color.white,
    fontFamily: theme.font.semiBold,
    fontSize: 14,
  },
});

export default EmptyBookmarkScreen;
