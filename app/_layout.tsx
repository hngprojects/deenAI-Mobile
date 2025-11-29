import AnimatedSplash from "@/components/AnimatedSplash";
import ToastProvider from "@/components/ToastProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function RootLayoutNav() {
  const { isAuthenticated, isLoading, isGuest } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";
    const inOnboardingGroup = segments[0] === "(onboarding)";
    const inTasbihGroup = segments[0] === "(tasbih)";
    const inDeenAIGroup = segments[0] === "(deenai)";
    const inProfileGroup = segments[0] === "profile";
    const inQiblaGroup = segments[0] === "(qibla)";
    const inHadithGroup = segments[0] === "(hadith)";
    const inAdhkarGroup = segments[0] === "(adhkar)";
    const inPrayerTimesGroup = segments[0] === "(prayer-times)";
    const inRoot = segments.length === 0;

    console.log("🧭 Navigation check:", {
      isAuthenticated,
      isGuest,
      segments,
      inAuthGroup,
      inTabsGroup,
      inTasbihGroup,
      inHadithGroup,
      inRoot,
    });

    if (isAuthenticated || isGuest) {
      // Allow navigation to protected routes: tabs, onboarding, tasbih, deenai, profile
      if (
        !inTabsGroup &&
        !inOnboardingGroup &&
        !inTasbihGroup &&
        !inDeenAIGroup &&
        !inProfileGroup &&
        !inHadithGroup &&
        !inPrayerTimesGroup &&
        !inAdhkarGroup &&
        !inQiblaGroup &&
        !inAdhkarGroup
      ) {
        console.log("➡️ Redirecting to tabs");
        router.replace("/(tabs)");
      }
    } else {
      // Not authenticated - only allow auth routes
      if (
        inTabsGroup ||
        inTasbihGroup ||
        inDeenAIGroup ||
        inProfileGroup ||
        inHadithGroup ||
        inPrayerTimesGroup ||
        inAdhkarGroup ||
        inQiblaGroup ||
        inAdhkarGroup
      ) {
        console.log("➡️ Redirecting to login");
        router.replace("/(auth)/login");
      }
    }
  }, [isAuthenticated, isGuest, isLoading, router, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(tasbih)" />
      <Stack.Screen name="(deenai)" />
      <Stack.Screen name="(adhkar)" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="(qibla)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  const [fontsLoaded] = useFonts({
    "NunitoSans-SemiBold": require("../assets/fonts/NunitoSans-SemiBold.ttf"),
    "NunitoSans-Bold": require("../assets/fonts/NunitoSans-Bold.ttf"),
    "NunitoSans-Regular": require("../assets/fonts/NunitoSans-Regular.ttf"),
    "NunitoSans-Light": require("../assets/fonts/NunitoSans-Light.ttf"),
    "NunitoSans-ExtraBold": require("../assets/fonts/NunitoSans-ExtraBold.ttf"),
    "NunitoSans-Black": require("../assets/fonts/NunitoSans-Black.ttf"),
    "DigitalNumbers-Regular": require("../assets/fonts/DigitalNumbers-Regular.ttf"),
    "AmiriQuran-Regular": require("../assets/fonts/AmiriQuran-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();

      setTimeout(() => {
        setShowCustomSplash(false);
      }, 2500);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || showCustomSplash) {
    return <AnimatedSplash />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StatusBar style="light" />
        <ToastProvider />
        <RootLayoutNav />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
