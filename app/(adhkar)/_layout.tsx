import { Stack } from "expo-router";

export default function AdhkarLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Adhkar",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Prayer",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
