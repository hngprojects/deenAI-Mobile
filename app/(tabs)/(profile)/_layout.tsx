import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="language" />
      <Stack.Screen name="DeleteAccountScreen" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="notification" />
      <Stack.Screen name="SupportScreen" />
      {/* <Stack.Screen name="AppLanguageScreen" /> */}
      {/* <Stack.Screen name="AppLanguageScreen" /> */}
    </Stack>
  );
}
