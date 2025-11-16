import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Image } from "expo-image";

export default function CustomSplashScreen() {
  return (
    <ImageBackground
      source={require("@/assets/images/splash-screen.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.centerContainer}>
        {/* Logo Icon */}
        <Image
          source={require("@/assets/images/splash-icon.png")}
          style={styles.logo}
          contentFit="contain"
        />

        {/* App Name */}
        <Text style={styles.appName}>NoorAi</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },

  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    letterSpacing: 1,
  },
});
