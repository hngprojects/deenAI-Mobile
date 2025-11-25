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

const OnboardingScreenNext = () => {
  const router = useRouter();

  return (
    <ScreenContainer backgroundColor={theme.color.background}>
      {/* Top Image (3/4 of screen) */}
      <View style={styles.imageWrapper}>
        <Image
          source={require("../../assets/images/Onboarding-mockup2.png")}
          style={styles.topImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textSection}>
        <Text style={styles.title}>
          Keep Your Sacred{"\n"} Notes Safe..
        </Text>

        <Text style={styles.subtitle}>
          Securely journal your reflections on the Quran. Easily {"\n"}
          save and revisit your most impactful verses for {"\n"}
          consistent spiritual comfort and growth.
        </Text>

        <View style={styles.pagination}>
          <View style={styles.line} />
          <View style={[styles.line, styles.activeLine]} />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.color.brand }]}
          onPress={() => router.push("/(onboarding)/onboardingscreen")}
        >
          <Text style={[styles.buttonText, { color: theme.color.white }]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

export default OnboardingScreenNext;

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
    paddingTop: 15,
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
    backgroundColor: "#ffffff",
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
