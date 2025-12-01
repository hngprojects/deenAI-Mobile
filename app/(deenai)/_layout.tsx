import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth-store";
import { router, Stack } from "expo-router";
import React, { useEffect } from "react";

const DeenAILayout = () => {
  const { isGuest } = useAuth();
  const { clearAuth } = useAuthStore();

  useEffect(() => {
    if (isGuest) {
      // Logout the guest user
      clearAuth();
      // Redirect to onboarding
      router.replace("/(onboarding)/onboardingscreen");
    }
  }, [isGuest]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="chat-history" />
    </Stack>
  );
};

export default DeenAILayout;
