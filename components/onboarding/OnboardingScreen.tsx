import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import ScreenContainer from "../ScreenContainer";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");

const OnboardingScreen = () => {
  const router = useRouter();

  return (
    <ScreenContainer backgroundColor={theme.color.background}>
      <View style={styles.imageWrapper}>
        <Image
          source={require("../../assets/images/Onboarding-mockup.png")}
          style={styles.topImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textSection}>
        <Text style={styles.title}>
          When the Path Feels Heavy,{"\n"}Find Your Peace.
        </Text>

        <Text style={styles.subtitle}>
          Feeling overwhelmed? Deen AI is your private,{"\n"}
          intelligent companion, ready to listen and offer {"\n"}
          tailored guidance from the Quran and Sunnah.
        </Text>

        <View style={styles.pagination}>
          <View style={[styles.line, styles.activeLine]} />
          <View style={styles.line} />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.color.brand }]}
          onPress={() => router.push("/(onboarding)/onboadingnext")}
        >
          <Text style={[styles.buttonText, { color: theme.color.white }]}>
            next
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  imageWrapper: {
    height: height * 0.60, 
    width: "100%",
  },
  topImage: {
    width: "100%",
    height: "100%",
  },
  textSection: {
    height: height * 0.40, 
    width: "100%",
    backgroundColor: theme.color.white,
    paddingHorizontal: 25,
    paddingTop: -15,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.color.secondary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#777",
    lineHeight: 22,
    marginBottom: 15,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  line: {
    width: 20,
    height: 4,
    backgroundColor: "#D9D9D9",
    borderRadius: 2,
    marginHorizontal: 4,
  },
  activeLine: {
    backgroundColor: theme.color.brand,
    width: 28,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 20,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
