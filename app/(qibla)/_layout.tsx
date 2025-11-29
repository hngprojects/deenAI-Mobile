import { Stack } from "expo-router";
import React from "react";

const QiblaLaoyout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(qibla)" />
      <Stack.Screen name="qiblaPermissions" />
    </Stack>
  );
};

export default QiblaLaoyout;
