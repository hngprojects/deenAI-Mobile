import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Text, TextInput } from "react-native";

SplashScreen.preventAutoHideAsync(); 

export const unstable_settings = {
  anchor: '(tabs)',
};

// GLOBAL FONT OVERRIDE (TypeScript Safe)
const applyGlobalFont = () => {
  const TextAny = Text as any;
  const TextInputAny = TextInput as any;

  if (!TextAny._hasFontOverride) {
    TextAny._hasFontOverride = true;  // prevents double patching

    const oldTextRender = TextAny.render;
    TextAny.render = function (...args: any[]) {
      const origin = oldTextRender.apply(this, args);
      return React.cloneElement(origin, {
        style: [{ fontFamily: "NunitoSans" }, origin.props.style],
      });
    };
  }

  if (!TextInputAny._hasFontOverride) {
    TextInputAny._hasFontOverride = true;

    const oldInputRender = TextInputAny.render;
    TextInputAny.render = function (...args: any[]) {
      const origin = oldInputRender.apply(this, args);
      return React.cloneElement(origin, {
        style: [{ fontFamily: "NunitoSans" }, origin.props.style],
      });
    };
  }
};

function AppContent() {
  const [loaded] = useFonts({
    NunitoSans: require("@/assets/fonts/NunitoSans-VariableFont.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      applyGlobalFont();   // Fonts Loaded
      SplashScreen.hideAsync();
    }
  }, [loaded]); 

  if (!loaded) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1515ff' }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome-screen" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
