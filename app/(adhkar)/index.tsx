import ScreenContainer from "@/components/ScreenContainer";
import ScreenHeader from "@/components/screenHeader";
import { theme } from "@/styles/theme";
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
      title: "Morning Adhkar",
      subtitle: "Start your day with the remembrance of Allah",
      image: require("@/assets/images/adhkar/morning.png"),
    },
    {
      id: "evening",
      title: "Evening Adhkar",
      subtitle: "End your day with the remembrance of Allah",
      image: require("@/assets/images/adhkar/evening.png"),
    },
  ];

  const handleStartPress = (adhkarId: any, event: any) => {
    event.stopPropagation();
    router.push(`./${adhkarId}`);
  };

  const handleCardPress = (adhkarId: any) => {
    router.push(`./${adhkarId}`);
  };

  const handleStreakPress = () => {
    console.log("Streak icon pressed");
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Adhkar"
        showBackButton
        rightComponent={
          <TouchableOpacity
            onPress={handleStreakPress}
            activeOpacity={0.7}
            style={styles.streakButton}
          >
            <Image
              source={require("@/assets/images/streaks.png")}
              style={styles.streakIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {adhkarTypes.map((adhkar) => (
          <TouchableOpacity
            key={adhkar.id}
            style={styles.adhkarItemContainer}
            onPress={() => handleCardPress(adhkar.id)}
            activeOpacity={0.7}
          >
            <Image source={adhkar.image} style={styles.cardImage} />

            <View style={styles.rowContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{adhkar.title}</Text>
                <Text
                  style={styles.cardSubtitle}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {adhkar.subtitle}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.startButton}
                onPress={(e) => handleStartPress(adhkar.id, e)}
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
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
    padding: 10,
  },
  adhkarItemContainer: {
    marginBottom: 20,
  },
  cardImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 16,
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F0F0F",
    marginBottom: 8,
    fontFamily: theme.font.bold,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#3C3A35",
    fontFamily: theme.font.regular,
  },
  startButton: {
    backgroundColor: "#964B00",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    width: 87,
    height: 49,
  },
  startButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: theme.font.regular,
  },
  streakButton: {
    padding: 4,
  },
  streakIcon: {
    width: 24,
    height: 24,
  },
});
