// app/(tabs)/(prayer-times)/_layout.tsx
import { Stack } from 'expo-router';

export default function PrayerTimesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="prayerTimes" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="prayerDetails" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="calendar" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}