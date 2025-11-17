import { ThemeProvider } from "@/context/ThemeContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "NunitoSans-SemiBold": require("../assets/fonts/NunitoSans-SemiBold.ttf"),
    "NunitoSans-Bold": require("../assets/fonts/NunitoSans-Bold.ttf"),
    "NunitoSans-Regular": require("../assets/fonts/NunitoSans-Regular.ttf"),
    "NunitoSans-Light": require("../assets/fonts/NunitoSans-Light.ttf"),
    "NunitoSans-ExtraBold": require("../assets/fonts/NunitoSans-ExtraBold.ttf"),
    "NunitoSans-Black": require("../assets/fonts/NunitoSans-Black.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen
          name="(hadiths-collection)"
          options={{ title: "Hadiths Collections" }}
        />
        {/* <Stack.Screen name="(tabs)" /> */}
      </Stack>
    </ThemeProvider>
  );
}
