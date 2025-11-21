import { Stack } from "expo-router";
import React from "react";

const DeenAILayout = () => {
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
