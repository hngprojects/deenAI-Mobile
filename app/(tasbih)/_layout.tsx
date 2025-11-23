import { Stack } from 'expo-router';

export default function TasbihLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
        </Stack>
    );
}