import { router } from "expo-router";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import TextLink from "@/components/textLink";
import PrimaryButton2 from "@/components/primaryButton2";

export default function WelcomeScreen() {
  return (
    <ImageBackground
      source={require("@/assets/images/welcome-screen-bg-image.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.title}> Welcome to Noor AI, {"\n"} Converse & Learn </Text>
        <Text style={styles.subtitle}>
          A peaceful space to connect with the Quran every {"\n"} day.
          Seek answers, find light, and reflect in stillness.
        </Text>

        <View style={styles.buttonWrapper}>
          <PrimaryButton2
            title="Create an Account"
            onPress={() => router.push("/(auth)/create-account/CreateAccount")}
          />
        </View>

        <TextLink
          label="Already have an account?"
          linkText="Log in"
          onPress={() => router.push("/(auth)/login/Login")}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)", // dark overlay for readability
  },
  content: {
    paddingHorizontal: 32,
    paddingBottom: 50,
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 39,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "400",
    color: "#f0f0f0",
    lineHeight: 28,
    marginBottom: 36,
  },
  buttonWrapper: {
    width: "100%",
    marginBottom: 18,
  },
});
