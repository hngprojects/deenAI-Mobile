import AnimatedSplash from "@/components/AnimatedSplash";
import { ThemeProvider } from '@/context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function RootLayout() {
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  const [fontsLoaded] = useFonts({
    'NunitoSans-SemiBold': require('../assets/fonts/NunitoSans-SemiBold.ttf'),
    'NunitoSans-Bold': require('../assets/fonts/NunitoSans-Bold.ttf'),
    'NunitoSans-Regular': require('../assets/fonts/NunitoSans-Regular.ttf'),
    'NunitoSans-Light': require('../assets/fonts/NunitoSans-Light.ttf'),
    'NunitoSans-ExtraBold': require('../assets/fonts/NunitoSans-ExtraBold.ttf'),
    'NunitoSans-Black': require('../assets/fonts/NunitoSans-Black.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Hide native splash screen
      SplashScreen.hideAsync();

      // Show custom splash for 2.5 seconds
      setTimeout(() => {
        setShowCustomSplash(false);
      }, 2500);
    }
  }, [fontsLoaded]);

  // Show custom splash while fonts are loading or during splash delay
  if (!fontsLoaded || showCustomSplash) {
    return <AnimatedSplash />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          {/* <Stack.Screen name="(tabs)" /> */}
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}