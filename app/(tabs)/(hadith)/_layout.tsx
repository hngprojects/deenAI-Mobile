import { Stack } from 'expo-router';

export default function HadithLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="hadiths"
        options={{
          title: 'Hadith Collections',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="hadith-categories"
        options={{
          title: 'Books',
        }}
      />
      <Stack.Screen
        name="revelation"
        options={{
          title: 'Hadiths',
        }}
      />
    </Stack>
  );
}