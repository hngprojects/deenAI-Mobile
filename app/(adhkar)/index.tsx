import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdhkarScreen() {
  const router = useRouter();

  const adhkarTypes = [
    {
      id: "morning",
      title: "Morning Adkar",
      subtitle: "Start your day with the remembrance of Allah",
      image: require("@/assets/images/adhkar/morning.png"),
    },
    {
      id: "evening",
      title: "Evening Adkar",
      subtitle: "End your day with the remembrance of Allah",
      image: require("@/assets/images/adhkar/evening.png"),
    },
  ];

  const handleStartPress = (adhkarId: string, event: any) => {
    event.stopPropagation();
    console.log('Navigating to:', adhkarId);

    // Try this approach first - relative path
    router.push(`./${adhkarId}`);

  };

  const handleCardPress = (adhkarId: string) => {
    console.log('Card pressed:', adhkarId);
    router.push(`./${adhkarId}`);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Azkar" showBackButton />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {adhkarTypes.map((adhkar) => (
          <TouchableOpacity
            key={adhkar.id}
            style={styles.card}
            onPress={() => handleCardPress(adhkar.id)}
            activeOpacity={0.7}
          >
            <Image source={adhkar.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{adhkar.title}</Text>

              <View style={styles.subtitleRow}>
                <Text
                  style={styles.cardSubtitle}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {adhkar.subtitle}
                </Text>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={(e) => handleStartPress(adhkar.id, e)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.startButtonText}>Start</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    flex: 1,
  },
  startButton: {
    backgroundColor: "#964B00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  startButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});